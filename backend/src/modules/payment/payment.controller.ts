import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_GATEWAY_URL = "https://khalti.com/api/v2";
// Set to false to use real Khalti payment page
const KHALTI_TEST_MODE = process.env.KHALTI_TEST_MODE === "true";

// Debug: Log TEST_MODE on startup
console.log("🔧 KHALTI_TEST_MODE env var:", process.env.KHALTI_TEST_MODE);
console.log("🔧 KHALTI_TEST_MODE resolved to:", KHALTI_TEST_MODE);

// Helper function to log to console with timestamps
const logToFile = (message: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

interface KhaltiInitiatePayload {
  return_url: string;
  website_url: string;
  amount: number;
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface KhaltiVerificationPayload {
  token: string;
  amount: number;
}

export const initiatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const debugInfo = `
═══════════════════════════════════════
PAYMENT INITIATE CALLED AT ${new Date().toISOString()}
process.env.KHALTI_TEST_MODE = ${process.env.KHALTI_TEST_MODE}
KHALTI_TEST_MODE constant = ${KHALTI_TEST_MODE}
typeof KHALTI_TEST_MODE = ${typeof KHALTI_TEST_MODE}
═══════════════════════════════════════
`;
    console.log(debugInfo);
    fs.appendFileSync("backend/logs/payment-debug.txt", debugInfo);
    
    logToFile("🔵 Payment initiate endpoint called!");
    logToFile("Request body: " + JSON.stringify(req.body, null, 2));
    logToFile("Environment - KHALTI_SECRET_KEY exists: " + (!!KHALTI_SECRET_KEY));
    logToFile("Environment - KHALTI_SECRET_KEY length: " + (KHALTI_SECRET_KEY?.length || 0));
    
    // Check if KHALTI_SECRET_KEY is loaded
    if (!KHALTI_SECRET_KEY) {
      logToFile("❌ KHALTI_SECRET_KEY is not defined in environment variables!");
      res.status(500).json({
        success: false,
        message: "Payment configuration error: Missing KHALTI_SECRET_KEY",
        error: "KHALTI_SECRET_KEY not found in environment",
      });
      return;
    }

    const authReq = req as AuthRequest;
    const { amount, purchase_order_id, purchase_order_name, customer_info, cart_items } = req.body;

    if (!amount || !purchase_order_id || !purchase_order_name) {
      logToFile("❌ Missing required fields");
      res.status(400).json({
        success: false,
        message: "Missing required fields: amount, purchase_order_id, purchase_order_name",
      });
      return;
    }

    // Log cart items for tracking (you can store this in database later)
    logToFile("Payment initiated for cart: " + JSON.stringify(cart_items));
    logToFile("🔧 TEST_MODE check: " + KHALTI_TEST_MODE);

    // TEST MODE: Simulate successful payment initiation
    if (KHALTI_TEST_MODE) {
      logToFile("⚠️  Running in TEST MODE - using mock payment");
      const mockPidx = `test_pidx_${Date.now()}`;
      const mockPaymentUrl = `http://localhost:3000/payment/success?pidx=${mockPidx}&transaction_id=test_${Date.now()}&amount=${amount}`;
      
      res.status(200).json({
        success: true,
        message: "Test mode: Payment initiated successfully",
        data: {
          pidx: mockPidx,
          payment_url: mockPaymentUrl,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          expires_in: 1800,
        },
      });
      return;
    }

    const payload: KhaltiInitiatePayload = {
      return_url: process.env.KHALTI_RETURN_URL || "http://localhost:3000/payment/success",
      website_url: process.env.KHALTI_WEBSITE_URL || "http://localhost:3000",
      amount: Math.round(amount * 100), // Khalti expects amount in paisa (1 NPR = 100 paisa)
      purchase_order_id,
      purchase_order_name,
      customer_info: customer_info || {
        email: authReq.user?.email || "customer@everblue.com",
      },
    };

    logToFile("🔄 Calling Khalti API...");
    logToFile("URL: " + `${KHALTI_GATEWAY_URL}/epayment/initiate/`);
    logToFile("Payload: " + JSON.stringify(payload, null, 2));
    logToFile("Secret Key (first 10 chars): " + KHALTI_SECRET_KEY?.substring(0, 10) + "...");

    const response = await axios.post(
      `${KHALTI_GATEWAY_URL}/epayment/initiate/`,
      payload,
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    logToFile("✅ Khalti response received: " + JSON.stringify(response.data));

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (outerError: any) {
    try {
      logToFile("❌ OUTER ERROR in initiatePayment!");
      logToFile("Outer error message: " + outerError.message);
      logToFile("Outer error stack: " + outerError.stack);
      
      if (outerError.response) {
        logToFile("Axios response status: " + outerError.response.status);
        logToFile("Axios response data: " + JSON.stringify(outerError.response.data));
      } else if (outerError.request) {
        logToFile("No response received: " + JSON.stringify(outerError.request));
      }
    } catch (logError) {
      console.error("Error while logging:", logError);
    }

    res.status(500).json({
      success: false,
      message: "Failed to initiate payment. Check backend logs for details.",
      error: outerError.response?.data || outerError.message,
      debugInfo: {
        khaltiStatus: outerError.response?.status,
        khaltiData: outerError.response?.data,
        errorMessage: outerError.message,
      },
    });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      res.status(400).json({
        success: false,
        message: "Missing payment index (pidx)",
      });
      return;
    }

    // TEST MODE: Simulate successful payment verification
    if (KHALTI_TEST_MODE) {
      console.log("⚠️  Running in TEST MODE - simulating payment verification");
      
      // Simulate successful payment
      if (pidx.startsWith("test_pidx_")) {
        res.status(200).json({
          success: true,
          message: "Test mode: Payment verified successfully",
          data: {
            pidx: pidx,
            total_amount: 250000, // in paisa
            status: "Completed",
            transaction_id: `test_txn_${Date.now()}`,
            fee: 0,
            refunded: false,
          },
        });
        return;
      }
    }

    const response = await axios.post(
      `${KHALTI_GATEWAY_URL}/epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentData = response.data;

    // Check if payment was successful
    if (paymentData.status === "Completed") {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: paymentData,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
        data: paymentData,
      });
    }
  } catch (error: any) {
    console.error("Khalti verify payment error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.response?.data || error.message,
    });
  }
};
