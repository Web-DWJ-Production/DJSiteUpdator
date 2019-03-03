var express = require('express');
var router = express.Router();
var data = require('../services/data.service');
var user = require('../services/user.service');

/*** Announcements  ***/
/* get announcements */
function getAnnouncements(req, res){ data.getAnnouncements(req, res); }

/* delete announcements */
function deleteAnnouncements(req, res){ data.deleteAnnouncements(req, res); }

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


/* Routes */
router.get('/getAnnouncements', getAnnouncements);
router.post('/deleteAnnouncements', deleteAnnouncements);

/* Login */
router.post('/validateUser', validateUser);
router.post('/getResetQuestion', getResetQuestion);
router.post('/compareQuestionAnswer', compareQuestionAnswer);
router.post('/setNewPassword', setNewPassword);
router.post('/setSecurityQuestions', setSecurityQuestions);

module.exports = router;