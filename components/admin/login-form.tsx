"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";

export function LoginForm() {
  const [state, action] = useActionState(loginAction, { message: "" });
  return (
    <form className="loginForm" action={action}>
      <label>Username<input name="username" type="text" autoComplete="username" autoFocus required placeholder="studio owner" /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required placeholder="••••••••••••" /></label>
      {state.message && <p className="formError" role="alert">{state.message}</p>}
      <SubmitButton>Enter the studio</SubmitButton>
    </form>
  );
}
