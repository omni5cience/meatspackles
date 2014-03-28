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

  this.directory = directory;
  this.fingerprint = _.md5(options.fingerprint);
  this.regex = new RegExp(options.trigger,
                          options.caseSensitive ? '': 'i');

  this._messages = options.messages || '';
  this._gifs = options.gifs;

  Object.defineProperty(this, 'message', {get: this.getMessage});
  Object.defineProperty(this, 'gif', {get: this.getGif});

  _.each(meatspaces, function(meatspace) {
    meatspace.on('message', this.handleMessage.bind(this, meatspace));
  }, this);
}

util.inherits(Bot, EventEmitter);

Bot.prototype.handleMessage = function(meatspace, message) {
  if (this.regex.test(message)) {
    meatspace.send({
      message: this.message,
      gif: this.gif,
      fingerprint: this.fingerprint
    });
  }
};

Bot.prototype.getGif = function() {
  var gifPath = path.join(this.directory, _.randomElement(this._gifs));
  return _.dataURI(gifPath);
}

Bot.prototype.getMessage = function() {
  return _.randomElement(this._messages);
}

module.exports = Bot;
