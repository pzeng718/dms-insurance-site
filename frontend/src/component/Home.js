import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import AdminDashboard from "./AdminDashboard.js";
import CustomerDashboard from "./CustomerDashboard.js";
import Navbar from "./Navbar.js";

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
        <div className="App">
            {user === 'admin' 
                ? <AdminDashboard /> 
                : <div>
                    <Navbar />
                    <CustomerDashboard user={user}/> 
                </div>
            }
        </div>
    )
}

export default App;
