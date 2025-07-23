import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useOutletContext, useParams } from "react-router";
import { formatHumanTime } from "../util";
function Chatwindow() {
  const ref = useRef(null);
  const controllerRef = useRef();
  const [streamActive, setStreamActive] = useState(false);
  const [message, setMessage] = useState([]);
  const { setIsStreaming } = useOutletContext();
  const parm = useParams();

  useEffect(() => {
    ref?.current?.focus();

    async function loadMessage() {
      const res = await fetch(`http://localhost:5000/api/chat/${parm.chatId}`);
      const data = await res.json();
      const data_up = data?.data?.map((t) => {
        return { ...t, createdAt: formatHumanTime(t.timestamp) };
      });
      setMessage(data_up);
    }
    loadMessage();
  }, [parm.chatId]);

  async function handleSend() {
    if (!ref || ref.current.value?.trim() === "") {
      alert("Type some message");
      ref.current.value = "";
      return;
    }
    let temp = {
      role: "sender",
      content: ref?.current?.value,
      createdAt: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
    if (ref.current) {
      ref.current.value = "";
    }
    setMessage((prev) => [...prev, temp]);
    const controller = new AbortController();
    controllerRef.current = controller;

    let botMessage = {
      author: "bot",
      content: "",
      createdAt: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
    setMessage((prev) => {
      botindex = prev.length;
      return [...prev, botMessage];
    });
    let botindex;
    try {
      setStreamActive(true);
      setIsStreaming(() => true);
      const res = await fetch(
        `http://localhost:5000/api/chat/${parm.chatId}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ content: temp.content }),
        },
      );

      if (!res.ok) {
        setMessage((prev) => {
          const update = [...prev];
          update[botindex] = {
            ...update[botindex],
            content:
              update[botindex].content +
              res.statusText +
              "Server error is occured",
          };
          return update;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const temp = JSON.parse(chunk);
        setMessage((prev) => {
          const update = [...prev];
          update[botindex] = {
            ...update[botindex],
            content: update[botindex].content + temp.response,
          };
          return update;
        });
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Aborted By user");
      } else {
        setMessage((prev) => {
          const update = [...prev];
          update[botindex] = {
            ...update[botindex],
            content: "Server error Please wait we working on it.",
          };
          return update;
        });
        console.log("err");
      }
    } finally {
      setStreamActive(false);
      setIsStreaming(false);
    }
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSend();
    }
  }

  function handleStop() {
    if (controllerRef?.current) {
      controllerRef?.current?.abort();
      stopGeneration();
    }
  }
  
  const stopGeneration = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/${parm.chatId}/stop`, { method: "POST" });
      const json = await res.json();
      console.log(json.message);
    } catch (err) {
      console.error("Stop failed:", err);
    }
  };

  return (
    <>
      <div className="relative flex flex-2/3 flex-col overflow-clip">
        <div className="custom-scrollbar h-full w-full overflow-y-auto">
          {message?.map((message, id) =>
            message?.role === "sender" ? (
              <div
                key={id}
                className="my-4 mr-4 ml-auto w-fit max-w-3/4 text-wrap"
              >
                <div className="m-0 rounded-sm bg-blue-600 px-4 py-2 text-wrap text-white">
                  {message?.content ? (
                    <ReactMarkdown>{message?.content}</ReactMarkdown>
                  ) : (
                    "loading... "
                  )}
                </div>
                <div className="text-start font-sans text-xs text-gray-400 lg:text-sm">
                  {message?.createdAt}
                </div>
              </div>
            ) : (
              <div
                key={id}
                className="mx-4 mt-4 w-fit max-w-3/4 text-wrap break-words"
              >
                <div className="rounded-sm bg-black px-4 py-2 text-wrap text-white">
                  {message?.content ? (
                    <ReactMarkdown>{message?.content}</ReactMarkdown>
                  ) : (
                    "loading... "
                  )}
                </div>
                <div className="text-end font-sans text-xs font-normal text-gray-400 lg:text-sm">
                  {message?.createdAt}
                </div>
              </div>
            ),
          )}
        </div>
        <div className="m-2 flex w-full justify-center self-end border-t-1 border-[#aaa]">
          <input
            type="text"
            className="m-2 w-2/3 rounded-sm border-1 px-2 outline-0 placeholder:text-white dark:border-white dark:text-white"
            placeholder="Enter your message..."
            onKeyDown={handleKeyDown}
            ref={ref}
          />
          {!streamActive ? (
            <button
              onClick={handleSend}
              // disabled={streamActive}
              className="m-2 cursor-pointer rounded-sm bg-black px-4 py-2 text-white shadow-sm outline-0 hover:shadow-xl active:scale-95 disabled:scale-100 disabled:cursor-not-allowed lg:px-8"
            >
              Send
            </button>
          ) : (
            <button
              onClick={handleStop}
              // disabled={streamActive}
              className="m-2 cursor-pointer rounded-sm bg-black px-4 py-2 text-white shadow-sm outline-0 hover:shadow-xl active:scale-95 disabled:scale-100 disabled:cursor-not-allowed lg:px-8"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Chatwindow;
