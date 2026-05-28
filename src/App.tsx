import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Landing } from "./screens/Landing";
import { Mint } from "./screens/Mint";
import { Passport } from "./screens/Passport";
import { Matchday } from "./screens/Matchday";
import { Banter } from "./screens/Banter";
import { Leaderboard } from "./screens/Leaderboard";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppShell />}>
        <Route path="/mint" element={<Mint />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/matchday" element={<Matchday />} />
        <Route path="/banter" element={<Banter />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
