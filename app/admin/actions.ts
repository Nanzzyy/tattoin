"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, requireAdmin, verifyLogin } from "@/lib/auth";
import { createPortfolioItem, createPriceItem, removePortfolioItem, removePriceItem, updatePortfolioItem, updatePriceItem } from "@/lib/content";
import { firstZodError, portfolioSchema, priceSchema } from "@/lib/validation";

export type FormState = { message: string; success?: boolean };

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi."),
  password: z.string().min(1, "Password wajib diisi."),
});

export async function loginAction(_state: FormState, formData: FormData): Promise<FormState> {
  const result = loginSchema.safeParse({ username: formData.get("username"), password: formData.get("password") });
  if (!result.success) return { message: firstZodError(result.error) };

  const auth = await verifyLogin(result.data.username, result.data.password);
  if (!auth.ok) return { message: auth.message };

  await createSession(auth.adminId);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function savePortfolioAction(id: number | null, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = portfolioSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { message: firstZodError(result.error) };

  const fileValue = formData.get("image");
  const file = fileValue instanceof File ? fileValue : null;

  try {
    if (id) await updatePortfolioItem(id, result.data, file);
    else {
      if (!file) return { message: "Gambar portfolio wajib dipilih." };
      await createPortfolioItem(result.data, file);
    }
  } catch (error) {
    return { message: error instanceof Error ? error.message : "Portfolio gagal disimpan." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio?saved=1");
}

export async function deletePortfolioAction(id: number) {
  await requireAdmin();
  await removePortfolioItem(id);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio?deleted=1");
}

export async function savePriceAction(id: number | null, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = priceSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { message: firstZodError(result.error) };

  try {
    if (id) await updatePriceItem(id, result.data);
    else await createPriceItem(result.data);
  } catch (error) {
    return { message: error instanceof Error ? error.message : "Harga gagal disimpan." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/prices");
  redirect("/admin/prices?saved=1");
}

export async function deletePriceAction(id: number) {
  await requireAdmin();
  await removePriceItem(id);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/prices");
  redirect("/admin/prices?deleted=1");
}
