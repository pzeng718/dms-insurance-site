import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';
import Login from "./component/login.js";
import Home from "./component/Home.js";
import Policy from "./component/Policy.js";
import CustomerPolicyDashboard from "./component/CustomerPolicyDashboard.js";

function App() {
    const [user, setUser] = useState('');
    useEffect(() => {
        const loginUser = Cookies.get('loginUser');
        if (loginUser) {
            setUser(loginUser);
        } else {
            console.log('Cookie not found');
        }
    }, [])
    return (
        user === '' 
        ? <Login setUser={setUser} /> 
        : <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/policyDashboard" element={<CustomerPolicyDashboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
