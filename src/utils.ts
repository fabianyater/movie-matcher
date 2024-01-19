export const generateJoinRoomLink = (name: string, roomId: string) => {
  return `${window.location.origin}/join-room/${name}/${roomId}`;
};
