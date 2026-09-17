import { requireAdmin } from "@e-commerce/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  return NextResponse.json({ message: "Welcome, admin!" });
}