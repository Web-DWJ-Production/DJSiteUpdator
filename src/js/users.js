import React, { Component } from 'react';

class Users extends Component{
    constructor(props) {
        super(props);

        this.state = {
            userList:[
                {_id:"1", admin:true, email:"testuser1@testmail.com", name:"Test User 1"},
                {_id:"2", email:"testuser2@testmail.com", name:"Test User 2"},
                {_id:"3", email:"testuser3@testmail.com", name:"Test User 3"},
                {_id:"4", email:"testuser4@testmail.com", name:"Test User 4"},
                {_id:"5", email:"testuser5@testmail.com", name:"Test User 5"}
            ]
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.addUser = this.addUser.bind(this);
    }

    render(){  
        return(
            <div className="page-container users">
                <h1>User Management</h1>
                <span className="ctrlCards">
                    <div className="ctrlCard addCard" onClick={this.addUser}><i className="fas fa-user-check"></i></div>
                </span>

                <div className="management-container">
                    {this.state.userList.map((item,i) =>
                        <div key={i} className={"user-line" + (i%2==0?" odd":"")}>
                            <div className="input-container">
                                <span>Name</span>
                                <input type="text" name="userName" id="userName" value={item.name} onChange={(e) => this.handleTextChange(e,"name",i)} />    
                            </div>

                            <div className="input-container">
                                <span>Email</span>
                                <input type="text" name="email" id="email" value={item.email} onChange={(e) => this.handleTextChange(e,"email",i)} />    
                            </div>

                            {(item.admin === true ? <div className="btn-message"><span>This User Is An Admin</span></div>
                                :                            
                                <div className="btn-container">
                                    <div className={"btn save" + (item.changes === true ? "":" inactive")} onClick={() => this.saveChanges(i)}><i className="fas fa-save"></i><span>Save Changes</span></div>                                
                                    <div className="btn reset" onClick={() => this.resetPassword(i)}><i className="fab fa-rev"></i><span>Reset Password</span></div>
                                    <div className="btn remove" onClick={() => this.removeUser(i)}><i className="fas fa-user-times"></i><span>Remove User</span></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    handleTextChange(event, type, loc){
        var self = this;
        try {
            var tmpList = self.state.userList;
            if(type in tmpList[loc]){
                tmpList[loc][type] = event.target.value;
                tmpList[loc].changes = true;
            }

            this.setState({ userList:tmpList });
        }
        catch(ex){

        }
    }

    addUser() {
        var self = this;
        try {
            var tmpList = self.state.userList;
            tmpList.push({email:"", name:"", password:null, admin:false});
            this.setState({ userList:tmpList });
        }
        catch(ex){

        }
    }
    saveChanges(loc){
        var self = this;
        try {
            var tmpList = self.state.userList;
            if(tmpList[loc].change) {

            }
        }
        catch(ex){

        }
    }

    removeUser(loc){
        var self = this;        
        try {            
            var tmpList = self.state.userList;             
            
            if(tmpList.length > 0) {
                var status = window.confirm("You are about to remove "+tmpList[loc].name+" is this OK?");
                if(status === true){
                    /* TODO GET ID & REMOVE ELEMENT FROM DB */                
                    var tmpRemoved = tmpList.splice(loc,1);
                    self.setState({ userList:tmpList });
                }
            }
        }
        catch(ex){
            
        }
    }

    resetPassword(loc){
        var self = this;
        try {

        }
        catch(ex){
            
        }
    }

    loadUserList(){
        var self = this;
        try {

        }
        catch(ex){

        }
    }
    componentDidMount(){
        this.props.setList();
        this.loadUserList();
    }
}
export default Users;