import React, { useState } from "react";
import { users, roles, User } from "../data/discordData";

const StatusDot: React.FC<{ status: User["status"]; size?: "sm" | "md" }> = ({
  status,
  size = "sm",
}) => {
  const colors: Record<string, string> = {
    online: "#57F287",
    idle: "#FEE75C",
    dnd: "#ED4245",
    offline: "#72767d",
  };
  const s = size === "md" ? "w-3.5 h-3.5" : "w-3 h-3";
  const border = size === "md" ? "border-[2.5px] border-[#2f3136]" : "border-2 border-[#2f3136]";

  if (status === "idle") {
    return (
      <span
        className={`${s} ${border} rounded-full flex-shrink-0 flex items-center justify-center`}
        style={{ backgroundColor: colors.idle }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#2f3136", marginLeft: "2px", marginBottom: "2px" }}
        />
      </span>
    );
  }
  if (status === "dnd") {
    return (
      <span
        className={`${s} ${border} rounded-full flex-shrink-0 flex items-center justify-center`}
        style={{ backgroundColor: colors.dnd }}
      >
        <span className="w-1.5 h-0.5 rounded-full bg-white" />
      </span>
    );
  }

  return (
    <span
      className={`${s} ${border} rounded-full flex-shrink-0`}
      style={{ backgroundColor: colors[status] ?? "#72767d" }}
    />
  );
};

const statusLabel: Record<User["status"], string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [tooltip, setTooltip] = useState(false);
  const role = roles.find((r) => r.id === user.roleId);
  const roleColor = role?.color ?? "#b9bbbe";
  const avatarBg = roleColor === "#B9BBBE" ? "#5865F2" : roleColor;

  return (
    <div
      className="relative flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[#3a3d44] transition-colors group"
      onMouseEnter={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: user.status === "offline" ? "#72767d" : avatarBg, opacity: user.status === "offline" ? 0.6 : 1 }}
        >
          {user.avatar}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5">
          <StatusDot status={user.status} />
        </div>
      </div>

      {/* Name */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span
            className={`text-sm font-medium truncate ${
              user.status === "offline" ? "text-[#72767d]" : "text-[#dcddde] group-hover:text-white"
            }`}
            style={user.status !== "offline" ? { color: roleColor } : {}}
          >
            {user.username}
          </span>
          {user.bot && (
            <span className="bg-[#5865f2] text-white text-[9px] font-bold px-1 rounded-sm leading-4 flex-shrink-0">BOT</span>
          )}
        </div>
        {user.customStatus && user.status !== "offline" && (
          <div className="text-[11px] text-[#96989d] truncate">{user.customStatus}</div>
        )}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute left-full top-0 ml-2 z-50 bg-[#18191c] border border-[#42464d] rounded-xl shadow-2xl p-3 w-60 pointer-events-none">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: avatarBg }}
              >
                {user.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5">
                <StatusDot status={user.status} size="md" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-bold text-base truncate"
                style={{ color: roleColor }}
              >
                {user.username}
              </div>
              <div className="text-[#b9bbbe] text-xs">#{user.discriminator}</div>
              <div className="mt-1 flex items-center gap-1">
                <StatusDot status={user.status} />
                <span className="text-[#b9bbbe] text-xs">{statusLabel[user.status]}</span>
              </div>
            </div>
          </div>

          {user.customStatus && (
            <div className="mt-2 pt-2 border-t border-[#42464d]">
              <div className="text-[#dcddde] text-xs">{user.customStatus}</div>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-[#42464d]">
            <div className="text-[#72767d] text-[11px] uppercase font-bold tracking-wide mb-1">Roles</div>
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
              style={{ color: roleColor, borderColor: roleColor + "55", backgroundColor: roleColor + "22" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: roleColor }} />
              {role?.name ?? "Member"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const UserList: React.FC = () => {
  const roleOrder = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"];

  const onlineUsers = users.filter((u) => u.status !== "offline");
  const offlineUsers = users.filter((u) => u.status === "offline");

  // Group online users by role
  const grouped = roleOrder.reduce<{ role: typeof roles[0]; members: User[] }[]>((acc, roleId) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return acc;
    const members = onlineUsers.filter((u) => u.roleId === roleId);
    if (members.length > 0) acc.push({ role, members });
    return acc;
  }, []);

  return (
    <div className="w-60 bg-[#2f3136] flex flex-col flex-shrink-0 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#202225]">
      <div className="p-3 pt-4">
        {/* Online users grouped by role */}
        {grouped.map(({ role, members }) => (
          <div key={role.id} className="mb-4">
            <div className="flex items-center gap-1.5 px-2 mb-1">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: role.color }}
              />
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#96989d]">
                {role.name} — {members.length}
              </span>
            </div>
            {members.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ))}

        {/* Offline users */}
        {offlineUsers.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 px-2 mb-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-[#72767d]" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#96989d]">
                Offline — {offlineUsers.length}
              </span>
            </div>
            {offlineUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
