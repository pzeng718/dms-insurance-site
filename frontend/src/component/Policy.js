import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Request from "../util/Request";
import { Button, message, Modal, Form, Input, InputNumber, Select } from "antd";
import Navbar from "./Navbar";

function Policy() {
    const request = new Request();
    const [policy, setPolicy] = useState({});
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [policyPurchased, setPolicyPurchased] = useState(false);
    const [quotePricing, setQuotePricing] = useState(0);
    const [custId, setCustId] = useState(-1);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const planCode = params.get('planCode');
        request.post('db', {query: `select * from \`productplan-h\` where plancode = ${planCode}`}).then(resp => {
            if(resp.status === 200 && resp.data.length > 0){
                setPolicy(resp.data[0]);
            }else{
                message.error(`Policy ${planCode} does not exist.`)
            }
        })

        let custId = Cookies.get('custId');
        if(custId){
            setCustId(custId);
            request.post('db', {query: `select * from purchased_policies where CustomerId = ${custId} and PolicyCode = ${planCode}`}).then(resp => {
                if(resp.status === 200 && resp.data.length > 0){
                    setPolicyPurchased(true);
                }
            })
        }
    }, [])
    const applyForPolicy = (values) => {
        request.post('getQuote', {user: values.user, basePrice: policy.AnnualizedPremium}).then(resp => {
            setIsApplicationModalOpen(false);
            if(resp.status === 200 && resp.data.hasOwnProperty('price')){
                message.success('We have got you the price for your quote!');
                setQuotePricing(resp.data.price);
            }else{
                message.warning('Fail to calculate the price for your quote, please try again later.')
            }
        })
    };
    const purchasePolicy = () => {
        let todayDate = new Date();
        let day = todayDate.toISOString().split('T')[0];
        let purchaseSql =  `insert into \`purchased_policies\`(CustomerId, PolicyCode, PurchaseDate, StartDate, EndDate, Status)`;
        purchaseSql += ` values('${custId}', ${policy.PlanCode}, '${day}', '${day}', DATE_ADD('${day}', INTERVAL 1 YEAR), 'active');`;
        request.post('db', {query: purchaseSql}).then(resp => {
            if(resp.status === 200){
                message.success('Congraulations! You have purcahsed our policy, you can go to dashboard to check it out.');
                setPolicyPurchased(true);
            }
        })
    }
    const layout = {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 14,
        },
    };
    const options = [
        {
            label: 'Cancer',
            value: 'Cancer'
        },
        {
            label: 'Diabetes',
            value: 'Diabetes'
        },
        {
            label: 'Respiratory Diseases',
            value: 'Respiratory Diseases'
        },
        {
            label: 'Mental Health Conditions',
            value: 'Mental Health Conditions'
        },
        {
            label: 'Chronic Pain',
            value: 'Chronic Pain'
        }
    ]
    return <div className="policy-card">
        <Navbar />
        <section><b>PlanName: </b>{policy.PlanName}</section>
        <section><b>PlanCode: </b>{policy.PlanCode}</section>
        <section><b>LineOfBusiness: </b>{policy.LineOfBusiness}</section>
        <section><b>Description: </b>{policy.Description}</section>
        <section><b>Benefit: </b>{policy.Benefit}</section>
        <section><b>RiderName: </b>{policy.RiderName}</section>
        <section><b>SeriesName: </b>{policy.SeriesName}</section>
        {policyPurchased ?
        <div>
            You have purcahsed this policy. <br />
            <Button 
                type="primary" 
                onClick={() => window.open(`/policyDashboard`, '_blank')}
            >
                Go to my dashboard
            </Button>
        </div>
        : (quotePricing === 0 
        ? <Button 
            type="primary" 
            style={{marginTop: '20px'}} 
            onClick={() => setIsApplicationModalOpen(true)}
        >
            Apply
        </Button>
        : <div>
            Your price for this policy: {quotePricing} <br />
            <Button 
                type="primary"
                style={{margin: '20px 10px 0 0'}}
                onClick={purchasePolicy}
            >
                Purchase this policy
            </Button>
            or 
            <Button
                type="primary"
                style={{margin: '20px 0 0 10px'}}
                onClick={() => setIsApplicationModalOpen(true)}
            >
                Modify your application
            </Button>
        </div>)
        }
        <Modal 
            title={`${policy.PlanName} Application`}
            open={isApplicationModalOpen} 
            footer={null}
        >
            <Form
                {...layout}
                name="nest-messages"
                onFinish={applyForPolicy}
                style={{
                    maxWidth: 600,
                    marginTop: '30px'
                }}
            >
                <Form.Item
                    name={['user', 'name']}
                    label="Name"
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['user', 'email']}
                    label="Email"
                    rules={[
                        {
                        type: 'email',
                        required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['user', 'age']}
                    label="Age"
                    rules={[
                        {
                        type: 'number',
                        min: 0,
                        max: 99,
                        required: true,
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item 
                    name={['user', 'state']} 
                    label="state" 
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item 
                    name={['user', 'city']} 
                    label="city"
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'zipcode']} label="zipcode">
                    <InputNumber />
                </Form.Item>
                <Form.Item name={['user', 'medical_history']} label="medical history">
                    <Select
                        mode="multiple"
                        allowClear
                        style={{
                            width: '100%',
                        }}
                        placeholder="Please select"
                        options={options}
                    />
                </Form.Item>
                <Form.Item
                wrapperCol={{
                    ...layout.wrapperCol,
                    offset: 8,
                }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button onClick={() => setIsApplicationModalOpen(false)} style={{marginLeft: '20px'}}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </div>;
}

export default Policy;