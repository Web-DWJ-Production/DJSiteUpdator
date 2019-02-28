import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect } from "react-router-dom";

import LoginCard from './components/loginCard';

class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {
            redirectToReferrer:false
        }
        this.loginUser = this.loginUser.bind(this);
    }

    render(){  
        let { from } = { from: { pathname: "/" } };
        if (this.state.redirectToReferrer) return <Redirect to={from} />;

        return(
            <div className="page-container login">
                <h1>Login</h1>

                <div className="login-container">
                    <LoginCard loginUser={this.loginUser}/>
                </div>
            </div>
        );
    }
    
    loginUser(userInfo){
        var self = this;
        try {
            self.props.setUser({"_id":"U1", "name":"John Doe", "email":userInfo.email, "admin":false}, function(ret){
                self.setState({redirectToReferrer: ret});
            });
        }
        catch(ex){
            console.log(" Error login in user: ", ex);
        }
    }

    componentDidMount(){
        this.props.clearList();
    }
}
export default Login;