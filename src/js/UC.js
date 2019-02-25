import React, { Component } from 'react';

class UC extends Component{
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){  
        return(
            <div>
                <h1>Under Construction</h1>
            </div>
        );
    }
    
    componentDidMount(){
        this.props.setList();
    }
}
export default UC;