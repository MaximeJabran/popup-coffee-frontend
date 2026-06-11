import { useState, useEffect } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dark/membership.css";
import { API_BASE } from "../../api";



export default function MembershipRegistrationPage() {
  const navigate = useNavigate();

  // FORM STATE
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsNotification, setSmsNotification] = useState(false);
  const [emailNotification, setEmailNotification] = useState(false);
  const [membershipCode, setMembershipCode] = useState("");

  // EVENT STATE (for next opening card)
  const [event, setEvent] = useState<any | null>(null);
  const [daysUntil, setDaysUntil] = useState<number | null>(null);

  // UX
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Members Club | Popup Coffee";
  }, []);

  // RESET FIELDS WHEN OPT‑INS TURN OFF
  useEffect(() => {
    if (!emailNotification) setEmail("");
  }, [emailNotification]);

  useEffect(() => {
    if (!smsNotification) setPhone("");
  }, [smsNotification]);

  // LOAD NEXT EVENT
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await fetch(`${API_BASE}/events/next`);
        const evt = await response.json();
        if (!evt) return;

        setEvent(evt);

        const start = new Date(evt.startDate);
        const today = new Date();
        start.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffMs = start.getTime() - today.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        setDaysUntil(diffDays);
      } catch (err) {
        console.error("Error loading event:", err);
      }
    };

    loadEvent();
  }, []);

  // VALIDATION
  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      return "Please enter your first name and last name.";
    }

    if (!membershipCode.trim()) {
      return "Please enter your one time code. If you don't have a code yet, request it at the counter.";
    }

    if (emailNotification) {
      if (!email.trim()) return "Please enter an email address.";
      if (!email.includes("@") || !email.includes(".")) {
        return "Please enter a valid email address.";
      }
    }

    if (smsNotification) {
      if (!phone.trim()) return "Please enter a phone number.";
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
      const response = await fetch(`${API_BASE}/membership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          birthdate,
          email,
          phone,
          receiveEmail: emailNotification,
          receiveSMS: smsNotification,
          oneTimeCode: membershipCode,
        }),
      });

      if (!response.ok) {
        const text = await response.text();

        if (text.includes("INVALID_OR_EXPIRED_CODE")) {
          setError("Invalid or expired membership code. Request a new code at the counter.");
          setIsSubmitting(false);
          return;
        }

        throw new Error("Server error");
      }


      navigate("/membership/success");

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="membership-page">
        <div className="page">   
        {/* HEADER */}
        <header className="header">
            <img src="/coffee-bear-logo.png" alt="Popup Coffee logo" className="logo" />
            <div>
            <h1 className="title">Popup Coffee</h1>
            <p className="subtitle">Members Club Registration</p>
            </div>
        </header>

        {/* CARD 1 — WELCOME */}
        <section className="hero">
            <h2 className="form-title">Become a Member</h2>
            <p className="hero-desc">
            You’ve been invited to join a small circle of people who bring warmth, good energy, and great vibes to our popup openings.
            </p>
            <p className="hero-desc">
            Membership is completely free — it’s simply our way of staying connected with the people who make Popup Coffee special.
            </p>
        </section>

        {/* CARD 2 — FORM */}
        <section className="form-section">
            <h3 className="form-title">Activate your membership</h3>

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

            <label>
              Date of birth
              <input
                type="date"
                className="birthdate-input"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
            </label>

            <div className="checkbox-group">
                <label>
                <input
                    type="checkbox"
                    checked={emailNotification}
                    onChange={(e) => setEmailNotification(e.target.checked)}
                />
                Receive email notifications
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

            <div className="checkbox-group">
                <label>
                <input
                    type="checkbox"
                    checked={smsNotification}
                    onChange={(e) => setSmsNotification(e.target.checked)}
                />
                Receive SMS notifications
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

                <label>
                  One Time Code (get your code at the counter in the shop)
                  <input
                    type="text"
                    value={membershipCode}
                    onChange={(e) => setMembershipCode(e.target.value)}
                    required
                  />
                </label>


            {error && (
              <div
                key={error}   // ← THIS forces React to recreate the element
                className="error-box"
              >
                {error}
              </div>
            )}

            <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Become a member now"}
            </button>
            </form>
        </section>

        {/* CARD 3 — PERKS */}
        <section className="details">
            <h3>Membership Perks</h3>
                <p>Get access one day before the public.</p>
                <p>Get event info 24–48 hours earlier.</p>
                <p>Enjoy a 30% discount on all products.</p>
                <p>Get exclusive access to tastings and seasonal launches.</p>
        </section>

        {/* CARD 4 — NEXT OPENING */}
        {event && daysUntil !== null && (
            <section className="details">
            <h3>Next Opening in {daysUntil} {daysUntil === 1 ? "day" : "days"}</h3>
            <p>From {new Date(event.startDate).toLocaleDateString()} to {new Date(event.endDate).toLocaleDateString()}</p>
            <p>A relaxed, friendly space where people meet, talk, and connect in an easy international vibe.</p>
            </section>
        )}

        <footer className="footer">
            © 2026 Popup Coffee — Comines
        </footer>
        </div> 
    </div>
  );
}
