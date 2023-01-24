import { opts, Receiver, Listener, ListenerOpts, VoiceMessageOpts } from "Receiver"
import { joinVoiceChannel } from "@discordjs/voice"
import { GuildMember, VoiceBasedChannel, User } from "discord.js"
import { VoiceConnection, CreateVoiceConnectionOptions, JoinVoiceChannelOptions, VoiceReceiver, EndBehaviorType } from "@discordjs/voice"

class VoiceMessage {
    constructor(opts: VoiceMessageOpts) {
        if (!opts.stream) {

        }
    }
}

class UserListener implements Listener {
    voice_messages: Array<VoiceMessage>
    opts: ListenerOpts
    listening: boolean

    constructor(opts: ListenerOpts) {
        this.voice_messages = []
        this.opts = opts
        this.listening = false
    }

    get isSpeaking() {
        return this.opts.receiver.speaking.users.has(this.opts.user.id)
    }

    get lastMessage() {
        if (this.voice_messages.length > 0) {
            let msg = this.voice_messages[0]
            this.voice_messages.shift()
            return msg
        } else return null
    }

    get VoiceMessage() {
        let stream = this.opts.receiver.subscribe(this.opts.user.id, { end: { behavior: EndBehaviorType.AfterSilence, duration: 100 } } )
        return new VoiceMessage({
            stream: stream,
            user: this.opts.user,
            receiverData: this.opts.receiver.speaking.users.get(this.opts.user.id)
        })
    }

    async sleep(ms: number) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    async listen() {
        this.listening = true

        while (this.listening) {
            if (this.isSpeaking) {
                this.voice_messages.push(this.VoiceMessage)
            }
        }
    }
}

class VoiceCall implements Receiver {
    
    private channel: VoiceBasedChannel
    opts: opts


    private connection_opts: CreateVoiceConnectionOptions & JoinVoiceChannelOptions
    private connection: VoiceConnection
    usersBeingRecorded: {[userId: string]: GuildMember} = {}
    private userListeners: {[userId: string]: UserListener} = {}

    constructor(opts: opts) {

        this.opts = {
            selfMute: false,
            selfDeaf: false,
            ...opts
        }

        /**
         * Fix this to actually check 
         */
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

    *receiveStreams(): Iterator<VoiceMessage> {
        while(true) {
            for (let userKey of Object.keys(this.userListeners)) {
                let listener = this.userListeners[userKey]
                let checkLastMessage = true
                while (checkLastMessage) {
                    let lstMsg = listener.lastMessage
                    if (!lstMsg) {
                        checkLastMessage = false
                    } else yield lstMsg
                }
            
            }
        }
    }


    async destroy() {
        delete this.userListeners
        delete this.usersBeingRecorded
        this.connection.destroy()
        return 
    }

    record() {
        for (let id of Object.keys(this.usersBeingRecorded)) {
            /**
             * UserListener and Recording opts will hold key functionality for getting messages.
             */
            this.userListeners[id] = new UserListener({
                user: this.usersBeingRecorded[id],
                receiver: this.receiver
            })

            this.userListeners[id].listen()
        }

        return this
    }
}


export { VoiceCall }