const crypto = require('crypto');
const EventEmitter = require('events');

const POLL_INTERVAL_MS = 5000;
const CHANNEL_TIMEOUT_MS = 120000;

class Pollable {

  subscriptions = {};
  channels = {};

  subscribe({ key, res, latestMessageId = '' }) {

    if (!key) throw "we need a key";
    if (!res) throw "we need a res";

    this.channels[key] = this.channels[key] || new EventEmitter;

    const channel = this.channels[key];
    const message = channel.latestMessage;

    // respond right away if they've missed something
    if (message && message.messageId != latestMessageId) {
      return res.json({ message, status: 'catch-up' })
    }

    // respond with the latest message after 30s and client will reconnect
    const responseTv = setTimeout(_ => {
      channel.off('message', send);
      res.json({ message, status: 'timeout' });
    }, POLL_INTERVAL_MS);


    // broadcast our new message
    channel.once('message', send);

    function send(data) {
      clearTimeout(responseTv);
      res.json({ message: data.message, status: 'new' });
    }
  }

  publish(key, message) {
    const channel = this.channels[key];
    if (!channel) return;
    clearTimeout(channel.finalizeTv);
    channel.finalizeTv = setTimeout(_ => delete channels[key], CHANNEL_TIMEOUT_MS);
    message.messageId = message.messageId || md5(message);
    channel.latestMessage = message;
    channel.emit('message', { message });
  }
}

function md5(data) {
  return crypto.createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');
}

module.exports = new Pollable;
