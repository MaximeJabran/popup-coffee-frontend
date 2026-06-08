import { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {

  // Stores all registrations loaded from the backend
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);


  // Controls the loading state while fetching data
  const [loading, setLoading] = useState(true);



  // ---------------------------------------------
  // Load registrations when the component mounts
  // ---------------------------------------------

  useEffect(() => {
    document.title = "Admin Dashboard | Popup Coffee";
  }, []);

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        // Fetch all registrations from the backend API
        const response = await fetch("http://localhost:8080/registrations");
        const data = await response.json();

        // Save them into state (this triggers a re-render)
        setRegistrations(data);

      } catch (err) {
        console.error("Error loading registrations:", err);

      } finally {
        // Stop showing the loading message
        setLoading(false);
      }
    };

    loadRegistrations();
  }, []); // Empty dependency array → runs only once on page load

  useEffect(() => {
  const loadMembers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/membership/all");

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



  // ---------------------------------------------------------
  // Toggle the "arrived" status for a specific registration
  // ---------------------------------------------------------
  const toggleArrived = async (id: number) => {
    // Call backend PATCH endpoint to toggle arrival
    const response = await fetch(`http://localhost:8080/registrations/${id}/arrived`, {
      method: "PATCH"
    });

    const updated = await response.json();

    // Update the local state by replacing the updated registration
    setRegistrations(registrations.map(r =>
      r.id === id ? updated : r
    ));
  };


  // ---------------------------------------------------------
  // Delete a registration from backend + remove from UI
  // ---------------------------------------------------------
  const deleteRegistration = async (id: number) => {
    await fetch(`http://localhost:8080/api/registrations/${id}`, {
      method: "DELETE",
    });

    setRegistrations(prev => prev.filter(r => r.id !== id));
  };



  // Show loading message while data is being fetched
  if (loading) return <p>Loading...</p>;


  const approveMember = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/membership/${id}/approve`, {
        method: "POST"
      });

      const updated = await res.json();

      // Update the local state
      setMembers(members.map(m =>
        m.id === id ? updated : m
      ));

    } catch (err) {
      console.error("Error approving member:", err);
    }
  };

    const deleteMember = async (id: number) => {
    await fetch(`http://localhost:8080/api/membership/${id}`, {
      method: "DELETE",
    });

    setMembers(prev => prev.filter(m => m.id !== id));
  };

    const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      window.location.href = "/admin/login";
    }
  };



  // ---------------------------------------------
  // Render the admin dashboard table
  // ---------------------------------------------
  return (
    
    <div className="admin-root">

      <div className="admin-header">
        
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          
      </div>

      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-container">

        {/* Page title + total count */}
        <h2 className="admin-subtitle">Total registrations: {registrations.length}</h2>

        {/* Main table */}
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

                {/* Full name */}
                <td>{reg.firstName} {reg.lastName}</td>

                {/* Contact info */}
                <td>{reg.email}</td>
                <td>{reg.phone}</td>

                {/* Opt-in flags */}
                <td>{reg.emailOptIn ? "Yes" : "No"}</td>
                <td>{reg.smsOptIn ? "Yes" : "No"}</td>

                {/* Arrived toggle button */}
                <td>
                  <button
                    className="arrived-btn"
                    onClick={() => toggleArrived(reg.id)}
                  >
                    {reg.arrived ? "✓" : ""}
                  </button>
                </td>

                {/* Delete button */}
                <td>
                  <button className="delete-icon-btn" onClick={() => deleteRegistration(reg.id)}>
                    ×
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

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
