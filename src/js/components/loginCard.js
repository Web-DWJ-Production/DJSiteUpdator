import React, { Component } from 'react';

class LoginCard extends Component{
    constructor(props) {
        super(props);

        this.state = {
            validLogin:false,
            loginAttempt:{
                "email":"",
                "password":""
            }
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.loginUser = this.loginUser.bind(this);
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
                    <div className={"btn save" + (this.state.validLogin === true ? "":" inactive")} onClick={this.loginUser}><i className="fas fa-unlock-alt"></i><span>Login</span></div>                                              
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

            this.setState({ loginAttempt:tmpUser }, () => {
                self.validateCridentials();
            });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }

    loginUser(){
        var self = this;
        try {
            if(self.state.validLogin === true){
                self.props.loginUser(self.state.loginAttempt);
            }
            else {
                alert("Please Check Login Credentials");
            }
        }
        catch(ex){
            console.log("Error login in User(2): ",ex);
        }
    }

    validateCridentials(){
        try {
            var tmpUser = this.state.loginAttempt;
            var status = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(tmpUser.email)) 
            
            this.setState({validLogin: status});            
        }
        catch(ex){
            console.log("Error validating credientials: ",ex);
        }
    }
    componentDidMount(){
        this.setState({ loginAttempt:{ "email":"","password":""}});
    }
}
export default LoginCard;