import { query } from "./_generated/server"
import { v } from "convex/values"; 

export const getAllProducts = query(async ({ db }) => {
  return await db.query("products").collect();
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
