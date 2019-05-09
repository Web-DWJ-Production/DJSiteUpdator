import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

/* Images */
import defaultImg from '../assets/imgs/DefaultImg.PNG';
import defaultImgAlt from '../assets/imgs/DefaultImgW.PNG';

/* Components */
import SocketConnect from './components/socketConnect';

var localSock = null;

class Events extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedId:null,
            selectedItem:{links:[]},
            loader:false,
            eventList:[]
        }

        this.socketDeclaration = this.socketDeclaration.bind(this);
        this.changeSelected = this.changeSelected.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.removeLink = this.removeLink.bind(this);
        this.newEvent = this.newEvent.bind(this);
        this.addLink = this.addLink.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
    }

    changeSelected(id){
        var self = this;
        if(id === null){
            this.setState({selectedId:id, selectedItem: {links:[]}});
        }
        else if(id !== this.state.selectedId) {
            var status = (this.state.selectedId !== null ? window.confirm("Are you sure you want to switch selected without saving?") : true);
            
            if(status){
                let tmpItem = Object.assign({}, this.state.eventList[id]);
                tmpItem.links = [];
                this.state.eventList[id].links.forEach(function(link) {
                    tmpItem.links.push(Object.assign({}, link));
                });        
                this.setState({selectedId:id, selectedItem: tmpItem});
            }
        }
    }

    handleDateChange(date){
        var self = this;
        try {            
            var tmpItem = self.state.selectedItem;            
            tmpItem.date = date;            

            this.setState({ selectedItem:tmpItem });
        }
        catch(ex){
            console.log("Error with date change: ",ex);
        }
    }

    handleTextChange(event){
        var self = this;
        try {
            var name = event.target.name;
            var tmpItem = self.state.selectedItem;
            if(name in tmpItem){
                tmpItem[name] = event.target.value;
            }

            this.setState({ selectedItem:tmpItem }, () => {
                //self.validateCridentials();
            });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }
    handleLinkChange(event,loc){
        var self = this;
        try {
            var type = event.target.name;
            var tmpItem = this.state.selectedItem;
            tmpItem.links[loc][type] = event.target.value;
            this.setState({ selectedItem:tmpItem }, () => { 
                //self.validQuestions();
            });
        }
        catch(ex){
            console.log("Error with link change: ",ex);
        }
    }

    removeLink(loc){
        var self = this;
        try {           
            var tmpItem = this.state.selectedItem;
            tmpItem.links.splice(loc,1);
            this.setState({ selectedItem:tmpItem }, () => { 
                //self.validQuestions();
            });
        }
        catch(ex){
            console.log("Error with link change: ",ex);
        }
    }

    validateForm(){
        var self = this;
        var errors = [];
        try {            
            var tmpItem = this.state.selectedItem;

            if(tmpItem.title.length <= 0){
                errors.push("Please Add Event Title");
            }
            if(!tmpItem.date || tmpItem.date.length <= 0){
                errors.push("Please Add Event Date");
            }
        }
        catch(ex){
            console.log("Error validating form: ", ex);
        }

        return errors;
    }

    newEvent() {
        var self = this;
        try {
            if(this.state.selectedId !== -1) {
                var status = (this.state.selectedId !== null ? window.confirm("Are you sure you want to switch without saving?") : true);
                
                if(status){
                    let tmpItem = Object.assign({}, {title:'', additionalInfo:'', links:[]});                
                    self.setState({selectedId:-1, selectedItem: tmpItem});
                }
            }
        }
        catch(ex){
            console.log("Error adding new songs: ",ex);
        }
    }
    addLink(){
        var self = this;
        try {
            let tmpLink = Object.assign({}, {link:"", title:""});   
            let tmpEvent = this.state.selectedItem;
            tmpEvent.links.push(tmpLink); 

            this.setState({selectedItem: tmpEvent});
        }
        catch(ex){
            console.log("Error adding new songs: ",ex);
        }
    }

    handleInputChange(event){
        var self = this;
        try {
            var tmpItem = this.state.selectedItem;
            var file = event.target.files[0];

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                tmpItem.img = reader.result;         
                self.setState({ selectedItem: tmpItem });
            };
        }
        catch(ex){
            console.log("Error changing image: ",ex);
        }
    }
    
    updateEvent(type){
        var self = this;
        try {
            if(type === "save"){
                var errorStatus = this.validateForm();
                if(errorStatus.length > 0){
                    alert("Unable To Event: " + errorStatus.join(", "));
                }   
                else {
                    this.setState({loader: true}, () => {
                        localSock.emit('update event', {"event": this.state.selectedItem});
                    });                    
                }    
            }
            else if(type === "delete"){
                var status = window.confirm("Are you sure you want to delete the selected event?");
                if(status){
                    var tmpRemoved = self.state.selectedItem
                    var postData = {"id": tmpRemoved._id };

                    axios.post(this.props.baseUrl + "/api/removeEvent", postData, {'Content-Type': 'application/json'})
                        .then(function(response) {                        
                            if(response.data && response.data.results){                                
                                alert("Successfully deleted event"); 
                                self.changeSelected(null);
                                self.getEvents();
                            }
                            else {
                                alert("Error deleting event: " + response.data.errorMessage);
                            }
                    });  
                }  
            }
        }
        catch(ex){
            console.log("Error updating event: ", ex);
        }
    }

    render(){  
        return(
            <div className="page-container songs">
                <SocketConnect baseUrl={this.props.baseUrl} user={this.props.currentUser} socketDeclaration={this.socketDeclaration}/>

                <h1>Events</h1>
                <div className="split-editor">
                    <div className="song-selector split">                    
                        <div className="music-list">
                            <div className="music-item new">
                                <div className="music-icon save-icon">                                                    
                                    <i className="fas fa-plus-circle"></i>
                                </div>
                                <div className="music-title" onClick={()=> this.newEvent()}>Add Event</div>                                    
                            </div>  

                             {this.state.eventList.map((event,i) => (
                                <div key={i} className="music-item">
                                    <div className="music-icon">                                                    
                                        <img src={(event.img && event.img !== "" ? event.img : defaultImg)}/>
                                    </div>
                                    <div className="music-title" onClick={()=> this.changeSelected(i)}>{event.title}</div>
                                </div>
                            ))}                          
                        </div>
                    </div>
                    <div className="song-editor split">                                            
                        {this.state.selectedId != null && 
                            <div className="editor-container">
                                <div className="input-container">                              
                                    <div className="cover-photo">
                                        <div className="uploadContainer">
                                            <input type="file" className="img-input" name="imgFile" id="imgFile" accept="image/*" onChange={this.handleInputChange} />    
                                            <label className="img-lbl" htmlFor="imgFile"><div className="uploadImg"><i className="fas fa-file-import"></i></div></label>
                                        </div>
                                        {this.state.selectedItem.img ? <img src={this.state.selectedItem.img} className="cover-img" alt="" /> : <span>No Photo</span> }
                                    </div>
                                </div>

                                <div className="input-container">
                                    <span>Title</span>
                                    <input type="text" name="title" id="title" value={this.state.selectedItem.title} onChange={(e) => this.handleTextChange(e)} />    
                                </div>
                                <div className="input-container">
                                    <span>Location</span>
                                    <input type="text" name="location" id="location" value={this.state.selectedItem.location} onChange={(e) => this.handleTextChange(e)} />    
                                </div>
                                <div className="input-container">
                                    <span>Event Date</span>                                                                    
                                    <DatePicker onChange={this.handleDateChange} selected={this.state.selectedItem.date}/>
                                </div>
                                <div className="input-container">
                                    <span>Download Links</span>                                
                                    <div className="links-container">
                                        {this.state.selectedItem.links.map((item,i) => (
                                            <div className="link-container" key={i}>
                                                <input type="text" name="title" id="title" placeholder="Title" value={item.title} onChange={(e) => this.handleLinkChange(e,i)} />   
                                                <input type="text" name="link" id="link" placeholder="Link" value={item.link} onChange={(e) => this.handleLinkChange(e,i)} />    
                                                <span className="action-btns" onClick={() => this.removeLink(i)}><i className="fas fa-minus-circle"></i></span>
                                            </div>                                            
                                        ))}
                                        { this.state.selectedItem.links.length < 3 &&
                                            <div className="link-container">
                                                <div className="action-btns add" onClick={this.addLink}><i className="fas fa-link"></i><span>Add Download Link</span></div>
                                            </div>
                                        }
                                    </div>
                                </div> 

                                 <div className="ctrls">
                                    <div className="ctrl-btn save" onClick={() => this.updateEvent("save")}><i className="far fa-save"></i><span>Save Event</span></div>
                                    <div className="ctrl-btn delete" onClick={() => this.updateEvent("delete")}><i className="far fa-trash-alt"></i><span>Delete Event</span></div>
                                </div>                               
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
    
    socketDeclaration(tmpSock){
        var self = this;
        try {
            tmpSock.on('update event',function(res) {
                self.setState({loader: true}, () => {
                    if(res.results){
                        alert("Successfully updated event");
                        self.changeSelected(null);
                        self.getEvents();
                    }
                    else {
                        alert("Error updating event: ", res.errorMessage);
                    }
                });                
            });
            localSock = tmpSock;
        }
        catch(ex){
            console.log("Error with socket declaration: ", ex);
        }
    }
    
    getEvents(){
        var self = this;
        try {
            fetch(this.props.baseUrl + "/api/getEvents")
            .then(function(response) {
                if (response.status >= 400) {throw new Error("Bad response from server"); }
                return response.json();
            })
            .then(function(data) {
                self.setState({ eventList: data.results});
            });
        }
        catch(ex){
            console.log(" Error loading events: ",ex);
        }
    }

    componentDidMount(){
        this.props.setList();
        this.getEvents();
    }
}
export default Events;