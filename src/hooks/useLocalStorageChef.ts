import { useState, useEffect } from "react";

export function useLocalStorageChef() {
  const [chef, setChef] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("chef");
    if (stored) {
      try {
        setChef(JSON.parse(stored));
      } catch {
        setChef(null);
      }
    }
  }, []);

  return chef;
}
