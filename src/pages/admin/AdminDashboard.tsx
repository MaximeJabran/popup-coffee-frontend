import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { API_BASE } from "../../api";

export default function AdminDashboard() {

  // ---------------------------------------------------------------  STATE VARIABLES

  // Stores all event registrations from backend
  const [registrations, setRegistrations] = useState<any[]>([]);

  // Stores all membership applications from backend
  const [members, setMembers] = useState<any[]>([]);

  // Controls the initial loading screen
  const [loading, setLoading] = useState(true);

  // OTC (One-Time Code) management state
  const [otcs, setOtcs] = useState<any[]>([]);      
  const [otcMessage, setOtcMessage] = useState(""); 
  const [otcLoading, setOtcLoading] = useState(false);


  // ---------------------------------------------------------------  PAGE SETUP

  useEffect(() => {
    document.title = "Admin Dashboard | Popup Coffee";
  }, []);


  // ---------------------------------------------------------------  LOAD REGISTRATIONS

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const response = await fetch(`${API_BASE}/registrations`);
        const data = await response.json();

        setRegistrations(data);

      } catch (err) {
        console.error("Error loading registrations:", err);

      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, []);

  // ---------------------------------------------------------------  GENERATE OTC

  const generateOtc = async () => {
    try {
      setOtcLoading(true);

      const res = await fetch(`${API_BASE}/admin/otc`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to generate OTC");
      }

      const data = await res.json();

      setOtcMessage(`Generated OTC: ${data.code}`);

      await loadOtcs(); // refresh list

    } catch (err) {
      console.error("Error generating OTC:", err);
      setOtcMessage("Failed to generate OTC");

    } finally {
      setOtcLoading(false);
    }
  };


  // ---------------------------------------------------------------  LOAD ACTIVE OTCs

  const loadOtcs = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/otc`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load OTCs");
      }

      const data = await res.json();
      setOtcs(data);

    } catch (err) {
      console.error("Error loading OTCs:", err);
    }
  };

  useEffect(() => {
    loadOtcs();
  }, []);

  // ---------------------------------------------------------------  COPY OTC
  
  const copyOtc = (code: string) => {
    navigator.clipboard.writeText(code);
    setOtcMessage(`Copied ${code} to clipboard`);
  };

  // ---------------------------------------------------------------  REVOKE OTC
  
  const revokeOtc = async (code: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/otc/${code}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to revoke OTC");
    }

    await loadOtcs(); // refresh list

    setOtcMessage(`Revoked OTC: ${code}`);

    } catch (err) {
      console.error("Error revoking OTC:", err);
      setOtcMessage("Failed to revoke OTC");
    }
};


  // ---------------------------------------------------------------  LOAD MEMBERS

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/membership/all`);

        if (!res.ok) {
          throw new Error("Failed to load members");
        }

        const data = await res.json();
        setMembers(data);

      } catch (e) {
        console.error(e);
      }
    };

    loadMembers();
  }, []);



  // ---------------------------------------------------------------  REGISTRATION ACTIONS

  const toggleArrived = async (id: number) => {
    const response = await fetch(`${API_BASE}/registrations/${id}/arrived`, {
      method: "PATCH"
    });

    const updated = await response.json();

    setRegistrations(registrations.map(r =>
      r.id === id ? updated : r
    ));
  };

  const deleteRegistration = async (id: number) => {
    await fetch(`${API_BASE}/registrations/${id}`, {
      method: "DELETE",
    });

    setRegistrations(prev => prev.filter(r => r.id !== id));
  };


  // ---------------------------------------------------------------  MEMBERSHIP ACTIONS

  const approveMember = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/membership/${id}/approve`, {
        method: "POST"
      });

      const updated = await res.json();

      setMembers(members.map(m =>
        m.id === id ? updated : m
      ));

    } catch (err) {
      console.error("Error approving member:", err);
    }
  };

  const deleteMember = async (id: number) => {
    await fetch(`${API_BASE}/api/membership/${id}`, {
      method: "DELETE",
    });

    setMembers(prev => prev.filter(m => m.id !== id));
  };


  // ---------------------------------------------------------------  LOGOUT

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      window.location.href = "/admin/login";
    }
  };


  // ---------------------------------------------------------------  LOADING SCREEN

  if (loading) return <p>Loading...</p>;


  // ---------------------------------------------------------------  RENDER UI

  return (
    <div className="admin-root">

      {/* Header with logout button */}
      <div className="admin-header">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-container">

        {/* -----------------------------------------------------------  OTC MANAGEMENT SECTION */}
        <div className="otc-section">
          <h2 className="admin-subtitle">One-Time Codes</h2>

          {otcMessage && (
            <p style={{ color: "green", marginBottom: "10px" }}>
              {otcMessage}
            </p>
          )}

          <button
            disabled={otcLoading}
            onClick={generateOtc}
            className="approve-btn"
          >
            {otcLoading ? "Generating..." : "Generate OTC"}
          </button>


          <ul style={{ marginTop: "15px" }}>
            {otcs.length === 0 && <p>No active OTCs</p>}

            {otcs.map((otc: any) => (
              <li key={otc.code} style={{ marginBottom: "10px" }}>
                <strong>{otc.code}</strong>

                <button
                  className="approve-btn"
                  style={{ marginLeft: "10px" }}
                  onClick={() => copyOtc(otc.code)}
                >
                  Copy
                </button>

                <button
                  className="delete-icon-btn"
                  style={{ marginLeft: "10px" }}
                  onClick={() => revokeOtc(otc.code)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

        </div>


        {/* -----------------------------------------------------------  REGISTRATIONS TABLE */}
        <h2 className="admin-subtitle">Total registrations: {registrations.length}</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Email</th>
              <th>SMS</th>
              <th>Arrived</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map(reg => (
              <tr key={reg.id}>
                <td>{reg.firstName} {reg.lastName}</td>
                <td>{reg.email}</td>
                <td>{reg.phone}</td>
                <td>{reg.emailOptIn ? "Yes" : "No"}</td>
                <td>{reg.smsOptIn ? "Yes" : "No"}</td>

                <td>
                  <button
                    className="arrived-btn"
                    onClick={() => toggleArrived(reg.id)}
                  >
                    {reg.arrived ? "✓" : ""}
                  </button>
                </td>

                <td>
                  <button className="delete-icon-btn" onClick={() => deleteRegistration(reg.id)}>
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        {/* -----------------------------------------------------------  MEMBERS TABLE */}
        <h2 className="admin-subtitle">Members</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Birthdate</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.firstName} {m.lastName}</td>
                <td>{m.birthDate}</td>
                <td>{m.email || ""}</td>
                <td>{m.phone || ""}</td>

                <td>
                  {m.status === "PENDING_APPROVAL" ? (
                    <button 
                      className="approve-btn"
                      onClick={() => approveMember(m.id)}
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="status-approved">Member</span>
                  )}
                </td>

                <td>
                  <button 
                    className="delete-icon-btn"
                    onClick={() => deleteMember(m.id)}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
