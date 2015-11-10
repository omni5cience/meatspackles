// Heavily inspired by Contra's wearefractal/meatbot
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var io = require('socket.io-client');
var _ = require('./helpers');

function Meatspace(config){
  EventEmitter.call(this);

  this.address = config.address || 'https://chat.meatspac.es';
  this.messageDelay = config.messageDelay || 5000;
  this.frameNumber = config.frameNumber || 10;
  this.gifSize = config.gifSize || [200, 150];
  this.botMessageFormat = config.botMessageFormat || '%s';

  this.socket = io.connect(this.address);

  this.socket.on('connect', function() {
    this.socket.emit('fingerprint', _.md5('I\'m a butt and I approve this message'));
    this.socket.emit('join', 'jpg');
  }.bind(this));

  this.userId = 0;
  this.socket.on('userid', function(userId) {
    this.userId = userId;
  }.bind(this));

  this.socket.on('chat', function messageCB(messageData){
    var clockDrift = 30000;

    // Filter out old messages
    var msgDrift = Date.now() - messageData.sent;
    if (msgDrift > clockDrift) return;

    this.emit('message', messageData);
  }.bind(this));

  this.lastMessage = 0;
  this.on('send', function sendCB(messageData){
    // Limit the rate at which we spam messages
    if (Date.now() - this.lastMessage < this.messageDelay) return;

    this.lastMessage = Date.now();

    this.socket.emit('chat', {
      text: messageData.text,
      format: 'image/jpeg'
    }, messageData.frames);
  });

  this.send = this.emit.bind(this, 'send');

  //TODO cleaner solution
  this.setMaxListeners(0);
}
util.inherits(Meatspace, EventEmitter);

module.exports = Meatspace;
