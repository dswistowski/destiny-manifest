import { Language } from "@dswistowski/destiny-manifest-react";
import { persist } from "zustand/middleware";

import create from "zustand/vanilla";
import reactCreate from "zustand";

interface Store {
  language: Language;
  changeLanguage: (language: Language) => void;
}

export const store = create(
  persist<Store>((set) => ({
    language: "en",
    changeLanguage: (language) => set({ language }),
  }))
);

export const useStore = reactCreate(store);
