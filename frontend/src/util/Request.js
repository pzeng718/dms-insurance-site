import axios from 'axios';

class Request {
    post(url, params){
        return axios.post('http://localhost:3000/' + url, params);
    }
}
 
export default Request;