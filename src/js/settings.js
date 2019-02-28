import React, { Component } from 'react';

import quesFile from './components/secQues';

class Settings extends Component{
    constructor(props) {
        super(props);

        this.state = {
            changes:false,
            user: {
                _id:"2", 
                email:"testuser2@testmail.com", 
                name:"Test User 2", 
                securityQuestions:[
                    {question:"Q3",answer:"test answer 1"},
                    {question:"Q8",answer:"test answer 2"},
                    {question:"Q4",answer:"test answer 3"}
                ]
            },
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.checkQuestionId = this.checkQuestionId.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    render(){  
        return(
            <div className="page-container settings">
                <h1>Settings</h1>

                <div className="management-container">
                    <div className="input-container">
                        <span>Name</span>
                        <input type="text" name="userName" id="userName" value={this.state.user.name} onChange={(e) => this.handleTextChange(e,"name")} />    
                    </div>

                    <div className="input-container">
                        <span>Email</span>
                        <input type="text" name="email" id="email" value={this.state.user.email} onChange={(e) => this.handleTextChange(e,"email")} />    
                    </div>

                    <h2 className="bodyHeader">Security Questions</h2>

                    <div className="input-container">
                        <span>Security Question 1</span>
                        <select onChange={(e) => this.handleQuestionChange(e,"question",0)}>
                            {quesFile.map((item,i) =>
                                <option key={i} value={item.id} disabled={(this.checkQuestionId(0, item) === true ? null : "true")} selected={this.isSelected(0, item)}>{item.question}</option>
                            )}
                        </select>
                        <input type="text" name="secQues1" id="secQues1" value={this.state.user.securityQuestions[0].answer} onChange={(e) => this.handleQuestionChange(e,"answer",0)}/>    
                    </div>

                    <div className="input-container">
                        <span>Security Question 2</span>
                        <select onChange={(e) => this.handleQuestionChange(e,"question",1)}>
                            {quesFile.map((item,i) =>
                                <option key={i} value={item.id} disabled={(this.checkQuestionId(1, item) === true ? null : "true")} selected={this.isSelected(1, item)}>{item.question}</option>
                            )}
                        </select>
                        <input type="text" name="secQues2" id="secQues2" value={this.state.user.securityQuestions[1].answer} onChange={(e) => this.handleQuestionChange(e,"answer",1)}/>    
                    </div>

                    <div className="input-container">
                        <span>Security Question 3</span>
                        <select onChange={(e) => this.handleQuestionChange(e,"question",2)}>
                            {quesFile.map((item,i) =>
                                <option key={i} value={item.id} disabled={(this.checkQuestionId(2, item) === true ? null : "true")} selected={this.isSelected(2, item)}>{item.question}</option>
                            )}
                        </select>
                        <input type="text" name="secQues3" id="secQues3" value={this.state.user.securityQuestions[2].answer} onChange={(e) => this.handleQuestionChange(e,"answer",2)}/>    
                    </div>

                </div>

                <div className="btn-container">
                    <div className={"btn save" + (this.state.changes === true ? "":" inactive")} onClick={this.saveChanges}><i className="fas fa-save"></i><span>Save Changes</span></div>                                              
                </div>
            </div>
        );
    }

    saveChanges(){
        var self = this;
        try {
            if(this.state.changes) {

            }
        }
        catch(ex){

        }
    }
    handleQuestionChange(event, type, loc) {
        var self = this;
        try {
            var tmpUser = self.state.user;
            tmpUser.securityQuestions[loc][type] = event.target.value;

            this.setState({ user:tmpUser, changes:true });
        }
        catch(ex){
            console.log("Error with question answer change: ",ex);
        }
    }

    handleTextChange(event, type){
        var self = this;
        try {
            var tmpUser = self.state.user;
            if(type in tmpUser){
                tmpUser[type] = event.target.value;
                tmpUser.changes = true;
            }

            this.setState({ user:tmpUser, changes:true });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }
    
    checkQuestionId(locId, ques) {
        var self = this;
        var ret = false;
        try {
           if(locId+1 <= this.state.user.securityQuestions.length) {
               var idList = this.state.user.securityQuestions.map(function (ques) {
                    return ques.question
               });
               if((ques.id == this.state.user.securityQuestions[locId].question) ||
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

    isSelected(locId, ques){
        var self = this;
        var ret = "";
        try {
           if(locId+1 <= this.state.user.securityQuestions.length) {
                if((ques.id == this.state.user.securityQuestions[locId].question)){
                    ret = "selected";
                } 
           }
        }
        catch(ex){
            console.log("Error checking Questions Id: ",ex);
        }
        return ret;
    }

    componentDidMount(){
        this.props.setList();
    }
}
export default Settings;