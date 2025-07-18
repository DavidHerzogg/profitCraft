import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import App from "./App.jsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk
        client={convex}
        useAuth={() => {
          const { getToken } = useAuth();
          return { getToken };
        }}
      >
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>
);
