import React, { Component } from 'react';

/* Image */
import tmpImg from "../assets/imgs/tmp/Pastor2.jpg";
import defaultImg from "../assets/imgs/amez_logo.png";

/* Cards */
import ImgCard from "./components/imgCard";

class Announcements extends Component{
    constructor(props) {
        super(props);

        this.state = {
            maxList:7,
            selectedId:0,
            selectedItem:{},
            refreshItem:false,
            announcementList:[
                {type:"carousel-card-img", title:"Welcome", media:tmpImg, lines:[
                    {size:"paragraph", bold:false, text:"Our vision is to affect a completely transformed community of faith, worthy of citizenship in the Kingdom of God, by the power of God through His Son Jesus Christ. Our mission is to produce ministries that will serve the CAUSE of Christ through the spiritual transformation of minds, bodies and spirits."},
                    {size:"paragraph", bold:false, text:"Sunday morning worship services begin at 10:00 AM.  Visitors, we encourage you to be sure to explore our 'Galleries' tab."}
                ]},
                {type:"carousel-card-img", title:"Announcement 2", media:tmpImg, lines:[{size:"h1", bold:true, text:"Test 2"}]},
                {type:"carousel-card-img", title:"Announcement 3", media:tmpImg, lines:[{size:"h1", bold:true, text:"Test 3"}]},
                {type:"carousel-card-img", title:"Announcement 4", media:tmpImg, lines:[{size:"h1", bold:true, text:"Test 4"}]}
            ]
        }

        this.changeSelected = this.changeSelected.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.addLine = this.addLine.bind(this);
        this.addAnnouncement = this.addAnnouncement.bind(this);
        this.removeAnnouncement = this.removeAnnouncement.bind(this);
    }

    render(){  
        return(
            <div className="page-container announcements">
                <h1>Announcements Editor</h1>
                <div className="announcement-container">
                    <div className="selected-announcement">
                        <div className="removeCard" onClick={this.removeAnnouncement}><i className="fas fa-folder-minus"></i></div>
                        {this.state.announcementList.map((announcement,i) =>                                                   
                            <ImgCard key={i} isSelected={(i === this.state.selectedId)} item={announcement} handleInputChange={this.handleInputChange} handleTextChange={this.handleTextChange} addLine={this.addLine}></ImgCard>               
                        )}
                    </div>

                    <div className="list-announcements">
                        <div className="list-subcontainer">
                            {this.state.announcementList.map((item,i) =>
                                <div key={i} className={"list-item" + (this.state.selectedId === i ? " selected" : "")} onClick={()=> this.changeSelected(i)}>Announcement {i}</div>
                            )}

                            {(this.state.announcementList.length < this.state.maxList ? 
                                <div className="list-item add" onClick={this.addAnnouncement}>Add Announcement</div>
                                : <span></span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    changeSelected(id){
        var self = this;
        this.setState({selectedId:id}, () => { self.forceUpdate()});
    }
    
    removeAnnouncement(){
        var self = this;
        try {
            /* TODO: Add Warning Message */
            if(this.state.announcementList.length > 0) {
                var tmpList = self.state.announcementList;
                tmpList.splice(self.state.selectedId,1);
                self.setState({ announcementList:tmpList });
            }
        }
        catch(ex){
            console.log(" Error removing announcement: ", ex);
        }
    }

    addAnnouncement() {
        var self = this;
        try {
            if(this.state.announcementList.length < this.state.maxList) {
                var tmpList = this.state.announcementList;
                tmpList.push({type:"carousel-card-img", title:"New Title", media:defaultImg, lines:[]});
                self.setState({ announcementList:tmpList });
            }
        }
        catch(ex){
            console.log(" Error adding announcement: ", ex);
        }
    }

    addLine(){
        var self = this;
        try {
            var tmpList = this.state.announcementList;
            tmpList[self.state.selectedId].lines.push({size:"paragraph", bold:false, text:"Edit Text"});
            self.setState({ announcementList: tmpList });
        }
        catch(ex){
            console.log(" Error adding line: ", ex);
        }
    }

    handleInputChange(event){
        var self = this;
        try {
            var tmpList = this.state.announcementList;
            var file = event.target.files[0];

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                tmpList[self.state.selectedId].media = reader.result;         
                self.setState({ announcementList: tmpList });
            };
        }
        catch(ex){
            console.log("Error changing image: ",ex);
        }
    }

    handleTextChange(event,type,loc){
        var self = this;
        try {
            var tmpList = self.state.announcementList;
            if(type === "title"){
                tmpList[self.state.selectedId].title = event.target.value;
            }
            else if(type === "line"){
                tmpList[self.state.selectedId].lines[loc].text = event.target.value;
            }

            self.setState({ announcementList: tmpList });
        }
        catch(ex){
            console.log("Error updating text: ", ex);
        }
    }

    componentDidMount(){
        this.props.setList();
        this.setState({selectedId:0});
    }
}
export default Announcements;