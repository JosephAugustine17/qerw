let api = (function(){
	"use strict"; 

function sendFiles(method, url, data, callback){
        let formdata = new FormData();
        Object.keys(data).forEach(function(key){
            let value = data[key];
            formdata.append(key, value);
        });
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        xhr.send(formdata);
    }
 function send(method, url, data, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else 
		{ console.log(xhr.responseText); 
		 callback(null, JSON.parse(xhr.responseText));}
        };
        xhr.open(method, url, true);
        if (!data) xhr.send();
        else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }
     let module = {}; 

      
    /*  ******* Data types *******
        image objects must have at least the following attributes:
            - (String) imageId 
            - (String) title
            - (String) author
            - (String) url
            - (Date) date
    
        comment objects must have the following attributes
            - (String) commentId
            - (String) imageId
            - (String) author
            - (String) content
            - (Date) date
    
    ****************************** */ 
        let imageListeners = [];
      let commentListeners = [];
    // add an image to the gallery

let voteListeners = [];
    
module.upvoteMessage = function(commentsId){
        send("PATCH", "/api/comments/" +commentsId+"/", {action: 'upvote'}, function(err, res){
             if (err) return notifyErrorListeners(err);
             notifyVoteListeners(res);
        });
    }
    
    module.downvoteMessage = function(commentsId){
        send("PATCH", "/api/comments/" + commentsId+ "/", {action: 'downvote'}, function(err, res){
             if (err) return notifyErrorListeners(err);
             notifyVoteListeners(res);
        });
    }
    function notifyVoteListeners(message){
        voteListeners.forEach(function(listener){
            listener(message);
        });
    }
    
    module.onVoteUpdate = function(listener){
        voteListeners.push(listener);
    }

    module.addImage = function(author, file){
 sendFiles("POST", "/api/images/", {username:author,file:file}, function(err, res){
             if (err) return notifyErrorListeners(err);
             notifyImageListeners();
        });
    }
   
    
    // delete an image from the gallery given its imageId
    module.deleteImage = function(imageId){
	    }
   
    
    function notifyCommentListeners()
	{   getComment(function(err,comments)
		{ if (err) return notifyErrorListeners(err);
		  commentListeners.forEach(function(listener)
			  {listener(comments); 
		});
	});
	}

    
    function notifyImageListeners()
	{ getImages(function(err,comments)
		{
	if(err) return notifyErrorListeners(err); 
	 imageListeners.forEach(function(listener)
		{listener(comments); 
		});
		}); 
	}
   let getImages = function(callback)
	{ send("GET", "/api/images/", null, callback);
	}
   let getComment = function (callback)
{send("GET", "/api/comments/", null, callback);
	}
    
    // add a comment to an image
    module.addComment = function(imageId, author, content){
  send("POST", "/api/comments/", {imageId: imageId, content: content,author:author}, function(err, res){
             if (err) return notifyErrorListeners(err);
             notifyCommentListeners();
              
        });
    }
    
    // delete a comment to an image
    module.deleteComment = function(commentId){

    }
    
    // call handler when an image is added or deleted from the gallery
    module.onImageUpdate = function(handler){
	    imageListeners.push(handler);
	    getImages(function(err,images)
		    {if (err) return notifyErrorListeners(err); 
		   handler(images);
		    });
    }
    
    // call handler when a comment is added or deleted to an image
    module.onCommentUpdate = function(handler){
        commentListeners.push(handler);
	    getComment(function(err,comments)
		    { if (err) return notifyErrorListeners(err); 
		      handler(comments);
		    }); 
 
    }

let errorListeners = [];
    
    function notifyErrorListeners(err){
        errorListeners.forEach(function(listener){
            listener(err);
        });
    }
    
    module.onError = function(listener){
        errorListeners.push(listener);
    };
    return module;
})();
