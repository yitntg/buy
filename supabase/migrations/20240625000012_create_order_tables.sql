-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'canceled')),
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_method TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建订单项表
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- 设置RLS策略
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 订单的RLS策略
-- 用户可以查看自己的订单
CREATE POLICY "用户可查看自己的订单" ON orders
  FOR SELECT USING (user_id = auth.uid());

-- 管理员可以查看所有订单
CREATE POLICY "管理员可查看所有订单" ON orders
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 用户可以添加订单
CREATE POLICY "用户可添加订单" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 用户可以取消自己的订单(仅限pending状态)
CREATE POLICY "用户可取消自己的订单" ON orders
  FOR UPDATE USING (
    user_id = auth.uid() AND
    status = 'pending'
  ) WITH CHECK (
    user_id = auth.uid() AND
    status = 'canceled'
  );

-- 管理员可以更新所有订单
CREATE POLICY "管理员可更新所有订单" ON orders
  FOR UPDATE USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 订单项的RLS策略
-- 用户可以查看自己的订单项
CREATE POLICY "用户可查看自己的订单项" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- 管理员可以查看所有订单项
CREATE POLICY "管理员可查看所有订单项" ON order_items
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 用户可以添加订单项(当添加订单时)
CREATE POLICY "用户可添加订单项" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- 管理员可以更新订单项
CREATE POLICY "管理员可更新订单项" ON order_items
  FOR UPDATE USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 视图：用户订单统计
CREATE OR REPLACE VIEW user_order_stats AS
SELECT 
  u.id AS user_id,
  COUNT(o.id) AS order_count,
  SUM(o.total) AS total_spent,
  MAX(o.created_at) AS last_order_date,
  COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) AS delivered_orders,
  COUNT(CASE WHEN o.status = 'canceled' THEN 1 END) AS canceled_orders
FROM 
  auth.users u
LEFT JOIN 
  orders o ON u.id = o.user_id
GROUP BY 
  u.id; 