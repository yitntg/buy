# 项目结构说明

本项目采用按业务领域和技术层分离的目录结构，便于代码管理和未来可能的拆分。

## 主要目录结构

```
/src
  /customer            # 用户端
    /frontend          # 用户前端
      /components      # 用户端UI组件
      /pages           # 用户端页面
    /backend           # 用户后端
      /api             # 用户端API
      /services        # 用户端服务
  /admin               # 管理员端
    /frontend          # 管理员前端
      /components      # 管理员端UI组件 
      /pages           # 管理员端页面
    /backend           # 管理员后端
      /api             # 管理员端API
      /services        # 管理员端服务
  /shared              # 共享代码
    /types             # 类型定义
    /utils             # 通用工具函数
    /hooks             # 通用钩子函数
    /context           # 共享上下文
```

## 结构说明

此结构是从原始的Next.js项目结构迁移而来，采用"先按业务领域分（用户/管理员），再按技术层分（前端/后端）"的方式组织代码，便于:

1. 更清晰地划分业务边界
2. 更容易将管理员端迁移到独立仓库
3. 各模块职责更加清晰

## 技术栈

- 前端: Next.js
- 用户端UI: 定制组件
- 管理员端UI: Ant Design（计划引入）
- 后端: Next.js API Routes 