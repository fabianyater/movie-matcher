import { Avatar, Button } from "@nextui-org/react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const MoviesPage = () => {
  const { signOut, session } = useAuth();

  return (
    <>
      <h1>Movies works</h1>

      <div className="flex items-center space-x-4 p-3">
        <Avatar
          src={session?.user.user_metadata.avatar_url}
          isBordered
          size="lg"
          color="secondary"
        />
        <div>
          <p className="text-lg font-semibold">
            {session?.user.user_metadata.full_name}
          </p>
          <p className="text-sm text-gray-600">{session?.user.email}</p>
        </div>
      </div>

      <Button onClick={signOut}>Cerrar sesión</Button>

      <Link to="/room">Salas</Link>
    </>
  );
};

export default MoviesPage;
