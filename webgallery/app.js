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
var Message = (function(){ 
    return function item(message){
        this.content = message.content;
        this.username = message.username;
        this.upvote = 0;
	this.id = message.imageId;
        this.downvote = 0;
    }
}());

var User= (function ()	{
	var id =1; 
	  return function userItem(user,file) 
		{  
		 this.id = id++; 
		  this.username = user.username; 
		   this.file =file; 
		}
	}());



// Create
let multer = require('multer'); 
let upload = multer({dest:path.join(__dirname, 'uploads/')});
app.get('/api/images/:id/next/',function(req,res,next) 
	{   users.count({},function(err,count)
		{ if ( parseInt(req.params.id) >count)
			{ if(count >0)
			   { users.findOne({id :1},function(err,user)
				   { return res.json(user)
				   }); 
			   }
			}
		});
		users.findOne({id:parseInt(req.params.id)}, function(err,user)
		{if(!user) return res.status(404).end("no user"); 
			
		 else
			{ return res.json(user); 
			}
		});
		});
app.post('/api/images/',upload.single("file"), function (req, res, next) { 	
   users.insert(new User(req.body,req.file),function(err,user)
		{ if(err)
			{
				return res.status(500).end(err);}
	           else 
			{ console.log(user.id);
				return res.json(user.username)}
		});
});
app.get('/api/images/:username/profile/picture/',function(req,res,next)
	{users.findOne({username:req.params.username},function(err,user){ 
		if (!user)
		{  
			res.status(404).end('username does not exist'); 
		}
		else 
		{ 
		  res.setHeader('Content-Type',user.file.mimetype); 
		  res.sendFile(user.file.path); 
		}
	});
});

app.get('/api/images/:id',function (req,res,next)
{       console.log("userid" + req.params.id); 
	users.findOne({id:parseInt(req.params.id)},function(err,user)
	{ if(!user)
		{console.log("nothing");}
		console.log(user);
		return res.json(user); 
	});
});

app.post('/api/comments/', function (req, res, next) {
     messages.insert(new Message(req.body), function(err,message) 
	     {
	       if (err) return res.status(500).end(err);
		     else if (!message)
		     { return res.status(404).end("no user"); 
		     }
		  else{
         return res.json(message);
	       }
	     }); 
});

// Read

app.get('/api/comments/:id', function (req, res, next) {
      console.log(req.params.id); 
	messages.find({id:parseInt(req.params.id)}).exec(function(err, message)
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
