-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  images JSONB,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_reply BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建评论点赞表
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (comment_id, user_id)
);

-- 创建评论回复表 (可选，如果需要更复杂的回复结构时使用)
CREATE TABLE IF NOT EXISTS comment_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON comments(product_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_replies_parent_id ON comment_replies(parent_id);

-- 设置RLS策略
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_replies ENABLE ROW LEVEL SECURITY;

-- 评论的RLS策略
-- 任何人可以查看评论
CREATE POLICY "评论公开可读" ON comments
  FOR SELECT USING (true);

-- 只有自己可以修改自己的评论
CREATE POLICY "用户可修改自己的评论" ON comments
  FOR UPDATE USING (user_id = auth.uid());

-- 只有自己可以删除自己的评论，但管理员可以删除任何评论
CREATE POLICY "用户可删除自己的评论" ON comments
  FOR DELETE USING (
    user_id = auth.uid() OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 任何已登录用户可以添加评论
CREATE POLICY "已登录用户可添加评论" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 评论点赞的RLS策略
-- 任何人可以查看评论点赞
CREATE POLICY "评论点赞公开可读" ON comment_likes
  FOR SELECT USING (true);

-- 已登录用户可以添加点赞
CREATE POLICY "已登录用户可添加点赞" ON comment_likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 只有自己可以删除自己的点赞
CREATE POLICY "用户可删除自己的点赞" ON comment_likes
  FOR DELETE USING (user_id = auth.uid());

-- 评论统计视图
CREATE OR REPLACE VIEW comment_stats AS
SELECT 
  c.product_id,
  COUNT(c.id) AS comment_count,
  AVG(c.rating) AS avg_rating,
  SUM(CASE WHEN c.rating = 5 THEN 1 ELSE 0 END) AS rating_5_count,
  SUM(CASE WHEN c.rating = 4 THEN 1 ELSE 0 END) AS rating_4_count,
  SUM(CASE WHEN c.rating = 3 THEN 1 ELSE 0 END) AS rating_3_count,
  SUM(CASE WHEN c.rating = 2 THEN 1 ELSE 0 END) AS rating_2_count,
  SUM(CASE WHEN c.rating = 1 THEN 1 ELSE 0 END) AS rating_1_count
FROM 
  comments c
WHERE 
  c.parent_id IS NULL
GROUP BY 
  c.product_id; 