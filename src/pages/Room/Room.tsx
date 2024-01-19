import { Button } from "@nextui-org/react";
import { CreateRoom } from "../../components/CreateRoom";
import { useAuth } from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";
import { generateJoinRoomLink } from "../../utils";

interface RommPageProps {
  roomId: string;
}

const RoomPage: React.FC<RommPageProps> = () => {
  const { session } = useAuth();
  const { getRooms, joinRoom, getJoinedRooms, joinedRooms, rooms } = useRoom();

  const handleShare = (name: string, roomId: string) => {
    const shareLink = generateJoinRoomLink(name, roomId);
    navigator.clipboard.writeText(shareLink);
    alert("Enlace copiado al portapapeles!");
  };

  const isJoined = (roomId: string) => {
    return joinedRooms.some((room) => room.id === roomId);
  };

  const handleJoinRoom = async (roomId: string) => {
    if (session) {
      await joinRoom(roomId, session.user.id);
    }
  };

  const handleJoinedRooms = async () => {
    if (session) {
      getJoinedRooms(session.user.id);
    }
  };

  return (
    <div>
      <CreateRoom />
      <Button onClick={getRooms} color="secondary">
        Obtener salas
      </Button>
      <Button onClick={handleJoinedRooms} color="secondary">
        Obtener salas en las que estoy unido
      </Button>

      <div className="m-20">
        Mis Salas:
        {rooms.map((room) => (
          <div key={room.id}>
            <p>{room.name}</p>
            {!isJoined(room.id) && (
              <Button color="warning" onClick={() => handleJoinRoom(room.id)}>
                Unirse a la Sala
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="m-20">
        Salas en las que estoy unido:
        {joinedRooms.map((room) => (
          <div key={room.id}>
            <Button
              color="success"
              onClick={() => handleShare(room.name, room.id)}
            >
              Compartir Enlace de Sala
            </Button>
            <p>{room?.name}</p>
            <h3>Personas unidas:</h3>
            {room.members.map((member, index) => (
              <p key={index}>{member}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomPage;
