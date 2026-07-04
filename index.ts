import { connectDB } from "@/lib/db";
import { SubscriptionModel } from "@/lib/db/models/subscription.model";

// Single source of truth for "is this user premium right now".
export async function hasActivePremium(userId: string): Promise<boolean> {
  await connectDB();
  const sub = await SubscriptionModel.findOne({
    userId,
    plan: "premium",
    status: "active",
    $or: [
      { currentPeriodEnd: { $gt: new Date() } },
      { currentPeriodEnd: null },
    ],
  }).lean();
  return Boolean(sub);
}

// Gate a piece of content. `isFree` content is always allowed.
export async function canAccess(
  userId: string | null,
  content: { isFree?: boolean }
): Promise<boolean> {
  if (content.isFree) return true;
  if (!userId) return false;
  return hasActivePremium(userId);
}
