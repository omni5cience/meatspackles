meatspackles
============

Meatspac.es Bots

Heavily inspired by [wearefractal/meatbot](https://github.com/wearefractal/meatbot) and [taotetek/meatmonsters](https://github.com/taotetek/meatmonsters).

Submitting a Bot
================

To submit a bot create a new folder in the `/bots` directory with:
- A `bot.json` file
- Relevant GIFs – GIFs should be 135 x 101px and loop unless they're completely static.
  (You can use http://ezgif.com/resize to resize GIFs if you need to.)

`bot.json`
==========

```js
{
  "trigger": "!metal",         // A regex or string to look for in messages
  "caseSensitive": false,      // [Optional] Defaults to false
  "gifs": ["metal1.gif", ...]  // [Optional] A path or array of paths
  "messages": ["METAL!"],      // [Optional] A string or array of strings
}
```


TODO
====

- [x] Automated restarts
- [ ] Actual documentation
- [ ] Tests?
- [ ] Generate bot listing (GH-Pages)
- [x] Meatmonsters emulation (thanks @gggritso)
- [ ] More custom bots
- [ ] Compatibility with [meatspace-chat-v2](https://github.com/meatspaces/meatspace-chat-v2)
