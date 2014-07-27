// Heavily inspired by Contra's wearefractal/meatbot
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var _ = require('./helpers');

function Bot(directory, options, meatspaces){
  EventEmitter.call(this);

  if (options.fingerprint === undefined) {
    throw new Error('Missing fingerprint in bot.json');
  }
  if (options.gifs === undefined) {
    throw new Error('Missing a gif in bot.json');
  }

  this.directory = directory;
  this.fingerprint = _.md5(options.fingerprint);

  this.triggers = new _.TriggerList(options.trigger, options.caseSensitive);

  this._messages = options.messages || '';
  this._gifs = options.gifs;

  this.messages = _.shuffle(this._messages);
  this.gifs = _.shuffle(this._gifs);

  Object.defineProperty(this, 'message', {get: this.getMessage});
  Object.defineProperty(this, 'gif', {get: this.getGif});

  _.each(meatspaces, function(meatspace) {
    meatspace.on('message', this.handleMessage.bind(this, meatspace));
  }, this);
}

util.inherits(Bot, EventEmitter);

Bot.prototype.handleMessage = function(meatspace, message) {
  if (this.triggers.test(message)) {
    meatspace.send({
      message: this.message,
      gif: this.gif,
      fingerprint: this.fingerprint
    });
  }
};

Bot.prototype.getGif = function() {
  var gif = this.gifs.pop();
  if (!gif) {
    this.gifs = _.shuffle(this._gifs);
    gif = this.gifs.pop();
  }
  var gifPath = path.join(this.directory, gif);
  return _.dataURI(gifPath);
};

Bot.prototype.getMessage = function() {
  var message = this.messages.pop();
  if (!message) {
    this.messages = _.shuffle(this._messages);
    message = this.messages.pop();
  }
  return message;
};

module.exports = Bot;
