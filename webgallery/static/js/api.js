let api = (function(){
	"use strict"; 
     let module = {}; 
	if (!localStorage.getItem('store'))
	{ localStorage.setItem('store', JSON.stringify({author:"",commentFirst:0,imageId:0, title:0,current:0,url:0,date:0,imageObjects:[]}))

	localStorage.setItem('comment', JSON.stringify({author:"",imageId:0, title:0,commentId:0, url:0,date:0,commentObjects:[]}))
	}; 
      
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
    
    // add an image to the gallery
    module.addImage = function(title, author, url){
    let jsonObject= JSON.parse(localStorage.getItem('store'))
    let imageItem = 
		    {       imageId: jsonObject.imageId++,
			    author:author,
			    title : title,
			    url : url,
			    commentFirst:0, 
			    date: new Date()
		    };
    jsonObject.imageObjects.push(imageItem);
   jsonObject.current=jsonObject.imageObjects.length;
    localStorage.setItem('store', JSON.stringify(jsonObject));
    notifyImageListeners();
    }
   module.nextComment = function(imageId)
	{ let pageComment =[];
          let images= JSON.parse(localStorage.getItem('store')); 
          let comments = JSON.parse(localStorage.getItem('comment')); 
	  let i;
	  for (i=0; i<comments.commentObjects.length; i++)
		  { if(comments.commentObjects[i].imageId ==imageId)
			  { pageComment.push(comments.commentObjects[i]);   
			  }
		  }
	 let firstImage;
         for (let y=0; y<images.imageObjects.length; y++)
		{ if (images.imageObjects[y].imageId == imageId)
			{   firstImage = images.imageObjects[y];
				break;}
		}
		
         if (firstImage.commentFirst+10<pageComment.length)
		  {   let x=0;
		      firstImage.commentFirst =firstImage.commentFirst+10
		      localStorage.setItem('store',JSON.stringify(images)); 
		  }
	 
		      notifyCommentListeners(); 
	}

   module.backComment = function(imageId)
	{ let pageComment = []; 
	  let images = JSON.parse(localStorage.getItem('store'));
		let comments = JSON.parse(localStorage.getItem('comment')); 
		let i; 
		for (i =0; i<comments.commentObjects.length; i++)
		{ if (comments.commentObjects[i].imageId==imageId)
			{ pageComment.push(comments.commentObjects[i]); 

			}
			
		}
		let firstImage; 
		for (let y=0; y<images.imageObjects.length; y++)
		{ if (images.imageObjects[y].imageId == imageId)
			{   firstImage = images.imageObjects[y];	
				break;}
		}

		if (firstImage.commentFirst-9>0)
		{       
			firstImage.commentFirst =firstImage.commentFirst-10;
			localStorage.setItem('store',JSON.stringify(images));
		}
		notifyCommentListeners();
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
    let jsonObject = JSON.parse(localStorage.getItem('store'))
    let index = jsonObject.imageObjects.findIndex(function(image)
	    {return image.imageId == imageId;
	    });
    jsonObject.imageObjects.splice(index,1); 
    jsonObject.current=1; 
    deleteComments(imageId);
    jsonObject.imageId--; 
    localStorage.setItem('store',JSON.stringify(jsonObject));
  if (jsonObject.imageObjects.length !=1 && jsonObject.current-1< jsonObject.imageObjects.length)
	    {
		  resetImageImageId(jsonObject.current,jsonObject.imageObjects.length,jsonObject);
	  
	    }
	   notifyImageListeners(); 
	    notifyCommentListeners();
	   
	    }
   function resetImageImageId(current,end,jsonObject)
	{  let i;
		for (i=current; i< end; i++)
		{ jsonObject.imageObjects[i].imageId--; 
		}

           localStorage.setItem('store',JSON.stringify(jsonObject));
	}
   let commentListeners = []; 
   
   function deleteComments(imageId)
	{ let jsonObject= JSON.parse(localStorage.getItem('comment'));
	   let images= JSON.parse(localStorage.getItem('store'));
	  let i;
	  let totalSize = jsonObject.commentObjects.length;
	   for (i=0; i<jsonObject.commentObjects.length;i++)
		{ if (jsonObject.commentObjects[i].imageId == imageId)
			{ 
			  jsonObject.commentObjects.splice(i,1) 
			  i--; 
			}
		}
          if (jsonObject.commentObjects.length!=1 && images.current-1< jsonObject.commentObjects.length)
		{
	 resetCommentId(images.current,jsonObject.commentObjects.length,jsonObject);
		}
			localStorage.setItem('comment',JSON.stringify(jsonObject));
	}
    function resetCommentId(current,end,jsonObject)
	{   let i;
		for (i=current; i<end; i++)
		{ jsonObject.commentObjects[i].imageId--; 
		}     
           localStorage.setItem('comment',JSON.stringify(jsonObject));
	}
    function notifyCommentListeners()
	{ commentListeners.forEach(function(listener)
		{ listener(getComment()); 
		})
	}
   let imageListeners=[];
    
    function notifyImageListeners()
	{imageListeners.forEach(function(listener)
		{listener(getImages()); 
		});
	}
   let getImages = function()
	{ let images = JSON.parse(localStorage.getItem('store'));
	    if(images.current==0)
		{ return images.imageObjects[0]; 
		}
		
	return images.imageObjects[images.current-1]; 
	}
   let getComment = function () 
	{ let comment = JSON.parse(localStorage.getItem('comment'));
	  let image= JSON.parse(localStorage.getItem('store'));
	 let current = []
	 let imageComment=[]
	 if (image.imageObjects.length==0)
		{ return current; 
		}
		for (let y=0; y<comment.commentObjects.length; y++)
		{ if (comment.commentObjects[y].imageId==image.current-1)
			{ imageComment.push(comment.commentObjects[y]); 
			}
		}
		 if (imageComment.length ==0)
			{ return current;
			}
		else if (imageComment.length==1)
		 { return current = imageComment;
			}
		
		for (let x= Math.max(imageComment.length-image.imageObjects[image.current-1].commentFirst-10,0); x<imageComment.length - image.imageObjects[image.current-1].commentFirst;x++)
		{ current.push(imageComment[x]);
		}
		return current; 
	}
    
    // add a comment to an image
    module.addComment = function(imageId, author, content){
	 let jsonObject = JSON.parse(localStorage.getItem('comment')) 
	    let commentItem = 
		    { 
			    imageId: imageId, 
			    author: author,
			    content: content,
			    commentId:jsonObject.commentId++,
			    date: new Date() 
		    };
	   jsonObject.commentObjects.push(commentItem)
	    localStorage.setItem('comment', JSON.stringify(jsonObject))
	    notifyCommentListeners(); 
    }
    module.changeCurrentId=function(direction)
	{ 
		let jsonObject =JSON.parse(localStorage.getItem('store'))
		if (jsonObject.imageObjects.length==0)
		{ 
		   jsonObject.current=1; 
		}
		else if(jsonObject.current==jsonObject.imageObjects.length && direction == 1 )
		{ jsonObject.current = 1 ;
		}
		else if (jsonObject.current==1 && direction ==-1 )
		{ 
			jsonObject.current=jsonObject.imageObjects.length;
		}
		else
		{
		jsonObject.current= jsonObject.current+direction; 
		} 
		localStorage.setItem('store', JSON.stringify(jsonObject))
		notifyImageListeners();
		notifyCommentListeners(); 
	}
    // delete a comment to an image
    module.deleteComment = function(commentId){
	   let jsonObject = JSON.parse(localStorage.getItem('comment'))
	    let index = jsonObject.commentObjects.findIndex(function(comments)
	    { return comments.commentId == commentId; 
	    }); 
	    jsonObject.commentObjects.splice(index,1)
            localStorage.setItem('comment',JSON.stringify(jsonObject));
	    notifyCommentListeners(); 
    }
    
    // call handler when an image is added or deleted from the gallery
    module.onImageUpdate = function(handler){
	    imageListeners.push(handler);
	    handler(getImages()); 
    }
    
    // call handler when a comment is added or deleted to an image
    module.onCommentUpdate = function(handler){
        commentListeners.push(handler); 
	handler(getComment()); 
    }
    return module;
})();
