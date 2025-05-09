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