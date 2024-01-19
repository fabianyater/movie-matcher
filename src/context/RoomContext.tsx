import { SupabaseClient } from "@supabase/supabase-js";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { supabaseClient } from "../supabaseClient";

export interface IRoom {
  id: string;
  name: string;
  created_by: string;
  members: string[];
}

export interface RoomContextType {
  currentRoom: IRoom | null;
  rooms: IRoom[];
  joinedRooms: IRoom[];
  createRoom: (roomName: string, userId: string) => Promise<IRoom | null>;
  joinRoom: (roomId: string, userId: string) => Promise<boolean>;
  getRooms: () => Promise<void>;
  getRoomDetails: (roomId: string) => Promise<IRoom | null>;
  getJoinedRooms: (userId: string) => Promise<void>;
}

const supabase: SupabaseClient = supabaseClient;

export const RoomContext = createContext<RoomContextType | undefined>(
  undefined
);

interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider = ({ children }: RoomProviderProps) => {
  const [currentRoom, setCurrentRoom] = useState<IRoom | null>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<IRoom[]>([]);

  const createRoom = useCallback(async (roomName: string, userId: string) => {
    const { data, error } = await supabase
      .from("rooms")
      .insert({ name: roomName, created_by: userId })
      .single();

    if (error) {
      console.error("Error al crear la sala:", error);
      return null;
    }

    setCurrentRoom({ id: "", created_by: userId, name: roomName, members: [] });
    return data;
  }, []);

  const joinRoom = useCallback(async (roomId: string, userId: string) => {
    const { error } = await supabase
      .from("room_members")
      .insert({ user_id: userId, room_id: roomId });

    if (error) {
      console.error("Error al unirse a la sala:", error);
      return false;
    }

    setCurrentRoom({ id: roomId, name: "", created_by: userId, members: [] });
    return true;
  }, []);

  const getRooms = useCallback(async () => {
    const { data, error } = await supabaseClient.from("rooms").select("*");

    if (error) {
      console.error("Error al obtener salas:", error);
      return;
    }

    setRooms(data);
  }, []);

  const getJoinedRooms = useCallback(async (userId: string) => {
    const { data, error } = await supabaseClient
      .from("room_members")
      .select(
        `
      room_id, 
      rooms (
        id,
        name,
        created_by, 
        room_members (
          user_id
        )
      )`
      )
      .eq("user_id", userId);

    if (error) {
      console.error(
        "Error al obtener las salas a las que el usuario está unido:",
        error
      );
      return;
    }

    const mappedRooms = data.map((member) => ({
      ...member.rooms,
      members: member.rooms.room_members.map((rm) => rm.user_id), // Sólo IDs de usuario
    }));

    setJoinedRooms(mappedRooms);
  }, []);

  const getRoomDetails = useCallback(async (roomId: string) => {
    const { data, error } = await supabaseClient
      .from("rooms")
      .select("*")
      .eq("id", roomId);

    if (error || !data) {
      console.error("Error al obtener detalles de la sala:", error);
      return null;
    }

    return data;
  }, []);

  useEffect(() => {
    const roomMembers = supabaseClient
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "room_members" },
        (payload) => {
          console.log("Change received!", payload);

          setJoinedRooms((currentRooms) => {
            const roomIndex = currentRooms.findIndex(
              (room) => room.id === payload.new.room_id
            );

            if (roomIndex !== -1) {
              const updatedRooms = [...currentRooms];
              updatedRooms[roomIndex] = {
                ...updatedRooms[roomIndex],
                members: [
                  ...updatedRooms[roomIndex].members,
                  payload.new.user_id,
                ],
              };

              return updatedRooms;
            }

            return currentRooms;
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(roomMembers);
    };
  }, []);

  return (
    <RoomContext.Provider
      value={{
        currentRoom,
        rooms,
        joinedRooms,
        getJoinedRooms,
        createRoom,
        joinRoom,
        getRooms,
        getRoomDetails,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
