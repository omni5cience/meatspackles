var fs = require('fs');
var path = require('path');
var Meatspackle = require('./bot');

function requireBots(meatspaces) {
  var bots = {};

  var BOTS_ROOT = path.resolve('bots');
  var botDirectories = fs.readdirSync(BOTS_ROOT).filter(
    function(file){ return fs.statSync('bots/'+file).isDirectory(); }
  );

  // If there's a bot.js require that
  // otherwise require the bot.json and instantiate a bot

  botDirectories.forEach(function(bot) {
    var botDirectory = path.join(BOTS_ROOT, bot);
    var jsPath = path.join(botDirectory, 'bot.js');
    var jsonPath = path.join(botDirectory, 'bot.json');

    if (fs.existsSync(jsPath)) {
      bots[bot] = require(jsPath)(botDirectory, options, meatspaces);
    }
    else if (fs.existsSync(jsonPath)) {
      var options = require(jsonPath);
      bots[bot] = new Meatspackle(botDirectory, options, meatspaces);
    }
  });

  return bots;
}

module.exports = requireBots;
