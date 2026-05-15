import { createMiddleware } from "@tanstack/react-start";

export const ADMIN_KEY_STORAGE = "indigo_admin_key";

export const attachAdminPassword = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const key =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem(ADMIN_KEY_STORAGE)
        : null;
    return key
      ? next({ headers: { "x-admin-key": key } })
      : next();
  },
);