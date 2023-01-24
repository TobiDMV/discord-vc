import { opts, Receiver, Listener, ListenerOpts, VoiceMessageOpts } from "Receiver"
import { joinVoiceChannel } from "@discordjs/voice"
import { GuildMember, VoiceBasedChannel, User } from "discord.js"
import { VoiceConnection, CreateVoiceConnectionOptions, JoinVoiceChannelOptions, VoiceReceiver, EndBehaviorType } from "@discordjs/voice"

class VoiceMessage {
    constructor(opts: VoiceMessageOpts) {

    }
}

class UserListener implements Listener {
    voice_messages: Array<VoiceMessage>
    opts: ListenerOpts

    constructor(opts: ListenerOpts) {
        this.voice_messages = []
        this.opts = opts
    }

    get isSpeaking() {
        return this.opts.receiver.speaking.users.has(this.opts.user.id)
    }

    get VoiceMessage() {
        return new VoiceMessage({
            stream: this.opts.receiver.subscribe(this.opts.user.id, { end: { behavior: EndBehaviorType.AfterSilence, duration: 100 } }),
            user: this.opts.user,
            receiverData: this.opts.receiver.speaking.users.get(this.opts.user.id)
        })
    }
}

class VoiceCall implements Receiver {
    
    private channel: VoiceBasedChannel
    opts: opts


    private connection_opts: CreateVoiceConnectionOptions & JoinVoiceChannelOptions
    private connection: VoiceConnection
    usersBeingRecorded: {[userId: string]: GuildMember}
    private userListeners: {[userId: string]: UserListener}

    constructor(opts: opts) {

        this.opts = {
            selfMute: false,
            selfDeaf: false,
            ...opts
        }

        this.channel = opts.user.voice.channel
        
        this.connection_opts = {
            selfDeaf: this.opts.selfDeaf,
            selfMute: this.opts.selfMute,
            guildId: this.opts.guild.id,
            channelId: this.channel.id,
            adapterCreator: this.opts.guild.voiceAdapterCreator
        }

        this.connection = joinVoiceChannel(this.connection_opts)

    }

    private get receiver(): VoiceReceiver {
        return this.connection.receiver
    }

    setUsers(...users: GuildMember[]): VoiceCall {
        for (let user of users) {
            this.usersBeingRecorded[user.id] = this.opts.guild.members.cache.get(user.id)
        }
        return this
    }

    removeUsers(...users: GuildMember[]): VoiceCall {
        for (let user of users) {
            if (this.userListeners[user.id]) { delete this.userListeners[user.id] }
            if (this.usersBeingRecorded[user.id]) { delete this.usersBeingRecorded[user.id] }
        }
        return this
    }

    *receiveStreams() {

    }

    record() {
        
        return this
    }
}


export { VoiceCall }