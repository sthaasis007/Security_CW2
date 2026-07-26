import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, textAlign: "center" }}>Loading payment details...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
