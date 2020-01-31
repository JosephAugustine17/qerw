const express = require('express');
const app = express(); 

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var Item = (function(){
    var id = 1;
    return function item(item){
        this.id = id++;
        this.content = item.content;
	this.author = item.author;
	this.upvote=0; 
	this.downvote=0; 
    }
}());
app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});
 var items = []; 
app.post('/api/messages/', function (req, res, next) {
    var item = new Item(req.body);
    items.push(item);  
    res.json(item);
    next(); 
});

app.get('/api/messages/',function (req,res,next)
	{    let x=0;
	     if( items.length>4)
		{res.json(items.slice(items.length-5)); 
		}
	  else {
	    res.json(items.slice(0,items.length));
	  }
    next();
	});

app.patch('/api/messages/:id/',function (req,res,next)
	{ let index= items.findIndex(function(e)
		{ return (e.id === parseInt(req.params.id));});
	console.log(req.body);
	if (req.body.vote =="upvote")
		{
	items[index].upvote= items[index].upvote+1;
		}
	else 
		{
	items[index].downvote= items[index].downvote+1;
		}
	res.json(items[index]); 
}); 
app.delete('/api/messages/:id/',function (req,res,next)
	{ 
	  let index= items.findIndex(function(e)
		{return (e.id === parseInt(req.params.id));});
	  if(index==-1) 
		{res.json(null);} 
	  else
		{ var item = items[index]; 
		  items.splice(index,1);
		  res.json(item); 
		}
	  next(); 
	}); 

app.use(express.static('static')); 
const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
