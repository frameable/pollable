const subscribe = require('../client.js');
const connection = subscribe('http://localhost:3000/poll/channel-1');

connection.addEventListener('message', e => {
  console.log("DATA", e.detail);
});


