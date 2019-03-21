import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

/* Images */
import defaultImg from '../assets/imgs/DefaultImg.PNG';
import defaultImgAlt from '../assets/imgs/DefaultImgW.PNG';

const baseUrl = "http://localhost:1777";
var localSock = null;


class Songs extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedId:null,
            selectedItem:{links:[]},
            linksList:["itunes","soundcloud","spinrilla","other"],
            songList:[
                {"title":"Trap blues", "additionalInfo":"", "date":new Date("2017-11-20"), "links":[{"type":"soundcloud", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"}], "img":""},
                {"title":"That Way", "additionalInfo":"", "date":new Date("2017-08-18"), "links":[{"type":"itunes", "url":"https://itunes.apple.com/us/album/that-way-feat-sleep/id1276026221?i=1276026223"}], "img":""},
                {"title":"Test Song 1", "additionalInfo":"", "date":new Date("2017-08-18"), "links":[{"type":"soundcloud", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"},{"type":"itunes", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"},{"type":"other", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"}], "img":""},
                {"title":"Test Song 2", "additionalInfo":"", "date":new Date("2017-07-18"), "links":[{"type":"soundcloud", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"}], "img":""},
                {"title":"Test Song 7", "additionalInfo":"beats by test", "date":new Date("2017-08-19"), "links":[{"type":"itunes", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"}], "img":""},
                {"title":"Test Song 8", "additionalInfo":"ft. T. est", "date":new Date("2017-04-13"), "links":[{"type":"spinrilla", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"}], "img":""}
            ]
        }

        this.changeSelected = this.changeSelected.bind(this);
        this.getLinkIcon = this.getLinkIcon.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.removeLink = this.removeLink.bind(this);
        this.newSong = this.newSong.bind(this);
        this.addLink = this.addLink.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateSong = this.updateSong.bind(this);
    }

    getLinkIcon(link, key){
        switch(link.type){
            case "itunes":
                return <a href={link.url} target="_blank" rel="noopener noreferrer" key={key} className="link-icon itunes"><i className="fab fa-apple"></i></a>
            case "soundcloud":
                return <a href={link.url} target="_blank" rel="noopener noreferrer" key={key} className="link-icon soundcloud"><i className="fab fa-soundcloud"></i></a>
            case "spinrilla":
                return <a href={link.url} target="_blank" rel="noopener noreferrer" key={key} className="link-icon spinrilla"><i className="fas fa-compact-disc"></i></a>
            default:
                return <a href={link.url} target="_blank" rel="noopener noreferrer" key={key} className="link-icon other"><i className="fas fa-music"></i></a>
        }
    }

    changeSelected(id){
        var self = this;
        if(id !== this.state.selectedId) {
            var status = (this.state.selectedId !== null ? window.confirm("Are you sure you want to switch selected without saving?") : true);
            
            if(status){
                let tmpItem = Object.assign({}, this.state.songList[id]);
                tmpItem.links = [];
                this.state.songList[id].links.forEach(function(link) {
                    tmpItem.links.push(Object.assign({}, link));
                });        
                this.setState({selectedId:id, selectedItem: tmpItem});
            }
        }
    }

    handleDateChange(date, name){
        var self = this;
        try {            
            var tmpItem = self.state.selectedItem;

            if(name in tmpItem){
                tmpItem[name] = date;
            }

            this.setState({ selectedItem:tmpItem }, () => {
                //self.validateCridentials();
            });
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
                errors.push("Please Add Song Title");
            }
            if(!tmpItem.date || tmpItem.date.length <= 0){
                errors.push("Please Add Song Release Date");
            }
        }
        catch(ex){

        }

        return errors;
    }

    newSong() {
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
            let tmpLink = Object.assign({}, {url:"", link:""});   
            let tmpSong = this.state.selectedItem;
            tmpSong.links.push(tmpLink); 

            this.setState({selectedItem: tmpSong});
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
    
    updateSong(type){
        var self = this;
        try {
            if(type === "save"){
                var errorStatus = this.validateForm();
                if(errorStatus.length > 0){
                    alert("Unable To Save: " + errorStatus.join(", "));
                }   
                else {

                }    
            }
            else if(type === "delete"){
                var status = window.confirm("Are you sure you want to delete the selected song?");
                if(status){

                }  
            }
        }
        catch(ex){
            console.log("Error updating song: ", ex);
        }
    }

    render(){  
        return(
            <div className="page-container songs">
                <h1>Songs</h1>
                <div className="split-editor">
                    <div className="song-selector split">                    
                        <div className="music-list">
                            <div className="music-item new">
                                <div className="music-icon save-icon">                                                    
                                    <i className="fas fa-plus-circle"></i>
                                </div>
                                <div className="music-title" onClick={()=> this.newSong()}>Add Song</div>                                    
                            </div>
                            {this.state.songList.map((song,i) => (
                                <div key={i} className="music-item">
                                    <div className="music-icon">                                                    
                                        <img src={(song.img && song.img !== "" ? song.img : defaultImg)}/>
                                    </div>
                                    <div className="music-title" onClick={()=> this.changeSelected(i)}>{song.title}</div>
                                    <div className="music-links-container">
                                        {song.links.map((link,j) => (
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
                                    <DatePicker onChange={(date) => this.handleDateChange(date, 'date')} selected={this.state.selectedItem.date}/>
                                </div>
                                <div className="input-container">
                                    <span>Download Links</span>                                
                                    <div className="links-container">
                                        {this.state.selectedItem.links.map((item,i) => (
                                            <div className="link-container" key={i}>
                                                <select name="type" id="type" value={item.type} onChange={(e) => this.handleLinkChange(e,i)}>
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
                                    <div className="ctrl-btn save" onClick={() => this.updateSong("save")}><i className="far fa-save"></i><span>Save Song</span></div>
                                    <div className="ctrl-btn delete" onClick={() => this.updateSong("delete")}><i className="far fa-trash-alt"></i><span>Delete Song</span></div>
                                </div>                               
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
    
    getSongs(){
        var self = this;
        try {
            fetch(baseUrl + "/api/getSongs")
            .then(function(response) {
                if (response.status >= 400) {throw new Error("Bad response from server"); }
                return response.json();
            })
            .then(function(data) {
                self.setState({ songList: data.results});
            });
        }
        catch(ex){
            console.log(" Error loading announcements: ",ex);
        }
    }

    componentDidMount(){
        this.props.setList();
        this.getSongs();
        //this.initSocket(this.props.currentUser);
    }
}
export default Songs;