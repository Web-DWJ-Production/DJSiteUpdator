var path = require('path');
var fs = require('fs');
var util = require('util');
var request = require('request');
var isBase64 = require('is-base64');
var base64Img = require('base64-img');
var Flickr = require("flickrapi");

require('dotenv').config();
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var Image = require('../models/image');

var activeStatus = false;


var apiUrl = {}
var AnnouncementsFolderId = "72157696977148262";
var FlickrOptions = { 
    permissions: "delete",
    api_key: process.env.FLICKR_TOKEN,
    secret:process.env.FLICKR_SECRET,
    access_token:process.env.FLICKR_ACCESS_TOKEN,
    access_token_secret:process.env.FLICKR_ACCESS_TOKEN_SECRET
 };

 var database = {
    remoteUrl: process.env.REMOTEURL,
    dbName: process.env.DBNAME,
    mongoOptions: { connectTimeoutMS: 2000, socketTimeoutMS: 2000}
}

var data = {
    /* Announcements */
    getAnnouncements:function(req,res){ 
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    res.status(200).json(response);
                }
                else {
                    const db = client.db(database.dbName).collection('announcements');
                    db.find({}, {useNewUrlParser: true}).sort( { order: 1 } ).toArray(function(err, dbres){
                        if(dbres == null || dbres == undefined) { 
                            response.errorMessage = "Unable get list";
                        }
						else {
                            response.results = dbres;
                        }

                        client.close();
                        res.status(200).json(response);
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error getting announcements: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    removeAnnouncement:function(req,res){ 
        var response = {"errorMessage":null, "results":null};

        try {
            var deleteID = req.body.id;

            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    res.status(200).json(response);
                }
                else {
                    const db = client.db(database.dbName).collection('announcements');
                    // Get Accouncement
                    db.find({"_id": ObjectId(deleteID)}, {useNewUrlParser: true}).toArray(function(err, dbres){
                        if(dbres.length > 0){ 
                            // Delete Image
                            _deleteImg(dbres[0].mediaId);
                            // Delete Announcement
                            db.deleteOne({ "_id": ObjectId(deleteID) });
                        }
                        response.results = true;
                        client.close();
                        res.status(200).json(response); 
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error deleting announcements: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    updateAnnouncement:function(req, res, next){
        var response = {"errorMessage":null, "results":false};
        // { imageName, title, lines, order, type}
        try {
           var dataItem = JSON.parse(req.body.dataItem);
           console.log(1);
           mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){ 
                if(err) {
                    response.errorMessage = err;
                    res.status(200).json(response);
                }
                else {
                    const db = client.db(database.dbName).collection('announcements');
                    console.log("new? ", dataItem._id);

                    if(!dataItem._id){   
                        /* Add New Img */            
                        const newImage = new Image({
                            imageName: req.body.imageName,
                            imageData: req.file.path
                        });

                        uploadImg(newImage, dataItem, function(upRet){
                            if(upRet.status){
                                dataItem.media = upRet.new;
                                dataItem.mediaId = upRet.newId;

                                db.insert(dataItem);
                                response.results = true;
                                res.status(200).json(response);
                            }
                            else {
                                res.status(200).json(response);
                            }
                        });   
                    }
                    else {
                        /* Update */
                        console.log("update check: ");
                        console.log(req.file);
                        if(req.file){
                            /* Add New Img */ 
                            const newImage = new Image({
                                imageName: req.body.imageName,
                                imageData: req.file.path
                            });

                            uploadImg(newImage, dataItem, function(upRet){
                                if(upRet.status){
                                    db.updateOne({ "_id": ObjectId(dataItem._id) },  { $set: {title: dataItem.title, lines: dataItem.lines, order:dataItem.order, media: upRet.new, mediaId: upRet.newId }}, {upsert: true, useNewUrlParser: true});
                                    response.results = true;
                                    res.status(200).json(response);
                                }
                                else {
                                    res.status(200).json(response);
                                }
                            });   
                        }
                        else {
                            db.updateOne({ "_id": ObjectId(dataItem._id) },  { $set: {title: dataItem.title, lines: dataItem.lines, order:dataItem.order, media: dataItem.media, mediaId: dataItem.mediaId}}, {upsert: true, useNewUrlParser: true});
                            response.results = true;
                            res.status(200).json(response);
                        }                        
                    }
                }
           });

        }
        catch(ex){
            response.errorMessage = "[Error]: Error updating announcement: "+ex;
            console.log(response.errorMessage); 
            res.status(200).json(response);
        }
    },
    /* Ministries */
    getMinistries:function(req,res){ 
        var response = {"errorMessage":null, "results":null};

        try {
            getTree(function(ret) { res.status(200).json(ret); });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error getting all ministries: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    updateMinistry:function(req,res){ 
        var response = {"errorMessage":null, "results":null};

        try {
            var updateItem = req.body.ministry;

            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('ministries');            
                    if(updateItem._id){
                        /* Update */
                        db.updateOne({ "_id": ObjectId(updateItem._id) },  { 
                            $set: {
                                title: updateItem.title, 
                                active: updateItem.active,
                                website: updateItem.website,
                                leadership: updateItem.leadership,
                                mission: updateItem.mission,
                                memebership: updateItem.membership,
                                section: updateItem.section,
                                spotlight: updateItem.spotlight
                            }}, {upsert: true, useNewUrlParser: true});
                        client.close();
                    }
                    else {
                        response.errorMessage = "[Error]: Error Id Does Not Exist";
                    }

                    response.results = true;
                    res.status(200).json(response);
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error updating ministry: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    /* Events */
    getEvents: function(req, res){
        var response = {"errorMessage":null, "results":null};

        /* { startDt, endDt, type: [single, weekly, biweekly, monthly], title, description, location } */
        try {
            var minDt = req.body.minDt;
            var maxDt = req.body.maxDt;

            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {  
                    const db = client.db(database.dbName).collection('events');
                                                                              
                    db.find({ $and:[
                            { startDt:{ $lte: new Date(maxDt)}},
                            { $or: [
                                { $and:[
                                    { type: "single"},
                                    { startDt: { $gte: new Date(minDt)}},
                                    { endDt: null }
                                ]},
                                { $and:[
                                    { type: "single"},
                                    { endDt: { $gte: new Date(minDt)}},
                                    { endDt: {$ne: null }}
                                ]},
                                { $and:[
                                    { type: {$ne:"single"}},
                                    { $or:[
                                        { endDt: { $gte: new Date(minDt)}},
                                        { endDt: null }
                                    ]}
                                ]}
                            ]}
                        ]},{}).toArray(function(err, ret){

                        if(ret == null || ret == undefined) { response.errorMessage = "Unable get list";}
                        else { 
                            // build list
                            response.results = buildEventList(ret, maxDt);
                        }
                        client.close();
                        res.status(200).json(response);
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error getting all events: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    }
}

module.exports = data;

// Private Functions
function buildEventList(list, maxDt){
    var ret = [];
    try {
        list.forEach(function(item){
            if(item.type == "single"){
                ret.push(item);
            }
            else if(item.type == "weekly"){
                // add 7 days and loop
                ret = ret.concat(repeatDateBuilder(item, maxDt, 7, false));
            }
            else if(item.type == "biweekly"){
                // add 14 days and loop
                ret = ret.concat(repeatDateBuilder(item, maxDt, 14, false));
            }
            else if(item.type == "monthly"){
                // add 1 to month and loop
                ret = ret.concat(repeatDateBuilder(item, maxDt, 1, true));
            }
        });
        ret.sort(function(a,b) { return new Date(a.startDt) - new Date(b.startDt); });
    }
    catch(ex){
        console.log("Error building event list: ", ex);
    }
    return ret;
}

function repeatDateBuilder(item, maxDt, addtime, monthFlg){
    var ret = [];
    try {
        var mxCmpDate = new Date(maxDt);
        var dt = new Date(item.startDt);
        do {
            if(monthFlg){
                if(dt.getMonth() == 11) {
                    dt.setMonth(0);
                    dt.setFullYear(dt.getFullYear() + 1);
                }
                else {
                    dt.setMonth(dt.getMonth() + 1);
                }
            }
            else {
                dt.setDate(dt.getDate() + addtime);
            }

            // Add item to list
            var tmpObj = JSON.parse(JSON.stringify(item));
            tmpObj.startDt = dt.toISOString();
            ret.push(tmpObj);            
        } while(dt < mxCmpDate);
    }
    catch(ex){
        console.log("error with repeat builder: ",ex);
    }
    return ret;
}

function uploadImg(newImage, imgData, callback){
    try {
        var ret = {new: null, status: false};
        var url = path.join(__dirname, '../../'+newImage.imageData);  
        
        Flickr.authenticate(FlickrOptions, function(error, flickrAuth) { 
            var uploadOptions = { photos:[] };
            uploadOptions.photos.push({title: newImage.imageName, photo: url});
            Flickr.upload(uploadOptions, FlickrOptions, function(err, result) { 
                if(err) {
                    console.log(error);
                    callback(ret);
                }

                if(result.length) {
                    var photo_id = result[0];
                    flickrAuth.photosets.addPhoto({api_key: flickrAuth.api_key, photoset_id: AnnouncementsFolderId, photo_id: photo_id}, function(err, res0){
                        flickrAuth.photos.getInfo({
                            api_key: FlickrOptions.api_key,
                            photo_id : photo_id,
                            secret: FlickrOptions.secret
                        }, function(err, result1) {
                            // Return Img Url
                            ret.status = true;
                            ret.new = getImgUrl(result1);
                            ret.newId = photo_id;
                            
                            //console.log("file: ",url);
                            fs.unlinkSync(url);
                            callback(ret);
                        });
                    }); 
                }
            });
        });
    }
    catch(ex){
        console.log("Error uploading Img: ",ex);
        callback(false);
    }
}


function _deleteImg(imgId){
    try {     
        Flickr.authenticate(FlickrOptions, function(error, flickrAuth) { 
            //flickrAuth.photosets.removePhoto({api_key: flickrAuth.api_key, photoset_id: AnnouncementsFolderId, photo_id: imgId}, function(err, res0){
            flickrAuth.photos.delete({api_key: flickrAuth.api_key, photo_id: imgId}, function(err, res0){
                if(err){
                    console.log("error: ");
                    console.log(err);
                }
                else {
                    console.log("Removed Image");
                }
            });
        });
    }
    catch(ex){
        console.log("[Error] deleting image from Flickr: ",ex);
    }
}

function getImgUrl(retObj){
    var url = "";

    try{
        var imgObj = retObj.photo;
        
        var photoId = (imgObj.primary == undefined ? imgObj.id : imgObj.primary);
        //url = util.format("http://c1.staticflickr.com/%s/%s/%s_%s_b.jpg", imgObj.farm, imgObj.server, photoId, imgObj.secret);
        url = util.format("https://farm%s.staticflickr.com/%s/%s_%s_z.jpg", imgObj.farm, imgObj.server, photoId, imgObj.secret);
    }
    catch(ex){
        console.log("Error Processing Img: ", ex);
    }
    return url;
}

/* Get Tree Ministry List */
function getTree(callback){
    var response = {"errorMessage":null, "results":null};

    try {
        mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
            if(err) {
                response.errorMessage = err;
                callback(response);
            }
            else {  
                const db = client.db(database.dbName).collection('ministries');

                db.find({active: activeStatus},{ projection:{}}).toArray(function(err, res){
                    if(res == null || res == undefined) { response.errorMessage = "Unable get list";}
                    else { response.results = buildTree(res);}
                    
                    client.close();
                    callback(response);
                });
            }
        });
    }
    catch(ex){
        response.errorMessage = "Error getting Tree: " + ex;
        callback(response);
    }
}

function buildTree(list){
    var self = this;
    var ret = {};
    try {
        for(var i=0; i < list.length; i++){
            if(!(list[i].section in ret)){
                ret[list[i].section] = {"sectionTitle":list[i].section, "list":[]};
            }
            ret[list[i].section].list.push(list[i]);
        }
    }
    catch(ex){
        console.log("Error Building Tree: ",ex);
    }
    var retVal = (!ret ? {} : Object.values(ret).sort(function(a,b){ return a.list.length < b.list.length; }));
    return retVal;
}