var path = require('path');
var util = require('util');
const bcrypt = require('bcrypt');
var request = require('request');

var database = require('../config/database');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var activeStatus = false;
var retLocations = {
    login:"",
    resetPassword:"resetpwd",
    forgotPassword:"forgotpwd",
    securityQuestions:"setQues"
};

var apiUrl = {};

const saltRounds = 15;

var user = {
    validateUser:function(req,res){ 
        var response = {"errorMessage":null, "returnStatus":null, "results":null};
        var email = req.body.email;
        var password = req.body.password;

        try {
            _getUserByEmail(email, function(ret){
                if(!ret){
                    response.errorMessage = "Invalid User";
                    response.returnStatus = retLocations.login;
                    res.status(200).json(response);
                }
                else {
                    if(!ret.securityQuestions || ret.securityQuestions.length == 0){
                        response.returnStatus = retLocations.securityQuestions;
                        res.status(200).json(response);
                    }
                    else {
                        bcrypt.compare(password, ret.password, function(err, resCmp){
                            if(resCmp){                                
                                response.results = {"_id":ret._id, "email":ret.email, "name":ret.name};
                            }
                            else {
                                response.errorMessage = "Invalid Password";
                                response.returnStatus = retLocations.login;                                
                            }
                            res.status(200).json(response);
                        });
                    }
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error validating user: "+ex;
            response.returnStatus = retLocations.login;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    getResetQuestion:function(req,res){ 
        var response = {"errorMessage":null, "returnStatus":null, "results":null};

        var email = req.body.email;

        try {
            _getUserByEmail(email, function(ret){
                if(!ret){
                    response.errorMessage = "Invalid User";
                    response.returnStatus = retLocations.forgotPassword;                    
                }
                else {
                    var secQues = ret.securityQuestions.map(function (ques) { return ques.question });
                    var randomNum = Math.floor(Math.random() * Math.floor(3));

                    response.results = secQues[randomNum];
                    response.returnStatus = retLocations.resetPassword;
                }
                res.status(200).json(response);
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error getting reset questions: " + ex;
            response.returnStatus = retLocations.forgotPassword;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    compareQuestionAnswer:function(req,res){ 
        var response = {"errorMessage":null, "returnStatus":null, "results":null};

        var email = req.body.email;
        var questionId = req.body.questionId;
        var answer = req.body.answer;

        try {
            _getUserByEmail(email, function(ret){
                if(!ret){
                    response.errorMessage = "Invalid User";
                    response.returnStatus = retLocations.forgotPassword;                    
                }
                else {
                    var secQues = ret.securityQuestions.filter(function (ques) { return ques.question ==  questionId});                
                    var status = (secQues.length > 0 ? (secQues[0].answer.toLowerCase() === answer.toLowerCase()) : false);

                    response.results = status
                    response.returnStatus = (status ? retLocations.resetPassword : retLocations.forgotPassword);
                }
                res.status(200).json(response);
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error getting reset questions: " + ex;
            response.returnStatus = retLocations.forgotPassword;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    setNewPassword:function(req,res){ 
        var response = {"errorMessage":null, "returnStatus":null, "results":null};

        var email = req.body.email;
        var password = req.body.password;

        try {
            _getUserByEmail(email, function(ret){
                if(!ret){
                    response.errorMessage = "Invalid User";
                    response.returnStatus = retLocations.resetPassword; 
                    res.status(200).json(response);                   
                }
                else {
                   var pwdHash = bcrypt.hashSync(password, saltRounds);

                   mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                        if(err) {
                            response.errorMessage = err;
                            response.returnStatus = retLocations.resetPassword;                            
                        }
                        else {
                            const db = client.db(database.dbName).collection('users');
                            db.update({ _id: ret._id }, { $set:{ password: pwdHash }}, {upsert: true, useNewUrlParser: true});                            
                            
                            response.results = true;
                            response.returnStatus = retLocations.login;
                        }
                        res.status(200).json(response);
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error setting user password: " + ex;
            response.returnStatus = retLocations.resetPassword;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },    
    setSecurityQuestions:function(req,res){ 
        var response = {"errorMessage":null, "returnStatus":null, "results":null};

        var email = req.body.email;
        var securityQuestions = req.body.securityQuestions;

        try {
            _getUserByEmail(email, function(ret){
                if(!ret){
                    response.errorMessage = "Invalid User";
                    response.returnStatus = retLocations.securityQuestions;
                    res.status(200).json(response);                    
                }
                else {                   
                   mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                        if(err) {
                            response.errorMessage = err;
                            response.returnStatus = retLocations.securityQuestions;                            
                        }
                        else {
                            const db = client.db(database.dbName).collection('users');
                            db.update({ _id: ret._id }, { $set:{ securityQuestions: securityQuestions }}, {upsert: true, useNewUrlParser: true});                            
                            
                            response.results = true;
                            response.returnStatus = retLocations.resetPassword;
                        }
                        res.status(200).json(response);
                    });
                }                
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error setting security questions: " + ex;
            response.returnStatus = retLocations.securityQuestions;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    updateUser:function(req,res){ 
        var response = {"errorMessage":null, "results":null};

        var user = req.body.user;

        try {
            _avaliableEmail(user.email, user._id,function(ret){
                if(!ret) {
                    response.errorMessage = "Sorry this email address is already in use";
                    res.status(200).json(response);
                }
                else {
                    mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                        if(err) {
                            response.results = false;
                            response.errorMessage = err;
                            res.status(200).json(response);
                        }
                        else {
                            const db = client.db(database.dbName).collection('users');                           
                           
                            if(user._id ){
                                /* Update */                                
                                db.updateOne({ "_id": ObjectId(user._id) }, { $set: { name: user.name, email:user.email, securityQuestions: user.securityQuestions}}, {upsert: true, useNewUrlParser: true});
                            }
                            else {
                                /* Add New */
                                db.insert(user);
                            }                            
        
                            response.results = true;
                            res.status(200).json(response);
                        }
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error updating user: " + ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    getUsers:function(req,res){ 
        var response = {"errorMessage":null, "results":null};
        var id = req.body.id;

        try {
            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    res.status(200).json(response);
                }
                else {
                    const db = client.db(database.dbName).collection('users');                           
                    var query = {};
                    if(id !== null ){
                        query = {"_id":ObjectId(id)};
                    }                        

                    db.find(query, {password:0}).toArray(function(err, ret){
                        response.results = ret;                
                        res.status(200).json(response);
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error getting user: " + ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    removeUser:function(req,res){ 
        var response = {"errorMessage":null, "results":null};
        var deleteID = req.body.id;

        try {
            mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    res.status(200).json(response);
                }
                else {
                    const db = client.db(database.dbName).collection('users');                           
                    db.deleteOne({ "_id": ObjectId(deleteID) });

                    response.results = true;
                    res.status(200).json(response);
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error getting user: " + ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    }
}

module.exports = user;

/* Private Methods */

/* Get User From DB */
function _getUserByEmail(email, callback){
    try {
        mongoClient.connect(database.remoteUrl, database.mongoOptions, function(err, client){
            const db = client.db(database.dbName).collection('users');
            db.find({ 'email' : email }).toArray(function(err, res){
                var ret = null;
                if(res) { ret = res[0]; }                
                callback(ret);
            });                       
        });
    }
    catch(ex){
        console.log("Error Getting User ", email," :", ex);
        callback(null);
    }
}

/* Get User From DB */
function _avaliableEmail(email, id, callback){
    _getUserByEmail(email, function(ret){
        var status = (!ret || ret._id == id);
        callback(status);
    });
}