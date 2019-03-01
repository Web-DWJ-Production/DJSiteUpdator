import React, { Component } from 'react';

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
        this.handleCancel = this.handleCancel.bind(this);
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
    
    changeCard(page){
        var self = this;
        try {
            if(page === ""){               
                this.props.changeCard("");                
            }            
        }
        catch(ex){
            console.log("Error changing card: ",ex);
        }
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
        try {
            this.changeCard("");
        }
        catch(ex){

        }
    }

    handleCancel(){
        try {

        }
        catch(ex){
            
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
            
        }
    }
    componentDidMount(){

    }
}
export default ResetPassword;