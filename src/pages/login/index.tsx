import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { login } from '@/services/login';
import styles from './index.module.scss';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { getDashboardData } from '@/services/dashboard'
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const { setToken, setUserInfo, setMenurouter } = useAuthStore();
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const res: any = await login(values)
      if (res.success) {
        setToken(res.data.login.token)
        setUserInfo(res.data.login)
        const data: any = await getDashboardData()
        setMenurouter(data.data)
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err)
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (<div className={styles.wrapper}>
    <div className={styles.container}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="账号"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入登录密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
          <Checkbox></Checkbox>
          我已阅读并同意《用户协议》《隐私政策》《儿童/青少年个人信息保护规则》
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            登录/注册
          </Button>
        </Form.Item>
        <Form.Item label={null}>
          新用户可直接登录
        </Form.Item>
      </Form>

    </div>
  </div>
  );
}
export default App;