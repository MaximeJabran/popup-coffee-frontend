type Otc = {
  id: number;
  code: string;
  createdAt: string;
};

type Props = {
  otcs: Otc[];
  onGenerate: () => void;
  onRevoke: (id: number) => void;
  onCopy: (code: string) => void;
};

export default function OtcSection({ otcs, onGenerate, onRevoke, onCopy }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <button
        className="generate-btn"
        onClick={onGenerate}
        style={{ marginBottom: 20 }}
      >
        Generate OTC
      </button>

      {otcs.length === 0 && <p>No active OTCs.</p>}

      {otcs.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {otcs.map((o) => (
              <tr key={o.id}>
                <td>{o.code}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>

                <td>
                  <button
                    className="copy-btn"
                    onClick={() => onCopy(o.code)}
                  >
                    Copy
                  </button>

                  <button
                    className="delete-icon-btn"
                    onClick={() => onRevoke(o.id)}
                    style={{ marginLeft: 10 }}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
