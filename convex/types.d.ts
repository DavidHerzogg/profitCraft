import "convex/server";

declare module "convex/server" {
  interface Auth {
    userId?: string;
  }
}
