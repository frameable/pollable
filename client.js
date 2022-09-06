function subscribe(url) {

  let latestMessageId;
  const emitter = new EventTarget;

  async function _poll(instant) {

    if (!instant) await sleep(1000);

    try {
      const _url = `${url}?latestMessageId=${latestMessageId}`;
      console.log("LATEST", _url, latestMessageId);
      var response = await fetch(_url);
    } catch(e) {
      console.log("fetch transport error", e);
      await sleep();
      return await _poll();
    }

    if (response.status == 200) {
      try {
        var data = await response.json();
        if (data && data.message) {
          latestMessageId = data.message.messageId;
        }
      } catch (e) {
        console.log("fetch parse error", e);
        await sleep();
        return await _poll();
      }
      emitter.dispatchEvent(new CustomEvent('message', { detail: data }));
      return await _poll();
    } else {
      console.log("fetch application error", response.status);
      await sleep();
      return await _poll();
    }
  }

  _poll();
  return emitter;
}

async function sleep(ms = 1000) {
  await new Promise(r => setTimeout(r, ms));
}

module.exports = subscribe;


// pollyfil for node.js

if (typeof fetch == 'undefined') {
  global.fetch = require('node-fetch');
}

if (typeof CustomEvent == 'undefined') {
  class CustomEvent extends Event {
    constructor(message, data) {
      super(message, data);
      this.detail = data.detail;
    }
  }
  global.CustomEvent = CustomEvent;
}

