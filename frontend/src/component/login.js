import { Button, Checkbox, Form, Input, Card, message } from 'antd';
import Cookies from 'js-cookie';
import Request from '../util/Request';

function Login({setUser}) {
    const request = new Request();
    const onFinish = (values) => {
        let {email, password, remember} = values;
        if((email === 'admin' && password === 'admin123') || password === 'customer123'){
            message.success('login success');

            // find customer id
            if(email !== 'admin'){
                request.post('db', {query: `select CustId, CustLastName, CustFirstName from customer where CusteMailAddress = '${email}';`}).then(resp => {
                    if(resp.status === 200){
                        let data = resp.data;
                        if(data.length > 0){
                            let custFullName = `${data[0].CustLastName} ${data[0].CustFirstName}`;
                            setUser(custFullName);
                            Cookies.set('loginUser', custFullName);
                            Cookies.set('custId', data[0].CustId);
                        }
                    }
                })
            }else{
                setUser(email);
                Cookies.set('loginUser', email);
            }
        }else{
            message.error('Wrong username or password.')
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }
    return <div className='login-container'>
        <div className='login-card'>
            <Card style={{ width: 310 }}>
                <p style={{textAlign: 'center', marginBottom: '15px'}}>
                    Welcome to insurance website!
                </p>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your email!',
                            },
                        ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password!',
                            },
                        ]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                    <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    </div>
}

export default Login;