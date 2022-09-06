# Pollable

Helper class for long-polling with Express

```javascript
// server.js

app.get('/poll', (req, res) => {
  const { latestMessageId } = req.query;
  pollable.subscribe({ key, latestMessageId, res });
});

setInterval(_ => {
  pollable.publish('channel-1', { value: Math.random() })
}, 1000);
```

```javascript
// client.js

const subscription = pollable('http://localhost:3000/poll/channel-1');

subscription.addEventListener('message', e => {
  console.log("DATA", e.detail);
});
```


