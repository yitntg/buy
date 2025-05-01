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

## 未来计划

- 添加用户认证系统
- 集成支付功能
- 添加商品评价系统
- 开发卖家数据分析面板 