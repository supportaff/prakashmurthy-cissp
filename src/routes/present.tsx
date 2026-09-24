import { createFileRoute } from "@tanstack/react-router";
import { Presenter } from "@/components/present/deck";

export const Route = createFileRoute("/present")({
  component: Presenter,
  head: () => ({
    meta: [
      { title: "Present — Prakashmurthy" },
      { name: "robots", content: "noindex" },
    ],
  }),
});
