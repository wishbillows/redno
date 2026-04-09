import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const LineChart = () => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return
    
    // 初始化
    const chart = echarts.init(chartRef.current)
    
    // 配置项
    chart.setOption({
      title: { text: '近三个月 DAU 和内容发布量趋势' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['DAU', '内容发布量'] },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月','4月','5月','6月','7月','8月','9月','10月','11月',"12月"] // 你的数据
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'DAU',
          type: 'line',
          smooth: true,         // 平滑曲线
          areaStyle: {
            color: 'rgba(211, 204, 112, 0.2)' // 半透明填充
          },        // 面积填充
          data: [820, 932, 901,820, 932, 901,820, 932, 901,820, 932, 901]
        },
        {
          name: '内容发布量',
          type: 'line',
          smooth: true,
          lineStyle: { type: 'dashed' }, // 虚线
          areaStyle:{
            color: 'rgba(216, 24, 44, 0.2)' // 半透明填充
          },
          data: [620, 732, 701,620, 732, 701,620, 732, 701,620, 732, 701]
        }
      ]
    })

    // 响应式
    window.addEventListener('resize', () => chart.resize())
    
    // 销毁
    return () => {
      window.removeEventListener('resize', () => chart.resize())
      chart.dispose()
    }
  }, [])

  // 👇 父容器必须有高度！
  return <div ref={chartRef} style={{ width: '100%', height: '100%',background:"#fff" }} />
}

export default LineChart