import { atom, selector } from 'recoil';

export const UsernameState = atom({
  key: 'UsernameState',
  default: '',
});

export const RoomListState = atom({
  key: 'RoomListState',
  default: [],
});

export const RoomListIdState = selector({
  key: 'RoomListIdState',
  get: ({ get }) => {
    const roomList = get(RoomListState);
    return roomList.map((room) => room.roomId);
  },
});

// export const RefreshState = atom({
//   key: 'RefreshState',
//   default: false,
// });
