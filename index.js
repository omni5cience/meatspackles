var Meatspace = require('./lib/meatspace');
var meatspackles = require('./lib/meatspackles')
var bots;

function setupBots(){
  var meatspaces = [];
  var configs = require('config.json');
  configs = configs instanceof Array
    ? configs
    : [configs];

  configs.forEach(function(config){
    meatspaces.push(new Meatspace(config));
  });

  bots = meatspackles(meatspaces);
}

setupBots();

