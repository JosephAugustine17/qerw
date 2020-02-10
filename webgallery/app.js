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

var User= (function ()	{
	var id =1; 
	  return function userItem(user,file) 
		{  
		 this.id = id++; 
		  this.username = user.username; 
		   this.file =file;
	          this.title = user.title;
		     
		}
	}());



// Create
let multer = require('multer'); 
let upload = multer({dest:path.join(__dirname, 'uploads/')});


app.get('/api/images/:id/back/',function(req,res,next) 
	{     
		
		users.findOne({id:parseInt(req.params.id)}, function(err,user)
		{if(!user)
                     { users.count({},function(err,count)
		
		{       
			if ( parseInt(req.params.id)<1)
			{ 
				users.findOne({id :parseInt(count)},function(err,user)
				   {   
					 
					   return res.json(user)
				   }); 
			}
                        else
	{ return res.status(404).end("no item found"); 
	}
		});
                            } 			
		 else
			{ return res.json(user); 
			}
		});
		});

app.get('/api/images/:id/next/',function(req,res,next) 
	{     
		
		users.findOne({id:parseInt(req.params.id)}, function(err,user)
		{if(!user)
                     { users.count({},function(err,count)
		
		{       
			if ( parseInt(req.params.id)>count)
			{ 
				users.findOne({id :1},function(err,user)
				   {   
					   return res.json(user)
				   }); 
			}
                        else
	{ return res.status(404).end("no item found"); 
	}
		});
                            } 			
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
			{ 
				return res.json(user.id)}
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
{       
	users.findOne({id:parseInt(req.params.id)},function(err,user)
	{ 
		return res.json(user); 
	});
});

app.post('/api/comments/', function (req, res, next) {
    users.count ({},function (err,count){
	
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

app.get('/api/comments/:id/', function (req, res, next) { 
	messages.find({id:parseInt(req.params.id)}).sort({commentId:1}).limit(10).exec(function(err, message)
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

app.delete('/api/images/:id/',function(req,res,next)
	{    users.find({}).sort({id:1}).exec(function(err,image)
		{ 
		   for (let i=parseInt(req.params.id)-1; i<image.length; i++)
			{
users.update({id:image[i].id},{$inc:{id: -1 }},{},function()
	{}); 
			}
		});
	    messages.remove({id:parseInt(req.params.id)},{multi:true},function (err,numRemoved)
		{}); 
	     users.remove({id:parseInt(req.params.id)},{},function(err,numRemoved)
		{  
		}); 
	     users.findOne({id:1},function(err,user) 
		     { 
			return res.json(1); 
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
app.delete('/api/comments/:id/', function (req, res, next) {

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
