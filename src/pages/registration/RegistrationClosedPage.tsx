import { useState, useEffect } from "react";

export default function RegistrationClosedPage() {

    const [event, setEvent] = useState<any | null>(null);

    useEffect(() => {
      document.title = "Event Closed | Popup Coffee";
    }, []);


    useEffect(() => {
    const loadEvent = async () => {
        try {
        const response = await fetch("http://localhost:8080/events");
        const events = await response.json();
        if (events.length > 0) {
            setEvent(events[0]);
        }
        } catch (err) {
        console.error("Error loading event:", err);
        }
    };

    loadEvent();
    }, []);

  return (
    
    <div className="light-page">
      <div className="page">

        <header className="header">
          <img
            src="/coffee-bear-logo.png"
            alt="Popup Coffee logo"
            className="logo"
          />
          <div>
            <h1 className="title">Popup Coffee</h1>
            <p className="subtitle">Memorable coffee shop experiences</p>
          </div>
        </header>

        <section className="hero">
          <h2 className="hero-title">Registration is now closed</h2>

          {event ? (
          <>
              <p className="hero-desc">
              We’re looking forward to seeing you on{" "}
              <strong>{new Date(event.startDate).toLocaleDateString()}</strong>
              {" "}at{" "}
              <strong>10:00</strong>
              .
              </p>

              <p className="hero-desc">
              Location: <strong>{event.location}</strong>
              </p>
          </>
          ) : (
          <p className="hero-desc">Loading event...</p>
          )}

        </section>

        <footer className="footer">
          © 2026 Popup Coffee — Comines
        </footer>

      </div>
    </div>
  );
}

