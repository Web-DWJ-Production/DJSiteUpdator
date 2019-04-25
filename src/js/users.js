import React, { Component } from 'react';
import axios from 'axios';

const baseUrl = "http://localhost:1777";

class Users extends Component{
    constructor(props) {
        super(props);

        this.state = {
            userList:[]
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
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
                        <div key={i} className={"user-line" + (i%2===0?" odd":"")}>
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
            if(tmpList[loc].changes) {
                var postData = {"user": tmpList[loc]};

                axios.post(baseUrl + "/api/updateUser", postData, {'Content-Type': 'application/json'})
                .then(function(response) {                        
                    var data = response.data;                    
                    alert((data.results ? "Successfully updated user" : "Error updating user: " + data.errorMessage));
                }); 
            }
        }
        catch(ex){
            console.log("Error saving changes: ",ex);
        }
    }

    removeUser(loc){
        var self = this;        
        try {            
            var tmpList = self.state.userList;             
            
            if(tmpList.length > 0) {
                var status = window.confirm("You are about to remove "+tmpList[loc].name+" is this OK?");
                if(status === true){          
                    var tmpRemoved = tmpList.splice(loc,1);                    
                    var postData = {"id": tmpRemoved[0]._id };

                    axios.post(baseUrl + "/api/removeUser", postData, {'Content-Type': 'application/json'})
                        .then(function(response) {                        
                            if(response.data && response.data.results){                                
                                self.setState({ userList:tmpList }, () => { alert("Successfully deleted user"); });
                            }
                            else {
                                alert("Error deleting user: " + response.data.errorMessage);
                            }
                    });  
                }
            }
        }
        catch(ex){
            console.log("Error deleting user: ",ex);
        }
    }

    loadUserList(){
        var self = this;
        try {
            var postData = {"id": null };

            axios.post(baseUrl + "/api/getUsers", postData, {'Content-Type': 'application/json'})
                .then(function(response) {                        
                    var list = (response.data && response.data.results ? response.data.results : []);
                    self.setState({ userList: list });
            });   
        }
        catch(ex){
            console.log("Error loading user list");
        }
    }
    componentDidMount(){
        this.props.setList();
        this.loadUserList();
    }
}
export default Users;