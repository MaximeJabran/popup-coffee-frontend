import "../../styles/dark/membership.css";

export default function MembershipSuccessPage() {
  return (
    <div className="membership-page">
      <div className="page">

        <div className="success-page">
          <div className="success-card">

            <img
                src="/coffee-bear-logo.png"
                alt="Popup Coffee logo"
                className="logo"
            />

            <h1 className="success-title">Welcome to the Club!</h1>

            <p className="success-text">
              Your membership has been successfully registered. 
              You can now enjoy exclusive perks, early access to events, a permanent 30% discount on everything, and special members‑only surprises.
            </p>

            <a href="/" className="success-button">
              Back to Home
            </a>

          </div>
        </div>

      </div>
    </div>
  );
}
