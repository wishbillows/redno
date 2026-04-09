const categories = [
  { name: '美妆护肤', percent: 32, color: '#ff4d4f' },
  { name: '穿搭时尚', percent: 24, color: '#1890ff' },
  { name: '美食探店', percent: 18, color: '#52c41a' },
  { name: '旅行攻略', percent: 14, color: '#fa8c16' },
  { name: '其他',    percent: 12, color: '#722ed1' },
]

const CategoryBar = () => {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '16px', height: '100%',marginLeft:"20px" }}>
      <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 20px' }}>各分类内容占比</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {categories.map((item) => (
          <div key={item.name}>
            {/* 名称 + 百分比 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: '#1a1a1a',
              marginBottom: 6
            }}>
              <span>{item.name}</span>
              <span style={{ color: '#999' }}>{item.percent}%</span>
            </div>

            {/* 进度条 */}
            <div style={{
              width: '100%', height: 6,
              background: '#f5f5f5',
              borderRadius: 3, overflow: 'hidden'
            }}>
              <div style={{
                width: `${item.percent}%`,
                height: '100%',
                background: item.color,
                borderRadius: 3,
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryBar