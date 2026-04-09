import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const PieChart = () => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.init(chartRef.current)

    chart.setOption({
      color: ['#ff4d4f', '#1890ff', '#52c41a'],
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%'
      },
      legend: {
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 12, color: '#666' },
        formatter: (name: string) => {
          const map: Record<string, string> = {
            '女性用户': '女性用户 68%',
            '男性用户': '男性用户 27%',
            '未知': '未知 5%'
          }
          return map[name]
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '75%'],   // 环形图内外半径
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: '68%\n女性用户',
            fontSize: 16,
            fontWeight: 500,
            color: '#1a1a1a',
            lineHeight: 24
          },
          // 只显示最大块的中心label
          emphasis: {
            label: { show: true }
          },
          labelLine: { show: false },
          data: [
            { value: 68, name: '女性用户' },
            { value: 27, name: '男性用户' },
            { value: 5,  name: '未知' }
          ]
        }
      ]
    })

    const resize = () => chart.resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      chart.dispose()
    }
  }, [])

  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '16px', height: '100%',margin:" 0 0 0 10px" }}>
      <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 12px' }}>用户性别分布</p>
      <div ref={chartRef} style={{ width: '100%', height: '280px' }} />
    </div>
  )
}

export default PieChart