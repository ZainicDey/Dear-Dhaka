"use server";

import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL_MAP: Record<string, string> = {
  admin: "admin@deardhaka.com",
};

export async function loginAdmin(
  username: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  const email = ADMIN_EMAIL_MAP[username.toLowerCase()];

  if (!email) {
    return { success: false, error: "Invalid username or password" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "Invalid username or password" };
  }

  return { success: true };
}

export async function checkAdminSession(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
}

export async function logoutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}
