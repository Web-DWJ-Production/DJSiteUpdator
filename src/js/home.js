import React, { Component } from 'react';

import baseImg from "../assets/imgs/builder2.png";

class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){  
        return(
            <div className="page-container home">
                <h1>Welcome to the DWJ Site Editor</h1>
                <h2>Gandhi3x</h2>
                <div className="img-container"><img src={baseImg} /></div>
            </div>
        );
    }

    componentDidMount(){
        this.props.setList();
    }
}
export default Home;