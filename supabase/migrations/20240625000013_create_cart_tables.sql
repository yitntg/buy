-- 创建购物车表
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建购物车项表
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保购物车中每个产品只有一条记录
  CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- 添加表注释
COMMENT ON TABLE carts IS '用户购物车表';
COMMENT ON COLUMN carts.user_id IS '购物车所属用户ID';

COMMENT ON TABLE cart_items IS '购物车项，存储购物车中的产品';
COMMENT ON COLUMN cart_items.cart_id IS '关联的购物车ID';
COMMENT ON COLUMN cart_items.product_id IS '产品ID';
COMMENT ON COLUMN cart_items.quantity IS '产品数量'; 