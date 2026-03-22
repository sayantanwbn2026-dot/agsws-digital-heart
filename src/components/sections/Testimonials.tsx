import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
import { testimonials } from "@/data/testimonials";
import FadeInUp from "../ui/FadeInUp";

const Testimonials = () => (
  <section className="bg-background py-24">
    <div className="max-w-[1100px] mx-auto px-6">
      <FadeInUp className="text-center mb-16">
        <span className="label-text text-teal">Testimonials</span>
        <h2 className="heading-2 text-text-dark mt-3 before:hidden text-center">What People Say</h2>
      </FadeInUp>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-teal !opacity-30 !w-2 !h-2 !mx-1 transition-all duration-300",
          bulletActiveClass: "!opacity-100 !w-6 !rounded-full",
        }}
        loop
        spaceBetween={40}
        className="pb-16"
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i}>
            <div className="text-center max-w-[680px] mx-auto px-4">
              <span className="text-[96px] font-extrabold text-teal/[0.12] leading-none block -mb-12">"</span>
              <p className="text-xl text-text-dark italic leading-[1.75] mb-8">{t.quote}</p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.initials}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-text-dark">{t.author}</p>
                  <p className="text-sm text-text-light">{t.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default Testimonials;
