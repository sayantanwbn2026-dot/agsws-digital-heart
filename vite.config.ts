import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// @ts-expect-error — JS module without types
import { runAudit } from "./scripts/cms-audit.mjs";

function cmsAuditPlugin(env: Record<string, string>) {
  return {
    name: "cms-route-audit",
    apply: "build" as const,
    async buildStart() {
      await runAudit({
        url: env.VITE_SUPABASE_URL,
        key: env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY,
        strict: env.CMS_AUDIT_STRICT === "1",
      });
    },
  };
}

/**
 * In a prototype build (VITE_DEMO_MODE=true) replace robots.txt with a
 * blanket disallow. The <meta name="robots"> tag is rendered by JavaScript, so
 * a crawler that doesn't run JS would otherwise be free to index the preview.
 * Production builds keep the real robots.txt from public/ untouched.
 */
function demoRobotsPlugin(isDemo: boolean) {
  return {
    name: "demo-robots",
    apply: "build" as const,
    generateBundle(this: { emitFile: (f: { type: "asset"; fileName: string; source: string }) => void }) {
      if (!isDemo) return;
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `# Prototype preview - not for indexing.
User-agent: *
Disallow: /
`,
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: Number(env.PORT) || 8080,
      strictPort: false,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      cmsAuditPlugin(env),
      demoRobotsPlugin(env.VITE_DEMO_MODE === "true"),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Split the big, rarely-changing libraries into their own chunks. They
      // then stay in the browser cache across deploys instead of being
      // re-downloaded every time page code changes.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id))
              return "vendor-react";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("@radix-ui")) return "vendor-radix";
            // recharts/d3 are deliberately NOT given a manual chunk: only the
            // lazily-loaded admin dashboard uses them, so Rollup keeps them
            // inside that chunk. Hoisting them into a shared vendor chunk made
            // the entry reference it, pulling 425 kB onto every public page.
          },
        },
      },
      // Every remaining chunk is genuinely page-sized now, so a lower ceiling
      // makes a regression here show up as a build warning.
      chunkSizeWarningLimit: 700,
    },
    define: {
      // Forward NEXT_PUBLIC_* vars so import.meta.env.VITE_NEXT_PUBLIC_* works
      "import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(
        env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || ""
      ),
      "import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      ),
    },
  };
});

