import React, { Component } from 'react';

class Events extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedId:null,
            selectedItem:{links:[]},
            eventList:[
                { "title":"Panda's Play House II: A Trippy Affair", "location":"MilkBoy ART HOUSE - 7416 Baltimore Ave., College Park, MD.", "date": "2019-12-01 21:00:00", "img":null, links:[{title:"Purchase tickets here", link:"https://www.ticketfly.com/event/1598104-pandas-playhouse-ii-live-college-park/"}] },
                { "title":"Basement Tuesdays", "location":"Pure Lounge - 1326 U Street, NW, DC", "date": "2019-11-28 19:00:00", "img":null, links:[]},
                { "title":"DanksGiving", "location":"HollyWood Hemp Museum - 6140 Hollywood Blvd., Los Angeles, CA.", "date": "2019-11-24 22:00:00", "img":null, links:[]}
            ]
        }
    }

    render(){  
        return(
            <div className="page-container events">
                <h1>Events</h1>
            </div>
        );
    }
    
    componentDidMount(){
        this.props.setList();
    }
}
export default Events;