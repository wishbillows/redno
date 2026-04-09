// src/layout/BasicLayout.tsx
import './tabStyle.css'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, theme, Spin, Tabs } from 'antd'
import type { MenuProps } from 'antd'
import * as AntdIcons from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'

const { Sider, Header, Content } = Layout

// 递归将 MenuRouter 打平为 { path: label } 映射
const flattenMenuRouter = (list: any[]): Record<string, string> => {
  const map: Record<string, string> = {}
  list.forEach(item => {
    if (item.key) map[item.key] = item.label
    if (item.children?.length > 0) {
      Object.assign(map, flattenMenuRouter(item.children))
    }
  })
  return map
}

type TabItem = { key: string; label: string }

export default function BasicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userInfo, logout, MenuRouter } = useAuthStore()
  const { token } = theme.useToken()
  const [loading, setLoading] = useState(true)
  const [menulist, setMenuList] = useState<MenuProps['items']>([])

  // 标签页状态
  const [tabs, setTabs] = useState<TabItem[]>([])
  const [activeTab, setActiveTab] = useState<string>('')

  // 每次路由变化时，自动添加标签
  useEffect(() => {
    const path = location.pathname
    const labelMap = flattenMenuRouter(MenuRouter)
    const label = labelMap[path] || path
    setTabs(prev => {
      if (prev.find(t => t.key === path)) return prev
      return [...prev, { key: path, label }]
    })
    setActiveTab(path)
  }, [location.pathname])

  useEffect(() => {
    fetchMenuList()
  }, [])

  const renderIcon = (iconStr: string) => {
    if (!iconStr) return null
    const iconName = iconStr.replace(/[<>/\s]/g, '')
    const IconComponent = (AntdIcons as any)[iconName]
    return IconComponent ? <IconComponent /> : null
  }

  const formatMenuList = (list: any[]): any[] => {
    return list.map(item => ({
      key: item.key,
      label: item.label,
      icon: renderIcon(item.icon),
      children: item.children?.length > 0 ? formatMenuList(item.children) : undefined,
    }))
  }

  const fetchMenuList = async () => {
    try {
      setMenuList(formatMenuList(MenuRouter))
    } catch (err) {
      console.error('获取菜单数据失败', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // 点击标签跳转
  const handleTabChange = (key: string) => {
    navigate(key)
  }

  // 关闭标签
  const handleTabEdit = (targetKey: any, action: 'add' | 'remove') => {
    if (action !== 'remove') return
    const newTabs = tabs.filter(t => t.key !== targetKey)
    setTabs(newTabs)
    // 如果关闭的是当前激活标签，跳转到最后一个
    if (targetKey === activeTab && newTabs.length > 0) {
      const last = newTabs[newTabs.length - 1]
      navigate(last.key)
    }
  }

  if (loading) return <Spin fullscreen />

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider width={220} theme="dark">
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff2442',
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          📋 RedNote 后台
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['content', 'user', 'market']}
          items={menulist}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        {/* 顶部 Header */}
        <Header style={{
          background: token.colorBgContainer,
          padding: '0 24px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          height: 64,
        }}>
          {/* 左侧：路由标签栏 */}
          <Tabs
            type="editable-card"
            hideAdd
            activeKey={activeTab}
            onChange={handleTabChange}
            onEdit={handleTabEdit}
            items={tabs.map(t => ({
              key: t.key,
              label: t.label,
              closable: t.key !== activeTab && tabs.length > 1,
            }))}
            size="small"
          />

          {/* 右侧：用户信息 */}
          <Dropdown menu={{
            items: [
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: '退出登录',
                onClick: handleLogout,
              },
            ],
          }}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Avatar src={userInfo?.avatar} icon={<UserOutlined />} />
              <span>{userInfo?.name ?? '管理员'}</span>
            </div>
          </Dropdown>
        </Header>

        {/* 内容区 */}
        <Content style={{ margin: 24, background: token.colorBgContainer, borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
