import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Rooms() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinUrl, setJoinUrl] = useState<string | null>(null);

  async function createRoom() {
    setLoading(true);
    setError(null);
    setJoinUrl(null);
    try {
      const res = await fetch(`${API_BASE}/rooms`, { method: "POST" });
      if (!res.ok) throw new Error(`Failed to create room: ${res.status}`);
      const data = (await res.json()) as { roomId: string; joinUrl: string };
      setJoinUrl(data.joinUrl);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Create a Room</h1>
      <p>Click the button to create a new room and get a join link.</p>
      <button onClick={createRoom} disabled={loading}>
        {loading ? "Creating…" : "Create Room"}
      </button>
      {error && (
        <p style={{ color: "crimson", marginTop: 12 }}>Error: {error}</p>
      )}
      {joinUrl && (
        <div style={{ marginTop: 16 }}>
          <p>Share this link:</p>
          <pre>{joinUrl}</pre>
          <a href={joinUrl}>Open room</a>
        </div>
      )}
    </div>
  );
}
