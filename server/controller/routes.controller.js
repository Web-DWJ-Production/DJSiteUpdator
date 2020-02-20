var express = require('express');
const multer = require('multer');
var router = express.Router();
var data = require('../services/data.service');
var user = require('../services/user.service');

/* IMG STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // rejects storing a file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

/*** Announcements  ***/
/* get announcements */
function getAnnouncements(req, res){ data.getAnnouncements(req, res); }

/* remove announcement */
function removeAnnouncement(req, res){ data.removeAnnouncement(req, res); }

/*** Ministries  ***/
/* get ministries */
function getMinistries(req, res){ data.getMinistries(req, res); }

/* update Minstry */
function updateMinistry(req, res){ data.updateMinistry(req, res); }

/*** Events ***/
/* get events */
function getEvents(req, res){ data.getEvents(req, res); }
/* add event */
/* update event */
/* delete event */
/* clean up old events */

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
router.get('/updateAnnouncement', upload.single('imageData'), function (req, res, next) {
    data.updateAnnouncement(req, res, next);
});

router.get('/getMinistries', getMinistries);
router.post('/updateMinistry', updateMinistry);

router.post('/getEvents', getEvents);

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