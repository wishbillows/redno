import { useEffect, useState } from "react"
import { getPostsList } from "@/services/posts"
import Table from "@/components/Tables"
import { Card, Flex, Input, Select, DatePicker, Button, Space, Tag } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { getColumns } from "./columns"

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [postsList, setPostsList] = useState([])
  const [page, setpage] = useState(1)
  const [pageSize, setpageSize] = useState(10)
  const [total, settotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchPostsList = async () => {
    try {
      setLoading(true)
      const data = { page, pageSize }
      const res: any = await getPostsList(data)
      const list = (res.data?.list || []).map((item: any, index: number) => ({
        ...item,
        key: item.id || item.key || index,
      }))
      const newList = list.filter((item:any)=>item.status === 'pending')
      console.log(newList,'list')
      setPostsList(newList)
      settotal(res.data?.total || list.length)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPostsList()
  }, [page, pageSize])

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card styles={{ body: { padding: '16px 24px' } }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
          <Space size="middle" wrap>
            <Input placeholder="搜索标题/作者" prefix={<SearchOutlined />} style={{ width: 200 }} />
            <Select defaultValue="all" style={{ width: 120 }} options={[{ value: 'all', label: '全部状态' }]} />
            <Select defaultValue="fashion" style={{ width: 120 }} options={[{ value: 'fashion', label: '穿搭时尚' }]} />
            <RangePicker />
            <Button type="primary">搜索</Button>
            <Button>重置</Button>
          </Space>
          <Space>
            <Button>批量审核</Button>
            <Button danger>批量删除</Button>
          </Space>
        </Flex>
      </Card>
      
      <Card 
        styles={{ 
          header: { borderBottom: '1px solid #f0f0f0', padding: '16px 24px' },
          body: { padding: 0 }
        }}
        title={
          <div style={{ fontWeight: 'normal' }}>
            笔记列表 <span style={{ color: '#999', fontSize: 14 }}>共 {total} 条</span>
          </div>
        } 
        extra={
          <Space>
            <Tag color="#fff1f0" style={{ color: '#cf1322', borderRadius: 20, border: 'none', padding: '2px 12px' }}>
              待审核 156
            </Tag>
            <Button type="text" size="small" style={{ color: '#666', backgroundColor: '#f5f5f5', borderRadius: 20 }}>
              全部
            </Button>
          </Space>
        }
        bordered={false}
      >
        <Table 
          rowSelection={rowSelection}
          columns={getColumns()} 
          dataSource={postsList} 
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (p, pz) => {
              setpage(p)
              setpageSize(pz)
            }
          }}
        />
      </Card>
    </div>
  )
}

export default Dashboard