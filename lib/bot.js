// Heavily inspired by Contra's wearefractal/meatbot
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var crypto = require('crypto');
var TMP_DIR = __dirname + '/../tmp/';
var _ = require('./helpers');

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

Bot.prototype.handleMessage = function(meatspace, messageData) {
  var message = messageData.text;
  if (this.triggers.test(message)) {
    var bot = this;
    this.getGifFrames(meatspace, function(err, frames) {
      meatspace.send({
        text: bot.message,
        frames: frames,
        fingerprint: bot.fingerprint
      });
    });
  }
};

Bot.prototype.getGifFrames = function(meatspace, cb) {
  var gifPath = this.gif;
  var bot = this;

  var dirName = crypto.createHash('md5').update(gifPath).digest('hex');
  var directory = TMP_DIR + dirName;

  fs.mkdir(directory, function(err) {
    if (err) {
      // easiest way to check if the directory already exists?
      if (err.code == 'EEXIST') {
        return doDirectory(directory);
      }
      return cb(err);
    }

    var gifWidth = meatspace.gifSize[0];
    var gifHeight = meatspace.gifSize[1];
    var commandFormat = 'convert -coalesce -resize %sx%s %s %s/out%d.jpeg';
    var command = util.format(commandFormat, gifWidth, gifHeight, gifPath, directory);

    child_process.exec(command, function(err, stdout, stderr) {
      if (err) {
        return cb(err)
      }
      doDirectory(directory);
    })
  });

  function doDirectory(directory) {
    var arr = [];
    for(var i = 0; i < meatspace.frameNumber; i++) {
      var data = fs.readFileSync(directory+'/out'+i+'.jpeg');
      arr.push(data);
    }

    cb(null, arr);
  }
};

Bot.prototype.getGif = function() {
  var gif = this.gifs.pop();
  if (!gif) {
    this.gifs = _.shuffle(this._gifs);
    gif = this.gifs.pop();
  }
  var gifPath = path.join(this.directory, gif);
  return gifPath;
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
