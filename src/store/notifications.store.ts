import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationsState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      enabled: false,
      setEnabled: (enabled) => set({ enabled }),
    }),
    { name: "market-clock-notifications" }
  )
);
