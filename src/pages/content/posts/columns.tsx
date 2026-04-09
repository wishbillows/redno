import { Avatar, Space, Tag, Flex, Typography } from 'antd';
import { HeartOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

const { Text } = Typography;

export const getColumns = (): TableProps<any>['columns'] => [
  {
    title: '笔记内容',
    dataIndex: 'content',
    key: 'content',
    render: (_, record) => {
      console.log(record,'record')
     return (
      <Flex gap="middle" align="center">
        {record.cover ? (
          <Avatar shape="square" size={64} src={record.author.color} />
        ) : (
          <div style={{ width: 64, height: 64, backgroundColor: record.author.color || '#ff4d4f', borderRadius: 4 }} />
        )}
        <Flex vertical justify="space-between" style={{ height: 64, padding: '4px 0' }}>
          <Text strong ellipsis style={{ width: 200 }}>{record.title || '标题不见了'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            📄 {record.desc}
            {/* 📄 {record.type === 'video' ? '视频' : '图文'} · {record.mediaCount || 0} {record.type === 'video' ? '时长' : '张图'} */}
          </Text>
        </Flex>
      </Flex>
     )
    }
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
    render: (_, record) => (
      <Space>
        {record.authorAvatar ? (
           <Avatar src={record.authorAvatar} size="small" />
        ) : (
           <Avatar style={{ backgroundColor: '#ff4d4f' }} size="small">
             {record.authorName?.[0] || '博'}
           </Avatar>
        )}
        <Text  style={{color:`${record.author.color}`}}>{record.author.name || '匿名作者'}</Text>
      </Space>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = 'gold';
      let text = '待审核';
      let bgColor = '#fffbe6';
      
      if (status === 'published' || status === 1) {
        color = '#52c41a';
        text = '已发布';
        bgColor = '#f6ffed';
      } else if (status === 'blocked' || status === 2) {
        color = '#ff4d4f';
        text = '已屏蔽';
        bgColor = '#fff2f0';
      }
      
      return (
        <Tag color={bgColor} style={{ color, borderColor: 'transparent', borderRadius: 12, padding: '2px 8px' }}>
          {text}
        </Tag>
      );
    },
  },
  {
    title: '数据',
    key: 'data',
    render: (_, record) => (
      <Space size="middle" style={{ color: '#888' }}>
        <span><HeartOutlined style={{ color: '#ff4d4f' }} /> {record.stats.likes || 0}</span>
        <span><MessageOutlined /> {record.stats.comments || 0}</span>
        <span><StarOutlined style={{ color: '#faad14' }} /> {record.stats.stars || 0}</span>
      </Space>
    ),
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    key: 'publishTime',
    render: (_,record) => <Text type="secondary">{record.time || '未知时间'}</Text>,
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => {
       const isBlocked = record.status === 'blocked' || record.status === 2;
       return (
        <Space size="middle">
          <a style={{ color: '#1677ff' }}>查看</a>
          {!isBlocked && <a style={{ color: '#52c41a' }}>通过</a>}
          {!isBlocked && <a style={{ color: '#ff4d4f' }}>屏蔽</a>}
          {isBlocked && <Text type="secondary">已屏蔽</Text>}
        </Space>
       );
    },
  },
];
