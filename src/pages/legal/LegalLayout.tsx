import { ReactNode } from "react";
import { motion } from "framer-motion";
import PageHero from "@/components/layout/PageHero";
import { useSEO } from "@/hooks/useSEO";

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  updated: string;
  children: ReactNode;
}

const LegalLayout = ({ title, subtitle, updated, children }: LegalLayoutProps) => {
  useSEO({ title: `${title} — AGSWS`, description: subtitle });

  return (
    <>
      <PageHero badge="Legal" title={title} subtitle={subtitle} />
      <section className="py-16 bg-[hsl(var(--background))]">
        <div className="max-w-[760px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-8 md:p-12"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))] mb-8">
              Last updated · {updated}
            </p>
            <article className="prose prose-sm max-w-none text-[hsl(var(--foreground))]
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[hsl(var(--foreground))] [&_h2]:mt-8 [&_h2]:mb-3
              [&_p]:text-[14px] [&_p]:leading-[1.7] [&_p]:text-[hsl(var(--muted-foreground))] [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1.5 [&_ul]:mb-4
              [&_li]:text-[14px] [&_li]:text-[hsl(var(--muted-foreground))]
              [&_a]:text-[hsl(var(--primary))] [&_a]:underline">
              {children}
            </article>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LegalLayout;
