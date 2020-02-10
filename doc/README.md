# Microblog REST API Documentation

## Message API

### Create

- description: create a new message
- request: `POST /api/comments/`
    - content-type: `application/json`
    - body: object
      - content: (string) the content of the message
      - author: (string) the authors username
- response: 200
    - content-type: `application/json`
    - body: list of object
        -id: (string) the image id
      - commentId : (string) the comment id 
      - content: (string) the content of the message
      - username: (string) the authors username
      - upvote: (int) the number of upvotes
      - downvote: (int) the number of downvotes

``` 
$ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"content":"hello world","username":"me", imageId:1} 
       http://localhost:3000/api/comments/'
```

### Read

- description: retrieve the last 10 messages 
- request: `GET /api/messages/:imageid`   
- response: 200
    - content-type: `application/json`
    - body: list of objects
        -id: (string) the image id
      - commentId : (string) the comment id 
      - content: (string) the content of the message
      - username: (string) the authors username
      - upvote: (int) the number of upvotes
      - downvote: (int) the number of downvotes
 
``` 
$ curl http://localhost:3000/api/comments/0/
``` 

- description: retrieve the previous image 
- request: `GET /api/comments:id/back  
- response: 200
    - content-type: `application/json`
    - body: list of objects
        -id: (string) the image id
      - commentId : (string) the comment id 
      - file : (file ) the file information 
      - username: (string) the authors username
      - title: (string) the tile of the string 
       - downvote: (int) the number of downvotes
 
``` 
$ curl http://localhost:3000/api/comments/
``` 


- description: retrieve the message id
- request: `GET /api/messages/:id/`
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the message id
      - content: (string) the content of the message
      - author: (string) the authors username
      - upvote: (int) the number of upvotes
      - downvote: (int) the number of downvotes
- response: 404
    - body: message id does not exists

``` 
$ curl http://localhost:3000/api/messages/jed5672jd90xg4awo789/
``` 
  
### Update

- description: upvote or downvote the message id
- request: `PATCH /api/comments/:id/`
    - content-type: `application/json`
    - body: object
      - action: (string) either `upvote` or `downvote`
- response: 200
    - content-type: `application/json`
    - body: object
      - id: (string) the image id
      - commentId : (string) the comment id 
      - content: (string) the content of the message
      - username: (string) the authors username
      - upvote: (int) the number of upvotes
      - downvote: (int) the number of downvotes
- response: 404
    - body: message :id does not exists
  
``` 
$ curl -X PATCH 
       -H 'Content-Type: application/json'
       -d '{"action":"upvote"} 
       http://localhost:3000/api/comments/1/'
```
  
  
  
### Delete
  
- description: delete the message id
- request: `DELETE /api/comments/:id/`
- response: 200
    - content-type: `application/json`
    - body: object
       - id: (string) the image id
      - commentId : (string) the comment id 
      - content: (string) the content of the message
      - username: (string) the authors username
      - upvote: (int) the number of upvotes
      - downvote: (int) the number of downvotes
- response: 500
    - body: message :id does not exists

``` 
$ curl -X DELETE
       http://localhost:3000/api/comments/0/
``` 
## Image API

### Create

- description: create a new message
- request: `POST /api/images/`
    - content-type: `application/json`
    - body: object
      - username: (string) the authors username
      - title : (string) the name of the message
      - file : (file) the file type and info 
- response: 200
    - content-type: `application/json`
    - body: list of object
        -id: (string) the image id
      - content: (string) the content of the message
      - username: (string) the authors username
      -file : (string) the the file information 

``` 
$ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"content":"hello world","username":"me", "file": "random.png"} 
       http://localhost:3000/api/images/'
```

### Read

- description: retrieve the last image
- request: `GET /api/images/:id`   
- response: 200
    - content-type: `application/json`
    - body: object 
        - username: (string) the authors username
      - title : (string) the name of the message
      - file : (file) the file type and info 
 
``` 
$ curl http://localhost:3000/api/images/1/
``` 

- description: retrieve the next image 
- request: `GET /api/images/:id/next/`  
- response: 200
    - content-type: `application/json`
    - body: list of objects
        -username: (string) the authors username
      - title : (string) the name of the message
      - file : (file) the file type and info 
``` 
 curl http://localhost:3000/api/images/1/back/ 
 ``` 
- description: retrieve the backimage 
- request: `GET /api/images/:id/back/`  
- response: 200
    - content-type: `application/json`
    - body: list of objects
        -username: (string) the authors username
      - title : (string) the name of the message
      - file : (file) the file type and info 
``` 
 $ curl http://localhost:3000/api/images/1/back/ 
 ``` 

  
### Update

  
  
### Delete
  
- description: delete the message id
- request: `DELETE /api/comments/:id/`
- response: 200
    - content-type: `application/json`
    - body: object
      - content-type: `application/json`
       - body: list of objects
        -username: (string) the authors username
      - title : (string) the name of the message
      - file : (file) the file type and info 
- response: 500
    - body: message :id does not exists

``` 
$ curl -X DELETE
       http://localhost:3000/api/images/0/
``` 