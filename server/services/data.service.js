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

var activeStatus = false;

var apiUrl = {}
var FlickrOptions = { 
    permissions: "write", 
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
                        // clean Img                           
                        cleanImg(item.media, "72157696977148262",function(ret){
                            item.media = ret.new;
                            if(item._id){
                                /* Update */
                                db.updateOne({ "_id": ObjectId(item._id) },  { $set: {title: item.title, lines: item.lines, order:item.order, media: item.media}}, {upsert: true, useNewUrlParser: true});
                            }
                            else {
                                /* Add New */
                                db.insert(item);
                            }
                        });
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
    }
}

module.exports = data;

// Private Functions
function cleanImg(img, folderId, callback){
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
                uploadOptions.photos.push({title:"clinton-"+pid, photo: dest+"/"+pid+".jpg"});
                Flickr.upload(uploadOptions, FlickrOptions, function(err, result) {
                    if(err) {
                        console.log(error);
                    }
                    if(result.length){
                        // Get Flickr Img Url
                        var photo_id = result[0];
                        flickrAuth.photosets.addPhoto({api_key: flickrAuth.api_key, photoset_id:folderId, photo_id: photo_id}, function(err, res0){
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

                db.find({active: activeStatus},{ projection:{_id:0, title: 1, section:1, subSections:1,logo:1}}).toArray(function(err, res){
                    if(res == null || res == undefined) { response.errorMessage = "Unable get list";}
                    else { response.results = buildTree(res);}

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