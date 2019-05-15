var express = require('express');
var router = express.Router();
var data = require('../services/data.service');
var user = require('../services/user.service');

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
router.get('/getAnnouncements', getAnnouncements);
router.post('/removeAnnouncement', removeAnnouncement);

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