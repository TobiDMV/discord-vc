import { opts, Receiver, Listener, ListenerOpts, VoiceMessageOpts } from "Receiver"
import { joinVoiceChannel } from "@discordjs/voice"
import { GuildMember, VoiceBasedChannel, User, Collection, Faces } from "discord.js"
import { VoiceConnection, CreateVoiceConnectionOptions, JoinVoiceChannelOptions, VoiceReceiver, EndBehaviorType } from "@discordjs/voice"

class VoiceMessage {
    constructor(opts: VoiceMessageOpts) {

    }
}

class UserListener implements Listener {
    voice_messages: Array<VoiceMessage>
    opts: ListenerOpts
    listening: boolean
    connection: VoiceConnection

    constructor(connection: VoiceConnection, opts: ListenerOpts) {
        this.voice_messages = []
        this.opts = opts
        this.listening = false
        this.connection = connection
    }

    get isSpeaking() {
        return this.connection.receiver.speaking.users.has(this.opts.user.id)
    }

    get lastMessage() {
        if (this.voice_messages.length > 0) {
            let msg = this.voice_messages[0]
            this.voice_messages.shift()
            return msg
        } else return null
    }

    get VoiceMessage() {
        let stream = this.connection.receiver.subscribe(this.opts.user.id, { end: { behavior: EndBehaviorType.AfterSilence, duration: 100 } } )
        return new VoiceMessage({
            stream: stream,
            user: this.opts.user,
            receiverData: this.connection.receiver.speaking.users.get(this.opts.user.id)
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

    private userListeners: Collection<string, UserListener>

    constructor(opts: opts) {

        this.opts = {
            selfMute: false,
            selfDeaf: false,
            ...opts
        }


        this.userListeners = new Collection()

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
            this.userListeners.set(user.id, new UserListener(this.connection, { user: user }))

        }
        return this
    }

    removeUsers(...users: GuildMember[]): VoiceCall {
        for (let user of users) {
            this.userListeners.delete(user.id)
        }
        return this
    }

    private async getStreams(): Promise<VoiceMessage[]> {
        return new Promise((resolve, reject) => {
            let listeners = 0
            let messages: VoiceMessage[] = []
            this.userListeners.forEach((listener, k, m) => {
                let next = true

                while (next) {
                    let voice = listener.lastMessage
                    if (voice) {
                        messages.push(voice)
                    } else { 
                        next = false
                    }
                }
                
                if (m.keys.length > listeners) { listeners++ }
                else { resolve(messages) }
            })

        })
    }

    async *receiveStreams(): AsyncGenerator<VoiceMessage> {
        while (true) {
            for (let vm of (await this.getStreams())) {
                yield vm
            }
        }
    }

    async destroy() {
        delete this.userListeners
        this.connection.destroy()
        return 
    }

    record() {
        this.userListeners.forEach(listener => {
            listener.listen()
        })
        return this
    }
}

export { VoiceCall }