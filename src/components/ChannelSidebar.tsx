import React, { useState } from "react";
import { categories, Channel, users } from "../data/discordData";

interface Props {
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
  currentUserId: string;
}

const ChannelIcon: React.FC<{ type: Channel["type"] }> = ({ type }) => {
  if (type === "voice")
    return (
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm-2 6a5 5 0 0010 0H17a7 7 0 01-14 0h2z" />
      </svg>
    );
  if (type === "announcement")
    return (
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
      </svg>
    );
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  );
};

const LockIcon = () => (
  <svg className="w-3 h-3 text-[#72767d]" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    online: "bg-[#57F287]",
    idle: "bg-[#FEE75C]",
    dnd: "bg-[#ED4245]",
    offline: "bg-[#72767d]",
  };
  return (
    <span className={`w-3 h-3 rounded-full border-2 border-[#2f3136] ${colors[status] ?? "bg-[#72767d]"} flex-shrink-0`} />
  );
};

const ChannelSidebar: React.FC<Props> = ({ activeChannelId, onSelectChannel, currentUserId }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const currentUser = users.find((u) => u.id === currentUserId)!;

  const toggle = (catId: string) =>
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));

  return (
    <div className="w-60 bg-[#2f3136] flex flex-col flex-shrink-0 h-full">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-black/20 shadow-sm cursor-pointer hover:bg-[#35393f] transition-colors flex-shrink-0">
        <span className="text-white font-bold text-[15px] truncate">🚀 Galaxia Dev</span>
        <svg className="w-5 h-5 text-[#b9bbbe]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-[#202225]">
        {categories.map((cat) => (
          <div key={cat.id} className="mb-1">
            {/* Category Header */}
            <button
              className="w-full flex items-center px-4 py-1 group"
              onClick={() => toggle(cat.id)}
            >
              <svg
                className={`w-3 h-3 text-[#96989d] mr-1 transition-transform duration-150 ${collapsed[cat.id] ? "-rotate-90" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-[11px] font-bold uppercase text-[#96989d] tracking-wide group-hover:text-[#dcddde] flex-1 text-left">
                {cat.name}
              </span>
              <span className="text-[#96989d] text-lg leading-none hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">+</span>
            </button>

            {/* Channels */}
            {!collapsed[cat.id] &&
              cat.channels.map((ch) => {
                const isActive = ch.id === activeChannelId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => ch.type !== "voice" && onSelectChannel(ch.id)}
                    className={`w-full flex items-center gap-1.5 px-2 mx-2 py-[5px] rounded cursor-pointer transition-colors duration-100 group
                      ${isActive
                        ? "bg-[#42464d] text-white"
                        : ch.unread
                        ? "text-white hover:bg-[#393c43]"
                        : "text-[#96989d] hover:bg-[#393c43] hover:text-[#dcddde]"
                      }`}
                    style={{ width: "calc(100% - 16px)" }}
                  >
                    <span className={`${isActive ? "text-[#dcddde]" : ch.unread ? "text-[#dcddde]" : "text-[#72767d] group-hover:text-[#dcddde]"}`}>
                      <ChannelIcon type={ch.type} />
                    </span>
                    <span className={`text-[15px] truncate flex-1 text-left font-${ch.unread && !isActive ? "semibold" : "medium"}`}>
                      {ch.name}
                    </span>
                    {ch.locked && <LockIcon />}
                    {ch.mentions && ch.mentions > 0 && (
                      <span className="ml-auto bg-[#ED4245] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                        {ch.mentions}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {/* User Panel */}
      <div className="h-14 bg-[#292b2f] px-2 flex items-center gap-2 flex-shrink-0">
        <div className="relative">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "#5865F2" }}
          >
            {currentUser.avatar}
          </div>
          <StatusDot status={currentUser.status} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold truncate">{currentUser.username}</div>
          <div className="text-[#b9bbbe] text-[11px] truncate">#{currentUser.discriminator}</div>
        </div>
        <div className="flex items-center gap-1">
          <button title="Mute" className="w-8 h-8 rounded flex items-center justify-center text-[#b9bbbe] hover:bg-[#36393f] hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm-2 6a5 5 0 0010 0H17a7 7 0 01-14 0h2z" clipRule="evenodd"/>
            </svg>
          </button>
          <button title="Settings" className="w-8 h-8 rounded flex items-center justify-center text-[#b9bbbe] hover:bg-[#36393f] hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebar;
