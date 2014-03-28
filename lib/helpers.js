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

module.exports = {
  md5: md5Hash,
  dataURI: dataURI,
  randomElement: randomElement,
  each: each
}

