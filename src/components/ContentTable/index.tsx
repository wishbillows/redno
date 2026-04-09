import { Tag } from 'antd'

const statusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待审核', color: 'orange' },
  approved: { text: '已通过', color: 'green' },
  blocked: { text: '已屏蔽', color: 'red' }
}

const mockData = [
  { id: 1, title: '春日踏青记录', author: '小红', avatar: '小', status: 'pending', time: '5分钟前' },
  { id: 2, title: '分享我的护肤心得', author: '美妆达人', avatar: '美', status: 'pending', time: '12分钟前' },
  { id: 3, title: '今日穿搭OOTD', author: '时尚博主', avatar: '时', status: 'approved', time: '1小时前' },
  { id: 4, title: '违规广告内容举报', author: '广告用户', avatar: '广', status: 'blocked', time: '2小时前' },
]

const avatarColors = ['#ff4d4f', '#1890ff', '#52c41a', '#fa8c16']

const ContentTable = () => {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '16px' }}>
      {/* 头部 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>最新待审核内容</p>
        <a style={{ fontSize: 13, color: '#ff4d4f' }}>查看全部 →</a>
      </div>

      {/* 表头 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        fontSize: 12,
        color: '#999',
        padding: '0 0 8px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <span>标题</span>
        <span>作者</span>
        <span>状态</span>
        <span>时间</span>
      </div>

      {/* 数据行 */}
      {mockData.map((item, index) => (
        <div key={item.id} style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          alignItems: 'center',
          padding: '12px 0',
          borderBottom: index < mockData.length - 1 ? '1px solid #f5f5f5' : 'none',
          fontSize: 13
        }}>
          <span style={{ color: '#1a1a1a' }}>{item.title}</span>

          {/* 作者 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: avatarColors[index % avatarColors.length],
              color: '#fff', fontSize: 11, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {item.avatar}
            </div>
            <span>{item.author}</span>
          </div>

          {/* 状态 */}
          <Tag color={statusMap[item.status].color} style={{ margin: 0 }}>
            {statusMap[item.status].text}
          </Tag>

          <span style={{ color: '#999' }}>{item.time}</span>
        </div>
      ))}
    </div>
  )
}

export default ContentTable