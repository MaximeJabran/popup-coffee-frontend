import { useEffect } from "react";

export default function SuccessPage() {

  useEffect(() => {
    document.title = "Registration Successful | Popup Coffee";
  }, []);

  return (
    <div className="light-page">
      <div className="page success-page">
        <div className="success-card">
          <img
            src="/coffee-bear-logo.png"
            alt="Popup Coffee logo"
            className="logo"
          />

          <h1 className="success-title">Registration successful!</h1>

          <p className="success-text">
            Thanks for signing up, we hope to see you soon.
          </p>

          <a href="/" className="success-button">
            Register someone else
          </a>
        </div>
      </div>
    </div>
  );
}
