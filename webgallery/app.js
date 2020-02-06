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

app.post('/api/images/', function (req, res, next) {
	users.insert(new User(req.body,req.file),function(err,user)
		{ if(err)
			{return res.status(500).end(err);}
	
		});

	return res.redirect('/');
});

app.get('/api/images/',function (req,res,nex)
{ users.find({}).limit(5).exec(function(err,user)
	{ if (err) {return res.status(500).end(err);}
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
