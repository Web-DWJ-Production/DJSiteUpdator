var path = require('path');
var util = require('util');
var request = require('request');

var database = require('../config/database');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var activeStatus = false;

var apiUrl = {}

var data = {
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