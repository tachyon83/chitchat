import { atom } from 'recoil';

export const UsernameState = atom({
  key: 'UsernameState',
  default: '',
});

export const RoomListState = atom({
  key: 'RoomListState',
  default: [],
});
