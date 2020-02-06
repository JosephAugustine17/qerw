let api = (function(){
	"use strict"; 

 function send(method, url, data, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
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

    module.addImage = function(title, author, url){
 send("POST", "/api/images/", {author: author, title: title,url:url}, function(err, res){
             if (err) return notifyErrorListeners(err);
             notifyImageListeners();
             notifyCommentListeners();
        });
    }
   
    module.getImageId= function()
	{ let jsonObject = JSON.parse(localStorage.getItem('store'))
		if(jsonObject.imageObjects.length ==0)
		{ return 0; 
		}
		return jsonObject.imageObjects[jsonObject.current-1].imageId; 
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
	{imageListeners.forEach(function(listener)
		{listener(getImages()); 
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
	    handler(getImages()); 
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
