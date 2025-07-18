import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveSettings = mutation({
  args: {
    userId: v.string(),
    strategies: v.array(v.string()),
    errorTags: v.array(v.string()),
    purchasedProductIds: v.optional(v.array(v.id('products'))),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      // Patch alle Felder, auch purchasedProductIds (oder leeres Array)
      return await ctx.db.patch(existing._id, {
        strategies: args.strategies,
        errorTags: args.errorTags,
        purchasedProductIds: args.purchasedProductIds ?? existing.purchasedProductIds ?? [],
      });
    }

    return await ctx.db.insert("userSettings", {
      userId: args.userId,
      strategies: args.strategies,
      errorTags: args.errorTags,
      purchasedProductIds: args.purchasedProductIds ?? [],
    });
  },
});

export const getSettings = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return (
      settings ?? {
        strategies: [],
        errorTags: [],
        purchasedProductIds: [],
      }
    );
  },
});

export const addPurchase = mutation({
  args: {
    userId: v.string(),
    productId: v.id('products'),
  },
  handler: async (ctx, { userId, productId }) => {
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (settings) {
      const purchased = settings.purchasedProductIds ?? [];
      if (!purchased.includes(productId)) {
        await ctx.db.patch(settings._id, {
          purchasedProductIds: [...purchased, productId],
        });
      }
      return settings._id;
    } else {
      return await ctx.db.insert("userSettings", {
        userId,
        strategies: [],
        errorTags: [],
        purchasedProductIds: [productId],
      });
    }
  },
});

export const getUserPurchasedProducts = query({
  args: { userId: v.string() },
  handler: async ({ db }, { userId }) => {
    const settings = await db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!settings?.purchasedProductIds?.length) {
      return [];
    }

    // Hole Produkte mit IDs aus purchasedProductIds
    // Achtung: db.query("products").filter(...) erfordert Zugriff auf Felder, die nicht im Schema sind,
    // deshalb machen wir hier db.get direkt für jede ID
    const products = await Promise.all(
      settings.purchasedProductIds.map((productId) => db.get(productId))
    );

    // Filtere ggf. nicht gefundene Produkte raus (kann passieren, wenn Produkt gelöscht)
    return products.filter(Boolean);
  },
});


