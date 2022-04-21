const moment = require('moment');
const { BOT_NAME } = require('../constants');

function createMessage(text, username = BOT_NAME) {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
  };
}

module.exports = { createMessage };
