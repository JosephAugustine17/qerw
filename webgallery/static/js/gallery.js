 (function(){
    "use strict";
    
    window.addEventListener('load', function(){
        
        api.onError(function(err){
            console.error("[error]", err);
        });
    
        api.onError(function(err){
            var error_box = document.querySelector('#error_box');
            error_box.innerHTML = err;
            error_box.style.visibility = "visible";
        });

        api.onSignUpdate(function(username){
            if (!username) window.location.href = '/login.html';
        });

        api.onUserUpdate(function(users)
        {  
            document.querySelector('#gallery').innerHTML= '';
            users.forEach(function(user)
            {
            let elmt2 = document.createElement('div');
                   elmt2.className = "gallery";
                   elmt2.innerHTML=`
                       <div class = "image_author"> Author: ${user._id} </div>
                       <a href="/index.html?username=${user._id}">${user._id} Gallery </a>
                       `;
                  document.getElementById("gallery").prepend(elmt2);
            }); 
             });
        }); 
}())

