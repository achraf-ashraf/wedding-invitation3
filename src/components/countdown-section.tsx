'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weddingData } from '@/lib/wedding-data';

/**
 * قسم العد التنازلي
 * عدّاد حيّ ينقص كل ثانية حتى موعد الزفاف.
 * الأرقام لاتينية (1234567890)، التسميات بالعربية.
 * يظهر بأنيميشن تدريجي عند التمرير إليه.
 */

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetISO: string): TimeLeft {
  const target = new Date(targetISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// بطاقة عدّ رقم واحد
function CountCard({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  const display = String(value).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
      className="flex flex-col items-center"
    >
      {/* الرقم */}
      <div
        className="relative w-16 h-20 sm:w-24 sm:h-28 rounded-xl flex items-center justify-center overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* خط فاصل علوي زخرفي */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-px bg-white/30" />
        {/* الرقم */}
        <motion.span
          key={display}
          initial={{ opacity: 0.5, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-3xl sm:text-5xl"
          style={{
            fontFamily: 'var(--font-reem-kufi)',
            color: '#ffffff',
            fontWeight: 600,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            letterSpacing: '0.05em',
          }}
        >
          {display}
        </motion.span>
        {/* خط فاصل سفلي زخرفي */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-px bg-white/30" />
      </div>
      {/* التسمية */}
      <span
        className="mt-2 sm:mt-3 text-sm sm:text-lg"
        style={{
          fontFamily: 'var(--font-amiri)',
          color: '#ffffff',
          textShadow: '0 1px 6px rgba(0,0,0,0.6)',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(weddingData.event.startDateISO),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calculateTimeLeft(weddingData.event.startDateISO));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // إعدادات الأنيميشن المشتركة
  const reveal = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.0, ease: 'easeOut' as const },
  };

  return (
    <section
      id="countdown"
      className="relative w-full py-8 px-6 flex flex-col items-center text-center"
    >
      {/* عنوان القسم */}
      <motion.div
        {...reveal}
        className="flex flex-col items-center gap-3 mb-4"
      >
        {/* فاصل علوي */}
        <div className="w-32 h-px bg-white/40" />

        <motion.h2
          {...reveal}
          className="text-5xl sm:text-7xl"
          style={{
            fontFamily: 'var(--font-aref-ruqaa)',
            color: '#ffffff',
            fontWeight: 700,
            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
            lineHeight: 1.2,
          }}
        >
          العد التنازلي
        </motion.h2>

        <motion.p
          {...reveal}
          className="text-base sm:text-lg italic max-w-md"
          style={{
            fontFamily: 'var(--font-amiri)',
            color: '#ffffff',
            textShadow: '0 1px 8px rgba(0,0,0,0.6)',
          }}
        >
          يتبقّى على لقائنا
        </motion.p>

        {/* فاصل سفلي */}
        <div className="w-32 h-px bg-white/40" />
      </motion.div>

      {/* البطاقات الأربع — كلها على سطر واحد */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="flex flex-nowrap justify-center items-start gap-2 sm:gap-4 w-full max-w-md sm:max-w-2xl"
        dir="ltr"
      >
        <CountCard value={timeLeft.days} label="يوم" delay={0} />
        <CountCard value={timeLeft.hours} label="ساعة" delay={0.1} />
        <CountCard value={timeLeft.minutes} label="دقيقة" delay={0.2} />
        <CountCard value={timeLeft.seconds} label="ثانية" delay={0.3} />
      </motion.div>

      {/* تاريخ الحفل أسفل العدّاد */}
      <motion.p
        {...reveal}
        className="mt-4 text-lg sm:text-xl"
        style={{
          fontFamily: 'var(--font-reem-kufi)',
          color: '#ffffff',
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          letterSpacing: '0.08em',
        }}
      >
        {weddingData.event.dateLongAr}
      </motion.p>

      <motion.p
        {...reveal}
        className="mt-2 text-base sm:text-lg italic"
        style={{
          fontFamily: 'var(--font-amiri)',
          color: '#ffffff',
          textShadow: '0 1px 8px rgba(0,0,0,0.6)',
        }}
      >
        {weddingData.event.timeDisplayAr}
      </motion.p>
    </section>
  );
}
