import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Request from "../util/Request";
import { Button, Popconfirm, message } from "antd";
import Navbar from "./Navbar";

function CustomerPolicyDashboard() {
    const request = new Request();
    const [policies, setPolicies] = useState([]);
    useEffect(() => {
        let custId = Cookies.get('custId');
        if(custId){
            request.post('db', {query: `select * from purchased_policies where CustomerId = ${custId}`}).then(resp => {
                if(resp.status === 200){
                    setPolicies(resp.data);
                }
            })
        }

    }, [])
    const formatDate = (dateStr) => {
        let date = new Date(dateStr);
        let day = date.toISOString().split('T')[0];

        return day;
    }
    const terminatePolicy = (purchaseId) => {
        request.post('db', {query: `update purchased_policies set Status = 'terminated' where PurchaseID = ${purchaseId}`}).then(resp => {
            if(resp.status === 200){
                message.success('Policy terminated, please refresh page')
            }else{
                message.error('Failed to terimnate, please consult admin.');
            }
        })
    }
    const renewPolicy = (purchaseId) => {
        request.post('db', {query: `update purchased_policies set EndDate = DATE_ADD(EndDate, INTERVAL 1 YEAR) where PurchaseID = ${purchaseId}`}).then(resp => {
            if(resp.status === 200){
                message.success('Policy renewed, please refresh page')
            }else{
                message.error('Failed to renew, please consult admin.');
            }
        })
    }
    const cancel = (e) => {
        console.log(e);
    };

    return <div className="customer-policy-container">
        <Navbar />
        {policies.length > 0 ? policies.map(policy => {
            return <section key={policy.PurchaseID} className="customer-policy-card">
                <h5 className="card-title">Purchase id: {policy.PurchaseID}</h5>
                <p>Policy Code: {policy.PolicyCode}</p>
                <p>Status: {policy.Status}</p>
                <p>Start Date: {formatDate(policy.StartDate)}</p>
                <p>End Date: {formatDate(policy.EndDate)}</p>
                <p>Purchase Date: {formatDate(policy.PurchaseDate)}</p>
                {policy.Status === 'active' ? <section className="card-button-container">
                    <Popconfirm
                        title="terminate policy"
                        description="Are you sure to terminate this policy"
                        onConfirm={() => terminatePolicy(policy.PurchaseID)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className="card-button" type="primary" danger>Terminate</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="renew policy"
                        description="Are you sure to renew this policy"
                        onConfirm={() => renewPolicy(policy.PurchaseID)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className="card-button" type="primary">Renew</Button>
                    </Popconfirm>
                </section> : ''}
            </section>
        }) 
        : <div>You haven't purchased any polies yet.</div>}
    </div>
}

export default CustomerPolicyDashboard;