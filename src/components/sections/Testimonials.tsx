import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import FadeInUp from "../ui/FadeInUp";
import { useCMSList } from "@/hooks/useCMSList";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: cmsTestimonials } = useCMSList<any>('testimonials', [], {
    filter: { column: 'is_active', value: true },
    orderBy: { column: 'display_order' }
  });
  const testimonials = cmsTestimonials.length
    ? cmsTestimonials.map((t: any) => ({
        quote: t.quote,
        author: t.author,
        role: t.role ?? t.subtitle ?? '',
        initials: t.initials ?? t.author?.slice(0, 2).toUpperCase() ?? 'AA',
      }))
    : staticTestimonials;

  return (
    <section className="bg-[var(--bg)] py-[64px]">
      <div className="container">
        <FadeInUp className="text-center mb-12">
          <span className="label">Testimonials</span>
          <h2 className="text-[var(--dark)] mt-3 text-center">What People Say</h2>
        </FadeInUp>

        <div className="relative max-w-[800px] mx-auto pb-16">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            spaceBetween={40}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full relative px-4"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="text-center max-w-[680px] mx-auto px-10 relative z-10">
                  <span className="absolute top-[-30px] left-[0px] text-[120px] text-[var(--teal)] opacity-[0.1] z-0 pointer-events-none font-serif leading-none select-none">
                    "
                  </span>
                  <div className="relative z-10">
                    <p className="text-[clamp(17px,2.2vw,22px)] font-medium text-[var(--dark)] italic leading-[1.8] mb-12">
                      “{t.quote}”
                    </p>
                    <div className="flex items-center justify-center gap-5">
                      <div className="w-[56px] h-[56px] rounded-full bg-[var(--teal)] shadow-md flex items-center justify-center text-white font-bold text-[16px] border-2 border-white">
                        {t.initials}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-[16px] text-[var(--dark)] tracking-tight">{t.author}</p>
                        <p className="text-[13px] font-medium text-[var(--teal)] opacity-80">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Dots & Arrows Indicator */}
          <div className="mt-12 flex justify-center items-center gap-[12px] relative z-20">
            {testimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === i 
                    ? "w-8 h-2 bg-[var(--teal)] shadow-sm" 
                    : "w-2 h-2 bg-[var(--teal)] opacity-20 hover:opacity-40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
