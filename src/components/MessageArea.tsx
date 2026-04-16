import React, { useState, useRef, useEffect } from "react";
import {
  Message,
  Reaction,
  users,
  roles,
  messagesByChannel,
  quickEmojis,
  categories,
} from "../data/discordData";

interface Props {
  channelId: string;
  currentUserId: string;
}

const getUserById = (id: string) => users.find((u) => u.id === id);
const getRoleById = (id: string) => roles.find((r) => r.id === id);

const getRoleColor = (userId: string) => {
  const user = getUserById(userId);
  if (!user) return "#b9bbbe";
  const role = getRoleById(user.roleId);
  return role?.color ?? "#b9bbbe";
};

const getChannelInfo = (channelId: string) => {
  for (const cat of categories) {
    const ch = cat.channels.find((c) => c.id === channelId);
    if (ch) return ch;
  }
  return null;
};

const renderMarkdown = (text: string) => {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    // Handle @mentions
    const mentionParts = part.split(/(@\w+)/g);
    return (
      <span key={i}>
        {mentionParts.map((mp, j) =>
          mp.startsWith("@") ? (
            <span key={j} className="bg-[#5865f2]/30 text-[#dee0fc] rounded px-0.5 cursor-pointer hover:bg-[#5865f2]/60">
              {mp}
            </span>
          ) : (
            mp
          )
        )}
      </span>
    );
  });
};

interface ReactionBubbleProps {
  reaction: Reaction;
  onToggle: () => void;
}

const ReactionBubble: React.FC<ReactionBubbleProps> = ({ reaction, onToggle }) => (
  <button
    onClick={onToggle}
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm border transition-all duration-150 ${
      reaction.reacted
        ? "bg-[#5865f2]/30 border-[#5865f2] text-[#dee0fc]"
        : "bg-[#2f3136] border-[#42464d] text-[#b9bbbe] hover:bg-[#36393f] hover:border-[#72767d]"
    }`}
  >
    <span>{reaction.emoji}</span>
    <span className="text-xs font-semibold">{reaction.count}</span>
  </button>
);

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-8 right-0 bg-[#18191c] border border-[#42464d] rounded-xl shadow-2xl p-3 z-50 w-64"
    >
      <div className="text-[#96989d] text-xs font-semibold uppercase tracking-wide mb-2 px-1">Quick Reactions</div>
      <div className="grid grid-cols-5 gap-1">
        {quickEmojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => { onSelect(emoji); onClose(); }}
            className="w-10 h-10 text-xl flex items-center justify-center rounded-lg hover:bg-[#36393f] transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

const MessageArea: React.FC<Props> = ({ channelId, currentUserId }) => {
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const copy: Record<string, Message[]> = {};
    for (const key in messagesByChannel) {
      copy[key] = messagesByChannel[key].map((m) => ({ ...m, reactions: m.reactions.map((r) => ({ ...r })) }));
    }
    return copy;
  });
  const [inputValue, setInputValue] = useState("");
  const [emojiPickerFor, setEmojiPickerFor] = useState<string | null>(null);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const channelMessages = messages[channelId] ?? [];
  const channel = getChannelInfo(channelId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelId, channelMessages.length]);

  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) => {
      const updated = { ...prev };
      updated[channelId] = (updated[channelId] ?? []).map((msg) => {
        if (msg.id !== msgId) return msg;
        const existing = msg.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          return {
            ...msg,
            reactions: msg.reactions.map((r) =>
              r.emoji === emoji
                ? { ...r, reacted: !r.reacted, count: r.reacted ? r.count - 1 : r.count + 1 }
                : r
            ).filter((r) => r.count > 0),
          };
        } else {
          return { ...msg, reactions: [...msg.reactions, { emoji, count: 1, reacted: true }] };
        }
      });
      return updated;
    });
  };

  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      authorId: currentUserId,
      content: text,
      timestamp: "Just now",
      reactions: [],
    };
    setMessages((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] ?? []), newMsg],
    }));
    setInputValue("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Group consecutive messages from the same author
  const groupedMessages = channelMessages.reduce<
    { msg: Message; isGrouped: boolean }[]
  >((acc, msg, i) => {
    const prev = channelMessages[i - 1];
    const isGrouped = !!prev && prev.authorId === msg.authorId && msg.timestamp === prev.timestamp;
    acc.push({ msg, isGrouped });
    return acc;
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-[#36393f] min-w-0 h-full">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center gap-2 border-b border-black/20 shadow-sm flex-shrink-0 bg-[#36393f]">
        <span className="text-[#8e9297]">
          {channel?.type === "announcement" ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          )}
        </span>
        <span className="text-white font-bold text-base">{channel?.name ?? "unknown"}</span>
        <div className="w-px h-6 bg-[#42464d] mx-2" />
        <span className="text-[#b9bbbe] text-sm truncate">
          {channelId === "ch4" && "The main hub for all community chat"}
          {channelId === "ch8" && "Share your code and get feedback from the community"}
          {channelId === "ch7" && "Only the finest dev memes allowed 😂"}
          {channelId === "ch1" && "Important server announcements — read-only"}
          {channelId === "ch5" && "Introduce yourself to the community!"}
          {!["ch4","ch8","ch7","ch1","ch5"].includes(channelId) && "Welcome to the channel!"}
        </span>
        <div className="ml-auto flex items-center gap-3 text-[#b9bbbe]">
          <button title="Search" className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button title="Inbox" className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </button>
          <button title="Members" className="hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5 scrollbar-thin scrollbar-thumb-[#202225]">
        {/* Channel intro */}
        <div className="mb-6 pb-4 border-b border-[#42464d]">
          <div className="w-16 h-16 bg-[#42464d] rounded-full flex items-center justify-center text-3xl mb-3">
            {channel?.type === "announcement" ? "📢" : channel?.type === "voice" ? "🔊" : "#"}
          </div>
          <h2 className="text-white text-2xl font-bold mb-1">Welcome to #{channel?.name}!</h2>
          <p className="text-[#b9bbbe] text-sm">This is the start of the #{channel?.name} channel.</p>
        </div>

        {channelMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#72767d]">
            <span className="text-5xl mb-3">🌌</span>
            <p className="text-lg font-semibold text-[#96989d]">No messages yet</p>
            <p className="text-sm">Be the first to say something!</p>
          </div>
        )}

        {groupedMessages.map(({ msg, isGrouped }) => {
          const author = getUserById(msg.authorId);
          const roleColor = getRoleColor(msg.authorId);
          const isHovered = hoveredMsg === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 px-2 py-0.5 rounded-md relative group transition-colors duration-75 ${isHovered ? "bg-[#32353b]" : "hover:bg-[#32353b]"}`}
              onMouseEnter={() => setHoveredMsg(msg.id)}
              onMouseLeave={() => setHoveredMsg(null)}
            >
              {/* Avatar or timestamp spacer */}
              <div className="w-10 flex-shrink-0 flex items-start justify-center pt-0.5">
                {!isGrouped ? (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: roleColor === "#B9BBBE" ? "#5865F2" : roleColor }}
                  >
                    {author?.avatar ?? "??"}
                  </div>
                ) : (
                  <span className="text-[10px] text-[#72767d] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {msg.timestamp.includes("at") ? msg.timestamp.split("at")[1].trim() : ""}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {!isGrouped && (
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span
                      className="font-semibold text-sm cursor-pointer hover:underline"
                      style={{ color: roleColor }}
                    >
                      {author?.username ?? "Unknown"}
                    </span>
                    {author?.bot && (
                      <span className="bg-[#5865f2] text-white text-[10px] font-bold px-1.5 py-0 rounded-sm leading-5">BOT</span>
                    )}
                    <span className="text-[#72767d] text-xs">{msg.timestamp}</span>
                    {msg.pinned && (
                      <span className="text-[#faa61a] text-[10px] flex items-center gap-0.5">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2.586l1.707 1.707A1 1 0 0117 11h-1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5H3a1 1 0 01-.707-1.707L4 7.586V5z"/>
                        </svg>
                        pinned
                      </span>
                    )}
                  </div>
                )}

                <p className="text-[#dcddde] text-sm leading-relaxed break-words">
                  {renderMarkdown(msg.content)}
                </p>

                {/* Reactions */}
                {msg.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {msg.reactions.map((r) => (
                      <ReactionBubble
                        key={r.emoji}
                        reaction={r}
                        onToggle={() => toggleReaction(msg.id, r.emoji)}
                      />
                    ))}
                    <button
                      onClick={() => setEmojiPickerFor(msg.id)}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-sm border border-transparent text-[#72767d] hover:bg-[#36393f] hover:text-[#dcddde] hover:border-[#42464d] transition-all"
                    >
                      😊 +
                    </button>
                  </div>
                )}
              </div>

              {/* Message Actions (hover toolbar) */}
              <div className={`absolute right-2 -top-4 bg-[#18191c] border border-[#42464d] rounded-lg shadow-lg flex items-center gap-0.5 p-0.5 transition-opacity duration-100 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <button
                  title="Add Reaction"
                  onClick={() => setEmojiPickerFor(msg.id)}
                  className="w-8 h-8 rounded flex items-center justify-center text-[#b9bbbe] hover:bg-[#36393f] hover:text-white transition-colors text-base"
                >
                  😊
                </button>
                <button title="Reply" className="w-8 h-8 rounded flex items-center justify-center text-[#b9bbbe] hover:bg-[#36393f] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button title="More" className="w-8 h-8 rounded flex items-center justify-center text-[#b9bbbe] hover:bg-[#36393f] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>

              {/* Emoji Picker */}
              {emojiPickerFor === msg.id && (
                <div className="absolute right-2 top-6 z-50">
                  <EmojiPicker
                    onSelect={(emoji) => toggleReaction(msg.id, emoji)}
                    onClose={() => setEmojiPickerFor(null)}
                  />
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Message Input */}
      <div className="px-4 pb-6 pt-2 flex-shrink-0">
        <div className="bg-[#40444b] rounded-xl flex items-center gap-2 px-4 py-3">
          <button title="Add attachment" className="text-[#b9bbbe] hover:text-white transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channel?.name ?? "channel"}`}
            className="flex-1 bg-transparent text-[#dcddde] placeholder-[#72767d] text-sm outline-none"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <button title="GIF" className="text-[#b9bbbe] hover:text-white transition-colors text-xs font-bold border border-[#72767d] rounded px-1">
              GIF
            </button>
            <button title="Sticker" className="text-[#b9bbbe] hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              title="Send"
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className={`transition-colors ${inputValue.trim() ? "text-[#5865f2] hover:text-[#dee0fc]" : "text-[#72767d]"}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;
