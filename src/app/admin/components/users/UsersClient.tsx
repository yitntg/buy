'use client'

import { useEffect, useState } from 'react'
import { User } from '@/app/(shared)/types/user'
import { userService } from '../../services/userService'
import UsersTable from './UsersTable'

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers()
        setUsers(data)
      } catch (error) {
        console.error('获取用户列表失败:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUsers()
  }, [])
  
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await userService.updateUserStatus(id, status)
      setUsers(users.map(u => 
        u.id === id ? { ...u, status } : u
      ))
    } catch (error) {
      console.error('更新用户状态失败:', error)
    }
  }
  
  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id)
      setUsers(users.filter(u => u.id !== id))
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">用户管理</h1>
      </div>
      
      <UsersTable
        users={users}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  )
} 