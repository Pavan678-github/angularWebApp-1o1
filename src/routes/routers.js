const express = require('express');

const router = express.Router();

const webAppController = require('../controllers/webapps');
const feedbackController = require('../controllers/feedback');
const userController = require('../controllers/user');





/** WEBAPPS **/

// get all webapps
router.get('/webapp', webAppController.get);

//get app by id
router.get('/webapp/:id', webAppController.getID);

//create webapp
router.post('/webapp', webAppController.post);

//update a webapp by id
router.put('/webapp/:id', webAppController.put);

// delete a webapp
router.delete('/webapp/:id', webAppController.deleteApp);

/** FEEDBACK AND NOTATION**/

// get all feedback (not very usefuul)
router.get('/feedback', feedbackController.get);

// get feedback (with comments) by app id
router.get('/feedback/:id', feedbackController.getID);

// get feedback (with comments) by by a specific user (might implement user profile on front end)
router.get('/userfeedback/:id', feedbackController.getUID);

//create or updates rating & comment for an app (:id) from user_id
router.post('/feedback/:id', feedbackController.post);

//create or updates notation on a comment for an app (:id) from user_id
router.post('/notation/:id', feedbackController.postNote);

// delete feedback :id is feedback_id
router.delete('/webapp/:id', feedbackController.deleteFeedback);


/** USERS  **/

// get all users
router.get('/user', userController.get);

// get user by name
router.get('/userName/:name', userController.getByName);

// get user by ID
router.get('/user/:id', userController.getByID);

//creates a user
router.post('/user', userController.post);

//updates a user
router.put('/user', userController.put);

// delete a user
router.delete('/user/:id', userController.deleteUser);






module.exports = router;

