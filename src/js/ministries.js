import React, { Component } from 'react';

import defaultImg from "../assets/imgs/amez_logo.png";

class Ministries extends Component{
    constructor(props) {
        super(props);

        this.state = {
            ministryList: []
        }

        this.loadMinistries = this.loadMinistries.bind(this);
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
                                        <div key={i} className="music-item">
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
                    <div className="song-editor split"></div>
                </div>
            </div>
        );
    }
    
    componentDidMount(){
        this.props.setList();
        this.loadMinistries();
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