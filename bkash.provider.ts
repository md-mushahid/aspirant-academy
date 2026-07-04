import type {
  PaymentProvider,
  CreatePaymentInput,
  CreatePaymentResult,
  ExecutePaymentResult,
} from "./provider";

// Skeleton for bKash Tokenized Checkout (PGW). The flow shape is real
// (grant-token -> create -> execute), but wiring needs valid sandbox creds.
// NOTE: verify field/endpoint names against current bKash sandbox docs.

const BASE = process.env.BKASH_BASE_URL!;

async function grantToken(): Promise<string> {
  const res = await fetch(`${BASE}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: process.env.BKASH_USERNAME!,
      password: process.env.BKASH_PASSWORD!,
    },
    body: JSON.stringify({
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
    }),
  });
  const data = await res.json();
  if (!data.id_token) throw new Error("bKash: failed to grant token");
  return data.id_token as string;
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token,
    "X-APP-Key": process.env.BKASH_APP_KEY!,
  };
}

export const bkashProvider: PaymentProvider = {
  name: "bkash",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const token = await grantToken();
    // bKash expects a decimal string amount in BDT (major units).
    const amount = (input.amount / 100).toFixed(2);
    const res = await fetch(`${BASE}/tokenized/checkout/create`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        mode: "0011",
        payerReference: input.userId,
        callbackURL: input.callbackUrl,
        amount,
        currency: input.currency,
        intent: "sale",
        merchantInvoiceNumber: input.reference,
      }),
    });
    const data = await res.json();
    if (!data.paymentID || !data.bkashURL) {
      throw new Error("bKash: create payment failed");
    }
    return { providerPaymentId: data.paymentID, redirectUrl: data.bkashURL };
  },

  async executePayment(providerPaymentId: string): Promise<ExecutePaymentResult> {
    const token = await grantToken();
    const res = await fetch(`${BASE}/tokenized/checkout/execute`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ paymentID: providerPaymentId }),
    });
    const data = await res.json();
    const ok = data.transactionStatus === "Completed" || data.statusCode === "0000";
    return {
      status: ok ? "completed" : "failed",
      trxId: data.trxID,
      raw: data,
    };
  },
};
