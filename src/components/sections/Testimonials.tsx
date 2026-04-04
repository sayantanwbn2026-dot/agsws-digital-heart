import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/swiper-bundle.css";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import FadeInUp from "../ui/FadeInUp";
import { useCMSList } from "@/hooks/useCMSList";
import { Quote } from "lucide-react";

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
    <section className="bg-white py-20 lg:py-24">
      <div className="container">
        <FadeInUp className="text-center mb-14">
          <span className="label">Testimonials</span>
          <h2 className="text-[var(--dark)] mt-3 text-center">What People Say</h2>
        </FadeInUp>

        <div className="relative max-w-[760px] mx-auto pb-12">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            spaceBetween={40}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full relative"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="text-center max-w-[640px] mx-auto px-6 relative">
                  {/* Quote icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[var(--teal-light)] flex items-center justify-center mx-auto mb-8">
                    <Quote size={20} className="text-[var(--teal)]" />
                  </div>

                  <p className="text-[clamp(17px,2vw,21px)] font-[500] text-[var(--dark)] italic leading-[1.85] mb-10">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] flex items-center justify-center text-white font-[700] text-[14px] shadow-[0_4px_12px_rgba(31,154,168,0.25)]">
                      {t.initials}
                    </div>
                    <div className="text-left">
                      <p className="font-[700] text-[15px] text-[var(--dark)]">{t.author}</p>
                      <p className="text-[12px] font-[500] text-[var(--teal)]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Dots */}
          <div className="mt-10 flex justify-center items-center gap-2 relative z-20">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === i
                    ? "w-8 h-2 bg-[var(--teal)]"
                    : "w-2 h-2 bg-[var(--teal)]/20 hover:bg-[var(--teal)]/40"
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
