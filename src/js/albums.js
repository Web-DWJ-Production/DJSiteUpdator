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
var tmpImg = null;

class Albums extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedId:null,
            selectedItem:{links:[]},
            linksList:["itunes","soundcloud","other"],
            albumList:[]
        }

        this.socketDeclaration = this.socketDeclaration.bind(this);
        this.changeSelected = this.changeSelected.bind(this);
        this.getLinkIcon = this.getLinkIcon.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.removeLink = this.removeLink.bind(this);
        this.newAlbum = this.newAlbum.bind(this);
        this.addLink = this.addLink.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateAlbum = this.updateAlbum.bind(this);
    }

    getLinkIcon(link, key){
        switch(link.type){
            case "itunes":
                return <a href={link.url} target="_blank" rel="noopener noreferrer" key={key} className="link-icon itunes"><i className="fab fa-apple"></i></a>
            case "soundcloud":
                return <a href={link.url} target="_blank" rel="noopener noreferrer" key={key} className="link-icon soundcloud"><i className="fab fa-soundcloud"></i></a>
            default:
                return <a href={link.url} target="_blank" rel="noopener noreferrer" key={key} className="link-icon other"><i className="fas fa-music"></i></a>
        }
    }

    changeSelected(id){
        var self = this;
        if(id === null){
            this.setState({selectedId:id, selectedItem: {links:[]}});
        }
        else if(id !== this.state.selectedId) {
            var status = (this.state.selectedId !== null ? window.confirm("Are you sure you want to switch selected without saving?") : true);
            
            if(status){
                let tmpItem = Object.assign({}, this.state.albumList[id]);
                tmpItem.links = [];
                this.state.albumList[id].links.forEach(function(link) {
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
            //var date = event.target.name;

            tmpItem.date = date;            

            this.setState({ selectedItem:tmpItem });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
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

            this.setState({ selectedItem:tmpItem });
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
            this.setState({ selectedItem:tmpItem });
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
            this.setState({ selectedItem:tmpItem });
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
                errors.push("Please Add Album Title");
            }
            if(!tmpItem.date || tmpItem.date.length <= 0){
                errors.push("Please Add Album Release Date");
            }
        }
        catch(ex){

        }

        return errors;
    }

    newAlbum() {
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
            console.log("Error adding new album: ",ex);
        }
    }
    addLink(){
        var self = this;
        try {
            let tmpLink = Object.assign({}, {url:"", type:""});   
            let tmpAlbum = this.state.selectedItem;
            tmpAlbum.links.push(tmpLink); 

            this.setState({selectedItem: tmpAlbum});
        }
        catch(ex){
            console.log("Error adding new album: ",ex);
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
    
    updateAlbum(type){
        var self = this;
        try {
            if(type === "save"){
                var errorStatus = this.validateForm();
                if(errorStatus.length > 0){
                    alert("Unable To Save: " + errorStatus.join(", "));
                }   
                else {
                    localSock.emit('update album', {"album": this.state.selectedItem});
                }    
            }
            else if(type === "delete"){
                var status = window.confirm("Are you sure you want to delete the selected album?");
                if(status){
                    var tmpRemoved = self.state.selectedItem
                    var postData = {"id": tmpRemoved._id };

                    axios.post(this.props.baseUrl + "/api/removeAlbum", postData, {'Content-Type': 'application/json'})
                        .then(function(response) {                        
                            if(response.data && response.data.results){                                
                                alert("Successfully deleted album"); 
                                self.changeSelected(null);
                                self.getAlbums();
                            }
                            else {
                                alert("Error deleting user: " + response.data.errorMessage);
                            }
                    });  
                }  
            }
        }
        catch(ex){
            console.log("Error updating albums: ", ex);
        }
    }

    render(){  
        return(
            <div className="page-container albums">
                <SocketConnect baseUrl={this.props.baseUrl} user={this.props.currentUser} socketDeclaration={this.socketDeclaration}/>

                <h1>Albums</h1>
                <div className="split-editor">
                    <div className="song-selector split">                    
                        <div className="music-list">
                            <div className="music-item new">
                                <div className="music-icon save-icon">                                                    
                                    <i className="fas fa-plus-circle"></i>
                                </div>
                                <div className="music-title" onClick={()=> this.newAlbum()}>Add Album</div>                                    
                            </div>
                            {this.state.albumList.map((album,i) => (
                                <div key={i} className="music-item">
                                    <div className="music-icon">                                                    
                                        <img src={(album.img && album.img !== "" ? album.img : defaultImg)}/>
                                    </div>
                                    <div className="music-title" onClick={()=> this.changeSelected(i)}>{album.title}</div>
                                    <div className="music-links-container">
                                        {album.links.map((link,j) => (
                                            this.getLinkIcon(link,j)
                                        ))}
                                    </div>
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
                                    <span>Additional Info</span>
                                    <input type="text" name="additionalInfo" id="additionalInfo" value={this.state.selectedItem.additionalInfo} onChange={(e) => this.handleTextChange(e)} />    
                                </div>
                                <div className="input-container">
                                    <span>Release Date</span>                                                                    
                                    <DatePicker onChange={this.handleDateChange} selected={this.state.selectedItem.date}/>
                                </div>
                                <div className="input-container">
                                    <span>Download Links</span>                                
                                    <div className="links-container">
                                        {this.state.selectedItem.links.map((item,i) => (
                                            <div className="link-container" key={i}>
                                                <select name="type" id="type" value={item.type} onChange={(e) => this.handleLinkChange(e,i)}>
                                                    <option value="">Please Select A Type</option>
                                                    {this.state.linksList.map((link,j) =>(
                                                        <option key={j} value={link}>{link}</option>
                                                    ))}
                                                </select>
                                                <input type="text" name="url" id="url" value={item.url} onChange={(e) => this.handleLinkChange(e,i)} />    
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
                                    <div className="ctrl-btn save" onClick={() => this.updateAlbum("save")}><i className="far fa-save"></i><span>Save Album</span></div>
                                    <div className="ctrl-btn delete" onClick={() => this.updateAlbum("delete")}><i className="far fa-trash-alt"></i><span>Delete Album</span></div>
                                </div>                               
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
    
    socketDeclaration(localSock){
        var self = this;
        try {
            localSock.on('update album',function(res) {
                console.log("ret",res);
                if(res.results){
                    alert("Successfully updated album");
                    self.changeSelected(null);
                    self.getAlbums();
                }
                else {
                    alert("Error updating albums: ", res.errorMessage);
                }
            });
        }
        catch(ex){
            console.log("Error with socket declaration: ", ex);
        }
    }
    
    getAlbums(){
        var self = this;
        try {
            fetch(this.props.baseUrl + "/api/getAlbums")
            .then(function(response) {
                if (response.status >= 400) {throw new Error("Bad response from server"); }
                return response.json();
            })
            .then(function(data) {
                self.setState({ albumList: data.results});
            });
        }
        catch(ex){
            console.log(" Error loading announcements: ",ex);
        }
    }

    componentDidMount(){
        this.props.setList();
        this.getAlbums();
    }    
}

export default Albums;