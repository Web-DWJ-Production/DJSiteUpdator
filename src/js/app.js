import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Sidebar from "react-sidebar";

/* Components */
import DWJSideNav from './sideNav';
import Announcements from './announcements';
import Home from './home';
import UC from './UC';
import Ministries from './ministries';
import Users from './users';
import NoMatch from './noMatch';
import Settings from './settings';
import Login from './login';

//const baseUrl = "http://localhost:1777";
const baseUrl = "";
const userKey = "dwjSystemUser_ClintonAMEZ";

const routes = [
    { title:"Announcements", path:"/announcements", component:Announcements},
    { title:"Ministries", path:"/ministries", component: Ministries},
    { title:"Users", privilage:true, path:"/users", component:Users},
    { title:"Settings", path:"/settings", component:Settings}
];


class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user:null,
            sidebarOpen: false,
            routeList: []
        };   
        
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.clearRouteList = this.clearRouteList.bind(this);
        this.setRouteList = this.setRouteList.bind(this);
        this.setUser = this.setUser.bind(this);
        this.signOutUser = this.signOutUser.bind(this);
    }
    
    buildRoutes(){
        return (
            routes.map((route, i) => (                 
                <Route key={i} path={route.path} render={props => ( <route.component {...props} routeList={this.state.routeList} setList={this.setRouteList} clearList={this.clearRouteList}/>)} />     
            ))
        )
    }

    buildLoginRoutes(){
        return (
            routes.map((route, i) => (                             
                this.state.user === null ? 
                    <Redirect key={i} to="/login" from={route.path} />
                    :
                    <Route key={i} exact path={route.path} render={props => ( <route.component {...props} routeList={this.state.routeList} setList={this.setRouteList} clearList={this.clearRouteList} currentUser={this.state.user} baseUrl={baseUrl}/>)} />   
            ))
        )
    }

    render(){ 
        var siteRoutes = this.buildLoginRoutes();        

        return (
            <Router>           
                <Sidebar sidebar={<DWJSideNav pageList={this.state.routeList} user={this.state.user} signOutUser={this.signOutUser}/>}  open={this.state.sidebarOpen} onSetOpen={this.onSetSidebarOpen} styles={{ sidebar: { background: "rgba(50,50,50,0.95)", zIndex: 1000 } }}>
                    {(this.state.user === null ?
                        <span></span>
                        :
                        <div className="sidenav-btn" onClick={() => this.onSetSidebarOpen(true)}><i className="fas fa-bars"></i></div>
                    )}
                    <div className="dwj-body">
                        <div className="content-body">
                            <div className="main-body">
                                <Switch>                                    
                                    {(this.state.user === null ? 
                                        <Redirect exact to="/login" from="/" />
                                        :
                                        <Route exact path="/" render={()=> <Home routeList={this.state.routeList} setList={this.setRouteList} clearList={this.clearRouteList}/> } />
                                    )}                                   

                                    <Route path="/login" render={()=> <Login routeList={this.state.routeList} clearList={this.clearRouteList} setUser={this.setUser}/> } />
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

    getUser(){
        var self = this;
        try {
            var sessionUser = sessionStorage.getItem(userKey);
            if(sessionUser){
                var userResponse = JSON.parse(sessionUser);
                self.setState({user: userResponse});
            }
        }
        catch(ex){
            console.log("Error pulling session user:",ex);
        }        
    }

    setUser(userInfo, cb){
        this.setState({user: userInfo}, ()=> {
            var userStr = JSON.stringify(userInfo);
            sessionStorage.setItem(userKey, userStr);
            cb(true);
        });
    }
    signOutUser() {
        this.setState({user: null}, ()=>{ sessionStorage.removeItem(userKey); });
    }
    
    componentDidMount(){
        this.getUser();
    }
}

export default App;