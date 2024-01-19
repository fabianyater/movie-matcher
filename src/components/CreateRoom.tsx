import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

export const CreateRoom = () => {
  const [roomName, setRoomName] = useState<string>("");
  const { session } = useAuth();
  const { createRoom } = useRoom();

  const handleCreateRoom = async () => {
    if (!roomName || !session) return;

    const newRoom = await createRoom(roomName, session.user.id);
    if (newRoom) {
      console.log("Sala creada:", newRoom);
    }
  };

  return (
    <div>
      <Input
        type="text"
        label="Crear sala"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="max-w-max"
      />
      <Button color="success" onClick={handleCreateRoom}>
        Crear sala
      </Button>
    </div>
  );
};
