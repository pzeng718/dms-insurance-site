import { useEffect, useState } from "react";
import { Card } from "antd";
import Request from "../util/Request";

function CustomerDashboard({user}) {
    const request = new Request();
    const [policies, setPolicies] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            const dateElement = document.getElementById('date');
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            if(dateElement){
                dateElement.textContent = `${today.toLocaleDateString('en-US', options)}`;
            }
        }, 50)
        
        request.post('db', {query: 'select * from `productplan-h`'}).then(resp => {
            if(resp.status === 200){
                setPolicies(resp.data);
            }
        })
        
    }, [])

    const onPolicyClick = (planCode) => {
        window.open(`${window.location.href}policy?planCode=${planCode}`, '_blank');
    }

    return <div className="customer-dashboard">
        <div className="greeting">
            <div id="date"></div>
            Welcome, {user}
        </div>

        <div>
            <h3>Here are your policies, click to learn more</h3>
            {
                policies.map(policy => {
                    return (<Card onClick={() => onPolicyClick(policy.PlanCode)} key={policy.ContractNumber} className="policy" title={policy.PlanName}>
                        <section><b>ContractNumber:</b> {policy.ContractNumber}</section>
                        <section><b>Benefit:</b> {policy.Benefit}</section>
                        <section><b>Description:</b> {policy.Description}</section>
                        <section><b>Series:</b> {policy.SeriesName}</section>
                    </Card>)
                })
            }
        </div>
    </div>;
}

export default CustomerDashboard;