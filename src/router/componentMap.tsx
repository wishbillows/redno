// src/router/componentMap.tsx
import Dashboard from '@/pages/dashboard'
import PostList from '@/pages/content/posts'
import ReviewList from '@/pages/content/review'
import UserList from '@/pages/user/list'
import BanList from '@/pages/user/ban'
import GoodsList from '@/pages/market/goods'
import OrderList from '@/pages/market/orders'
import AdminList from '@/pages/permission/admin'
import RoleList from '@/pages/permission/role'
import { ReactNode } from 'react'

const componentMap: Record<string, ReactNode> = {
  '/dashboard':         <Dashboard />,
  '/content/posts':     <PostList />,
  '/content/review':    <ReviewList />,
  '/user/list':         <UserList />,
  '/user/ban':          <BanList />,
  '/market/goods':      <GoodsList />,
  '/market/orders':     <OrderList />,
  '/permission/admin':  <AdminList />,
  '/permission/role':   <RoleList />,
}

export default componentMap