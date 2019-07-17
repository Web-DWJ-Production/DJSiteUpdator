import React, { Component } from 'react';

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
                        {this.state.ministryList.map((song,i) => (
                            <div className="ministry-section"></div>
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
            fetch(self.props.baseUrl + "/api/getAllMinistries")
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