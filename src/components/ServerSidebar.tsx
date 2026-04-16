import React from "react";
import { servers, Server } from "../data/discordData";

interface Props {
  activeServerId: string;
  onSelectServer: (id: string) => void;
}

const ServerIcon: React.FC<{ server: Server; active: boolean; onClick: () => void }> = ({
  server,
  active,
  onClick,
}) => (
  <div className="relative flex items-center group mb-2" onClick={onClick}>
    {/* Active pill */}
    <div
      className={`absolute -left-3 w-1 rounded-r-full bg-white transition-all duration-200 ${
        active ? "h-10" : "h-5 opacity-0 group-hover:opacity-100"
      }`}
    />
    <button
      title={server.name}
      className={`relative w-12 h-12 rounded-[50%] flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-200 select-none
        ${active ? "rounded-[30%]" : "hover:rounded-[30%]"}
        hover:opacity-100`}
      style={{ backgroundColor: active ? server.color : "#36393f", color: "#fff" }}
    >
      {server.icon}
      {/* Unread badge */}
      {server.mention && !active && (
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#1e2124] text-[9px] flex items-center justify-center text-white font-bold">
          !
        </span>
      )}
      {server.unread && !server.mention && !active && (
        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#1e2124]" />
      )}
    </button>
  </div>
);

const ServerSidebar: React.FC<Props> = ({ activeServerId, onSelectServer }) => {
  return (
    <div className="w-[72px] bg-[#1e2124] flex flex-col items-center py-3 gap-0 overflow-y-auto scrollbar-hide flex-shrink-0">
      {/* Discord Home Button */}
      <button
        onClick={() => onSelectServer("s1")}
        title="Home"
        className={`w-12 h-12 rounded-[50%] flex items-center justify-center mb-2 transition-all duration-200 group ${
          activeServerId === "s1" ? "rounded-[30%] bg-[#5865F2]" : "bg-[#36393f] hover:rounded-[30%] hover:bg-[#5865F2]"
        }`}
      >
        {/* Discord logo SVG */}
        <svg width="28" height="28" viewBox="0 0 127.14 96.36" fill="white">
          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
        </svg>
      </button>

      {/* Divider */}
      <div className="w-8 h-[2px] bg-[#36393f] rounded-full mb-2" />

      {servers.slice(1).map((server) => (
        <ServerIcon
          key={server.id}
          server={server}
          active={activeServerId === server.id}
          onClick={() => onSelectServer(server.id)}
        />
      ))}

      {/* Add Server */}
      <div className="mt-2">
        <button
          title="Add a Server"
          className="w-12 h-12 rounded-[50%] bg-[#36393f] flex items-center justify-center text-[#57F287] text-2xl font-bold hover:rounded-[30%] hover:bg-[#57F287] hover:text-white transition-all duration-200"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ServerSidebar;
