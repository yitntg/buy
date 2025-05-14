-- 创建领域事件表
CREATE TABLE IF NOT EXISTS domain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_domain_events_aggregate_id 
ON domain_events(aggregate_id);

CREATE INDEX IF NOT EXISTS idx_domain_events_event_type 
ON domain_events(event_type);

CREATE INDEX IF NOT EXISTS idx_domain_events_timestamp 
ON domain_events(timestamp);

COMMENT ON TABLE domain_events IS '存储领域事件的表，用于事件溯源和CQRS模式实现';
COMMENT ON COLUMN domain_events.event_id IS '事件唯一标识符';
COMMENT ON COLUMN domain_events.aggregate_id IS '聚合根ID，用于关联事件到特定实体';
COMMENT ON COLUMN domain_events.event_type IS '事件类型，如CommentCreated, ProductUpdated等';
COMMENT ON COLUMN domain_events.timestamp IS '事件发生时间';
COMMENT ON COLUMN domain_events.data IS '事件数据，以JSON格式存储'; 