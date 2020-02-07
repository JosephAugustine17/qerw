const path= require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});
var Datastore = require('nedb');
let messages = new Datastore ({filename: 'db/messages.db', autoload : true, timeStamp : true});
let users = new Datastore({filename:'db/users.db',autoload:true});  
var id =0; 
var Message = (function(){ 
    return function item(message){
        this.content = message.content;
        this.username = message.username;
        this.upvote = 0;
	 this.id = id++; 
        this.downvote = 0;
    }
}());

var User= (function ()	{ 
	  return function userItem(user,file) 
		{  
		  this.username = user.username; 
		   this.file =file; 
		}
	}());



// Create
let multer = require('multer'); 
let upload = multer({dest:path.join(__dirname, 'uploads/')});

app.post('/api/images/',upload.single("file"), function (req, res, next) {
    	
   users.insert(new User(req.body,req.file),function(err,user)
		{ if(err)
			{console.log(`postttttttttttttttttttttttttttttt ${user}`); 
				return res.status(500).end(err);}
	           else 
			{return res.json(user.username)}
		});
});
app.get('/api/images/:username/profile/picture/',function(req,res,next)
	{users.findOne({username:req.params.username},function(err,user){ 
		if (!user)
		{ console.log(123131); 
			res.status(404).end('username does not exist'); 
		}
		else 
		{ console.log(user.file.mimetype);
		  res.setHeader('Content-Type',user.file.mimetype); 
		  res.sendFile(user.file.path); 
		}
	});
});

app.get('/api/images/',function (req,res,nex)
{ users.find({}).exec(function(err,user)
	{ if (err) {return res.status(500).end(err);}
	   console.log(user); 	
	  return res.json(user); 
	});
});

app.post('/api/comments/', function (req, res, next) {
     messages.insert(new Message(req.body), function(err,message) 
	     {
	       if (err) return res.status(500).end(err);
	       else{
         return res.json(message);
	       }
	     }); 
});

// Read

app.get('/api/comments/', function (req, res, next) {
      messages.find({}).limit(5).exec(function(err, message)
	    {
	      if (err){ return res.status(500).end(err);}
	      else {
		 return res.json(message); 
}
	    });
});

// Update

app.patch('/api/comments/:id/', function (req, res, next) {
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

app.delete('/api/messages/:id/', function (req, res, next) {
     messages.remove({_id:req.params.id},{},function(err,numRemoved)
       {}); 
    
	messages.findOne({_id:req.params.id},function(err,message)
		{
    return res.json(message);
		}); 
});

const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
