/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

const posts = [
  {
    id: '1',
    username: 'user1',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 1',
    timestamp: '2024-06-11T12:34:56Z',
  },
  {
    id: '2',
    username: 'user2',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 2',
    timestamp: '2024-06-11T12:35:56Z',
  },
  {
    id: '3',
    username: 'user3',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 3',
    timestamp: '2024-06-11T12:36:56Z',
  },
  {
    id: '4',
    username: 'user4',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 4',
    timestamp: '2024-06-11T12:37:56Z',
  },
  {
    id: '5',
    username: 'user5',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 5',
    timestamp: '2024-06-11T12:38:56Z',
  },
  {
    id: '6',
    username: 'user6',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 6',
    timestamp: '2024-06-11T12:39:56Z',
  },
  {
    id: '7',
    username: 'user7',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 7',
    timestamp: '2024-06-11T12:40:56Z',
  },
  {
    id: '8',
    username: 'user8',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 8',
    timestamp: '2024-06-11T12:41:56Z',
  },
  {
    id: '9',
    username: 'user9',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 9',
    timestamp: '2024-06-11T12:42:56Z',
  },
  {
    id: '10',
    username: 'user10',
    imageUrl: 'https://via.placeholder.com/300',
    caption: 'This is a mock post 10',
    timestamp: '2024-06-11T12:43:56Z',
  },
];

app.get('/posts', function (req, res) {
  // Add your code here
  res.json(posts);
});

app.get('/posts/*', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url });
});

/****************************
* Example post method *
****************************/

app.post('/posts', function (req, res) {
  const { id, username, imageUrl, caption, timestamp } = req.body;
  const newPost = { id, username, imageUrl, caption, timestamp };
  posts.push(newPost);
  res.json(newPost);
});

app.post('/posts/*', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

/****************************
* Example put method *
****************************/

app.put('/posts', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

app.put('/posts/*', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

/****************************
* Example delete method *
****************************/

app.delete('/posts', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.delete('/posts/*', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
