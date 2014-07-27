// Helpers
var crypto = require('crypto');
var fs = require('fs');
var mime = require('mime');

function md5Hash(string){
  return crypto
    .createHash('md5')
    .update(string)
    .digest('hex');
}

function dataURI(path){
  if (!path || !path.trim || path.trim() === '') {
    return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  }
  if (fs.existsSync(path)) {
    var content = fs.readFileSync(path).toString('base64');
    var type = mime.lookup(path);
    return 'data:' + type + ';base64,' + content;
  } else {
    throw new Error('File not found at: ' + path);
  }
}

function randomElement(array) {
  if (!(array instanceof Array)) return array;

  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function each(array, callback, context) {
  if (array instanceof Array) {
    array.forEach(callback, context);
  } else {
    callback.call(context, array);
  }
}

function shuffle(array) {
  var index = 0;
  var shuffled = [];

  if (!(array instanceof Array)) return [array];

  array.forEach(function(value) {
    var rand = Math.floor(Math.random() * ++index);
    shuffled[index - 1] = shuffled[rand];
    shuffled[rand] = value;
  });

  return shuffled;
}

function TriggerList(triggers, caseSensitive) {
  if (!(triggers instanceof Array)) triggers = [triggers];

  this._triggers = [];
  triggers.forEach(function(trigger) {
    this._triggers.push(new RegExp(trigger, caseSensitive ? '': 'i'));
  }, this);
}

TriggerList.prototype.test = function(message) {
  return this._triggers.reduce(function(matches, trigger) {
    return (matches || trigger.test(message));
  }, false);
};

module.exports = {
  md5: md5Hash,
  dataURI: dataURI,
  randomElement: randomElement,
  each: each,
  shuffle: shuffle,
  TriggerList: TriggerList
};

