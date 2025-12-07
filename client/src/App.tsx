//import * as  throttle  from "lodash.throttle";
import { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./App.css";
import { Cursor } from "./components/Cursor";
import Home from "./components/Home";
import Login from "./components/Login";

// custom
// Тип для координат
type MouseCoords = { x: number; y: number };

// throttle принимает функцию, которая работает с координатами
const throttle = (fn: (coords: MouseCoords) => void, limit: number) => {
  let lastTime = 0;
  return (event: MouseEvent) => {
    const now = Date.now();
    if (now - lastTime > limit) {
      lastTime = now;
      fn({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };
};

type IState = {
  x: number;
  y: number;
};

type IMessage = {
  username: string;
  id: string;
  state: IState;
};

type IUsers = {
  [id: string]: IMessage;
};

const renderCursors = (users: unknown) => {
  return Object.keys(users as IUsers).map((uuid) => {
    const user = (users as IUsers)[uuid];
    return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
  });
};

function App() {
  const [username, setUsername] = useState("");
  const [url] = useState("ws://127.0.0.1:8000");
  //const [messageHistory, setMessageHistory] = useState<IUsers>({});

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url, {
    queryParams: { username },
  });

  const THROTTLE_MS = 100;

  // Throttle sending mouse events
  const sendJsonMessageThrottled = useRef(
    throttle((coords: { x: number; y: number }) => {
      sendJsonMessage(coords);
    }, THROTTLE_MS)
  );

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      sendJsonMessageThrottled.current(event);
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // useEffect(() => {
  //   if (lastJsonMessage !== null) {
  //     try {
  //       const data: IUsers = JSON.parse(lastMessage.data);
  //       setMessageHistory(data);
  //     } catch (err) {
  //       console.error("Invalid message:", err);
  //     }
  //   }
  // }, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "connecting",
    [ReadyState.OPEN]: "open",
    [ReadyState.CLOSING]: "closing",
    [ReadyState.CLOSED]: "closed",
    [ReadyState.UNINSTANTIATED]: "uninstantiated",
  }[readyState];

  const component =
    lastJsonMessage !== null ? <>{renderCursors(lastJsonMessage)}</> : null;

  return username ? (
    <Home username={username} status={connectionStatus} component={component} />
  ) : (
    <Login onSubmit={setUsername} />
  );
}

export default App;
