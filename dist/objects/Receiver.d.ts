import { opts, Receiver, VoiceMessageOpts } from "Receiver";
import { GuildMember } from "discord.js";
declare class VoiceMessage {
    constructor(opts: VoiceMessageOpts);
}
declare class VoiceCall implements Receiver {
    private channel;
    opts: opts;
    private connection_opts;
    private connection;
    private userListeners;
    constructor(opts: opts);
    private get receiver();
    setUsers(...users: GuildMember[]): VoiceCall;
    removeUsers(...users: GuildMember[]): VoiceCall;
    private getStreams;
    receiveStreams(): AsyncGenerator<VoiceMessage>;
    destroy(): Promise<void>;
    record(): this;
}
export { VoiceCall };
//# sourceMappingURL=Receiver.d.ts.map