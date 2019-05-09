var express = require('express');
var router = express.Router();
var data = require('../services/data.service');
var user = require('../services/user.service');

/*** Events ***/
function getEvents(req, ret) { data.getEvents(req,ret); }
function removeEvent(req, res){ data.removeEvent(req, res); }

/*** Songs ***/
function getSongs(req, ret) { data.getSongs(req,ret); }
function removeSong(req, res){ data.removeSong(req, res); }

/*** Albums ***/
function getAlbums(req, ret) { data.getAlbums(req,ret); }
function removeAlbum(req, res){ data.removeAlbum(req, res); }

/*** Videos ***/
function getVideos(req, ret) { data.getVideos(req,ret); }
function removeVideo(req, res){ data.removeVideo(req, res); }
function updateVideo(req, res){ data.updateVideo(req, res); }

/*** Announcements  ***/
/* get announcements */
function getAnnouncements(req, res){ data.getAnnouncements(req, res); }

/* remove announcement */
function removeAnnouncement(req, res){ data.removeAnnouncement(req, res); }

/*** Login  ***/
/* validate User */
function validateUser(req, res){ user.validateUser(req, res); }

/* get Reset Question */
function getResetQuestion(req, res){ user.getResetQuestion(req, res); }

/* compare Question Answer */
function compareQuestionAnswer(req, res){ user.compareQuestionAnswer(req, res); }

/* set New Password */
function setNewPassword(req, res){ user.setNewPassword(req, res); }

/* set Security Questions */
function setSecurityQuestions(req, res){ user.setSecurityQuestions(req, res); }

/* update User */
function updateUser(req, res){ user.updateUser(req, res); }

/* get User */
function getUsers(req, res){ user.getUsers(req, res); }

/* remove User */
function removeUser(req, res){ user.removeUser(req, res); }


/* Routes */
router.get('/getEvents', getEvents);
router.post('/removeEvent', removeEvent);

router.get('/getAnnouncements', getAnnouncements);
router.post('/removeAnnouncement', removeAnnouncement);

router.get('/getSongs', getSongs);
router.post('/removeSong', removeSong);

router.get('/getAlbums', getAlbums);
router.post('/removeAlbum', removeAlbum);

router.get('/getVideos', getVideos);
router.post('/removeVideo', removeVideo);
router.post('/updateVideo', updateVideo);
/* Login */
router.post('/validateUser', validateUser);
router.post('/getResetQuestion', getResetQuestion);
router.post('/compareQuestionAnswer', compareQuestionAnswer);
router.post('/setNewPassword', setNewPassword);
router.post('/setSecurityQuestions', setSecurityQuestions);

/* Settings */
router.post('/updateUser', updateUser);
router.post('/removeUser', removeUser);
router.post('/getUsers', getUsers);

module.exports = router;