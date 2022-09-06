const express = require('express');
const pollable = require('../index');

const app = express();

setInterval(_ => {
  const message = { action: 'value', value: Math.random() };
  pollable.publish('channel-1', message);
}, 10000);

app.get('/poll/:key', (req, res) => {
  const { key } = req.params;
  const { latestMessageId } = req.query;
  pollable.subscribe({ key, latestMessageId, res });
});

app.listen(3000);

