import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import LinkedIn from "@auth/core/providers/linkedin"
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Resend, LinkedIn],
});
