import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Sidebar from "react-sidebar";

/* Components */
import DWJSideNav from './sideNav';
import Home from './home';
import UC from './UC';
import Announcements from './announcements';
import Users from './users';
import NoMatch from './noMatch';

const routes = [
    { title:"Announcements", path:"/announcements", component:Announcements},
    { title:"Users", privilage:true, path:"/users", component:Users},
    { title:"Settings", path:"/settings", component:UC}
];


class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false,
            routeList: []
        };   
        
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.clearRouteList = this.clearRouteList.bind(this);
        this.setRouteList = this.setRouteList.bind(this);
    }
    

    buildRoutes(){
        return (
            routes.map((route, i) => (                           
                <Route key={i} path={route.path} render={props => ( <route.component {...props} routeList={this.state.routeList} setList={this.setRouteList} clearList={this.clearRouteList}/>)} />
            ))
        )
    }

    render(){ 
        var siteRoutes = this.buildRoutes();

        return (
            <Router>                
                <Sidebar sidebar={<DWJSideNav pageList={this.state.routeList}/>}  open={this.state.sidebarOpen} onSetOpen={this.onSetSidebarOpen} styles={{ sidebar: { background: "rgba(50,50,50,0.95)", zIndex: 1000 } }}>
                    <div className="sidenav-btn" onClick={() => this.onSetSidebarOpen(true)}><i className="fas fa-bars"></i></div>
                    <div className="dwj-body">
                        <div className="content-body">
                            <div className="main-body">
                                <Switch>
                                    <Route exact path="/" render={()=> <Home routeList={this.state.routeList} setList={this.setRouteList} clearList={this.clearRouteList}/> } />                            
                                    {siteRoutes}                            
                                    <Route component={NoMatch} />                            
                                </Switch>
                            </div>
                        </div>
                    </div>
                </Sidebar>
            </Router> 
        )
    }
    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
    }

    clearRouteList(){
        this.setState({ routeList:[], sidebarOpen: false });
    }
    setRouteList(){
        this.setState({ routeList: routes, sidebarOpen: false });
    }
}

export default App;