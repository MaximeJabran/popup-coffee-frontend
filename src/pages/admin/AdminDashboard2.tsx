import { useEffect, useState } from "react";
import { API_BASE } from "../../api";

export default function AdminDashboard2() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/registrations/admin`, {
          credentials: "include"
        });

        if (!res.ok) {
          console.error("Failed:", res.status);
          setRegistrations([]);
          return;
        }

        const data = await res.json().catch(() => null);
        setRegistrations(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard 2</h1>
      <p>Loaded {registrations.length} registrations</p>
    </div>
  );
}
