import { query } from "./_generated/server";

export const currentUser = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Nicht eingeloggt");
  return { userId: identity.subject };
});
