// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

// 模拟数据
let users: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: 'active',
    lastLogin: '2024-03-20 10:00:00'
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: '普通用户',
    status: 'inactive',
    lastLogin: '2024-03-19 15:30:00'
  }
]

export const userService = {
  // 获取用户列表
  async getUsers(): Promise<User[]> {
    await delay(1000)
    return users
  },
  
  // 获取单个用户
  async getUser(id: string): Promise<User | null> {
    await delay(500)
    return users.find(u => u.id === id) || null
  },
  
  // 创建用户
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    await delay(1000)
    const newUser = {
      ...user,
      id: Date.now().toString()
    }
    users.push(newUser)
    return newUser
  },
  
  // 更新用户
  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    await delay(1000)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    
    users[index] = {
      ...users[index],
      ...user
    }
    return users[index]
  },
  
  // 删除用户
  async deleteUser(id: string): Promise<boolean> {
    await delay(500)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return false
    
    users.splice(index, 1)
    return true
  },
  
  // 更新用户状态
  async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<User | null> {
    await delay(500)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    
    users[index].status = status
    return users[index]
  },
  
  // 获取用户统计数据
  async getUserStats() {
    await delay(1000)
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      inactiveUsers: users.filter(u => u.status === 'inactive').length,
      adminUsers: users.filter(u => u.role === '管理员').length,
      regularUsers: users.filter(u => u.role === '普通用户').length
    }
  }
} 