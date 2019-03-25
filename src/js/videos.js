import React, { Component } from 'react';
import axios from 'axios';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

/* Images */
import defaultImg from '../assets/imgs/DefaultImg.PNG';
import defaultImgAlt from '../assets/imgs/DefaultImgW.PNG';

const baseUrl = "http://localhost:1777";


class Videos extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedId:null,
            selectedItem:{},
            selectedUrl:"",           
            videoList:[
                {"title":"Icey", "date":"2018-02-09","urlcode":"_DY9LEO2BA0","text":"Gandhi Ali Icey"},
                {"title":"Ready", "date":"2018-01-11","urlcode":"cVl3G12ry2s","text":"Gandhi Ali Ready"},
                {"title":"Bet It", "date":"2018-01-07","urlcode":"_CtbzItbu7Y","text":"Gandhi Ali Bet It"}
            ]
        }

        this.changeSelected = this.changeSelected.bind(this);       
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);        
        this.newSong = this.newSong.bind(this);        
        this.updateSong = this.updateSong.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
    }
    changeSelected(id){
        var self = this;
        if(id === null){
            this.setState({selectedId:id, selectedItem: {links:[]}});
        }
        else if(id !== this.state.selectedId) {
            var status = (this.state.selectedId !== null ? window.confirm("Are you sure you want to switch selected without saving?") : true);
            
            if(status){
                let tmpItem = Object.assign({}, this.state.videoList[id]); 
                let tmpUrl = (tmpItem.urlcode ? "https://www.youtube.com/watch?v="+tmpItem.urlcode : "");
                this.setState({selectedId:id, selectedItem: tmpItem, selectedUrl:tmpUrl});
            }
        }
    }

    handleUrlChange(event) {
        var self = this;
        try {            
            var tmpUrl = self.state.selectedUrl;            
            tmpUrl = event.target.value;            
            // validate url
            this.setState({ selectedUrl:tmpUrl }, () => {
                var tmpItem = self.state.selectedItem;
                var newCode = "";
                if(self.validateUrl(tmpUrl)){
                    var splitItems = tmpUrl.split("v=");
                    var tmpItem = self.state.selectedItem;
                    newCode = (splitItems.length > 1 ? splitItems[1] : "");
                }
                else {
                    alert("Please check your url is a valid youtube url");                    
                    newCode = "";
                }
                tmpItem.urlcode = newCode;
                self.setState({selectedItem: tmpItem});
            });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }

    validateUrl(url){
        var ret = false;
        try {
            
        }
        catch(ex){

        }
        return ret;
    }

    handleDateChange(date, name){
        var self = this;
        try {            
            var tmpItem = self.state.selectedItem;
            
            tmpItem[name] = date;            

            this.setState({ selectedItem:tmpItem }, () => {});
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

    validateForm(){
        var self = this;
        var errors = [];
        try {            
            var tmpItem = this.state.selectedItem;

            if(tmpItem.title.length <= 0){
                errors.push("Please Add Video Title");
            }
            if(!tmpItem.date || tmpItem.date.length <= 0){
                errors.push("Please Add Video Release Date");
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
                    let tmpItem = Object.assign({}, {title:'', text:'', urlcode:'', date:(new Date()).toString()});                
                    self.setState({selectedId:-1, selectedItem: tmpItem, selectedUrl:""});
                }
            }
        }
        catch(ex){
            console.log("Error adding new songs: ",ex);
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
                    /* Ajax save video */
                }    
            }
            else if(type === "delete"){
                var status = window.confirm("Are you sure you want to delete the selected video?");
                if(status){
                    var tmpRemoved = self.state.selectedItem
                    var postData = {"id": tmpRemoved._id };

                    axios.post(baseUrl + "/api/removeVideo", postData, {'Content-Type': 'application/json'})
                        .then(function(response) {                        
                            if(response.data && response.data.results){                                
                                alert("Successfully deleted video"); 
                                self.changeSelected(null);
                                self.getVideos();
                            }
                            else {
                                alert("Error deleting video: " + response.data.errorMessage);
                            }
                    });  
                }  
            }
        }
        catch(ex){
            console.log("Error updating song: ", ex);
        }
    }

    render(){  
        return(
            <div className="page-container videos">
                <h1>Videos</h1>
                <div className="split-editor">
                    <div className="song-selector split">                    
                        <div className="music-list">
                            <div className="music-item new">
                                <div className="music-icon save-icon">                                                    
                                    <i className="fas fa-plus-circle"></i>
                                </div>
                                <div className="music-title" onClick={()=> this.newSong()}>Add Video</div>                                    
                            </div>
                            {this.state.videoList.map((video,i) => (
                                <div key={i} className="music-item">
                                    <div className="music-icon">                                                    
                                        <i className="fab fa-youtube"></i>
                                    </div>
                                    <div className="music-title" onClick={()=> this.changeSelected(i)}>{video.title}</div>                                    
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="song-editor split">                                            
                        {this.state.selectedId != null && 
                            <div className="editor-container">
                                <div className="input-container">                              
                                    <div className="cover-photo">                                                                          
                                        {this.state.selectedItem.urlcode ? <iframe src={"https://www.youtube.com/embed/"+this.state.selectedItem.urlcode} frameBorder="0" height="100%" allowtransparency='true'/> : <span>No Video</span> }
                                    </div>
                                </div>

                                <div className="input-container">
                                    <span>Title</span>
                                    <input type="text" name="title" id="title" value={this.state.selectedItem.title} onChange={(e) => this.handleTextChange(e)} />    
                                </div>
                                <div className="input-container">
                                    <span>Text</span>
                                    <input type="text" name="text" id="text" value={this.state.selectedItem.text} onChange={(e) => this.handleTextChange(e)} />    
                                </div>
                                <div className="input-container">
                                    <span>Release Date</span>                                                                    
                                    <DatePicker onChange={(date) => this.handleDateChange(date, 'date')} selected={new Date(this.state.selectedItem.date)}/>
                                </div>
                                <div className="input-container">
                                    <span>Url</span>
                                    <input className="readonly" type="text" name="urlcode" id="urlcode" value={this.state.selectedItem.urlcode}  readOnly/>
                                    <input type="text" name="fullUrl" id="fullUrl" value={this.state.selectedUrl} onChange={(e) => this.handleUrlChange(e)} />    
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

    getVideos(){
        var self = this;
        try {
            fetch(baseUrl + "/api/getVideos")
            .then(function(response) {
                if (response.status >= 400) {throw new Error("Bad response from server"); }
                return response.json();
            })
            .then(function(data) {
                self.setState({ songList: data.results});
            });
        }
        catch(ex){
            console.log(" Error loading videos: ",ex);
        }
    }

    componentDidMount(){
        this.props.setList();
        //this.getVideos();      
    }
}

export default Videos;