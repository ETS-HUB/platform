"use client";

import { App } from "antd";

/**
 * Returns context-aware modal from Antd App.useApp().
 * Must be used inside a component that is a descendant of <App>.
 * Use this instead of Modal.confirm() to avoid the static API warning.
 */
export function useAdminModal() {
  const { modal } = App.useApp();
  return modal;
}
