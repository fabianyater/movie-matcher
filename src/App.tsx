import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { JoinRoom } from "./pages/JoinRoomPage/JoinRoomPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { MoviesPage } from "./pages/MoviesPage";
import NotFoundPage from "./pages/NotFound";
import RoomPage from "./pages/Room/Room";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/movies"
        element={
          <ProtectedRoute>
            <MoviesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join-room/:name/:roomId"
        element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room"
        element={
          <ProtectedRoute>
            <RoomPage roomId="" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
