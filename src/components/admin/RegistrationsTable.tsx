

type Registration = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
  arrived: boolean;
};

type Props = {
  registrations: Registration[];
  onToggleArrived: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function RegistrationsTable({ registrations, onToggleArrived, onDelete }: Props) {
  if (!registrations.length) {
    return <p>No registrations found.</p>;
  }

  return (
    <table className="admin-table" style={{ marginTop: 20 }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Email Opt‑In</th>
          <th>SMS Opt‑In</th>
          <th>Arrived</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {registrations.map((reg) => (
          <tr key={reg.id}>
            <td>{reg.firstName} {reg.lastName}</td>
            <td>{reg.email}</td>
            <td>{reg.phone}</td>
            <td>{reg.emailOptIn ? "Yes" : "No"}</td>
            <td>{reg.smsOptIn ? "Yes" : "No"}</td>

            <td>
              <button
                className="arrived-btn"
                onClick={() => onToggleArrived(reg.id)}
              >
                {reg.arrived ? "✓" : ""}
              </button>
            </td>

            <td>
              <button
                className="delete-icon-btn"
                onClick={() => onDelete(reg.id)}
              >
                ×
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
