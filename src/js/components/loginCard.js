import React, { Component } from 'react';

class LoginCard extends Component{
    constructor(props) {
        super(props);

        this.state = {
            validLogin:true,
            loginAttempt:{
                "email":null,
                "password":null
            }
        }
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    render(){  
        return(
            <div className="loginCard">
                 <h2>Please login in below to access the site editor</h2>

                 <div className="input-container">
                    <span>Email</span>
                    <input type="text" name="email" id="email" value={this.state.loginAttempt.email} onChange={(e) => this.handleTextChange(e,"email")} />    
                </div>

                <div className="input-container">
                    <span>Password</span>
                    <input type="password" name="password" id="password" value={this.state.loginAttempt.password} onChange={(e) => this.handleTextChange(e,"password")} />    
                </div>

                <div className="btn-container">
                    <div className={"btn save" + (this.state.validLogin === true ? "":" inactive")}><i className="fas fa-unlock-alt"></i><span>Login</span></div>                                              
                </div>
            </div>
        );
    }
    
    handleTextChange(event, type){
        var self = this;
        try {
            var tmpUser = self.state.loginAttempt;
            if(type in tmpUser){
                tmpUser[type] = event.target.value;
            }

            this.setState({ loginAttempt:tmpUser });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }

    componentDidMount(){

    }
}
export default LoginCard;