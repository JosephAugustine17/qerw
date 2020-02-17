let api = (function(){
	"use strict"; 
if (!localStorage.getItem('store'))
		{ localStorage.setItem('image', JSON.stringify({currentId:1,page:0}))
				}; 
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
		{ 
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

module.signup = function(username, password){
	send("POST", "/signup/", {username, password}, function(err, res){
		 if (err) return notifyErrorListeners(err);
		 notifyUserListeners(getUsername());
	});
}

module.signin = function(username, password){
	send("POST", "/signin/", {username, password}, function(err, res){
		 if (err) return notifyErrorListeners(err);
		 notifyUserListeners(getUsername());
	});
}
module.getImageId = function() 
	{ return getCurrentId();
	}
function setPage(page)
	{ let jsonObject = JSON.parse(localStorage.getItem('image')); 
		jsonObject.page=page;
		localStorage.setItem('image',JSON.stringify(jsonObject)); 
	}
function getPage()
	{ let jsonObject = JSON.parse(localStorage.getItem('image')); 
	  return (jsonObject.page); 
	}
function changeCurrent(id)
	{ let jsonObject = JSON.parse(localStorage.getItem('image')); 
             jsonObject.currentId = id; 
	   localStorage.setItem('image',JSON.stringify(jsonObject) ); 
	}
   function getCurrentId()
	{ let jsonObject =JSON.parse(localStorage.getItem('image'));
	  return(jsonObject.currentId); 
	}
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
   function updateCurrent()
	{ let jsonObject = JSON.parse(localStorage.getItem('image')); 
	   jsonObject.currentId = jsonObject.currentId+1; 
	    localStorage.setItem('image', JSON.stringify(jsonObject));
	}
    module.addImage = function(author,file,title){ 
  sendFiles("POST", "/api/images/", {username:author,title:title,file:file}, function(err, res){
             if (err) return notifyErrorListeners(err);
	     changeCurrent(res); 
             notifyImageListeners(getCurrentId());
	     notifyCommentListeners(getCurrentId()); 
        });
    }
   
   module.nextImage = function() 
	{  let current = getCurrentId();
	   setPage(0); 
	   getNextImage(current+1,function(err,image)
		{ if(err) return notifyErrorListeners(err);
		  changeCurrent(image.id);
		  imageListeners.forEach(function(listener)
			  { listener(image)
			  });
                 notifyCommentListeners(image.id); 
		}); 
	}
	let userListeners = [];
	module.onUserUpdate = function(listener){
        userListeners.push(listener);
        listener(getUsername());
    }
    
    module.signin = function(username, password){
        send("POST", "/signin/", {username, password}, function(err, res){
             if (err) return notifyErrorListeners(err);
             notifyUserListeners(getUsername());
        });
	}
	let getUsername = function(){
        return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    }
    
	function notifyUserListeners(username){
        userListeners.forEach(function(listener){
            listener(username);
        });
    };
    
    module.signup = function(username, password){
        send("POST", "/signup/", {username, password}, function(err, res){
             if (err) return notifyErrorListeners(err);
             notifyUserListeners(getUsername());
        });
    }


   module.backImage = function() 
	{  let current = getCurrentId();
	   setPage(0);
	   getBackImage(current-1,function(err,image)
		{ if(err) return notifyErrorListeners(err);
		  changeCurrent(image.id);

		  imageListeners.forEach(function(listener)
			  { listener(image)
			  });
	         notifyCommentListeners(image.id); 
		}); 
	}
 module.nextComment = function () 
	{  let current = getCurrentId();
	   let page = getPage()+1;
	  
	  send("GET", "/api/comments/"+current+"/", null,function(err,res)
		  { if (res > (page*10))
			  { setPage(page); 
			  }
		    else
			  { setPage(0); 
			  }
		   notifyCommentListeners(current); 
		  });
	}

module.backComment = function () 
	{  let current = getCurrentId();
	   let page = getPage()-1;
	  send("GET", "/api/comments/"+current+"/", null,function(err,res)
		  { 
		if (page< 0)
			  { setPage(Math.floor(res/10)); 
			  }
		     
		     else 
			  {setPage(page); 
			  }
	    notifyCommentListeners(current); 
});
}; 
  let getBackImage = function(imageId,callback)
	{ send("GET", "/api/images/" + imageId+"/back/", null,callback); 
	}
  let getNextImage = function(imageId,callback)
	{ send("GET", "/api/images/" + imageId+"/next/", null,callback); 
	}
    function notifyCommentListeners(imageId)
	{  let commentList = [];  
	   getComment(imageId,function(err,comments)
		{
			comments.forEach(function(comment)
				{
					if(comment.id == getCurrentId())
					{ commentList.push(comment); 
					}
				}); 	
		 if (err) return notifyErrorListeners(err);
		  commentListeners.forEach(function(listener)
			  {listener(commentList);
			  });
					
		
	});
	}
    function notifyImageListeners(imageId)
	{ 
		getImages(imageId,function(err,images)
			{
				if(err) return notifyErrorListeners(err);
				{imageListeners.forEach(function(listener)
								{
									listener(images); 
								});
				}

			});
	}
   let getImages= function(imageId,callback)
	{      let current = getCurrentId(); 
		send("GET", "/api/images/"+imageId+"/", null, callback);
	}
   let getComment = function (imageId,callback)
{      let current= getCurrentId();
	let page = getPage();
	send("GET", "/api/comments/"+imageId+"/"+page+"/", null, callback);
	}
    
    // add a comment to an image
    module.addComment = function(imageId, username,content){
  send("POST", "/api/comments/", {imageId: imageId, username: username,content:content}, function(err, res)
	  {         if (err) return notifyErrorListeners(err);
             notifyCommentListeners(getCurrentId());
	  });
       
    }
    module.deleteImage = function (imageId) 
   { send("DELETE", "/api/images/"+imageId+"/",null,function(err,res)
	  { if (err) return notifyErrorListeners(err); 
	    changeCurrent(res);  
	     notifyImageListeners(res);
	      notifyCommentListeners(res); 
	   });
   }
    // delete a comment to an image
    module.deleteComment = function(commentId){
       send("DELETE", "/api/comments/"+commentId+ "/", null,function(err,res) 
	       { if(err) return notifyErrorListeners(err); 
		 notifyCommentListeners(getCurrentId()); 
	       });
    }
    
    // call handler when an image is added or deleted from the gallery
    module.onImageUpdate = function(handler){
	    imageListeners.push(handler);
	    getImages(getCurrentId(),function(err,images)
		    {if (err) return notifyErrorListeners(err); 
		   handler(images);
		    });
    }
    
    // call handler when a comment is added or deleted to an image
    module.onCommentUpdate = function(handler){
        commentListeners.push(handler);
	    getComment(getCurrentId(),function(err,comments)
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
