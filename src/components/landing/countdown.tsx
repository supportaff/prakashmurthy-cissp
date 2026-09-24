import { useEffect, useState } from "react";
import { formatSessionLocal } from "@/lib/session";

export function LocalTime({ date }: { date: Date }) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    setLabel(formatSessionLocal(date));
  }, [date]);
  if (!label) return null;
  return <p className="text-xs text-muted">Your time · {label}</p>;
}
