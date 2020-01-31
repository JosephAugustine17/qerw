(function(){
"use strict";
window.onload = function()
{ 
    document.getElementById('create_comment_form').addEventListener('submit', function(e){
    // prevent from refreshing the page on submit
    e.preventDefault();
    // read form elements
    let username = document.getElementById("post_name").value;
    let content = document.getElementById("post_content").value;
    // clean form 
    document.getElementById("create_comment_form").reset();
    let imageId= api.getImageId()
    api.addComment(imageId,username,content)
    // create a new message elemen
    });
    document.getElementById('imageForum').addEventListener('click',function(e)
	    { let box = document.getElementById('create_image_form');
		    if (box.style.display =="none")
		    {       
			    box.style.display = "flex"; 
		    }
		    else 
			    
		    { box.style.display = "none";  
		    }
	    }); 
    document.getElementById('create_image_form').addEventListener('submit',function(e)
	    { e.preventDefault(); 
	      let url = document.getElementById("post_url").value;  
	      let author = document.getElementById("post_author").value; 
	      let title = document.getElementById("post_title").value; 
	       document.getElementById('create_image_form').reset();
	     api.addImage(title,author,url); 
	    }); 
 
    document.getElementById('delete_images').addEventListener('click',function(e)
	    { e.preventDefault(); 
	       let imageId = api.getImageId(); 
	      api.deleteImage(imageId)
    }); 
    
      document.getElementById('go_next').addEventListener('click',function(e)
	{	e.preventDefault();
		api.changeCurrentId(1); 
});
	 
   document.getElementById('go_before').addEventListener('click',function(e)
	{ e.preventDefault();
	   api.changeCurrentId(-1); 
	});
  document.getElementById('commentNext').addEventListener('click',function(e)
	  { e.preventDefault(); 
	    api.nextComment(api.getImageId()); 
	  });
    document.getElementById('commentBack').addEventListener('click',function(e)
	    { e.preventDefault();
		    api.backComment(api.getImageId());
	    });
   
   
api.onImageUpdate(function(image){
      if (image != null)
	   {
      document.querySelector('#images').innerHTML= ''; 
	            let elmt2 = document.createElement('div');
		      elmt2.className = "image";
		      elmt2.innerHTML=`
			      <img class = "image_picture" src=${image.url} alt=${image.author}>
			      <div class = "image_author"> Author: ${image.author}</div> 
			      <div class = "date_image"> date Posted:${image.date.toString()}</div>
			      <div class = "image_title"> Title :${image.title}></div>  
			      `; 
		     document.getElementById("images").prepend(elmt2); 	
	   }
	else
	   { document.querySelector('#images').innerHTML=''; 
	   }
    });
    api.onCommentUpdate(function(comment){
	    document.querySelector('#comments').innerHTML = '';
	     comment.forEach(function(comment){
		    let  elmt = document.createElement('div');
		    elmt.className = "comments";
		    elmt.innerHTML=`
		    <div class="comment_user">
		    <img class="comment_picture" src="media/user.png">
		    <div class="comment_username">UserName:${comment.author}</div>
		    <div class="date_user">datePosted:${comment.date.toString()}</div>
		    </div>
		    <div class="comment_content">${comment.content}</div>
		    <div class="delete-icon icon"></div>	
    `;
    elmt.querySelector('.delete-icon').addEventListener('click',function(e)
		    {api.deleteComment(comment.commentId); 
		    }); 
    // add this element to the document
    document.getElementById("comments").prepend(elmt);
	    });
    });
}
}());
