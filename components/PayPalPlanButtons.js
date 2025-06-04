import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const plans = [
  { label: "Monthly", value: "9.99", planId: "P-XXXXXXXXXXMONTH" },
  { label: "Yearly", value: "99.99", planId: "P-XXXXXXXXXXYEAR" },
  { label: "2 Years", value: "179.99", planId: "P-XXXXXXXXXX2YEAR" },
];

export default function PayPalPlanButtons() {
  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
      <div className="space-y-4">
        {plans.map(plan => (
          <div key={plan.planId}>
            <div className="font-bold mb-1">{plan.label} Plan</div>
            <PayPalButtons
              style={{ shape: "rect", label: "subscribe" }}
              createSubscription={(data, actions) => {
                return actions.subscription.create({
                  plan_id: plan.planId,
                });
              }}
              onApprove={async (data, actions) => {
                // Call your backend to unlock pro features for the user
                alert(`Subscribed with PayPal (${plan.label})!`);
              }}
            />
          </div>
        ))}
      </div>
    </PayPalScriptProvider>
  );
}