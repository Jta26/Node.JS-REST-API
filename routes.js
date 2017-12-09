var AuthenticationController = require('./controllers/authentication'),  
    express = require('express'),
    passportService = require('./config/passport'),
    passport = require('passport'),
    ClubController = require('./controllers/club');

//Establishes two paths of authentication, 
//one if the user provides a JWT
//and one if the user provides a username and password.
//"/protected" is accessable only if the user has been given a JWT.
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app){
 
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        clubRoutes = express.Router();
 
    // the api routes must be accessed through the authentication routes.
    apiRoutes.use('/auth', authRoutes);
    
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
    //Checks user's ability to access information via JWT, returns "Content: Success" if successful.
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });
    //links the routes to get the club information to the api routes.
    apiRoutes.use('/clubs', clubRoutes);
    //Posts to the club information
    clubRoutes.get('/', ClubController.getClubs);
    clubRoutes.post('/create', ClubController.createClub);
    clubRoutes.post('/delete/:_id', requireAuth, ClubController.deleteClub);
    clubRoutes.post('/addmember/:_id', ClubController.addMember);
    clubRoutes.post('/removemember/:_id', ClubController.removeMember);

    //Activate Routes
    app.use('/api', apiRoutes);
 
}