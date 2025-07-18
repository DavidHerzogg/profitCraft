// convex/trades.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const importTrades = mutation({
  args: {
    userId: v.string(),
    trades: v.array(
      v.object({
        name: v.string(),
        date: v.string(),
        profit: v.number(),
        ratio: v.number(),
        entry: v.optional(v.number()),
        exit: v.optional(v.number()),
        size: v.optional(v.number()),
        strategy: v.string(),
        direction: v.string(),
        screenshot: v.optional(v.string()),
        comment: v.optional(v.string()),
        errorTags: v.optional(v.array(v.string())),
        isLoss: v.boolean(),
        pnlPercent: v.optional(v.number()),
      })
    ),
    mode: v.union(v.literal("append"), v.literal("replace")),
  },
  handler: async (ctx, args) => {
    const { userId, trades, mode } = args;

    if (mode === "replace") {
      const existing = await ctx.db
        .query("trades")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      await Promise.all(
        existing.map((trade) => ctx.db.delete(trade._id))
      );
    }

    await Promise.all(
      trades.map((trade) =>
        ctx.db.insert("trades", {
          ...trade,
          userId,
        })
      )
    );
  },
});
