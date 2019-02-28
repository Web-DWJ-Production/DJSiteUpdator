import React, { Component } from 'react';

import LoginCard from './components/loginCard';

class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){  
        return(
            <div className="page-container login">
                <h1>Login</h1>

                <div className="login-container">
                    <LoginCard />
                </div>
            </div>
        );
    }
    
    componentDidMount(){
        this.props.clearList();
    }
}
export default Login;