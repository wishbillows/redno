import StatCard from "@/components/StatCard"
import LineChart from "@/components/Charts/LineChart"
import PieChart from "@/components/Charts/PieChart"
import CategoryBar from "@/components/CategoryBar"
import ContentTable from "@/components/ContentTable"
import styles from './index.module.scss';
import { Col, Row } from 'antd';
const Dashboard = () => {
  return <div className={styles.dashboard}>
    {/* 第一行：4个统计卡片 styles.grid;"grid-cols-4" ,"gap-4 ","mb-6" */}

    <Row gutter={16}>
        <Col className={styles.gutterBox}  span={6}> <StatCard title="今日新增用户" value="1,284" trend="+12.5%" /></Col>
        <Col span={6}> <StatCard title="今日发布内容" value="3,891" trend="+8.3%" /></Col>
        <Col span={6}> <StatCard title="今日活跃用户 DAU" value="28,456" trend="-2.1%" /></Col>
        <Col span={6}> <StatCard title="待审核内容" value="156" urgent /></Col>

      </Row>

    {/* 第二行：折线图 + 饼图 grid grid-cols-3 gap-4 mb-6*/}

    <div className={styles.pie}>
      <Row>
        <Col span={16}><LineChart /></Col>
        <Col span={8}><PieChart /></Col>
      </Row>
    </div>
    {/* 第三行：表格 + 条形统计 */}
    <div className={styles.pie}>

      <Row>
        <Col span={12}> <ContentTable /></Col>
        <Col span={12}><CategoryBar /></Col>
      </Row>
    </div>
  </div>
}

export default Dashboard