(function(){
    "use strict";
    
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
		      elmt2.innerHTML=`
			      <img class="message_picture" src="/api/images/${image.username}/profile/picture/" alt="${image.username}">
			      <div class = "image_author"> Author: ${image.username}</div> 
			      <div class = "image_title"> Title :${image.username}></div>  
			      `; 
		     document.getElementById("images").prepend(elmt2); 	
	  
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
                <div class="delete-icon icon"></div>
            `;
            elmt.querySelector(".delete-icon").addEventListener('click', function(){
                api.deleteMessage(message._id);
            });
            elmt.querySelector(".upvote-icon").addEventListener('click', function(){
                api.upvoteMessage(message._id);
            });
            elmt.querySelector(".downvote-icon").addEventListener('click', function(){
                api.downvoteMessage(message._id);
            });
            document.querySelector("#messages").prepend(elmt);
        });
    });
    
    window.addEventListener('load', function(){
	  console.log(123123); 
	document.querySelector('#create_image_form').addEventListener('submit', function(e){        
            e.preventDefault();
            var username = document.querySelector("#post_username").value; 
	    var content = document.querySelector("#picture").files[0];
            document.getElementById("create_image_form").reset();
            api.addImage(username, content);
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
	           api.nextImage(); 
		 });

	document.getElementById("CommentBack-button").addEventListener('click',function(e)
		{ e.preventDefault(); 
		  api.backImage(); 
		}); 
    });
}())

