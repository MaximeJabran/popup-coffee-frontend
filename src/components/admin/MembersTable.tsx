type Member = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthdate: string;
  approved: boolean;
};

type Props = {
  members: Member[];
  onApprove: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function MembersTable({ members, onApprove, onDelete }: Props) {
  if (!members.length) {
    return <p>No members found.</p>;
  }

  return (
    <table className="admin-table" style={{ marginTop: 20 }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Birthdate</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Approved</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {members.map((m) => (
          <tr key={m.id}>
            <td>{m.firstName} {m.lastName}</td>
            <td>{m.birthdate}</td>
            <td>{m.email}</td>
            <td>{m.phone}</td>

            <td>{m.approved ? "Yes" : "No"}</td>

            <td>
              {!m.approved && (
                <button
                  className="approve-btn"
                  onClick={() => onApprove(m.id)}
                >
                  Approve
                </button>
              )}

              <button
                className="delete-icon-btn"
                onClick={() => onDelete(m.id)}
                style={{ marginLeft: 10 }}
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
