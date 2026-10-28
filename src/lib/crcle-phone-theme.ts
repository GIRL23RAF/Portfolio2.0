import { useCallback, useSyncExternalStore } from "react";

/** Shared across CRCLE tabs so the sun toggle survives Signal Home → Messaging Hub. */
let light = true;
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  return light;
}

export function useCrclePhoneLight() {
  const isLight = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const toggleLight = useCallback(() => {
    light = !light;
    listeners.forEach((notify) => notify());
  }, []);
  return [isLight, toggleLight] as const;
}
