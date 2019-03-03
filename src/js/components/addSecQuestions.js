import React, { Component } from 'react';
import axios from 'axios';
import quesFile from './secQues';

const baseUrl = "http://localhost:1777";

class AddSecQuestions extends Component{
    constructor(props) {
        super(props);

        this.state = {
            valid:false,
            securityQuestions:[
                {question:"",answer:""},
                {question:"",answer:""},
                {question:"",answer:""}
            ]
        }

        this.checkQuestionId = this.checkQuestionId.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    render(){  
        return(
            <div className="forgotPwd">
                <h2>Please complete all of the security questions</h2>

                <div className="input-container">
                    <span>Security Question 1</span>
                    <select onChange={(e) => this.handleQuestionChange(e,"question",0)} value={this.state.securityQuestions[0].question}>
                        <option value="">Select A Question</option>
                        {quesFile.map((item,i) =>
                            <option key={i} value={item.id} disabled={(this.checkQuestionId(0, item) === true ? null : true)}>{item.question}</option>
                        )}
                    </select>
                    <input type="text" name="secQues1" id="secQues1" value={this.state.securityQuestions[0].answer} onChange={(e) => this.handleQuestionChange(e,"answer",0)}/>    
                </div>

                <div className="input-container">
                    <span>Security Question 2</span>
                    <select onChange={(e) => this.handleQuestionChange(e,"question",1)} value={this.state.securityQuestions[1].question}>
                        <option value="">Select A Question</option>
                        {quesFile.map((item,i) =>
                            <option key={i} value={item.id} disabled={(this.checkQuestionId(1, item) === true ? null : true)}>{item.question}</option>
                        )}
                    </select>
                    <input type="text" name="secQues1" id="secQues1" value={this.state.securityQuestions[1].answer} onChange={(e) => this.handleQuestionChange(e,"answer",1)}/>    
                </div>

                <div className="input-container">
                    <span>Security Question 3</span>
                    <select onChange={(e) => this.handleQuestionChange(e,"question",2)} value={this.state.securityQuestions[2].question}>
                        <option value="">Select A Question</option>
                        {quesFile.map((item,i) =>
                            <option key={i} value={item.id} disabled={(this.checkQuestionId(2, item) === true ? null : true)}>{item.question}</option>
                        )}
                    </select>
                    <input type="text" name="secQues1" id="secQues1" value={this.state.securityQuestions[2].answer} onChange={(e) => this.handleQuestionChange(e,"answer",2)}/>    
                </div>

                <div className="btn-container">
                    <div className={"btn save" + (this.state.valid === true ? "":" inactive")} onClick={this.handleSubmit}><i className="fas fa-sign-in-alt"></i><span>Submit</span></div>  
                    <div className="btn reset" onClick={this.handleCancel}><i className="fas fa-redo"></i><span>Cancel</span></div>                                            
                </div>
            </div>
        );
    }

    handleQuestionChange(event, type, loc) {
        var self = this;
        try {
            var tmpQues = self.state.securityQuestions;
            tmpQues[loc][type] = event.target.value;

            this.setState({ user:tmpQues }, () => { 
                self.validQuestions();
            });
        }
        catch(ex){
            console.log("Error with question answer change: ",ex);
        }
    }

    checkQuestionId(locId, ques) {
        var ret = false;
        try {
           if(locId+1 <= this.state.securityQuestions.length) {
               var idList = this.state.securityQuestions.map(function (ques) {
                    return ques.question
               });
               if((ques.id === this.state.securityQuestions[locId].question) ||
                !(idList.includes(ques.id))){
                    ret = true;
               } 
           }
        }
        catch(ex){
            console.log("Error checking Questions Id: ",ex);
        }
        return ret;
    }

    validQuestions(){
        try {
            var status = true;
            var tmpQues = this.state.securityQuestions;

            tmpQues.forEach(element => {
                if(element.question.length === 0 || element.answer.length === 0){
                    status = false;
                }
            });

            this.setState({valid:status});
        }
        catch(ex){
            console.log("Error validating questions: ",ex);
        }
    }

    handleSubmit(){
        var self = this;
        try {
            self.props.toggleLoader(true);

            var postData = {"email":this.props.tmpEmail, "securityQuestions": this.state.securityQuestions};

            axios.post(baseUrl + "/api/setSecurityQuestions", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    self.props.toggleLoader(false);
                    var data = response.data;
                    if(data.errorMessage){
                        alert("Unable to set security questions: " + data.errorMessage);
                    }
                    else if(data.results === true){
                        self.props.changeCard(data.returnStatus);
                    }
                    else {
                        alert("Unable to set security questions");
                        self.props.changeCard(data.returnStatus);
                    }                    
            });       
        }
        catch(ex){
            console.log(" [Error] setting questions: ",ex);
        }
    }

    handleCancel(){        
        this.props.changeCard("");        
    }

    componentDidMount(){}
}
export default AddSecQuestions;