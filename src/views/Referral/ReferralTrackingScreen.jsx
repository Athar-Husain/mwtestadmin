// import React from "react";
// import { useSelector } from 'react-redux';
import React from "react";
import "./ReferralTrackingScreen.css"; // Import the external CSS file

const ReferralTrackingScreen = () => {
  // Dummy data for referral tracking
  const dummyReferrals = [
    { id: 1, name: "John Doe", status: "Pending", bonus: 0, discountDate: null },
    { id: 2, name: "Jane Smith", status: "Completed", bonus: 200, discountDate: "2025-06-15" },
    { id: 3, name: "Emily Davis", status: "Completed", bonus: 200, discountDate: "2025-06-10" },
  ];

  // const referrals = useSelector(state => state.referral.referrals);

  return (
    <section className="referral-tracking-container">
      <h1 className="section-title">Referral Tracking</h1>
      <ul className="referral-list">
        {dummyReferrals.map((r) => (
          <li key={r.id} className="referral-item">
            <div className="referral-details">
              <p className="referral-name">{r.name}</p>
              <p className="referral-status">Status: {r.status}</p>
            </div>
            <div className="referral-info">
              <p
                className={`bonus-earned ${r.bonus > 0 ? "bonus-positive" : "bonus-zero"}`}
              >
                Bonus Earned: ₹{r.bonus}
              </p>
              <p className="discount-date">
                Discount applied: {r.discountDate || "-"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReferralTrackingScreen;
