// Heavily inspired by Contra's wearefractal/meatbot
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var _ = require('./helpers');
var config = require('../config.json');
var http = require('http');


function Bot(directory, options, meatspaces){
  EventEmitter.call(this);

  if (options.gifs === undefined) {
    throw new Error('Missing a gif in bot.json');
  }

  this.directory = directory;
  this.fingerprint = _.md5('I\'m a bert and I approve this message');

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
   if(message.indexOf('!tr-') >= 0) {
     this.babelfish(meatspace, message);
   } else if (this.triggers.test(message)) {
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

Bot.prototype.babelfish = function(meatspace, messageToTranslate) {
  messageToTranslate = messageToTranslate.substring(messageToTranslate.indexOf('!tr-')+4)
  var toLanguage = messageToTranslate.substring(0,2);
  messageToTranslate = messageToTranslate.substring(3);
  if (config.detectLanguageApiKey === undefined) {
    throw new Error('Missing API Key for detect language in config.json');
  } else {
    var detectLanguageString = 'http://ws.detectlanguage.com/0.2/detect?q='+messageToTranslate+'&key='+config.detectLanguageApiKey;
    http.get(detectLanguageString, function(res) {
      res.on('data', function(data) {
        var fromLanguage = JSON.parse(data).data.detections[0].language;
        var translateReqString = 'http://api.mymemory.translated.net/get?q='+messageToTranslate+'&langpair='+fromLanguage+'|'+toLanguage+'&de=todderick@gmail.com';
        http.get(translateReqString, function(res) {
          res.on('data', function(data) {
            meatspace.send({
              message: JSON.parse(data).responseData.translatedText,
              gif: this.gif,
              fingerprint: this.fingerprint
            });
          })
        });
      });
    });
  }

}

module.exports = Bot;
