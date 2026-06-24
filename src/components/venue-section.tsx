'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Navigation } from 'lucide-react';
import { weddingData } from '@/lib/wedding-data';

/**
 * قسم المكان (القاعة) — يدعم عدة أماكن
 * كل مكان يعرض:
 *  - عنوان القسم (حفل العشاء / حفل الزفاف)
 *  - اسم القاعة
 *  - العنوان
 *  - خريطة جوجل ستالايت مدمجة (iframe)
 *  - زر "افتح في خرائط جوجل"
 */

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

type Venue = (typeof weddingData.venues)[number];

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* عنوان القسم — حفل العشاء / حفل الزفاف */}
      <motion.div
        {...reveal}
        className="flex flex-col items-center gap-3 mb-6 w-full max-w-full"
      >
        <div className="w-24 h-px flex-shrink-0" style={{ backgroundColor: 'rgba(250, 248, 242, 0.6)' }} />

        <motion.h2
          {...reveal}
          className="text-4xl sm:text-5xl md:text-6xl whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-aref-ruqaa)',
            color: '#ffffff',
            fontWeight: 700,
            textShadow: '0 4px 24px rgba(0,0,0,1), 0 8px 40px rgba(0,0,0,0.95)',
            lineHeight: 1.2,
          }}
        >
          {venue.title}
        </motion.h2>

        <div className="w-24 h-px flex-shrink-0" style={{ backgroundColor: 'rgba(250, 248, 242, 0.6)' }} />
      </motion.div>

      {/* اسم القاعة */}
      <motion.h3
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl sm:text-3xl mb-6 whitespace-nowrap w-full text-center"
        style={{
          fontFamily: 'var(--font-aref-ruqaa)',
          color: '#ffffff',
          fontWeight: 700,
          textShadow: '0 4px 20px rgba(0,0,0,1), 0 8px 40px rgba(0,0,0,0.95)',
          lineHeight: 1.2,
          maxWidth: '100%',
          overflowWrap: 'normal',
        }}
      >
        {venue.name}
      </motion.h3>

      {/* التاريخ والوقت — مع أيقونة الساعة */}
      {venue.date && venue.time && (
        <motion.div
          {...reveal}
          className="flex flex-col items-center gap-2 mb-6"
        >
          {/* التاريخ مع أيقونة الساعة */}
          <div className="flex items-center gap-2" style={{ direction: 'rtl' }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white" strokeWidth={1.5}>
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              className="text-xl sm:text-2xl"
              style={{
                fontFamily: 'var(--font-reem-kufi)',
                color: '#ffffff',
                textShadow: '0 2px 16px rgba(0,0,0,1)',
                letterSpacing: '0.05em',
              }}
            >
              {venue.date}
            </span>
          </div>
          {/* الوقت */}
          <span
            className="text-base sm:text-lg italic"
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {venue.time}
          </span>
        </motion.div>
      )}

      {/* ملاحظة الحفلة الغنائية — مع أيقونة الموسيقى */}
      {venue.note && (
        <motion.div
          {...reveal}
          className="flex items-center gap-2 mb-6 px-5 py-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            direction: 'rtl',
          }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          <span
            className="text-base sm:text-lg"
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {venue.note}
          </span>
        </motion.div>
      )}

      {/* العنوان */}
      <motion.div
        {...reveal}
        className="flex flex-col items-center gap-2 mb-6 max-w-md w-full"
      >
        <p
          className="text-lg sm:text-xl"
          style={{
            fontFamily: 'var(--font-reem-kufi)',
            color: '#ffffff',
            textShadow: '0 2px 16px rgba(0,0,0,1)',
            letterSpacing: '0.02em',
          }}
        >
          {venue.address}
        </p>
        {venue.addressFr && (
          <p
            className="text-sm sm:text-base italic opacity-90"
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {venue.addressFr}
          </p>
        )}
      </motion.div>

      {/* خريطة جوجل ستالايت مدمجة */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden mb-4"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)' }}
        />
        <iframe
          src={venue.mapsEmbedUrl}
          title={`موقع ${venue.name}`}
          className="w-full"
          style={{
            height: '280px',
            border: 0,
            display: 'block',
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </motion.div>

      {/* زر "افتح في خرائط جوجل" */}
      <motion.a
        {...reveal}
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full transition-colors"
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.3)',
          fontFamily: 'var(--font-reem-kufi)',
          color: '#ffffff',
          fontSize: '14px',
          letterSpacing: '0.05em',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        <Navigation className="w-4 h-4" />
        <span>افتح في خرائط جوجل</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
      </motion.a>
    </div>
  );
}

export function VenueSection() {
  return (
    <section
      id="venue"
      className="relative w-full py-12 px-4 sm:px-6 flex flex-col items-center text-center overflow-x-hidden"
    >
      {/* عنوان القسم الرئيسي */}
      <motion.div
        {...reveal}
        className="flex flex-col items-center gap-3 mb-10 w-full max-w-full"
      >
        <div className="w-24 h-px flex-shrink-0" style={{ backgroundColor: 'rgba(250, 248, 242, 0.6)' }} />

        <motion.h2
          {...reveal}
          className="text-4xl sm:text-5xl md:text-6xl whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-aref-ruqaa)',
            color: '#ffffff',
            fontWeight: 700,
            textShadow: '0 4px 24px rgba(0,0,0,1), 0 8px 40px rgba(0,0,0,0.95)',
            lineHeight: 1.2,
          }}
        >
          المكان
        </motion.h2>

        <div className="w-24 h-px flex-shrink-0" style={{ backgroundColor: 'rgba(250, 248, 242, 0.6)' }} />
      </motion.div>

      {/* بطاقات الأماكن — حفل العشاء أولاً ثم حفل الزفاف */}
      <div className="w-full flex flex-col items-center gap-12">
        {weddingData.venues.map((venue, i) => (
          <VenueCard key={i} venue={venue} />
        ))}
      </div>
    </section>
  );
}
