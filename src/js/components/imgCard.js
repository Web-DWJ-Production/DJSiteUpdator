import React, { Component } from 'react';

class ImgCard extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isSelected:true
        }

        this.textAreaAdjust = this.textAreaAdjust.bind(this);
        this.sizeTxt = this.sizeTxt.bind(this);
        this.addLine = this.addLine.bind(this);
    }

   

    render(){        
        return(
            <div className={"carousel-card img-card " + (this.state.isSelected ? "active":"hidden")}> 
                <div className="img-card-container">                       
                    <div className="img-container">
                        { /* Edit Tool */}
                        <div className="uploadContainer">
                            <input type="file" className="img-input" name="imgFile" id="imgFile" accept="image/*" onChange={this.props.handleInputChange} />    
                            <label className="img-lbl" htmlFor="imgFile"><div className="uploadImg"><i className="fas fa-file-import"></i></div></label>
                        </div>
                        <img src={this.props.item.media} className="carousel-card-img" alt="" />
                    </div>

                    <div className="card-content">
                        { /* Edit Tool */}
                        <textarea className="content-title h-form noSz" ref="titleRef" value={this.props.item.title} onChange={(e) => this.props.handleTextChange(e,"title",0)}></textarea>
                        {this.props.item.lines.map((line,i) =>
                            <span key={i}>
                                <textarea className={"content-line h-form "+ line.size + (line.bold === true ? ' bold': '')} value={line.text} ref={"lineRef"+i} onChange={(e) => this.props.handleTextChange(e,"line",i)}></textarea>
                                <div className="editLine">                                    
                                        <div className="edit-item textType" onClick={() => this.props.handleTextStyleChange("size",i)}><span>{this.sizeTxt(line.size)}</span></div>
                                        <div className="edit-item bold" onClick={() => this.props.handleTextStyleChange("bold",i)}>
                                            {(line.bold === true ? <i className="fas fa-bold"></i> : <i className="fas fa-ban"></i> )}                                        
                                        </div>                                   

                                        <div className="edit-item remove" onClick={() => this.props.deleteLine(i)}><i className="fas fa-trash-alt"></i></div>
                                </div>                                
                            </span>
                        )}
                        
                        <div className="add-line" onClick={this.addLine}><div><i className="fas fa-plus-circle"></i><span>Add Line</span></div></div>                        
                    </div>
                </div>
            </div>    
        );        
    }

    componentWillReceiveProps(){
        var self = this;
        this.setState({ isSelected: this.props.isSelected });
    }

    componentDidMount(){
        this.setTextHeights();
        this.setState({ isSelected: this.props.isSelected });
    }

    addLine(){
        this.props.addLine();
    }

    sizeTxt(size){
        var ret = "|";

        try {
            switch(size){
                case "paragraph":
                    ret = "p";
                    break;
                case "h1":
                    ret = "h1";
                    break;
                case "h2":
                    ret = "h2";
                    break;
                default:
                    break;
            }
        }
        catch(ex){

        }
        return ret;
    }
    setTextHeights(){
        try {
            var refList = Object.keys(this.refs);
            for(var i =0; i < refList.length; i++){
                this.textAreaAdjust(this.refs[refList[i]]);
            }
        }
        catch(ex){
            console.log("Error setting box height: ", ex);
        }
    }

    textAreaAdjust(obj){
        try {           
            obj.style.height = "1px";
            var objHeight = (obj.offsetTop < obj.scrollHeight ? obj.offsetTop : obj.scrollHeight)+5+"px";
            
            obj.style.height = objHeight;            
        }
        catch(ex){
            console.log("Error setting text area: ", ex);
        }
        
    }
}

export default ImgCard;