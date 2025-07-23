import React from "react";
import SideBarCard from "./SideBarCard";
import { useState } from "react";
import { useEffect } from "react";
import { formatHumanTime } from "../util";
import { useNavigate, useParams } from "react-router";
function Sidebar({ isStreaming }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const param = useParams();
  useEffect(() => {
    async function getChats() {
      const temp = await fetch("http://localhost:5000/api/chats");
      const data = await temp.json();
      
      
      let tm = data.data.map((t) => ({
        ...t,
        created_at: formatHumanTime(t.created_at),
      }));
      setChats(tm);
    }
    getChats();
  }, [isStreaming]);

  async function handleNewChat() {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
    });
    const temp = await response.json();
    setChats((prev) => {
      const update = [
        {
          id: temp?.id,
          title: temp?.title,
          created_at: formatHumanTime(temp?.created_at),
        },
        ...prev,
      ];
      return update;
    });
    navigate(`/chat/${temp.id}`);
  }
  return (
    <div className="flex w-full flex-1/3 flex-col items-center shadow-md max-sm:hidden dark:shadow-[#ccc]">
      <h1 className="m-2 p-2 text-center font-sans text-3xl font-bold text-white">
        Chat with Gemma
      </h1>
      <button
        disabled={isStreaming}
        onClick={handleNewChat}
        className="w-2/3 cursor-pointer rounded-md disabled:cursor-not-allowed disabled:bg-gray-600 disabled:scale-100 bg-white px-10 py-2 pb-3 text-center align-middle text-xl font-semibold active:scale-95"
      >
        New Chat
      </button>

      <div className="mx-4 my-8 w-[95%] overflow-y-auto rounded-md p-2 text-white custom-scrollbar">
        {chats?.map((temp) => (
          <SideBarCard
            chatid = {param.chatId}
            isStreaming={isStreaming}
            id={temp?.id}
            title={temp?.title}
            created_at={temp?.created_at}
            key={temp?.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
