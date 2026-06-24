'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { weddingData } from '@/lib/wedding-data';
import { CountdownSection } from '@/components/countdown-section';
import { VenueSection } from '@/components/venue-section';
import { ContactSection } from '@/components/contact-section';
import { ClosingSection } from '@/components/closing-section';

type Stage = 'opening' | 'invitation';

export default function Home() {
  const [stage, setStage] = useState<Stage>('opening');
  const [started, setStarted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // المستخدم يضغط الشاشة لبدء الأنيميشن + الموسيقى معاً
  const handleStart = () => {
    if (stage !== 'opening' || started) return;
    setStarted(true);

    // ابدأ الموسيقى
    const a = audioRef.current;
    if (a) {
      a.muted = false;
      a.volume = 1;
      a.play().then(() => setMusicOn(true)).catch(() => {});
    }

    // شغّل فيديو الأنيميشن من البداية
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = true;
      v.play().catch(() => {});
    }

    // بعد انتهاء الأنيميشن، انتقل مباشرة للدعوة
    setTimeout(() => {
      setStage('invitation');
    }, 4900);
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (musicOn) {
      a.pause();
      setMusicOn(false);
    } else {
      a.play().then(() => setMusicOn(true)).catch(() => {});
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-black" dir="rtl">
      {/* عنصر الصوت */}
      <audio
        ref={audioRef}
        src={weddingData.music.src}
        loop
        preload="auto"
        className="hidden"
      />

      {/* زر التحكم بالموسيقى — يظهر بعد بدء التشغيل (أسفل اليمين) */}
      <AnimatePresence>
        {started && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={toggleMusic}
            className="fixed bottom-4 right-4 z-50 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-[#722F37]/20 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            aria-label={musicOn ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {musicOn ? (
              <Volume2 className="w-5 h-5 text-[#722F37]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#722F37]" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* المرحلة 1: أنيميشن الافتتاح */}
      <AnimatePresence mode="wait">
        {stage === 'opening' && (
          <OpeningAnimationStage
            key="opening"
            videoRef={videoRef}
            started={started}
            onStart={handleStart}
          />
        )}
      </AnimatePresence>

      {/* المرحلة 2: الدعوة الكاملة */}
      {stage === 'invitation' && <InvitationStage key="invitation" />}
    </main>
  );
}

/* ============================================================
   المرحلة 1 — أنيميشن الافتتاح
   الصورة الزخرفية تُعرض فوراً (poster) بينما يُحمّل الفيديو في الخلفية.
   عند الضغط: يبدأ الفيديو من البداية + الموسيقى معاً.
   ============================================================ */
function OpeningAnimationStage({
  videoRef,
  started,
  onStart,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  started: boolean;
  onStart: () => void;
}) {
  return (
    <motion.section
      key="opening"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0 }}
      onClick={onStart}
      className="absolute inset-0 z-20 bg-black flex items-center justify-center cursor-pointer"
    >
      {/* صورة Poster — تُعرض فوراً (الباب المغلق مع قوس الزهور - من بداية الفيديو) */}
      <img
        src={weddingData.theme.openingPoster}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      />
      {/* فيديو الأنيميشن — يبدأ فقط بعد الضغط */}
      <video
        ref={videoRef}
        src={weddingData.theme.openingAnimation}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 2, opacity: started ? 1 : 0 }}
        muted
        playsInline
        preload="auto"
      />
      {/* نص "TAP TO OPEN" — مركز الشاشة فوق الباب */}
      {!started && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-4"
          style={{ pointerEvents: 'none' }}
        >
          {/* أيقونة دائرية نابضة */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '2px solid rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
          {/* النص */}
          <span
            className="text-base sm:text-lg"
            style={{
              fontFamily: 'var(--font-reem-kufi)',
              color: '#FAF8F2',
              textShadow: '0 2px 16px rgba(0,0,0,1)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            Tap to Open
          </span>
        </motion.div>
      )}
    </motion.section>
  );
}

/* ============================================================
   المرحلة 2 — الدعوة الكاملة
   تصميم مستوحى من Vowlee "Enchanted":
   - خلفية ثابتة (لا فيديو متكرر)
   - ألوان: وردي فاتح + بنفسجي-رمادي + كحلي داكن
   - أقسام بألوان متبادلة
   ============================================================ */
function InvitationStage() {
  // تباعد عمودي موحّد بين كل الكتل (متناظر)
  const GAP = 'mb-6'; // 3rem = 48px بين كل عنصر

  // إعدادات الأنيميشن المشتركة — تظهر مرة واحدة فقط وتبقى ظاهرة
  const reveal = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5, ease: 'easeOut' as const },
  };

  // نفس الإعداد لكن مع scale للعناصر الكبيرة (الأسماء)
  const revealScale = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.1, ease: 'easeOut' as const },
  };

  // ألوان Vowlee Enchanted
  const colors = {
    bodyBg: '#EAD7E5',         // وردي فاتح
    sectionBg: '#726C82',      // بنفسجي-رمادي
    sectionAltBg: '#0E1225',   // كحلي داكن
    text: '#FAF8F2',           // أبيض كريمي
  };

  return (
    <motion.section
      key="invitation"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative z-30 w-full min-h-screen"
    >
      {/* ============================================================
          الخلفية — ثابتة (fixed) لكامل الشاشة، مستقلة عن النص
          تغطي كل الشاشة على كل الأجهزة بدون حواف
          ============================================================ */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${weddingData.theme.invitationBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          // لا نستخدم backgroundAttachment: fixed لأنها تسبب مشاكل على iOS
          // بدلاً من ذلك، العنصر نفسه fixed
        }}
      />
      {/* طبقة تدرّج خفيفة لتحسين وضوح النص */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* ============================================================
          المحتوى — مستقل تماماً عن الخلفية
          النصوص تظهر واحدة تلو الأخرى (sequential)
          ============================================================ */}
      <div className="relative z-10 w-full">
        {/* ============================================================
            القسم 1: الدعوة الرئيسية
            ============================================================ */}
        <div className="relative w-full pt-32 pb-12 px-6 flex flex-col items-center justify-start text-center">
          {/* 1. بسم الله الرحمن الرحيم — الرمز ﷽ */}
          <motion.p
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`text-2xl sm:text-3xl ${GAP}`}
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              fontWeight: 700,
              textShadow: '0 2px 20px rgba(0,0,0,1), 0 4px 40px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,0.8)',
              lineHeight: 1.8,
            }}
          >
            ﷽
          </motion.p>

          {/* 2. عنوان: دعوة زفاف — يظهر ثانياً */}
          <motion.h1
            initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`text-5xl sm:text-7xl ${GAP}`}
            style={{
              fontFamily: 'var(--font-aref-ruqaa)',
              color: '#ffffff',
              fontWeight: 700,
              textShadow: '0 4px 24px rgba(0,0,0,1), 0 8px 40px rgba(0,0,0,0.95)',
              lineHeight: 1.2,
            }}
          >
            دعوة زفاف
          </motion.h1>

          {/* 3. فاصل زخرفي — يظهر ثالثاً */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`w-40 h-px ${GAP}`}
            style={{ backgroundColor: 'rgba(250, 248, 242, 0.7)', boxShadow: '0 0 12px rgba(250,248,242,0.5)' }}
          />

          {/* 4. الآية الكريمة — تظهر رابعاً */}
          <motion.p
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`text-xl sm:text-2xl md:text-3xl leading-[2.2] max-w-2xl ${GAP}`}
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              fontWeight: 400,
              textShadow: '0 2px 16px rgba(0,0,0,1), 0 4px 30px rgba(0,0,0,0.95)',
              direction: 'rtl',
            }}
          >
            ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ﴾
          </motion.p>

          {/* 5. فاصل زخرفي ثانٍ — يظهر خامساً */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`w-40 h-px ${GAP}`}
            style={{ backgroundColor: 'rgba(250, 248, 242, 0.7)', boxShadow: '0 0 12px rgba(250,248,242,0.5)' }}
          />

          {/* 6. بعد إهدائكم عاطر التحية وأزكى السلام */}
          <motion.p
            initial={{ opacity: 0, y: 35, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`text-xl sm:text-2xl max-w-xl leading-[1.8] ${GAP}`}
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              textShadow: '0 2px 16px rgba(0,0,0,1)',
            }}
          >
            بعد إهدائكم عاطر التحية وأزكى السلام
          </motion.p>

          {/* 7. تتشرف عائلتا */}
          <motion.p
            initial={{ opacity: 0, y: 35, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`text-2xl sm:text-3xl ${GAP}`}
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              textShadow: '0 2px 16px rgba(0,0,0,1)',
            }}
          >
            تتشرف عائلتا
          </motion.p>

          {/* 8. السيد خالد بن روينة وحرمه */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`text-4xl sm:text-5xl ${GAP}`}
            style={{
              fontFamily: 'var(--font-aref-ruqaa)',
              color: '#ffffff',
              fontWeight: 700,
              textShadow: '0 4px 20px rgba(0,0,0,1), 0 8px 40px rgba(0,0,0,0.95)',
              lineHeight: 1.2,
            }}
          >
            السيد خالد بن روينة وحرمه
          </motion.p>

          {/* 9. والسيد مصطفى التريكي وحرمه */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`text-4xl sm:text-5xl ${GAP}`}
            style={{
              fontFamily: 'var(--font-aref-ruqaa)',
              color: '#ffffff',
              fontWeight: 700,
              textShadow: '0 4px 20px rgba(0,0,0,1), 0 8px 40px rgba(0,0,0,0.95)',
              lineHeight: 1.2,
            }}
          >
            والسيد مصطفى التريكي وحرمه
          </motion.p>

          {/* 10. بدعوتكم أنتم وعائلتكم الكريمة لحضور حفل زفاف ابنيهما */}
          <motion.p
            initial={{ opacity: 0, y: 35, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`text-xl sm:text-2xl max-w-xl leading-[1.8] ${GAP}`}
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              textShadow: '0 2px 16px rgba(0,0,0,1)',
            }}
          >
            بدعوتكم أنتم وعائلتكم الكريمة لحضور حفل زفاف ابنيهما
          </motion.p>

          {/* 9. اسم العريس — يظهر تاسعاً */}
          <motion.p
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`text-6xl sm:text-7xl md:text-8xl ${GAP}`}
            style={{
              fontFamily: 'var(--font-aref-ruqaa)',
              color: '#ffffff',
              fontWeight: 700,
              textShadow: '0 4px 24px rgba(0,0,0,0.98), 0 8px 50px rgba(0,0,0,1)',
              lineHeight: 1.2,
            }}
          >
            أشرف بن روينة
          </motion.p>

          {/* 10. نص الرابط: على الآنسة الكريمة — يظهر عاشراً */}
          <motion.p
            initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`text-2xl sm:text-3xl italic ${GAP}`}
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              textShadow: '0 2px 16px rgba(0,0,0,1)',
            }}
          >
            على الآنسة الكريمة
          </motion.p>

          {/* 11. اسم العروس — يظهر حادياً عشر */}
          <motion.p
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`text-6xl sm:text-7xl md:text-8xl ${GAP}`}
            style={{
              fontFamily: 'var(--font-aref-ruqaa)',
              color: '#ffffff',
              fontWeight: 700,
              textShadow: '0 4px 24px rgba(0,0,0,0.98), 0 8px 50px rgba(0,0,0,1)',
              lineHeight: 1.2,
            }}
          >
            آمنة التريكي
          </motion.p>

          {/* 12. فاصل — يظهر ثاني عشر */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`w-32 h-px ${GAP}`}
            style={{ backgroundColor: 'rgba(250, 248, 242, 0.7)', boxShadow: '0 0 12px rgba(250,248,242,0.5)' }}
          />

          {/* 13. التاريخ — يظهر ثالث عشر */}
          <motion.span
            initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`text-2xl sm:text-3xl tracking-[0.1em] ${GAP}`}
            style={{
              fontFamily: 'var(--font-reem-kufi)',
              color: '#ffffff',
              textShadow: '0 2px 16px rgba(0,0,0,1)',
            }}
          >
            {weddingData.event.dateLongAr}
          </motion.span>

          {/* 14. الوقت — يظهر رابع عشر */}
          <motion.span
            initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg italic"
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              textShadow: '0 2px 16px rgba(0,0,0,1)',
            }}
          >
            {weddingData.event.timeDisplayAr}
          </motion.span>
        </div>

        {/* ============================================================
            الأقسام التالية — كلها فوق نفس الخلفية الموحدة
            ============================================================ */}
        <div className="relative w-full flex flex-col items-center">
          <div className="w-full px-6">
            {/* قسم العد التنازلي */}
            <CountdownSection />

            {/* قسم المكان (القاعة) */}
            <VenueSection />

            {/* قسم التواصل */}
            <ContactSection />

            {/* قسم الختام */}
            <ClosingSection />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
