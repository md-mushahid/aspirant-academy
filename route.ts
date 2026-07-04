import { NextResponse } from "next/server";
import { connectDB, PaymentModel, SubscriptionModel } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const { paymentID } = await req.json();
    if (!paymentID) {
      return NextResponse.json({ error: "paymentID required" }, { status: 400 });
    }
    await connectDB();

    const payment = await PaymentModel.findOne({ providerPaymentId: paymentID });
    if (!payment) {
      return NextResponse.json({ error: "unknown payment" }, { status: 404 });
    }
    if (payment.status === "completed") {
      return NextResponse.json({ status: "completed" }); // idempotent
    }

    const result = await getPaymentProvider("bkash").executePayment(paymentID);

    if (result.status !== "completed") {
      await PaymentModel.updateOne(
        { _id: payment._id },
        { $set: { status: "failed", raw: result.raw } }
      );
      return NextResponse.json({ status: "failed" }, { status: 402 });
    }

    // Activate/extend premium for 30 days. (Kept simple; refine in a later slice.)
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const sub = await SubscriptionModel.findOneAndUpdate(
      { userId: payment.userId, plan: "premium" },
      {
        $set: {
          status: "active",
          currentPeriodEnd: periodEnd,
          provider: "bkash",
          providerRef: result.trxId,
        },
      },
      { upsert: true, new: true }
    );

    await PaymentModel.updateOne(
      { _id: payment._id },
      {
        $set: {
          status: "completed",
          trxId: result.trxId,
          subscriptionId: sub._id,
          raw: result.raw,
        },
      }
    );

    return NextResponse.json({ status: "completed" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
