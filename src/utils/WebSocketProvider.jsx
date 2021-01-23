import React, { useRef } from 'react';
const host = require('.././host');

const WebSocketContext = React.createContext(null);
export { WebSocketContext };

export const WebSocketProvider = ({ children }) => {
  const webScoketUrl = host.SERVER;
  let ws = useRef(null);

  if (!ws.current) {
    ws.current = new WebSocket(webScoketUrl);
    ws.current.onopen = () => {
      console.log('connected to websocket');
    };
    ws.current.onclose = (error) => {
      console.log('disconnected');
    };
    ws.current.onerror = (error) => {
      console.log('connection error');
    };
  }

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
