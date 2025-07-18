export default {
  auth: {
    oidc: {
      issuer: import.meta.env.VITE_CLERK_JWT_ISSUER,
      audience: import.meta.env.VITE_CLERK_JWT_AUDIENCE,
    },
  },
};