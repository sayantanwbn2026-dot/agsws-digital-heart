import { useEffect } from "react";

export const useSEO = (title: string, description: string) => {
  useEffect(() => {
    document.title = `${title} | AGSWS`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", description);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = description;
      document.head.appendChild(newMeta);
    }
  }, [title, description]);
};
