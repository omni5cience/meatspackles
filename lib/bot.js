// Heavily inspired by Contra's wearefractal/meatbot
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var _ = require('./helpers');

var TMP_DIR = __dirname + '/../tmp/';

function Bot(directory, options, meatspaces){
  EventEmitter.call(this);

  if (options.gifs === undefined) {
    throw new Error('Missing a gif in bot.json');
  }

  this.directory = directory;

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
    var botMessage = this.message;
    this.getGifFrames(meatspace, function(err, frames) {
      meatspace.send({
        text: util.format(meatspace.botMessageFormat, botMessage),
        frames: frames
      });
    });
  }
};

Bot.prototype.getGifFrames = function(meatspace, cb) {
  var gifPath = this.gif;
  var dirName = _.md5(gifPath);
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
    // Command: Example
    // convert -coalesce -resize 200x150 /path/to/image.gif /path/to/frames/out%d.jpeg
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
    var frames = [];
    var error = null;
    for(var i = 0; i < meatspace.frameNumber; i++) {
      try {
        var data = fs.readFileSync(directory+'/out'+i+'.jpeg');
        frames.push(data);
      } catch(e) {
        // quick fix:
        // fill missing frames from gif with less than 10 frames
        // it's not optimal but it send a gif
        // that won't crash the bot
        if (frames.length <= 0) {
            error = e;
            frames = [];
        } else {
          var currentFrames = frames;
          while(meatspace.frameNumber > frames.length) {
            frames = frames.concat(currentFrames);
          }
          frames = frames.slice(0, 10);
        }
        break;
      }
    }

    cb(error, frames);
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
