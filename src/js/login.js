import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect } from "react-router-dom";

import LoginCard from './components/loginCard';
import ForgotPasswordCard from './components/forgotPasswordCard';
import ResetPassword from './components/resetPassword';
import AddSecQuestions from './components/addSecQuestions';

class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {
            tmpEmail:"",
            redirectToReferrer:false,
            cardStatus:""
        }
        this.loginUser = this.loginUser.bind(this);
        this.changeCard = this.changeCard.bind(this);
        this.setTempEmail = this.setTempEmail.bind(this);
    }

    render(){  
        let { from } = { from: { pathname: "/" } };
        if (this.state.redirectToReferrer) return <Redirect to={from} />;

        return(
            <div className="page-container login">
                <h1>Login</h1>

                <div className="login-container">
                    { this.loginSwitch(this.state.cardStatus) }
                    {/*<LoginCard loginUser={this.loginUser}/> */}
                    {/*<ForgotPasswordCard /> */}
                    {/* <ResetPassword /> */}
                    {/*<AddSecQuestions />*/}
                </div>
            </div>
        );
    }
    
    loginSwitch(param){
        switch(param){
            case 'resetpwd':
                return <ResetPassword changeCard={this.changeCard} setTempEmail={this.setTempEmail} tmpEmail={this.state.tmpEmail} />;
                break;
            case 'forgotpwd':
                return <ForgotPasswordCard changeCard={this.changeCard} setTempEmail={this.setTempEmail} tmpEmail={this.state.tmpEmail} />;
                break;
            case 'setQues':
                return <AddSecQuestions changeCard={this.changeCard} setTempEmail={this.setTempEmail} tmpEmail={this.state.tmpEmail}  />;
                break;
            default:
                return <LoginCard loginUser={this.loginUser} changeCard={this.changeCard} setTempEmail={this.setTempEmail} tmpEmail={this.state.tmpEmail} />;
                break;            
        }
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

    setTempEmail(email){
        this.setState({ tmpEmail: email });
    }
    changeCard(newcard){
        this.setState({ cardStatus: newcard });
    }

    componentDidMount(){
        this.props.clearList();
        this.setState({ cardStatus: "", tmpEmail:"" });
    }
}
export default Login;