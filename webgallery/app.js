const path= require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const crypto = require('crypto'); 
const session = require ('express-session'); 

app.use(express.static('static'));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

var Datastore = require('nedb');
let images = new Datastore({filename:'db/images.db',autoload:true}); 
let messages = new Datastore ({filename: 'db/messages.db', autoload : true, timeStamp : true});
let users = new Datastore({filename:'db/users.db',autoload:true}); 
var Message = (function(){
    var commentId =1 ; 
    return function item(message){
        this.content = message.content;
        this.username = message.username;
        this.upvote = 0;
	this.id = message.imageId;
	this.commentId=commentId++; 
        this.downvote = 0;
    }
}());

var Image= (function ()	{
	var id =1; 
	  return function userImage(user,file) 
		{  
		 this.id = id++; 
		  this.username = user.username; 
		   this.file =file;
	          this.title = user.title;
		     
		}
	}());



	app.use(session({
		secret: 'please change this secret',
		resave: false,
		saveUninitialized: true,
	}));

	const cookie = require('cookie');

app.use(express.static('static'));

app.use(function (req, res, next){
    var cookies = cookie.parse(req.headers.cookie || '');
    req.username = (cookies.username)? cookies.username : null;
    console.log("HTTP request", req.username, req.method, req.url, req.body);
    next();
});
let isAuthenticated = function(req, res, next) {
    if (!req.username) return res.status(401).end("access denied");
    next();
};
app.post('/signup/', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var saltedHash = hash.digest('base64');
    console.log(salt, saltedHash);
    users.findOne({_id: username}, function(err, user){
        if (err) return res.status(500).end(err);
        if (user) return res.status(409).end("username " + username + " already exists");
        users.update({_id: username},{_id: username,password:saltedHash,salt}, {upsert: true}, function(err){
            if (err) return res.status(500).end(err);
            // initialize cookie
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                  path : '/', 
                  maxAge: 60 * 60 * 24 * 7
            }));
            return res.json("user " + username + " signed up");
        });
    });
});

app.post('/signin/', function (req, res, next) {
    var username = req.body.username;
   var password = req.body.password;
    // retrieve user from the databasives the user's credentials and compares the password with the one stored in the database.e
    users.findOne({_id: username}, function(err, user){
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("access denied"); 
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
	console.log(user.password);
        var saltedHash = hash.digest('base64');
	console.log(saltedHash) 
        if (user.password !== saltedHash) return res.status(401).end("access denied"); 
        // initialize cookie
        req.session.username = username; 
        res.setHeader('Set-Cookie', cookie.serialize('username', username, {
              path : '/', 
              maxAge: 60 * 60 * 24 * 7
        }));
        return res.json("user " + username + " signed in");
    });
});
app.get('/signout/', function (req, res, next) {
    req.session.destroy(); 
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.redirect('/');
});


// Create
let multer = require('multer'); 
let upload = multer({dest:path.join(__dirname, 'uploads/')});


app.get('/api/images/:id/back/',function(req,res,next) 
	{     
		
		images.findOne({id:parseInt(req.params.id)}, function(err,user)
		{if(!user)
                     { image.count({},function(err,count)
		
		{       
			if ( parseInt(req.params.id)<1)
			{ 
				images.findOne({id :parseInt(count)},function(err,image)
				   {   
					 
					   return res.json(image)
				   }); 
			}
                        else
	{ return res.status(404).end("no item found"); 
	}
		});
                            } 			
		 else
			{ return res.json(image); 
			}
		});
		});

app.get('/api/images/:id/next/',function(req,res,next) 
	{     
		
		images.findOne({id:parseInt(req.params.id)}, function(err,image)
		{if(!image)
                     { images.count({},function(err,count)
		
		{       
			if ( parseInt(req.params.id)>count)
			{ 
				images.findOne({id :1},function(err,image)
				   {   
					   return res.json(image)
				   }); 
			}
                        else
	{ return res.status(404).end("no item found"); 
	}
		});
                            } 			
		 else
			{ return res.json(image); 
			}
		});
		});
app.post('/api/images/',upload.single("file"), function (req, res, next) { 	
   images.insert(new Image(req.body,req.file),function(err,image)
		{ if(err)
			{
				return res.status(500).end(err);}
	           else 
			{ 
				return res.json(image.id)}
		});
});
app.get('/api/images/:username/profile/picture/',function(req,res,next)
	{images.findOne({username:req.params.username},function(err,image){ 
		if (!image)
		{  
			res.status(404).end('username does not exist'); 
		}
		else 
		{ 
		  res.setHeader('Content-Type',image.file.mimetype); 
		  res.sendFile(image.file.path); 
		}
	});
});

app.get('/api/images/:id',function (req,res,next)
{       
	images.findOne({id:parseInt(req.params.id)},function(err,image)
	{ 
		return res.json(image); 
	});
});

app.post('/api/comments/', function (req, res, next) {
    images.count ({},function (err,count){
	
	   if (count!=0)
	    {messages.insert(new Message(req.body), function(err,message) 
	     {
	       if (err) return res.status(500).end(err);
		     else if (!message)
		     { return res.status(404).end("no user"); 
		     }
		  else{
         return res.json(message);
	       }
	     });
	    }
    }); 
});

// Read

app.get('/api/comments/:id/:page', function (req, res, next) { 
	messages.find({id:parseInt(req.params.id)}).sort({commentId:-1}).skip(req.params.page*10).limit(10).exec(function(err, message)
	    {
	      if (err){ return res.status(500).end(err);}
	else if (!message)
		    {return res.status(404).end(err); 
		    }
	     else {
		 return res.json(message); 
}
	    });
});

app.get ('/api/comments/:id', function(req,res,next) {
	messages.count ({id:parseInt(req.params.id)},function (err,count)
		{ return res.json(count); 
		});
});

app.delete('/api/images/:id/',isAuthenticated,function(req,res,next)
	{    images.find({}).sort({id:1}).exec(function(err,image)
		{ 
		   for (let i=parseInt(req.params.id)-1; i<image.length; i++)
			{
images.update({id:image[i].id},{$inc:{id: -1 }},{},function()
	{}); 
			}
		});
	    messages.remove({id:parseInt(req.params.id)},{multi:true},function (err,numRemoved)
		{}); 
	     images.remove({id:parseInt(req.params.id)},{},function(err,numRemoved)
		{  
		}); 
	     images.findOne({id:1},function(err,image) 
		     { 
			return res.json(1); 
		     });
	});


// Update

app.patch('/api/comments/:id/',isAuthenticated,function (req, res, next) {
	if (req.body.action ==="upvote") 
	{
	messages.update({_id:req.params.id},{$inc:{upvote: 1 }},{} ,function(err,numReplaced){
		   });
	}

	else 
	{ 
	messages.update({_id:req.params.id},{$inc:{downvote: 1 }},{} ,function(err,numReplaced){
	});
	}
	messages.findOne({_id:req.params.id},function(err,message)
		{
	return res.json(message)
	});
	    
});

// Delete
app.delete('/api/comments/:id/', isAuthenticated, function (req, res, next) {

	 messages.remove({commentId:parseInt(req.params.id)},{multi:false},function(err,numRemoved)
       { if (err) return status(500).end(err);
	  return res.send({sucess:true}); 
       }); 
});

const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
