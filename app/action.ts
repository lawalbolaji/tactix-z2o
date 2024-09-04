"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signIn(prevState: any, formData: FormData) {
  const authSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const {
    success,
    error: validationError,
    data: authPayload,
  } = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!success) {
    console.log(validationError.flatten().fieldErrors);
    return {
      error: {
        fields: validationError.flatten().fieldErrors,
        type: "VALIDATION_ERROR",
      },
    };
  }

  console.log("attempted signin with username and password");

  /* sign in logic here */
  //   const supabase = createClient();
  const supabase = {} as any;
  const { error: authError } = await supabase.auth.signInWithPassword(authPayload);
  if (authError) {
    console.log(authError);
    // if (authError.name === AUTH_ERROR) {
    //     return { error: { message: authError.message, type: AUTH_ERROR } };
    // }

    return { error: { message: authError.message, type: authError.name } };
  }

    revalidatePath("/dashboard", "layout");
    redirect("/dashboard");
}
