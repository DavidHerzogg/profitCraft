import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addTrade = mutation({
  args: {
    userId: v.string(),
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("trades", args);
  },
});

export const getUserTrades = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const deleteTrade = mutation({
  args: {
    _id: v.id("trades"),
  },
  handler: async (ctx, { _id }) => {
    // Optional: Prüfe ob Trade existiert, bevor gelöscht wird
    const trade = await ctx.db.get(_id);
    if (!trade) {
      throw new Error("Trade nicht gefunden.");
    }

    await ctx.db.delete(_id);
    return { success: true };
  },
});

export const updateTrade = mutation({
  args: {
    _id: v.id("trades"),
    userId: v.string(),
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
  },
  handler: async (ctx, args) => {
    const { _id, ...updateFields } = args;
    await ctx.db.patch(_id, updateFields);
    return _id;
  },
});

export const importTrades = mutation({
  args: {
    userId: v.string(),         // User-ID muss vom Client mitkommen
    trades: v.array(v.any()),   // Liste der Trades
    mode: v.string(),           // Modus "append" oder "replace"
  },
  handler: async (ctx, args) => {
    // Wenn "replace" Modus, alle alten Trades löschen
    if (args.mode === "replace") {
      const existing = await ctx.db
        .query("trades")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();

      for (const trade of existing) {
        await ctx.db.delete(trade._id);
      }
    }

    // Neue Trades speichern
    for (const trade of args.trades) {
      await ctx.db.insert("trades", {
        userId: args.userId,
        name: typeof trade.name === "string" ? trade.name + " - import" : "unnamed - import",
        date:
          typeof trade.date === "string"
            ? trade.date
            : trade.date instanceof Date
            ? trade.date.toISOString()
            : new Date().toISOString(),
        entry: typeof trade.entry === "number" ? trade.entry : undefined,
        exit: typeof trade.exit === "number" ? trade.exit : undefined,
        size: typeof trade.size === "number" ? trade.size : undefined,
        screenshot: typeof trade.screenshot === "string" ? trade.screenshot : null,
        comment: typeof trade.comment === "string" ? trade.comment : "",
        strategy: typeof trade.strategy === "string" ? trade.strategy : "",
        direction: typeof trade.direction === "string" ? trade.direction : "long",
        ratio: typeof trade.ratio === "number" ? trade.ratio : 0,
        isLoss: typeof trade.isLoss === "boolean" ? trade.isLoss : false,
        errorTags: Array.isArray(trade.errorTags) ? trade.errorTags : [],
        pnlPercent: typeof trade.pnlPercent === "number" ? trade.pnlPercent : undefined,
        profit: typeof trade.profit === "number" ? trade.profit : 0,
      });
    }
  },
});



