import { useState } from "react";
import ServerSidebar from "./components/ServerSidebar";
import ChannelSidebar from "./components/ChannelSidebar";
import MessageArea from "./components/MessageArea";
import UserList from "./components/UserList";

const CURRENT_USER_ID = "u3"; // CosmicDev — logged in user
const DEFAULT_CHANNEL = "ch4"; // #general
const DEFAULT_SERVER = "s2"; // Galaxia Dev

export default function App() {
  const [activeServer, setActiveServer] = useState(DEFAULT_SERVER);
  const [activeChannel, setActiveChannel] = useState(DEFAULT_CHANNEL);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#36393f] font-sans">
      {/* Server List */}
      <ServerSidebar
        activeServerId={activeServer}
        onSelectServer={(id) => {
          setActiveServer(id);
          setActiveChannel(DEFAULT_CHANNEL);
        }}
      />

      {/* Channel Sidebar */}
      <ChannelSidebar
        activeChannelId={activeChannel}
        onSelectChannel={setActiveChannel}
        currentUserId={CURRENT_USER_ID}
      />

      {/* Main Chat Area */}
      <MessageArea channelId={activeChannel} currentUserId={CURRENT_USER_ID} />

      {/* User List */}
      <UserList />
    </div>
  );
}
