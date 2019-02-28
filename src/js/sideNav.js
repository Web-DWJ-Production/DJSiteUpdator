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
                <div className="nav-header">
                    {/* <Link to="\" className="navBtn"><i className="fas fa-home"></i></Link> */}
                    <span>Welcome, {(this.props.user === null ? "NA" : this.props.user.name)}</span>
                </div>

                <div className="nav-content">
                    {this.props.pageList.map((page,i) =>
                        <Link to={page.path} className="page-item" key={i}>{page.title}</Link>
                    )}

                    <div className="page-item signout" onClick={this.props.signOutUser}>Sign Out</div>
                </div>
            </div>
        );
    }

    componentDidMount(){ }
}
export default DWJSideNav;