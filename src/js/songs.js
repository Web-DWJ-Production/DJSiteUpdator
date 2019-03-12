import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

const baseUrl = "http://localhost:1777";
var localSock = null;

class Songs extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedId:0,
            selectedItem:{},
            songList:[
                {"title":"Trap blues", "additionalInfo":"", "date":"2017-11-20", "links":[{"type":"soundcloud", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"}], "img":""},
                {"title":"That Way", "additionalInfo":"", "date":"2017-08-18", "links":[{"type":"itunes", "url":"https://itunes.apple.com/us/album/that-way-feat-sleep/id1276026221?i=1276026223"}], "img":""},
                {"title":"Test Song 1", "additionalInfo":"", "date":"2017-08-18", "links":[{"type":"soundcloud", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"},{"type":"itunes", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"},{"type":"other", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"}], "img":""},
                {"title":"Test Song 2", "additionalInfo":"", "date":"2017-07-18", "links":[{"type":"soundcloud", "url":"https://soundcloud.com/gandhi3x/sets/trapblues"}], "img":""}
            ]
        }
    }

    render(){  
        return(
            <div className="page-container songs">
                <h1>Songs</h1>
                <div className="split-editor"></div>
            </div>
        );
    }
    
    componentDidMount(){
        this.props.setList();
    }
}
export default Songs;