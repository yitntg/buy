# 乐购商城 - 现代化电商网站

一个基于Next.js开发的现代化电商平台，包含商品展示和商品上传系统。

## 功能特点

- 响应式设计，适配各种设备
- 商品分类展示
- 商品详情页
- 商品搜索功能
- 商品上传系统
- 购物车功能
- 用户账户管理

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Icons

## 如何运行

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发环境运行

```bash
npm run dev
# 或
yarn dev
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 启动生产服务

```bash
npm run start
# 或
yarn start
```

## 项目结构

```
/app                    # Next.js 应用目录
  /components           # 共享组件
  /upload               # 商品上传页面
  /products             # 商品列表页面
  /api                  # API路由
  layout.tsx            # 根布局组件
  page.tsx              # 首页
/public                 # 静态资源
  /images               # 图片资源
```

## 商品上传系统说明

商品上传系统允许用户：

1. 上传商品基本信息（名称、分类、价格等）
2. 添加商品详细描述和规格参数
3. 上传多张商品图片
4. 设置配送和售后政策

## 管理员工具

管理员工具提供了多种实用功能，帮助管理和维护系统：

1. **环境变量调试** - 检查和验证Supabase环境变量配置
2. **数据库连接诊断** - 测试数据库连接和验证数据表
3. **数据库初始化工具** - 创建数据库表和添加示例数据
4. **SQL执行器** - 直接执行SQL语句并查看结果

### SQL执行器使用说明

SQL执行器允许管理员直接执行SQL语句：

1. 打开管理员工具页面，选择"SQL执行器"
2. 在文本框中输入SQL语句
3. 点击"执行SQL"按钮运行语句
4. 查看执行结果或错误信息

对于SELECT查询，需要先创建query_sql函数：
- 点击"创建query_sql函数"按钮
- 创建成功后，可以执行SELECT查询并查看结果表格

⚠️ **注意**：SQL执行器是一个强大的工具，不当的SQL语句可能会对数据库造成不可逆的损害。

## 未来计划

- 添加用户认证系统
- 集成支付功能
- 添加商品评价系统
- 开发卖家数据分析面板

## 安全配置指南

为了确保系统安全，请按照以下步骤进行配置：

### 1. 环境变量设置

在项目根目录创建`.env.local`文件，添加以下配置：

```
# Supabase环境变量 - 在Supabase控制台获取
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# 管理员账户 - 替换为安全的值
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=complex_password_here
```

### 2. 管理员账户

首次启动系统时，会根据环境变量中的配置自动创建管理员账户。如果未设置环境变量，系统会：

- 使用默认邮箱 `admin@example.com`
- 生成随机密码并在控制台输出（仅首次运行时）

**强烈建议**：设置环境变量自定义管理员账户，或在首次运行后立即登录并修改密码。

### 3. API密钥安全

- 请勿在前端代码中硬编码任何密钥或凭据
- 定期轮换Supabase API密钥
- 为Supabase库设置适当的行级安全策略(RLS)

### 4. 开发与部署

开发环境：
```bash
npm install
npm run dev
```

生产部署：
```bash
npm run build
npm start
```

## 账户系统

系统具有完整的用户认证与授权机制：

- 用户注册与登录
- 密码加密与安全验证
- 个人信息管理
- 基于角色的访问控制（用户/管理员）

### 管理员功能

- 商品管理：添加、编辑、删除商品
- 用户管理：查看用户信息，管理权限
- 订单管理：查看和处理订单
- 数据分析：查看销售和用户数据

# 评论系统

一个基于领域驱动设计(DDD)的评论系统,支持评论的创建、更新、删除、点赞和回复功能。

## 技术栈

- 前端: React + TypeScript + Tailwind CSS
- 后端: Node.js + Express + TypeScript
- 数据库: PostgreSQL + Prisma
- 缓存: Redis
- 测试: Jest + React Testing Library
- 部署: Docker + GitHub Actions

## 功能特性

- 评论的 CRUD 操作
- 评论点赞功能
- 评论回复功能
- 图片上传
- 评分系统
- 实时更新
- 缓存支持
- 错误处理
- 日志记录

## 项目结构

```
src/
  ├── features/           # 功能模块
  │   └── products/      # 商品模块
  │       ├── domain/    # 领域层
  │       ├── application/# 应用层
  │       ├── infrastructure/# 基础设施层
  │       └── ui/        # 表现层
  └── shared/            # 共享模块
      ├── domain/        # 共享领域模型
      └── infrastructure/# 共享基础设施
```

## 安装

1. 克隆项目
```bash
git clone https://github.com/yourusername/comment-system.git
cd comment-system
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```

4. 启动开发服务器
```bash
npm run dev
```

## 测试

运行单元测试:
```bash
npm test
```

运行集成测试:
```bash
npm run test:integration
```

## 部署

使用 Docker 部署:
```bash
docker-compose up -d
```

## 贡献

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 

## 认证和数据库系统

### 认证系统

本项目使用 Supabase 认证服务进行用户身份验证。认证流程包括:

- 使用邮箱/密码进行登录和注册
- JWT 令牌验证
- 中间件保护管理员路由
- 基于角色的权限控制

主要文件:
- `/app/context/AuthContext.tsx` - 认证上下文提供者和钩子
- `/utils/supabase/client.ts` - 浏览器端 Supabase 客户端
- `/utils/supabase/server.ts` - 服务器端 Supabase 客户端
- `/middleware.ts` - 保护 /admin 路由的中间件

### 数据库系统

本项目使用 Supabase (PostgreSQL) 作为数据库。数据库迁移和表结构定义在 `/supabase/migrations/` 目录中。

主要表结构:
- `users` - 用户表 (由 Supabase Auth 自动管理)
- `products` - 产品表
- `comments` - 评论表
- `orders` - 订单表

数据访问层:
- `/shared/infrastructure/lib/supabase.ts` - 共享 Supabase 客户端和 Prisma 兼容层
- `/shared/infrastructure/repositories/` - 仓储模式实现

### 环境变量

确保配置以下环境变量:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key (可选，用于管理任务)
```

### 验证脚本

项目包含两个验证脚本用于检查配置:

- `npm run verify:auth` - 验证认证系统配置
- `npm run verify:db` - 验证数据库结构

## 认证系统改进记录

### 问题修复总结

我们对认证系统进行了全面改进，解决了以下问题：

1. **统一Supabase客户端实现**
   - 移除了多余的 `lib/supabase.ts` 实现
   - 增强了 `utils/supabase/client.ts` 实现，添加错误检查
   - 确保正确使用 `src/utils/supabase/server.ts` 处理服务端请求

2. **统一认证逻辑**
   - 移除了自定义API路由 `/api/auth/login` 和 `/api/auth/register`
   - 所有认证请求直接通过Supabase Auth服务处理
   - 确保登录页和注册页正确使用 `AuthContext` 提供的方法

3. **改进路由和UI**
   - 登录页支持 `redirect` 参数，登录后跳转到指定页面
   - 添加错误消息显示，包括无效令牌和会话过期的处理
   - 改进表单验证，提供更好的用户体验

4. **数据库结构统一**
   - 统一使用Supabase迁移文件管理数据库结构
   - 创建安全的初始化脚本，不包含硬编码凭据
   - 确保用户表、权限表和MFA表结构一致

5. **添加验证工具**
   - 添加 `verify:auth` 脚本，用于检查认证系统配置
   - 在构建后自动运行 `init-db-safe` 脚本确保数据库结构正确

### 使用指南

1. **初始化数据库**
   ```bash
   # 本地开发环境
   npm run init-db-local
   
   # 生产环境(安全模式)
   npm run init-db-safe
   ```

2. **验证认证系统**
   ```bash
   npm run verify:auth
   ```

3. **开发模式运行**
   ```bash
   npm run dev
   ``` 

## 数据库系统改进记录

### 问题分析

在对应用的数据库系统进行全面检查后，发现项目同时使用了两套数据库管理技术:

1. **Supabase** - 用于用户认证和基本数据存储
2. **Prisma** - 用于评论系统、产品和订单管理

这种混合使用造成了以下问题:
- 代码重复和不一致
- 数据同步困难
- 增加维护成本
- 可能引发意外错误

### 改进措施

我们采取了以下措施统一数据库系统:

1. **清理迁移文件**
   - 删除重复和模板迁移文件
   - 添加结构化的表创建迁移文件

2. **创建全面的数据模型**
   - 为产品系统创建完整的表结构
   - 为评论系统创建表结构和关系
   - 为订单系统创建表结构和关系

3. **建立数据迁移工具**
   - 创建从Prisma到Supabase的数据迁移脚本
   - 提供迁移验证和错误处理机制

4. **增强类型定义**
   - 扩展Supabase类型定义，覆盖所有业务实体
   - 添加视图和函数的类型支持

5. **添加数据库验证工具**
   - 创建验证脚本检查数据库结构
   - 提供详细的错误报告

### 新增数据表和视图

本次改进新增了以下数据表:

- **产品相关**: `products`, `categories`, `tags`, `product_tags`
- **评论相关**: `comments`, `comment_likes`, `comment_replies`
- **订单相关**: `orders`, `order_items`

新增的数据视图:

- `comment_stats` - 提供产品评论统计信息
- `user_order_stats` - 提供用户订单统计信息

### 行级安全策略(RLS)

所有表都添加了细粒度的行级安全策略，确保:

- 公开数据可以被任何人读取
- 个人数据只能被所有者访问
- 管理员拥有适当的管理权限

### 使用指南

1. **初始化数据库结构**
   ```bash
   # 应用所有迁移文件
   npm run init-db-safe
   ```

2. **迁移Prisma数据到Supabase**
   ```bash
   # 将Prisma管理的数据转移到Supabase
   npm run migrate:prisma-to-supabase
   ```

3. **验证数据库结构**
   ```bash
   # 验证所有必要的表和视图是否存在
   npm run verify:db
   ``` 