import React, { Component } from 'react';

import quesFile from './secQues';

class ForgotPasswordCard extends Component{
    constructor(props) {
        super(props);

        this.state = {
            valid:false,
            questionId:"Q8",
            answer:""
        }

        this.getQuestion = this.getQuestion.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetQuestion = this.resetQuestion.bind(this);
    }

    render(){  
        return(
            <div className="forgotPwd">
                <h2>Please fill out the field below to reset your password</h2>

                <div className="input-container">
                    <span className="lrg">{ this.getQuestion(this.state.questionId) }</span>
                    <input type="text" name="answer" id="answer" value={this.state.answer} onChange={(e) => this.handleTextChange(e)} />    
                </div>

                <div className="btn-container">
                    <div className={"btn save" + (this.state.valid === true ? "":" inactive")} onClick={this.handleSubmit}><i className="fas fa-sign-in-alt"></i><span>Submit</span></div>  
                    <div className="btn reset" onClick={this.resetQuestion}><i className="fas fa-redo"></i><span>New Question</span></div>                                            
                </div>
            </div>
        );
    }
    
    getQuestion(id){
        var ret = null;
        try {
            ret = quesFile.find(function(q){ return q.id === id; });
        }
        catch(ex){

        }
        return (ret !== null ? ret.question : "");
    }

    handleTextChange(event){
        try {
            var tmpAnswer = this.state.answer;            
            tmpAnswer = event.target.value;            

            this.setState({ answer:tmpAnswer, valid: true });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }

    handleSubmit(){
        try {

        }
        catch(ex){

        }
    }

    resetQuestion(){
        try {

        }
        catch(ex){
            
        }
    }

    componentDidMount(){

    }
}
export default ForgotPasswordCard;