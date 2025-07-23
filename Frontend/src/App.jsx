import { useState } from "react";
import Chatwindow from "./Components/Chatwindow";
import Sidebar from "./Components/Sidebar";
import { Outlet } from "react-router";
function App() {
  const [count, setCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <>
      <div className="mt-5 mr-auto ml-auto h-[90dvh] w-[90dvw] overflow-clip rounded-lg bg-white shadow-xl max-sm:absolute max-sm:bottom-0 max-sm:w-full md:w-[80dvw] lg:w-[70dvw] lg:text-xl dark:bg-[#171717] dark:shadow-[#282828]">
        <div className="flex h-full w-full">
          <Sidebar isStreaming={isStreaming} />
          <Outlet context={{setIsStreaming}}/>

          {/* <Chatwindow /> */}
        </div>
      </div>
    </>
  );
}

export default App;
