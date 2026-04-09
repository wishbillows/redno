import { Avatar, Space, Tag, Flex, Typography } from 'antd';
import { HeartOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

const { Text } = Typography;

export const getColumns = (): TableProps<any>['columns'] => [
  {
    title: '用户信息',
    dataIndex: 'content',
    key: 'content',
    render: (_, record) => {
      console.log(record,'record')
     return (
      <Flex gap="middle" align="center">
        {/* {record.cover ? (
          <Avatar shape="square" size={64} src={record.author.color} />
        ) : (
          <div style={{ width: 64, height: 64, backgroundColor: '#ff4d4f', borderRadius: 4 }} />
        )} */}
        <div style={{ width:38, height: 38, backgroundColor: '#ff4d4f', borderRadius: 50,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}} >{record.username.slice(0,1)}</div>
         <Text strong ellipsis >{record.username || '标题不见了'}</Text>
      </Flex>
     )
    }
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    render: (_, record) => (
      <Space>
        <Text>{record.phone || '未知手机号'}</Text>
        {/* {record.phone ? (
           <Avatar src={record.phone} size="small" />
        ) : (
           <Avatar style={{ backgroundColor: '#ff4d4f' }} size="small">
             {record.phone?.[0] || '博'}
           </Avatar>
        )} */}
        {/* <Text  style={{color:`${record.author.color}`}}>{record.author.name || '匿名作者'}</Text> */}
      </Space>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = 'gold';
      let text = '正常';
      let bgColor = '#fffbe6';
      
      if (status === '"banned"' || status === 1) {
        color = '#52c41a';
        text = 'vip用户';
        bgColor = '#f6ffed';
      } else if (status === 'ban' || status === 2) {
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
    title: '发布内容',
    key: 'likeCount',
    render: (_, record) => (
      <Space size="middle" style={{ color: '#888' }}>
        <span><HeartOutlined style={{ color: '#ff4d4f' }} /> {record.likeCount || 0}</span>
        {/* <span><MessageOutlined /> {record.stats.comments || 0}</span> */}
        {/* <span><StarOutlined style={{ color: '#faad14' }} /> {record.stats.stars || 0}</span> */}
      </Space>
    ),
  },
  {
    title: '粉丝数',
    key: 'likeCount',
    render: (_, record) => (
      <Space size="middle" style={{ color: '#888' }}>
        <span><HeartOutlined style={{ color: '#ff4d4f' }} /> {record.postCount || 0}</span>
        {/* <span><MessageOutlined /> {record.stats.comments || 0}</span> */}
        {/* <span><StarOutlined style={{ color: '#faad14' }} /> {record.stats.stars || 0}</span> */}
      </Space>
    ),
  },
  {
    title: '注册时间',
    dataIndex: 'publishTime',
    key: 'publishTime',
    render: (_,record) => <Text type="secondary">{record.createdAt || '未知时间'}</Text>,
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => {
       const isBlocked = record.status === "normal"|| record.status === 2;
       return (
        <Space size="middle">
          {/* <a style={{ color: '#1677ff' }}>查看</a> */}
          {!isBlocked && <a style={{ color: '#52c41a' }}>详情</a>}
          {!isBlocked && <a style={{ color: '#ff4d4f' }}>禁封</a>}
          {/* {isBlocked && <Text type="secondary">详情</Text>}
          {isBlocked && <Text type="secondary">禁封</Text>} */}
        </Space>
       );
    },
  },
];
