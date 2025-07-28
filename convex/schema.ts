import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  trades: defineTable({
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
  }).index("by_user", ["userId"]),

  userSettings: defineTable({
    userId: v.string(),
    strategies: v.array(v.string()),
    errorTags: v.array(v.string()),
    purchasedProductIds: v.optional(v.array(v.id("products"))),
    startCapital: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  products: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.optional(v.float64()),
    currency: v.optional(v.string()),
    actionText: v.optional(v.string()),
    img: v.string(),
    category: v.string(),
    taxIncluded: v.optional(v.boolean()),
    paymentMethods: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    legalLinks: v.optional(
      v.object({
        agb: v.optional(v.string()),
        widerruf: v.optional(v.string()),
      })
    ),
    externalLink: v.optional(v.string()),
    //neu
    guide: v.optional(v.string()),
  }),
});
