import React, { Component } from 'react';

import axios from 'axios';

//const baseUrl = "http://localhost:1777";
const baseUrl = "";

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
        this.changeCard = this.changeCard.bind(this);
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
                
                <div className="btn-link" onClick={() => this.changeCard("forgotpwd")}>Forgot Your Password?</div>
            </div>
        );
    }
    
    changeCard(page){
        var self = this;
        try {
            if(page === "forgotpwd"){
                if(self.state.validLogin !== true){
                    alert("Please enter a valid email address");
                }
                else {
                    /* TODO: check if email address is active */
                    this.props.changeCard("forgotpwd");
                }
            }
            else if(page === "setQues"){
                this.props.changeCard("setQues");
            } 
        }
        catch(ex){
            console.log("Error changing card: ",ex);
        }
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
                var postData = this.state.loginAttempt;
                self.props.toggleLoader(true);

                axios.post(baseUrl + "/api/validateUser", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    self.props.toggleLoader(false);
                    var data = response.data;
                    if(data.errorMessage){
                        alert("Unable to login: " + data.errorMessage);
                    }
                    else if(data.results){
                        self.props.loginUser(data.results);
                    }
                    else {
                        self.props.changeCard(data.returnStatus);
                    }                    
                });                
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
            
            this.setState({validLogin: status}, () => { if(status){ this.props.setTempEmail(tmpUser.email); } });            
        }
        catch(ex){
            console.log("Error validating credientials: ",ex);
        }
    }
    componentDidMount(){
        var self = this;
        this.setState({ loginAttempt:{ "email":this.props.tmpEmail,"password":""}}, () => {
            self.validateCridentials();
        });
    }
}
export default LoginCard;