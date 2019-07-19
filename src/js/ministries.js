import React, { Component } from 'react';

import defaultImg from "../assets/imgs/amez_logo.png";

class Ministries extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedId:null,
            sectionId:null,
            selectedItem:{ leadership:[], subSections:[], activities:[],goals:[],gallery:[]},
            ministryList: []
        }

        this.loadMinistries = this.loadMinistries.bind(this);
        this.changeSelected = this.changeSelected.bind(this);
        this.pushArrays = this.pushArrays.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    render(){  
        return(
            <div className="page-container ministries">
                <h1>Ministries</h1>

                <div className="split-editor">
                    <div className="song-selector split">
                        <div className="music-list">
                        {this.state.ministryList.map((section,i) => (
                            <div className="ministry-section" key={i}>
                                <div className="sectionTitle">{section.sectionTitle}</div>

                                <div className="ministry-item-list">
                                    {section.list.map((item,k) => (
                                        <div key={k} className="music-item" onClick={()=> this.changeSelected(i,k)}>
                                            <div className="music-icon">                                                    
                                                <img src={(item.logo && item.logo !== "" ? item.logo : defaultImg)}/>
                                            </div>
                                            <div className="music-title">{item.title}</div>
                                        </div>
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
                                    <span>Title</span>
                                    <input type="text" name="title" id="title" value={this.state.selectedItem.title} onChange={(e) => this.handleTextChange(e)} />    
                                </div>

                                <div className="input-container check">
                                    <span>Spotlight</span>
                                    <input type="checkbox" name="spotlight" id="spotlight" checked={this.state.selectedItem.spotlight} onChange={(e) => this.handleTextChange(e)} />    
                                </div>

                                <div className="input-container check">
                                    <span>InActive</span>
                                    <input type="checkbox" name="active" id="active" checked={this.state.selectedItem.active} onChange={(e) => this.handleTextChange(e)} />    
                                </div>

                                <div className="input-container">
                                    <span>Website</span>
                                    <input type="text" name="website" id="website" value={this.state.selectedItem.website} onChange={(e) => this.handleTextChange(e)} />    
                                </div>

                                <div className="input-container">
                                    <span>Mission</span>
                                    <textarea name="mission" id="mission" value={this.state.selectedItem.mission} onChange={(e) => this.handleTextChange(e)} />    
                                </div>

                                <div className="input-container">
                                    <span>Membership</span>
                                    <textarea name="membership" id="membership" value={this.state.selectedItem.membership} onChange={(e) => this.handleTextChange(e)} />    
                                </div>

                                <div className="input-container">
                                    <span>Section</span>
                                    <input type="text" name="section" id="section" value={this.state.selectedItem.section} readOnly={true} />    
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
    
    componentDidMount(){
        this.props.setList();
        this.loadMinistries();
    }

    handleTextChange(event){
        var self = this;
        try {
            var name = event.target.name;
            var tmpItem = self.state.selectedItem;
            if(name in tmpItem){
                tmpItem[name] = (event.target.type === 'checkbox' ? event.target.checked : event.target.value);
                //event.target.value;
            }

            this.setState({ selectedItem:tmpItem });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }

    changeSelected(sid, id){
        var self = this;
        if(id === null){
            this.setState({sectionId:sid, selectedId:id, selectedItem: { leadership:[], subSections:[], activities:[],goals:[],gallery:[]}});
        }
        else if(id !== this.state.selectedId) {
            var status = (this.state.selectedId !== null ? window.confirm("Are you sure you want to switch selected without saving?") : true);
            
            if(status){
                let tmpItem = Object.assign({}, this.state.ministryList[sid].list[id]);        

                tmpItem = this.pushArrays(self.state.ministryList[sid].list[id], 
                    tmpItem,["leadership","subSections","activities","gallery"]);
                this.setState({sectionId:sid, selectedId:id, selectedItem: tmpItem});
            }
        }
    }

    pushArrays(item, tmpItem, arrayList){
        try {
           arrayList.forEach(function(elm){
               tmpItem[elm] = [];
               item[elm].forEach(function(elmItem){
                    tmpItem[elm].push(Object.assign({},elmItem));
               });
           });
        }
        catch(ex){
            console.log("Error pushing arrayList", ex);
        }
        return tmpItem;
    }

    loadMinistries(){
        var self = this;
        try {
            fetch(self.props.baseUrl + "/api/getMinistries")
            .then(function(response) {
                if (response.status >= 400) {
                  throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then(function(data) {
                self.setState({ ministryList: data.results});
            });
        }
        catch(ex){
            console.log(" Error loading announcements: ",ex);
        }
    }
}
export default Ministries;