import { Button } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";

export const JoinRoom: React.FC = () => {
  const { roomId, name } = useParams<{ roomId: string }>();
  const { joinRoom } = useRoom(); // Asumiendo que tienes una función getRoomDetails
  const { session } = useAuth();

  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (roomId && session) {
      const success = await joinRoom(roomId, session.user.id);
      if (success) {
        navigate(`/room`); // Redirige al usuario a la sala
      }
    }
  };

  return (
    <div>
      <h3>Unirse a la sala: {name}</h3>
      <Button onClick={handleJoinRoom}>Unirse a esta Sala</Button>
    </div>
  );
};
