import io from 'socket.io-client';
const host = require('.././host');

const socketIo = (function () {
  let socket;

  const initiate = async () => {
    return await io(host.SERVER, {
      withCredentials: true,
    });
  };
  return {
    getSocket: async function () {
      if (!socket) {
        console.log('This socket instance creator must be called only once');
        socket = await initiate();
      }
      return socket;
    },
    removeSocket: function () {
      socket.disconnect();
      socket = null;
      console.log('Removing socket');
    },
  };
})();

export default socketIo;
