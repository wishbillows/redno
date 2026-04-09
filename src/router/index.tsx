import { useRoutes, Navigate } from 'react-router-dom'
import { useAuthStore } from "@/stores/useAuthStore";
import BasicLayout from '@/layout/BasicLayout'
import Login from '@/pages/login'
import componentMap from './componentMap'

// 路由守卫

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const {token} = useAuthStore()
    return token ? <>{children}</> : <Navigate to="/login" replace />
}
// 递归生成动态路由
const generateRoutes = (menuList: any[]): any[] => {
  const routes: any[] = []

  menuList.forEach(menu => {
    // 有子菜单递归处理
    if (menu.children?.length > 0) {
      routes.push(...generateRoutes(menu.children))
    } else {
      // 没有子菜单生成路由
      // '/dashboard' → 'dashboard'
      const path = menu.key.startsWith('/')
        ? menu.key.slice(1)
        : menu.key 

      const element = componentMap[menu.key]

      if (element) {
        routes.push({ path, element })
      }
    }
  })

  return routes
}

export default function AppRouter() {
    const { MenuRouter } = useAuthStore()  // 👈 从 store 取菜单


  // 动态生成路由
  const dynamicRoutes = generateRoutes(MenuRouter ?? []) // 检查生成的路由
    return useRoutes([
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/',
            element: <PrivateRoute><BasicLayout /></PrivateRoute>,
            children: [{ index: true, element: <Navigate to="/dashboard" replace /> },

                ...dynamicRoutes
            ]
        },

    ])
}