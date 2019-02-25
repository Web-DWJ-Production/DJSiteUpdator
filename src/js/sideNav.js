import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";

class DWJSideNav extends Component{
    constructor(props) {
        super(props);

        this.state = {
            pageList: []
        }
    }

    render(){  
        return(
            <div className="sidenav-container">
                <div className="nav-content">
                    {this.props.pageList.map((page,i) =>
                        <Link to={page.path} className="page-item" key={i}>{page.title}</Link>
                    )}
                </div>
            </div>
        );
    }

    componentDidMount(){ }
}
export default DWJSideNav;