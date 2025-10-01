import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

export function useAutoSaveLocalStorage<T>(
  key: string,
  initialValue: T,
  interval: number = 20000 // mặc định 20s
) {
  const [data, setData] = useLocalStorage<T>(key, initialValue);

  useEffect(() => {
    const timer = setInterval(() => {
      // Gọi lại setData để ép sync xuống localStorage
      setData((prev) => prev);
      console.log("💾 Auto-saved:", key);
    }, interval);

    return () => clearInterval(timer);
  }, [key, setData, interval]);

  return [data, setData] as const;
}
