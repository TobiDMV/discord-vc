"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceCall = void 0;
const voice_1 = require("@discordjs/voice");
const voice_2 = require("@discordjs/voice");
class VoiceMessage {
    constructor(opts) {
    }
}
class UserListener {
    constructor(opts) {
        this.voice_messages = [];
        this.opts = opts;
    }
    get isSpeaking() {
        return this.opts.receiver.speaking.users.has(this.opts.user.id);
    }
    get VoiceMessage() {
        return new VoiceMessage({
            stream: this.opts.receiver.subscribe(this.opts.user.id, { end: { behavior: voice_2.EndBehaviorType.AfterSilence, duration: 100 } }),
            user: this.opts.user,
            receiverData: this.opts.receiver.speaking.users.get(this.opts.user.id)
        });
    }
}
class VoiceCall {
    constructor(opts) {
        this.opts = Object.assign({ selfMute: false, selfDeaf: false }, opts);
        this.channel = opts.user.voice.channel;
        this.connection_opts = {
            selfDeaf: this.opts.selfDeaf,
            selfMute: this.opts.selfMute,
            guildId: this.opts.guild.id,
            channelId: this.channel.id,
            adapterCreator: this.opts.guild.voiceAdapterCreator
        };
        this.connection = (0, voice_1.joinVoiceChannel)(this.connection_opts);
    }
    get receiver() {
        return this.connection.receiver;
    }
    setUsers(...users) {
        for (let user of users) {
            this.usersBeingRecorded[user.id] = this.opts.guild.members.cache.get(user.id);
        }
        return this;
    }
    removeUsers(...users) {
        for (let user of users) {
            if (this.userListeners[user.id]) {
                delete this.userListeners[user.id];
            }
            if (this.usersBeingRecorded[user.id]) {
                delete this.usersBeingRecorded[user.id];
            }
        }
        return this;
    }
    *receiveStreams() {
    }
    record() {
        return this;
    }
}
exports.VoiceCall = VoiceCall;
//# sourceMappingURL=Receiver.js.map