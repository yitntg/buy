-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category INTEGER NOT NULL,
  inventory INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加示例数据
INSERT INTO products (name, description, price, image, category, inventory, rating, reviews)
VALUES
  ('智能手表', '高级智能手表，支持多种运动模式和健康监测功能', 1299, 'https://picsum.photos/id/1/500/500', 1, 50, 4.8, 120),
  ('蓝牙耳机', '无线蓝牙耳机，支持降噪功能，续航时间长', 399, 'https://picsum.photos/id/3/500/500', 1, 200, 4.5, 85),
  ('真皮沙发', '进口真皮沙发，舒适耐用，适合家庭使用', 4999, 'https://picsum.photos/id/20/500/500', 2, 10, 4.9, 32),
  ('纯棉T恤', '100%纯棉材质，透气舒适，多色可选', 99, 'https://picsum.photos/id/25/500/500', 3, 500, 4.3, 210),
  ('保湿面霜', '深层保湿面霜，适合干性肌肤，改善肌肤干燥问题', 159, 'https://picsum.photos/id/30/500/500', 4, 80, 4.6, 65),
  ('有机坚果礼盒', '精选有机坚果礼盒，包含多种坚果，营养丰富', 169, 'https://picsum.photos/id/40/500/500', 5, 100, 4.7, 48),
  ('瑜伽垫', '专业瑜伽垫，防滑耐磨，厚度适中，适合各种瑜伽动作', 128, 'https://picsum.photos/id/50/500/500', 6, 60, 4.4, 72);

-- 创建产品分类表
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加示例分类
INSERT INTO categories (id, name, description)
VALUES
  (1, '电子产品', '各类电子产品、数码设备'),
  (2, '家居家具', '家具、家居用品'),
  (3, '服装服饰', '各类衣物、服装、鞋帽'),
  (4, '美妆个护', '美妆、个人护理用品'),
  (5, '食品饮料', '零食、饮品、生鲜食品'),
  (6, '运动户外', '运动器材、户外装备'); 