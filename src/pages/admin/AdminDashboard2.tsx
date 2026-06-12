import { useEffect, useState } from "react";
import { API_BASE } from "../../api";

// ---------------------------------------------------------------
//  SAFE JSON PARSER (prevents React #310 from fetch failures)
// ---------------------------------------------------------------
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function AdminDashboard2() {
  // ------------------------------------------------------------- STATE
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [otcs, setOtcs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------------- LOAD REGISTRATIONS
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/registrations/admin`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to load registrations:", res.status);
          setRegistrations([]);
          return;
        }

        const data = await safeJson(res);
        setRegistrations(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ------------------------------------------------------------- LOAD MEMBERS
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/membership/admin/all`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to load members:", res.status);
          setMembers([]);
          return;
        }

        const data = await safeJson(res);
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading members:", err);
      }
    };

    load();
  }, []);

  // ------------------------------------------------------------- LOAD OTCS
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/membership/admin/otc`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to load OTCs:", res.status);
          setOtcs([]);
          return;
        }

        const data = await safeJson(res);
        setOtcs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading OTCs:", err);
      }
    };

    load();
  }, []);

  // ------------------------------------------------------------- LOADING STATE
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Admin Dashboard 2</h1>
        <p>Loading…</p>
      </div>
    );
  }

  // ------------------------------------------------------------- RENDER
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard 2</h1>

      {/* -------------------------- Registrations Section */}
      <section style={{ marginTop: 40 }}>
        <h2>Registrations</h2>
        <p>Total: {registrations.length}</p>

        {/* Placeholder — add table later */}
        <pre>{JSON.stringify(registrations, null, 2)}</pre>
      </section>

      {/* -------------------------- Members Section */}
      <section style={{ marginTop: 40 }}>
        <h2>Members</h2>
        <p>Total: {members.length}</p>

        {/* Placeholder — add table later */}
        <pre>{JSON.stringify(members, null, 2)}</pre>
      </section>

      {/* -------------------------- OTC Section */}
      <section style={{ marginTop: 40 }}>
        <h2>One-Time Codes</h2>
        <p>Total active: {otcs.length}</p>

        {/* Placeholder — add list later */}
        <pre>{JSON.stringify(otcs, null, 2)}</pre>
      </section>
    </div>
  );
}
