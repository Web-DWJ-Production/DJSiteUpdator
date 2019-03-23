var path = require('path');
var fs = require('fs');
var util = require('util');
var request = require('request');
var isBase64 = require('is-base64');
var base64Img = require('base64-img');
var flickrConfig = require("../config/flickrconfig.json");
var Flickr = require("flickrapi");

var database = require('../config/database');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var activeStatus = false;

var apiUrl = {}
var FlickrOptions = { 
    permissions: "write", 
    api_key: flickrConfig.token, 
    secret: flickrConfig.secret,
    access_token: flickrConfig.access_token,
    access_token_secret: flickrConfig.access_token_secret 
 };

var data = {
    /* Songs */
    getSongs: function(req,res){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    res.status(200).json(response);
                }
                else {
                    const db = client.db(database.dbName).collection('songs');
                    db.find({}, {useNewUrlParser: true}).sort({ date: -1 }).toArray(function(err, dbres){
                        if(!dbres) { 
                            response.errorMessage = "Unable get list";
                        }
						else {                                                       
                            response.results = dbres;
                        }
                        res.status(200).json(response);
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error getting songs: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    removeSong: function(req,res){
        var response = {"errorMessage":null, "results":null};
       
        try {
            var deleteID = req.body.id;

            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    res.status(200).json(response);
                }
                else {
                    const db = client.db(database.dbName).collection('songs');                    
                    db.deleteOne({ "_id": ObjectId(deleteID) });

                    response.results = true;
                    res.status(200).json(response);
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error removing songs: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    updateSong:function(item, callback){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('songs');                  
                    // clean Img                           
                    cleanImg(item.img, function(ret){
                        item.img = ret.new;
                        if(item._id){
                            /* Update */
                            db.updateOne({ "_id": ObjectId(item._id) },  { $set: {title: item.title, additionalInfo: item.additionalInfo, date:item.date, links: item.links, img: item.img}}, {upsert: true, useNewUrlParser: true});
                        }
                        else {                   
                            /* Add New */
                            db.insert(item);
                        }     
                             
                        response.results = true; 
                        callback(response);
                    });                        
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error updating song: "+ex;
            console.log(response.errorMessage);  
            callback(response);         
        }
    },
    /* Albums */
    getAlbums: function(req,res){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    res.status(200).json(response);
                }
                else {
                    const db = client.db(database.dbName).collection('albums');
                    db.find({}, {useNewUrlParser: true}).sort({ date: -1 }).toArray(function(err, dbres){
                        if(!dbres) { 
                            response.errorMessage = "Unable get list";
                        }
						else {                                                       
                            response.results = dbres;
                        }
                        res.status(200).json(response);
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error getting albums: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    removeAlbum: function(req,res){
        var response = {"errorMessage":null, "results":null};
       
        try {
            var deleteID = req.body.id;

            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    res.status(200).json(response);
                }
                else {
                    const db = client.db(database.dbName).collection('albums');                    
                    db.deleteOne({ "_id": ObjectId(deleteID) });

                    response.results = true;
                    res.status(200).json(response);
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error removing albums: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    updateAlbum:function(item, callback){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('albums');                  
                    // clean Img                           
                    cleanImg(item.img, function(ret){
                        item.img = ret.new;
                        if(item._id){
                            /* Update */
                            db.updateOne({ "_id": ObjectId(item._id) },  { $set: {title: item.title, additionalInfo: item.additionalInfo, date:item.date, links: item.links, img: item.img}}, {upsert: true, useNewUrlParser: true});
                        }
                        else {                   
                            /* Add New */
                            db.insert(item);
                        }     
                             
                        response.results = true; 
                        callback(response);
                    });                        
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error updating albums: "+ex;
            console.log(response.errorMessage);  
            callback(response);         
        }
    },
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
                            var list = [];
                            dbres.forEach(function(item){
                                if(item.mediaArray != null) {
                                    item.media = item.mediaArray.join("");
                                    item.mediaArray = null;
                                }
                                list.push(item);
                            });
                            response.results = list;
                        }
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
                    db.deleteOne({ "_id": ObjectId(deleteID) });

                    response.results = true;
                    res.status(200).json(response);
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error deleting announcements: "+ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    updateAnnouncements:function(list, callback){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('announcements');
                    
                    list.forEach(function(item){
                        if(item._id){
                            /* Update */
                            db.updateOne({ "_id": ObjectId(item._id) },  { $set: {title: item.title, lines: item.lines, order:item.order, media: item.media}}, {upsert: true, useNewUrlParser: true});
                        }
                        else {
                            /* Add New */
                            db.insert(item);
                        }
                    });

                    response.results = true;
                    callback(response);
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error updating announcements: "+ex;
            console.log(response.errorMessage);  
            callback(response);         
        }
    }
}

module.exports = data;

// Private Functions
function cleanImg(img, callback){
    var ret = {new: img, old:null};
    try {
        if(isBase64(img, {mime: true})) {
            var d = new Date();
            var pid = d.getTime();
            var dest = path.join(__dirname, '../tmpImg');
            // Convert Img from Base64 to jpg
            var filepath = base64Img.imgSync(img, dest, pid);

            ret.old = filepath+"";
            // Upload Img to Flickr
            Flickr.authenticate(FlickrOptions, function(error, flickrAuth) {
                var uploadOptions = { photos:[] };
                uploadOptions.photos.push({title:"GAli-"+pid, photo: dest+"/"+pid+".jpg"});
                Flickr.upload(uploadOptions, FlickrOptions, function(err, result) {
                    if(err) {
                        console.log(error);
                    }
                    if(result.length){
                        // Get Flickr Img Url
                        var photo_id = result[0];
                        flickrAuth.photos.getInfo({
                            api_key: FlickrOptions.api_key,
                            photo_id : photo_id,
                            secret: FlickrOptions.secret
                        }, function(err, result1) {
                            // Return Img Url
                            ret.new = getImgUrl(result1);
                            fs.unlinkSync(ret.old);
                            callback(ret);
                        });
                    }
                });
            });
        }
        else {
            callback(ret);
        }
    }
    catch(ex){
        console.log("Error cleaning Img: ",ex);
        callback(ret);
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