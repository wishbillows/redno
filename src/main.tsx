
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {App, ConfigProvider} from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppRouter  from '@/router'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <QueryClientProvider client={queryClient}>
    <ConfigProvider locale={zhCN} theme={{
      token:{
        colorPrimary:'#ff2442'//小红书色
      }
    }}>
      {/* <App> */}
        <AppRouter />
      {/* </App> */}
      </ConfigProvider>
  </QueryClientProvider>
  </BrowserRouter>
)