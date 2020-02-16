// 1. call need package and defines posrt and some instance
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
var port = 8080;
var router = express.Router();

//model instance
var User = require('./app/models/user');

//2. use body parser to get data from http request
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());

//3. create connection to mongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sample');

// 4. API Routes
router.get('/', function(req, res){
    res.json({
        message:'Welcome to REST API Sample'
    });
});

// model related Routes
// post : creator user
// get : all user
router.route('/users')
.post(function(req, res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.name = req.body.name;
    user.email = req.body.email;
    user.save(function(err){
        if(err) res.send(err);
        else res.json({
            message:'new user created'
        });
    });
})
.get(function(req, res){
    User.find(function(err, users){
        if(err) res.send(err);
        else res.json(users);
    });
});

// GET : get a user
// PUT : updateing user attribute
// DELETE : delete users
router.route('/users/:username')
.get(function(req, res){
    User.findOne({
        username:req.params.username
    },function(err, user){
        if(err) res.send(err);
        else res.json(user);
    });
}) 
.put(function(req, res){
    User.findOne({
        username:req.params.username
    }, function(err, user){
        if(err) res.send(err);
        else{
            user.username = req.body.username;
            user.password = req.body.password;
            user.name = req.body.name;
            user.email = req.body.email;
            user.save(function(err){
                if(err) res.send(err);
                else res.json({
                    message:'user Updated'
                });
            });
        }
    });
})
.delete(function(req, res){
    User.remove({
        username:req.params.username
    },function(err, user){
        if(err) res.send(err)
        else res.json({
            message:'user deleted'
        });
    });
});

app.use('/api', router);
app.listen(port)
console.log('service started at port : ' + port)