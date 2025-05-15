# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 从构建阶段复制构建产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"] 