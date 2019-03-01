var express = require('express');
var router = express.Router();
var data = require('../services/data.service');
var user = require('../services/user.service');

/* get announcements */
function getAnnouncements(req, res){ data.getAnnouncements(req, res); }

/* delete announcements */
function deleteAnnouncements(req, res){ data.deleteAnnouncements(req, res); }

/* Routes */
router.get('/getAnnouncements', getAnnouncements);
router.post('/deleteAnnouncements', deleteAnnouncements);
