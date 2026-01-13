import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await auth.api.signUpEmail({
    body: {
      name: "ACM JU",
      email: "acm@ju.com",
      password: "acm@ju.com",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy6ob7-Syw1CeNDSzy6u2EzQ9HLk0eCd6_aQ&s",
    },
  });
  return NextResponse.json({ message: "User created" });
}
