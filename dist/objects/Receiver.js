"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceCall = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const voice_2 = require("@discordjs/voice");
class VoiceMessage {
    constructor(opts) {
    }
}
class UserListener {
    constructor(connection, opts) {
        this.voice_messages = [];
        this.opts = opts;
        this.listening = false;
        this.connection = connection;
    }
    get isSpeaking() {
        return this.connection.receiver.speaking.users.has(this.opts.user.id);
    }
    get lastMessage() {
        if (this.voice_messages.length > 0) {
            let msg = this.voice_messages[0];
            this.voice_messages.shift();
            return msg;
        }
        else
            return null;
    }
    get VoiceMessage() {
        let stream = this.connection.receiver.subscribe(this.opts.user.id, { end: { behavior: voice_2.EndBehaviorType.AfterSilence, duration: 100 } });
        return new VoiceMessage({
            stream: stream,
            user: this.opts.user,
            receiverData: this.connection.receiver.speaking.users.get(this.opts.user.id)
        });
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                setTimeout(resolve, ms);
            });
        });
    }
    listen(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.listening = true;
            while (this.listening) {
                if (this.isSpeaking) {
                    callback(this.VoiceMessage);
                    yield this.sleep(10);
                }
            }
        });
    }
}
class VoiceCall {
    constructor(opts) {
        this.opts = Object.assign({ selfMute: false, selfDeaf: false }, opts);
        this.userListeners = new discord_js_1.Collection();
        /**
         * Fix this to actually check
         */
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
            this.userListeners.set(user.id, new UserListener(this.connection, { user: user }));
        }
        return this;
    }
    removeUsers(...users) {
        for (let user of users) {
            this.userListeners.delete(user.id);
        }
        return this;
    }
    getStreams() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let listeners = 0;
                let messages = [];
                this.userListeners.forEach((listener, k, m) => {
                    let next = true;
                    while (next) {
                        let voice = listener.lastMessage;
                        if (voice) {
                            messages.push(voice);
                        }
                        else {
                            next = false;
                        }
                    }
                    if (m.keys.length > listeners) {
                        listeners++;
                    }
                    else {
                        resolve(messages);
                    }
                });
            });
        });
    }
    receiveStreams() {
        return __asyncGenerator(this, arguments, function* receiveStreams_1() {
            while (true) {
                for (let vm of (yield __await(this.getStreams()))) {
                    yield yield __await(vm);
                }
            }
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            delete this.userListeners;
            this.connection.destroy();
            return;
        });
    }
    record() {
        this.userListeners.forEach(listener => {
            //            listener.listen()
        });
        return this;
    }
    listen(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.userListeners.forEach(listener => {
                listener.listen(callback);
            });
        });
    }
}
exports.VoiceCall = VoiceCall;
//# sourceMappingURL=Receiver.js.map