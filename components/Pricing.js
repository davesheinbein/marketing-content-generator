import { useState } from "react";

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_12345" }), // Replace with your price ID
    });
    const data = await res.json();
    if (data.url) window.location = data.url;
    setLoading(false);
  };

  return (
    <button
      className="bg-blue-600 text-white px-6 py-3 rounded"
      onClick={handleSubscribe}
      disabled={loading}
    >
      {loading ? "Redirecting..." : "Subscribe Now"}
    </button>
  );
}