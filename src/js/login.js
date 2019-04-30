import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

import LoginCard from './components/loginCard';
import ForgotPasswordCard from './components/forgotPasswordCard';
import ResetPassword from './components/resetPassword';
import AddSecQuestions from './components/addSecQuestions';

const userKey = "dwjSystemUser_Gandhi3x";

class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {
            tmpEmail:"",
            redirectToReferrer:false,
            cardStatus:"",
            loader:false
        }
        this.loginUser = this.loginUser.bind(this);
        this.changeCard = this.changeCard.bind(this);
        this.setTempEmail = this.setTempEmail.bind(this);
        this.toggleLoader = this.toggleLoader.bind(this);
        this.checkUser = this.checkUser.bind(this);
    }

    render(){  
        let { from } = { from: { pathname: "/" } };
        if (this.state.redirectToReferrer) return <Redirect to={from} />;

        return(
            <div className="page-container login">
                <h1>Login</h1>

                { this.state.loader && <div className="loader"><i className="fas fa-spinner fa-spin"></i></div> }
                <div className="login-container">
                    { this.loginSwitch(this.state.cardStatus) }
                </div>
            </div>
        );
    }
    
    loginSwitch(param){
        switch(param){
            case 'resetpwd':
                return <ResetPassword changeCard={this.changeCard} setTempEmail={this.setTempEmail} toggleLoader={this.toggleLoader} tmpEmail={this.state.tmpEmail} />;
            case 'forgotpwd':
                return <ForgotPasswordCard changeCard={this.changeCard} setTempEmail={this.setTempEmail} toggleLoader={this.toggleLoader} tmpEmail={this.state.tmpEmail} />;
            case 'setQues':
                return <AddSecQuestions changeCard={this.changeCard} setTempEmail={this.setTempEmail} toggleLoader={this.toggleLoader} tmpEmail={this.state.tmpEmail}  />;
            default:
                return <LoginCard loginUser={this.loginUser} changeCard={this.changeCard} setTempEmail={this.setTempEmail} toggleLoader={this.toggleLoader} tmpEmail={this.state.tmpEmail} />;         
        }
    }

    loginUser(userInfo){
        var self = this;
        try {
            self.props.setUser(userInfo, function(ret){
                self.setState({redirectToReferrer: ret});
            });
        }
        catch(ex){
            console.log(" Error login in user: ", ex);
        }
    }

    setTempEmail(email){
        this.setState({ tmpEmail: email });
    }
    changeCard(newcard){
        this.setState({ cardStatus: newcard });
    }

    toggleLoader(status){
        this.setState({ loader: status });
    }

    checkUser(){
        var self = this;
        try {
            var sessionUser = sessionStorage.getItem(userKey);
            if(sessionUser){
                self.setState({redirectToReferrer: true});
            }
        }
        catch(ex){
            console.log("Error pulling session user:",ex);
        }        
    }

    componentDidMount(){
        this.props.clearList();
        this.checkUser();
        this.setState({ cardStatus: "", tmpEmail:"" });
    }
}
export default Login;