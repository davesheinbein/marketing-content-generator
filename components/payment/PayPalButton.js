import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalButton() {
  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: "9.99" } }],
          });
        }}
        onApprove={async (data, actions) => {
          await actions.order.capture();
          // Call your API to unlock features for the user
        }}
      />
    </PayPalScriptProvider>
  );
}