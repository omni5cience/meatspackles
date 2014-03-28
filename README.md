meatspackles
============

Meatspac.es Bots

Heavily inspired by [wearefractal/meatbot](https://github.com/wearefractal/meatbot) and [taotetek/meatmonsters](https://github.com/taotetek/meatmonsters).

Submitting a Bot
================

To submit a bot create a new folder in the `/bots` directory with:
- A `bot.json` file
- Relevant GIFs

`bot.json`
==========

```JSON
{
  "trigger": "!metal",    // A regex or string to look for in messages
  "caseSensitive": false, // [Optional] Defaults to false

  "messages": ["METAL!"],         // [Optional] A string or array of strings
  "gifs": ["metalhand.gif", ...], // [Optional] A path or array of paths

  "fingerprint": "metalbot", // A unique identifier for the bot
}
```


TODO
====

- [ ] Automated restarts
- [ ] Actual documentation
- [ ] Tests?
- [ ] Generate bot listing (GH-Pages)
- [ ] Meatmonsters emulation (with in band enabling for when they go down)
- [ ] More custom bots
