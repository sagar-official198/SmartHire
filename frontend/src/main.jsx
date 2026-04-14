import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { GoogleOAuthProvider } from "@react-oauth/google";


const GOOGLE_CLIENT_ID = "32101424845-9i8vi5iepjfl18tjj4pseivm004bhd7u.apps.googleusercontent.com";
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


if (!GOOGLE_CLIENT_ID) {
  throw new Error("Missing Google Client ID");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkPubKey}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);