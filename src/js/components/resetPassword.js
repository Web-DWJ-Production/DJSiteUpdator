import React, { Component } from 'react';
import axios from 'axios';

const baseUrl = "";

class ResetPassword extends Component{
    constructor(props) {
        super(props);

        this.state = {
            valid:false,
            password1:"",
            password2:""
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render(){  
        return(
            <div className="forgotPwd">
                <h2>Please enter a new password, atleast 7 characters long</h2>

                <div className="input-container">
                    <span className="lrg">New Password</span>
                    <input type="password" name="password1" id="password1" value={this.state.password1} onChange={(e) => this.handleTextChange(e)} />    
                </div>

                <div className={"input-container" + (this.state.password1.length > 0 && !this.state.valid ? " nomatch" : "")}>
                    <span className="lrg">Repeat New Password</span>
                    <input type="password" name="password2" id="password2" value={this.state.password2} onChange={(e) => this.handleTextChange(e)} />    
                </div>

                <div className="btn-container">
                    <div className={"btn save" + (this.state.valid === true ? "":" inactive")} onClick={this.handleSubmit}><i className="fas fa-sign-in-alt"></i><span>Submit</span></div>                                                                  
                </div>
            </div>
        );
    }

    handleTextChange(event){
        var self = this;
        try {
            var name = event.target.name;

            var tmpPwd = this.state[name];            
            tmpPwd = event.target.value;            

            this.setState({ [name]:tmpPwd }, () => {
                self.validPWD();
            });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }

    handleSubmit(){
        var self = this;
        try {
            self.props.toggleLoader(true);
            var postData = {"email":this.props.tmpEmail, "password": this.state.password1};

            axios.post(baseUrl + "/api/setNewPassword", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    self.props.toggleLoader(false);
                    var data = response.data;
                    if(data.errorMessage){
                        alert("Unable to reset password: " + data.errorMessage);
                    }
                    else if(data.results === true){
                        self.props.changeCard(data.returnStatus);
                    }
                    else {
                        alert("Unable to set password");
                        self.props.changeCard(data.returnStatus);
                    }                    
            });   
        }
        catch(ex){
            console.log("Error Setting Password: ",ex);
        }
    }

    validPWD(){
        try {
            if(this.state.password1.length > 6 && (this.state.password1 === this.state.password2)){
                this.setState({valid: true});
            }
            else {
                this.setState({valid: false});
            }
        }
        catch(ex){
            console.log("Error validating password: ", ex);
        }
    }
    componentDidMount(){}
}
export default ResetPassword;