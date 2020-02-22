(function(){
    "use strict";
    const urlParams = new URLSearchParams(window.location.search);
    const usernameOnPage = urlParams.get('username');
    let getUsername = function(){
        return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    } 
    api.onError(function(err){
        console.error("[error]", err);
    });
    
    api.onError(function(err){
        var error_box = document.querySelector('#error_box');
        error_box.innerHTML = err;
        error_box.style.visibility = "visible";
    });
    api.onVoteUpdate(function(message){
        document.querySelector('#msg' + message._id + ' .upvote-icon').innerHTML = message.upvote;
        document.querySelector('#msg' + message._id + ' .downvote-icon').innerHTML = message.downvote;
    });

    api.onSignUpdate(function(users){
        if (!users)window.location.href = '/login.html';
        document.querySelector("#signin_button").style.visibility = (users)? 'hidden' : 'visible';
        document.querySelector("#signout_button").style.visibility = (users)? 'visible' : 'hidden';
        document.querySelector('#create_message_form').style.visibility = (users)? 'visible' : 'hidden';
        document.querySelector('#gallery_button').style.visibility = (users)? 'visible' : 'hidden';
        document.querySelector('#create_image_form').style.visibility = (users==usernameOnPage)? 'visible' : 'hidden';
    });
 document.getElementById('add_username').addEventListener('click',function(e)
	    { let box = document.getElementById('create_image_form');
		    if (box.style.display =="none")
		    {       
			    box.style.display = "flex"; 
		    }
		    else 
			    
		    { box.style.display = "none";  
		    }
        });
     
    api.onImageUpdate(function(image){
     if(image!=null)
	    {
      document.querySelector('#images').innerHTML= ''; 
	   let elmt2 = document.createElement('div');
		      elmt2.className = "image";
		       let date = new Date(); 
		      elmt2.innerHTML=`
			      <img class="message_picture" src="/api/images/${image.username}/${image.id}/profile/picture/" alt="${image.username}">
			      <div class = "image_author"> Author: ${image.username}</div> 
			      <div class = "image_title"> Title :${image.title}></div>
			      <div class = "date" > Date : ${date}></div>  
                  `;
                  if (usernameOnPage ==getUsername())
                  {
                      elmt2.innerHTML=elmt2.innerHTML +('<div class = "delete-icon icon" > </div> ')
                      elmt2.querySelector(".delete-icon").addEventListener('click', function(){
                     api.deleteImage(image.id);
                        location.reload(true);
                      });                   
                  }
		     document.getElementById("images").prepend(elmt2); 	
	  
	    }
	   else
	    { document.querySelector('#images').innerHTML=''; 
	    }
   });
           
    api.onCommentUpdate(function(messages){
        document.querySelector('#messages').innerHTML = '';
        messages.forEach(function(message){
            var elmt = document.createElement('div');
            elmt.className = "message";
            elmt.id = "msg" + message._id;
            elmt.innerHTML=`
                <div class="message_user">
                    <div class="message_username">${message.username}</div>
                </div>
                <div class="message_content">${message.content}</div>
                <div class="upvote-icon icon">${message.upvote}</div>
                <div class="downvote-icon icon">${message.downvote}</div>
                <div class = "delete-icon icon" > </div>
            `;
                elmt.querySelector(".delete-icon").addEventListener('click', function(){
                    api.deleteComment(message.commentId);
                });                   
            elmt.querySelector(".upvote-icon").addEventListener('click', function(){
                api.upvoteMessage(message._id);
            });
            elmt.querySelector(".downvote-icon").addEventListener('click', function(){
                api.downvoteMessage(message._id);
            });
            document.querySelector("#messages").append(elmt);
        });
    });
    
    window.addEventListener('load', function(){ 
	document.querySelector('#create_image_form').addEventListener('submit', function(e){        
            e.preventDefault();
            var username = document.querySelector("#post_username").value; 
	    var content = document.querySelector("#picture").files[0];
	    var title = document.querySelector("#image_title").value; 
            document.getElementById("create_image_form").reset();
            api.addImage(username, content,title);
        });  
        document.querySelector('#create_message_form').addEventListener('submit', function(e){        
            e.preventDefault();
            var username = document.querySelector("#post_username").value; 
	    var content = document.querySelector("#post_content").value;
            document.getElementById("create_message_form").reset();  
            api.addComment(api.getImageId(),username, content);
        });
	document.getElementById("next-button").addEventListener('click',function(e)
		{ e.preventDefault(); 
		  api.nextImage();
		});
	 document.getElementById("back-button").addEventListener('click',function(e)
		 { e.preventDefault(); 
		   api.backImage(); 
		 });
	 document.getElementById("CommentNext-button").addEventListener('click',function(e)
		 { e.preventDefault(); 
	           api.nextComment(); 
        	 	 });

	document.getElementById("CommentBack-button").addEventListener('click',function(e)
		{ e.preventDefault(); 
		  api.backComment(); 
        });
        
    });
}())

