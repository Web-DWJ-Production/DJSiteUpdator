import React, { Component } from 'react';
import axios from 'axios';
import quesFile from './secQues';

const baseUrl = "http://localhost:1777";

class ForgotPasswordCard extends Component{
    constructor(props) {
        super(props);

        this.state = {
            valid:false,
            questionId:"",
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
                <h2>Please fill out the question field below with your previous answer to reset your password.</h2>

                <div className="input-container">
                    <span className="lrg">Email</span>
                    <input className="readOnly" type="text" name="email" id="email" readOnly value={this.props.tmpEmail} />    
                </div>

                <div className="input-container">
                    <span className="lrg">{ this.getQuestion(this.state.questionId) }</span>
                    <input type="text" name="answer" id="answer" value={this.state.answer} onChange={(e) => this.handleTextChange(e)} />    
                </div>

                <div className="btn-container">
                    <div className={"btn save" + (this.state.valid === true ? "":" inactive")} onClick={this.handleSubmit}><i className="fas fa-sign-in-alt"></i><span>Submit</span></div>  
                    <div className="btn reset" onClick={this.resetQuestion}><i className="fas fa-redo"></i><span>New Question</span></div>                                            
                    <div className="btn cancel" onClick={() => this.props.changeCard("")}><i className="far fa-times-circle"></i><span>Cancel</span></div>                                            
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
        return (ret ? ret.question : "");
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
        var self = this;
        try {
            self.props.toggleLoader(true);
            var postData = {"email":this.props.tmpEmail, "questionId": this.state.questionId, "answer":this.state.answer};

            axios.post(baseUrl + "/api/compareQuestionAnswer", postData, {'Content-Type': 'application/json'})
            .then(function(response) {
                self.props.toggleLoader(false);
                var data = response.data;
                if(data.errorMessage){
                    alert("Unable to compare answers: " + data.errorMessage);
                }
                else{
                    if(data.results !== true){
                        alert("Unable to compare answers");
                    }
                    self.props.changeCard(data.returnStatus);
                }                    
            });   
        }
        catch(ex){
            console.log("Error comparing password: ",ex);
        }
    }

    resetQuestion(){
        var self = this;
        try {
            self.props.toggleLoader(true);
            var postData = {"email":this.props.tmpEmail};

            axios.post(baseUrl + "/api/getResetQuestion", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    self.props.toggleLoader(false);
                    var data = response.data;
                    if(data.errorMessage){
                        alert("Unable to get security question: " + data.errorMessage);
                    }
                    else if(data.results){
                        self.setState({ questionId:data.results });
                    }
                    else {
                        alert("Unable to get security question");
                    }                    
            });  
        }
        catch(ex){
            
        }
    }

    componentDidMount(){
        this.resetQuestion();
    }
}
export default ForgotPasswordCard;