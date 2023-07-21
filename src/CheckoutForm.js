import { PaymentElement } from "@juspay-tech/react-hyper-js";
import { useState } from "react";
import { useHyper, useElements } from "@juspay-tech/react-hyper-js";

export default function CheckoutForm() {
  const hyper = useHyper();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hyper || !elements) {
      // Hyper.js has not yet loaded.
      // Make sure to disable form submission until Hyper.js has loaded.
      return;
    }

    setIsProcessing(true);

    const resMsg = await hyper.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/completion`,
      },
    });

    

    if (resMsg.error !== null) {
      setMessage(resMsg.error);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  let paymentOptions = {
    wallets: {
      walletReturnUrl: `${window.location.origin}/completion`,
    },
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentOptions} />
      <button disabled={isProcessing || !hyper || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
