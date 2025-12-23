import PlayerContainer from "@/components/player/PlayerContainer";
import { api } from "@/lib/api";

export default async function Home() {
  // Fetch weekly top songs on the server
  const songs = await api.getWeeklyTop();

  return (
    <div className="w-full min-h-screen bg-black">
      <PlayerContainer initialSongs={songs} />
    </div>
  );
}
