export type Role = {
  id: string;
  name: string;
  color: string;
};

export type User = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  roleId: string;
  customStatus?: string;
  bot?: boolean;
};

export type Reaction = {
  emoji: string;
  count: number;
  reacted: boolean;
};

export type Message = {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  reactions: Reaction[];
  pinned?: boolean;
  attachmentImage?: string;
};

export type Channel = {
  id: string;
  name: string;
  type: "text" | "voice" | "announcement";
  unread?: boolean;
  mentions?: number;
  locked?: boolean;
};

export type Category = {
  id: string;
  name: string;
  channels: Channel[];
};

export type Server = {
  id: string;
  name: string;
  icon: string;
  color: string;
  unread?: boolean;
  mention?: boolean;
};

// ── Servers ─────────────────────────────────────────────────────────────────
export const servers: Server[] = [
  { id: "s1", name: "Home", icon: "🏠", color: "#5865F2", unread: false },
  { id: "s2", name: "Galaxia Dev", icon: "🚀", color: "#5865F2", unread: true, mention: true },
  { id: "s3", name: "Art Collective", icon: "🎨", color: "#ED4245", unread: true },
  { id: "s4", name: "Gaming Lounge", icon: "🎮", color: "#57F287", unread: false },
  { id: "s5", name: "Music Vibes", icon: "🎵", color: "#FEE75C", unread: false },
  { id: "s6", name: "Book Club", icon: "📚", color: "#EB459E", unread: false },
];

// ── Roles ────────────────────────────────────────────────────────────────────
export const roles: Role[] = [
  { id: "r1", name: "Admin",       color: "#ED4245" },
  { id: "r2", name: "Moderator",   color: "#FEE75C" },
  { id: "r3", name: "Developer",   color: "#5865F2" },
  { id: "r4", name: "Designer",    color: "#EB459E" },
  { id: "r5", name: "VIP Member",  color: "#57F287" },
  { id: "r6", name: "Member",      color: "#B9BBBE" },
  { id: "r7", name: "Bot",         color: "#5865F2" },
];

// ── Users ────────────────────────────────────────────────────────────────────
export const users: User[] = [
  { id: "u1",  username: "StarAdmin",     discriminator: "0001", avatar: "SA", status: "online",  roleId: "r1", customStatus: "Keeping the peace ⚔️" },
  { id: "u2",  username: "MoonMod",       discriminator: "0042", avatar: "MM", status: "online",  roleId: "r2", customStatus: "Watching the chat 👀" },
  { id: "u3",  username: "CosmicDev",     discriminator: "1337", avatar: "CD", status: "online",  roleId: "r3", customStatus: "Building cool stuff 💻" },
  { id: "u4",  username: "NebulaDev",     discriminator: "2048", avatar: "ND", status: "idle",    roleId: "r3", customStatus: "Coffee break ☕" },
  { id: "u5",  username: "PixelArtist",   discriminator: "9999", avatar: "PA", status: "online",  roleId: "r4", customStatus: "In Figma rn 🎨" },
  { id: "u6",  username: "VoidDesigner",  discriminator: "3141", avatar: "VD", status: "dnd",     roleId: "r4", customStatus: "Do not disturb 🔴" },
  { id: "u7",  username: "AstroVIP",      discriminator: "7777", avatar: "AV", status: "online",  roleId: "r5", customStatus: "Feeling galactic ✨" },
  { id: "u8",  username: "CometVIP",      discriminator: "8008", avatar: "CV", status: "idle",    roleId: "r5" },
  { id: "u9",  username: "GalaxyUser",    discriminator: "1234", avatar: "GU", status: "online",  roleId: "r6" },
  { id: "u10", username: "OrionMember",   discriminator: "5678", avatar: "OM", status: "offline", roleId: "r6" },
  { id: "u11", username: "SiriusMember",  discriminator: "4321", avatar: "SM", status: "offline", roleId: "r6" },
  { id: "u12", username: "GalaxyBot",     discriminator: "0000", avatar: "GB", status: "online",  roleId: "r7", bot: true },
];

// ── Channels ─────────────────────────────────────────────────────────────────
export const categories: Category[] = [
  {
    id: "c1",
    name: "Information",
    channels: [
      { id: "ch1", name: "announcements", type: "announcement", locked: true },
      { id: "ch2", name: "rules",         type: "text",         locked: true },
      { id: "ch3", name: "welcome",       type: "text" },
    ],
  },
  {
    id: "c2",
    name: "General",
    channels: [
      { id: "ch4", name: "general",       type: "text", unread: true, mentions: 2 },
      { id: "ch5", name: "introductions", type: "text", unread: true },
      { id: "ch6", name: "off-topic",     type: "text" },
      { id: "ch7", name: "memes",         type: "text", unread: true, mentions: 1 },
    ],
  },
  {
    id: "c3",
    name: "Development",
    channels: [
      { id: "ch8",  name: "code-review",  type: "text", unread: true },
      { id: "ch9",  name: "help-desk",    type: "text" },
      { id: "ch10", name: "projects",     type: "text" },
      { id: "ch11", name: "resources",    type: "text" },
    ],
  },
  {
    id: "c4",
    name: "Voice Channels",
    channels: [
      { id: "ch12", name: "Lounge",       type: "voice" },
      { id: "ch13", name: "Dev Talk",     type: "voice" },
      { id: "ch14", name: "AFK",          type: "voice" },
    ],
  },
];

// ── Messages ─────────────────────────────────────────────────────────────────
export const messagesByChannel: Record<string, Message[]> = {
  ch4: [
    {
      id: "m1",
      authorId: "u1",
      content: "Welcome everyone to **#general**! 🎉 Make sure you read the rules before chatting.",
      timestamp: "Today at 9:00 AM",
      reactions: [
        { emoji: "👋", count: 12, reacted: false },
        { emoji: "🎉", count: 8,  reacted: true  },
        { emoji: "❤️", count: 5,  reacted: false },
      ],
      pinned: true,
    },
    {
      id: "m2",
      authorId: "u3",
      content: "Hey folks! Just pushed a massive update to the main repo. We now have TypeScript strict mode enabled across the entire codebase 🔥",
      timestamp: "Today at 10:15 AM",
      reactions: [
        { emoji: "🔥", count: 9,  reacted: true  },
        { emoji: "💯", count: 6,  reacted: false },
        { emoji: "😱", count: 3,  reacted: false },
      ],
    },
    {
      id: "m3",
      authorId: "u5",
      content: "Just finished the new design system. Dropping some screenshots in #projects soon. The new color palette is 🤌",
      timestamp: "Today at 10:32 AM",
      reactions: [
        { emoji: "🤩", count: 7,  reacted: false },
        { emoji: "👀", count: 4,  reacted: true  },
      ],
    },
    {
      id: "m4",
      authorId: "u4",
      content: "Anyone up for a code review session later? I've got some tricky async/await patterns I want to get feedback on.",
      timestamp: "Today at 11:00 AM",
      reactions: [
        { emoji: "🙋", count: 3,  reacted: false },
        { emoji: "👍", count: 5,  reacted: true  },
      ],
    },
    {
      id: "m5",
      authorId: "u7",
      content: "Good morning galaxy crew! ✨ Ready for another productive day?",
      timestamp: "Today at 11:22 AM",
      reactions: [
        { emoji: "☀️", count: 6,  reacted: true  },
        { emoji: "💪", count: 4,  reacted: false },
        { emoji: "🚀", count: 11, reacted: true  },
      ],
    },
    {
      id: "m6",
      authorId: "u2",
      content: "Reminder: We have a community call **tonight at 8 PM EST**. Topics include the roadmap, new feature requests, and Q&A. Hope to see everyone there!",
      timestamp: "Today at 12:05 PM",
      reactions: [
        { emoji: "📅", count: 8,  reacted: false },
        { emoji: "✅", count: 14, reacted: true  },
      ],
      pinned: true,
    },
    {
      id: "m7",
      authorId: "u9",
      content: "This community is honestly the best I've been a part of. Super helpful people everywhere 💙",
      timestamp: "Today at 12:30 PM",
      reactions: [
        { emoji: "💙", count: 15, reacted: true  },
        { emoji: "🥹", count: 7,  reacted: false },
        { emoji: "❤️", count: 9,  reacted: false },
      ],
    },
    {
      id: "m8",
      authorId: "u12",
      content: "🤖 **GalaxyBot:** Daily stats — **142** messages sent, **23** new members joined, **98%** uptime. Have a stellar day!",
      timestamp: "Today at 1:00 PM",
      reactions: [
        { emoji: "🤖", count: 4,  reacted: false },
        { emoji: "📊", count: 2,  reacted: false },
      ],
    },
    {
      id: "m9",
      authorId: "u6",
      content: "Just released v2.1.0 of the design tokens library. Check the changelog for breaking changes before updating!",
      timestamp: "Today at 2:15 PM",
      reactions: [
        { emoji: "🎊", count: 6,  reacted: true  },
        { emoji: "📦", count: 3,  reacted: false },
      ],
    },
    {
      id: "m10",
      authorId: "u3",
      content: "Nice work @VoidDesigner! The new tokens are a game changer. Already refactored 3 components 😎",
      timestamp: "Today at 2:40 PM",
      reactions: [
        { emoji: "😎", count: 5,  reacted: false },
        { emoji: "💪", count: 7,  reacted: true  },
      ],
    },
  ],
  ch8: [
    {
      id: "m11",
      authorId: "u3",
      content: "PR #248 is up for review. Refactored the auth module to use JWT refresh tokens properly. Please take a look when you get a chance!",
      timestamp: "Today at 8:45 AM",
      reactions: [
        { emoji: "👀", count: 5, reacted: false },
        { emoji: "💻", count: 3, reacted: true  },
      ],
    },
    {
      id: "m12",
      authorId: "u4",
      content: "Left some comments on PR #248. Overall looks great, just a couple of nit picks on the error handling. LGTM after that!",
      timestamp: "Today at 9:30 AM",
      reactions: [
        { emoji: "🙏", count: 2, reacted: false },
        { emoji: "✅", count: 4, reacted: true  },
      ],
    },
  ],
  ch7: [
    {
      id: "m13",
      authorId: "u9",
      content: "When the tests pass on the first try 😂",
      timestamp: "Today at 3:10 PM",
      reactions: [
        { emoji: "😂", count: 20, reacted: true  },
        { emoji: "🤣", count: 15, reacted: false },
        { emoji: "💀", count: 8,  reacted: true  },
      ],
    },
    {
      id: "m14",
      authorId: "u5",
      content: "Me explaining to my PM why I need 2 more weeks 💀",
      timestamp: "Today at 3:45 PM",
      reactions: [
        { emoji: "💀", count: 25, reacted: true  },
        { emoji: "😭", count: 18, reacted: false },
        { emoji: "🫡", count: 6,  reacted: false },
      ],
    },
  ],
  ch1: [
    {
      id: "m15",
      authorId: "u1",
      content: "📢 **ANNOUNCEMENT** — We just hit **1,000 members!** Thank you all for being part of this amazing community. Big things coming soon! 🚀",
      timestamp: "Yesterday at 6:00 PM",
      reactions: [
        { emoji: "🎉", count: 88, reacted: true  },
        { emoji: "🚀", count: 45, reacted: false },
        { emoji: "❤️", count: 62, reacted: true  },
        { emoji: "🥳", count: 33, reacted: false },
      ],
      pinned: true,
    },
  ],
  ch5: [
    {
      id: "m16",
      authorId: "u8",
      content: "Hey everyone! I'm CometVIP — a full-stack dev from Berlin 🇩🇪. Excited to be part of this community! I mostly work with Go and React.",
      timestamp: "Today at 7:00 AM",
      reactions: [
        { emoji: "👋", count: 9,  reacted: true  },
        { emoji: "🎉", count: 5,  reacted: false },
        { emoji: "🤝", count: 7,  reacted: false },
      ],
    },
  ],
};

// ── Emoji Picker Options ──────────────────────────────────────────────────────
export const quickEmojis = ["👍","❤️","🎉","🔥","😂","😮","😢","🚀","💯","✅","👀","🤩","💙","🙏","⭐","🤣","😎","💪","🥹","🫡"];
