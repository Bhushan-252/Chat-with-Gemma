import React from "react";
import { Link } from "react-router";

function SideBarCard({ title, created_at, id, isStreaming,chatid }) {
  return ( 
    <Link
      to={isStreaming ? "" : `/chat/${id}`}
      onClick={(e) => {
        if (isStreaming) e.preventDefault(); // block navigation
      }}
      className={`my-2 flex w-full justify-between rounded-md p-4 text-nowrap text-clip ${
        isStreaming
          ? "pointer-events-none cursor-not-allowed opacity-50"
          : "cursor-pointer"
      } ${id == chatid ? "bg-white text-black":"bg-black " }`}
    >
      <div className="flex w-full justify-between">
        <h1 className="flex-2/3 text-clip">{title}</h1>
        <p>{created_at}</p>
      </div>
    </Link>
  );
}

export default SideBarCard;
