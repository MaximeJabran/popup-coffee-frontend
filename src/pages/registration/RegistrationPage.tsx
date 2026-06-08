import { useState, useEffect } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/light/registration.css";
import { API_BASE } from "../../api";

// Build version: 1.0.2



export default function RegistrationPage() {
  const navigate = useNavigate();


  // FORM STATE
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsNotification, setSmsNotification] = useState(false);
  const [emailNotification, setEmailNotification] = useState(false);
  const [event, setEvent] = useState<any | null>(null);
  const [daysUntil, setDaysUntil] = useState<number | null>(null);

  // VALIDATION + UX
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  useEffect(() => {
    document.title = "Register | Popup Coffee";
  }, []);

  // ⭐ EVENT DATE LOGIC
  useEffect(() => {
  const checkEventStatus = async () => {
    try {
      
      const response = await fetch(`${API_BASE}/events/next`);

      const evt = await response.json();

      if (!evt) return;

      setEvent(evt); // ⭐ store event for dynamic UI

      // ⭐ Calculate countdown
      const start = new Date(evt.startDate);
      const today = new Date();

      start.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffMs = start.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      setDaysUntil(diffDays);


      const eventDate = new Date(evt.startDate);

      eventDate.setHours(0, 0, 0, 0);

      // Registration closed on event day or after
      if (today >= eventDate) {
        navigate("/closed");
        return;
      }

    } catch (err) {
      console.error("Error loading event:", err);
    }
  };

  checkEventStatus();
}, [navigate]);

  // ⭐ RESET EMAIL WHEN OPT‑IN IS TURNED OFF
  useEffect(() => {
    if (!emailNotification) setEmail("");
  }, [emailNotification]);

  // ⭐ RESET PHONE WHEN OPT‑IN IS TURNED OFF
  useEffect(() => {
    if (!smsNotification) setPhone("");
  }, [smsNotification]);

  // ⭐ VALIDATION
  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      return "Please enter your first name and last name.";
    }

    if (emailNotification) {
      if (!email.trim()) {
        return "Please enter an email address if you want email notifications.";
      }
      if (!email.includes("@") || !email.includes(".") || email.length < 5) {
        return "Please enter a valid email address.";
      }
    }

    if (smsNotification) {
      if (!phone.trim()) {
        return "Please enter a phone number if you want SMS notifications.";
      }

      const digitsOnly = phone.replace(/\D/g, "");
      if (digitsOnly.length < 8) {
        return "Phone number must contain at least 8 digits.";
      }

      if (!phone.startsWith("+32") && !phone.startsWith("+33")) {
        return "SMS notifications are only available for Belgian (+32) and French (+33) numbers.";
      }
    }

    return "";
  };

  // ⭐ SUBMIT HANDLER
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
  
        const response = await fetch(`${API_BASE}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event?.id, // ⭐ use real event ID
          firstName,
          lastName,
          smsOptIn: smsNotification,
          phone,
          emailOptIn: emailNotification,
          email,
        }),
      });


      if (!response.ok) {
        throw new Error("Server error");
      }

      navigate("/success");

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* HERO SECTION */}
        <section className="hero">

          {event && daysUntil !== null ? (
            <>
              <h2 className="form-title" style={{ marginBottom: "10px" }}>
                Next Opening in {daysUntil} {daysUntil === 1 ? "day" : "days"}
              </h2>

              <p className="hero-time" style={{ fontSize: "1.2rem", marginTop: "10px" }}>
                From {new Date(event.startDate).toLocaleDateString()} to {new Date(event.endDate).toLocaleDateString()}
              </p>

              <p className="hero-desc">
                A relaxed, friendly space where people meet, talk, and connect in an easy international vibe.
              </p>
            </>
          ) : (
            <h2 className="hero-title">Loading event...</h2>
          )}

        </section>

        {/* REGISTRATION FORM */}
        <section className="form-section">
          <h3 className="form-title">
            Register to the event
          </h3>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <label>
              First name
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>

            <label>
              Last name
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={smsNotification}
                  onChange={(e) => setSmsNotification(e.target.checked)}
                />
                SMS notification on event day
              </label>
            </div>

            {smsNotification && (
              <label>
                Phone (+32 / +33)
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>
            )}

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={emailNotification}
                  onChange={(e) => setEmailNotification(e.target.checked)}
                />
                Subscribe to email notifications for future events
              </label>
            </div>

            {emailNotification && (
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            )}

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Register now"}
            </button>
          </form>
        </section>

        {/* EVENT DETAILS */}
        <section className="details">
          <h3>Event Details</h3>
          <p><strong>Location:</strong> {event?.location}</p>
          <p><strong>Opening hours:</strong> 10:00 → 20:00</p>
          <p><strong>Drinks:</strong> Coffee, teas, iced drinks, and a small selection of simple, healthy foods made to feel light, natural, and easy to enjoy.</p>
        </section>

        <footer className="footer">
          © 2026 Popup Coffee — Comines
        </footer>
      </div>
    </div>
  );
}
