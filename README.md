# ABANDONED
This contains some code that was intended to route callframes into one location, so that it would be easy to query them. It never quite worked correctly and i have since abandoned the project to learn rust. I may come back to this in the future but for now it is being archived.

# Discord-vc

Discord-vc is a wrapper of the @discord/voice library. The intended purpose is to make it easier for people who are new to working with Discord Voice Chat features in node.js.

## Main Features

- Easy joining of a voice channels, as well as easy implementation when receiving and sending data
 (This is the basic, main goal)

### Possible future features

- Easy audio processing, converting words to messages (will likely be powered by deepgram, possibly google)

- The ability to save speech as is, essentially combining streams to create one stream from all of the users talking

- A command parser, using NLP

- Ability to easily respond to inputs in voice with files

- TTS capabilities to make custom responses (I am not sure what this will be powered by, i want it to sound nice and not super robot-y)



## Installation
```
npm install https://github.com/TobiDMV/discord-vc.git
```

CREDITS to @discord/voice for giving me the inspiration to create this, and using their examples to learn more about this!
