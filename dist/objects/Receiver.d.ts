import { opts, Receiver } from "Receiver";
import { GuildMember } from "discord.js";
declare class VoiceCall implements Receiver {
    private channel;
    opts: opts;
    private connection_opts;
    private connection;
    usersBeingRecorded: {
        [userId: string]: GuildMember;
    };
    private userListeners;
    constructor(opts: opts);
    private get receiver();
    setUsers(...users: GuildMember[]): VoiceCall;
    removeUsers(...users: GuildMember[]): VoiceCall;
    receiveStreams(): Generator<never, void, unknown>;
    record(): this;
}
export { VoiceCall };
//# sourceMappingURL=Receiver.d.ts.map