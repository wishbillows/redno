interface StatCardProps {
  title: string
  value: string
  trend?: string      // '12.5%'
  trendUp?: boolean   // true 上涨 / false 下跌
  urgent?: boolean    // 紧急样式
  urgentText?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, trend, trendUp, urgent, urgentText
}) => {
  return (
    <div style={{
      background: '#fff',
      border: urgent ? 'none' : '1px solid #f0f0f0',
      borderLeft: urgent ? '3px solid #ff4d4f' : undefined,
      borderRadius: 8,
      padding: '20px 24px',
    }}>
      <p style={{ fontSize: 13, color: '#999', margin: '0 0 10px' }}>{title}</p>

      <p style={{
        fontSize: 26,
        fontWeight: 500,
        color: urgent ? '#ff4d4f' : '#1a1a1a',
        margin: '0 0 8px'
      }}>
        {value}
      </p>

      {/* 普通趋势 */}
      {trend && (
        <div style={{
          fontSize: 13,
          color: trendUp ? '#52c41a' : '#ff4d4f',
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          <span>{trendUp ? '▲' : '▼'}</span>
          <span>{trend} 较昨日</span>
        </div>
      )}

      {/* 紧急提示 */}
      {urgent && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#ff4d4f' }}>
          <span style={{
            width: 7, height: 7,
            borderRadius: '50%',
            background: '#ff4d4f',
            display: 'inline-block'
          }} />
          <span>{urgentText ?? '需立即处理'}</span>
        </div>
      )}
    </div>
  )
}

export default StatCard