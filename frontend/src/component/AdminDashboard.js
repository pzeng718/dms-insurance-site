import { useEffect, useState } from "react";
import Request from "../util/Request";
import { Button, Modal, Input, message } from "antd";

function AdminDashboard() {
    const request = new Request();
    const [purchasedPolicies, setPurchasedPolicies] = useState([]);
    const [showChangePriceModal, setShowChangePriceModal] = useState(false);
    const [editingPolicyCode, setEditingPolicyCode] = useState(-1);
    const [defaultPrice, setDefaultPrice] = useState(-1);
    useEffect(() => {
        let sql = `select pr.*, COALESCE(subquery.NumberOfCustomers, 0) AS NumberOfCustomers from \`PRODUCTPLAN-H\` pr left outer join `
        sql += `(select policycode, count(*) as NumberOfCustomers from purchased_policies group by policycode) as subquery on pr.plancode = subquery.policycode`;
        request.post('db', {query: sql}).then(resp => {
            if(resp.status === 200){
                setPurchasedPolicies(resp.data);
            }
        })
    }, [])

    const updatePolicyPrice = () => {
        request.post('db', {query: `update \`productplan-h\` set AnnualizedPremium = ${defaultPrice} where PlanCode = ${editingPolicyCode}`}).then(resp => {
            if(resp.status === 200){
                message.success('Change price successfully, please refresh the page');
                setShowChangePriceModal(false);
            }
        })
    }
    return <div className="admin-policy-dashboard">
        <Modal 
            title="Change price modal" 
            open={showChangePriceModal} 
            onOk={updatePolicyPrice} 
            onCancel={() => setShowChangePriceModal(false)}
            okText="change price"
        >
            <p>Current policy: {editingPolicyCode}</p>
            Current price:
            <Input 
                style={{width: 100}}
                onChange={(e) => setDefaultPrice(parseInt(e.target.value))}
                value={defaultPrice}
            />
        </Modal>
        <h3>See how each policy is doing</h3>
        {purchasedPolicies.map(policy => {
            return <section key={policy.PlanCode} className="admin-policy-card">
                <h3>PlanName: {policy.PlanName}, PolicyCode: {policy.PlanCode}</h3>
                <p>LineOfBusiness: {policy.LineOfBusiness}</p>
                <p>SeriesName: {policy.SeriesName}</p>
                <p>RiderName: {policy.RiderName}</p>
                <p>PlanName: {policy.PlanName}</p>
                <p>Number of customers purchased: {policy.NumberOfCustomers}</p>
                <p>
                    Price: {policy.AnnualizedPremium} 
                    <Button 
                        type="primary" 
                        style={{marginLeft: '10px'}} 
                        onClick={() => { setShowChangePriceModal(true); setEditingPolicyCode(policy.PlanCode); setDefaultPrice(policy.AnnualizedPremium) }}
                    >
                        Change price
                    </Button>
                </p>
            </section>
        })}
    </div>
}

export default AdminDashboard;