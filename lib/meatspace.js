// Heavily inspired by Contra's wearefractal/meatbot
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var io = require('socket.io-client');

function Meatspace(config){
  EventEmitter.call(this);
  if (config.apiKey === undefined) {
    throw new Error('Missing API Key in config.json');
  }
  this.address = config.address || 'https://chat.meatspac.es';
  this.messageDelay = config.messageDelay || 5000;
  this.apiKey = config.apiKey;

  this.lastMessage = 0;

  this.socket = io.connect(this.address);
  this.socket.on('message', function messageCB(dict){
    var msg = dict.chat.value; // Pull out the useful bit
    var clockDrift = 30000;

    // Filter out old messages
    var msgDrift = Date.now() - msg.created;
    if (msgDrift > clockDrift) return;

    this.emit('message', msg.message);
  }.bind(this));

  this.on('send', function sendCB(msg){
    // Limit the rate at which we spam messages
    if (Date.now() - this.lastMessage < this.messageDelay) return;

    this.lastMessage = Date.now();

    this.socket.emit('message', {
      apiKey: this.apiKey,
      message: msg.message,
      picture: msg.gif,
      fingerprint: msg.fingerprint
    });

  });

  this.send = this.emit.bind(this, 'send');

  //TODO cleaner solution
  this.setMaxListeners(0);
}
util.inherits(Meatspace, EventEmitter);

module.exports = Meatspace;
