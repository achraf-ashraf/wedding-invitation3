'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { weddingData } from '@/lib/wedding-data';

/**
 * قسم الختام
 * يعرض:
 *  - رسالة الختام ("نتشرف بحضوركم..." / "سعداء بوجودكم...")
 *  - صورة الخط العربي الزخرفي
 *  - نافورة احتفالية من الفراشات الملونة وبتلات الزهور
 *    تنطلق من أسفل الشاشة عند وصول المستخدم للنهاية
 */

// ============================================================
// مكون النافورة الاحتفالية — فراشات + بتلات زهور
// ============================================================

interface Particle {
  id: number;
  // الموقع الابتدائي
  startX: number;     // نسبة من عرض الشاشة (0-1)
  startY: number;     // نسبة من ارتفاع الشاشة (0-1, 1 = أسفل)
  // الحركة
  velocityX: number;  // سرعة أفقية
  velocityY: number;  // سرعة عمودية (سالبة = للأعلى)
  gravity: number;    // الجاذبية
  // الشكل
  type: 'butterfly' | 'petal';
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  flutterPhase: number;
  flutterSpeed: number;
  // العمر
  life: number;       // 0-1
  maxLife: number;    // بالثواني
}

const BUTTERFLY_COLORS = [
  '#FF6B9D', '#FFB347', '#FFD700', '#FF8C42',
  '#C9A961', '#E6B8A2', '#DA70D6', '#FF69B4',
  '#FFA07A', '#F4A460', '#DDA0DD', '#FFB6C1',
];

const PETAL_COLORS = [
  '#FFB6C1', '#FFC0CB', '#FF69B4', '#FFD700',
  '#FFA07A', '#FFB347', '#DA70D6', '#FFD1DC',
  '#E6B8AF', '#F5DEB3',
];

// مكون فراشة واحدة (SVG)
function Butterfly({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{
        filter: `drop-shadow(0 0 4px ${color}66)`,
      }}
    >
      {/* الجناح الأيسر */}
      <path
        d="M 14,16 Q 6,10 4,16 Q 6,22 14,16 Z"
        fill={color}
        opacity={0.85}
      />
      {/* الجناح الأيمن */}
      <path
        d="M 18,16 Q 26,10 28,16 Q 26,22 18,16 Z"
        fill={color}
        opacity={0.85}
      />
      {/* الجناح السفلي الأيسر */}
      <path
        d="M 14,17 Q 8,22 6,26 Q 10,24 14,19 Z"
        fill={color}
        opacity={0.7}
      />
      {/* الجناح السفلي الأيمن */}
      <path
        d="M 18,17 Q 24,22 26,26 Q 22,24 18,19 Z"
        fill={color}
        opacity={0.7}
      />
      {/* جسم الفراشة */}
      <ellipse cx="16" cy="16" rx="1.2" ry="6" fill="#3a2818" />
      {/* رأس */}
      <circle cx="16" cy="9" r="1.5" fill="#3a2818" />
      {/* قرون الاستشعار */}
      <path d="M 15,8 Q 13,4 12,3" stroke="#3a2818" strokeWidth="0.6" fill="none" />
      <path d="M 17,8 Q 19,4 20,3" stroke="#3a2818" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

// مكون بتلة زهرة واحدة (SVG)
function Petal({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      style={{
        filter: `drop-shadow(0 0 3px ${color}66)`,
      }}
    >
      {/* بتلة منحنية */}
      <path
        d="M 10,2 Q 14,8 12,14 Q 10,18 8,14 Q 6,8 10,2 Z"
        fill={color}
        opacity={0.85}
      />
      {/* خط وسطي */}
      <path
        d="M 10,3 Q 10,10 10,16"
        stroke={color}
        strokeWidth="0.5"
        opacity={0.5}
        fill="none"
      />
    </svg>
  );
}

function CelebrationFountain({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      particlesRef.current = [];
      // Use requestAnimationFrame to defer the state update
      const id = requestAnimationFrame(() => setParticles([]));
      return () => cancelAnimationFrame(id);
    }

    startTimeRef.current = performance.now();
    lastSpawnRef.current = performance.now();
    particlesRef.current = [];

    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;

      // إطلاق جسيمات جديدة بشكل مستمر طالما النافورة فعّالة
      // (لا حد أقصى للمدة — الإيقاف يتم عبر prop active)
      const spawnInterval = 220; // أبطأ: دفعة كل 220 مللي ثانية (كانت 80)
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const newParticles: Particle[] = [];
        const count = 1 + Math.floor(Math.random() * 2); // 1-2 جسيمات فقط (أخف)
        for (let i = 0; i < count; i++) {
          const isButterfly = Math.random() > 0.45;
          const centerBias = (Math.random() - 0.5) * 0.3;
          const startX = 0.5 + centerBias;
          const isLeftStart = Math.random() > 0.5;
          newParticles.push({
            id: now + i + Math.random(),
            startX,
            startY: 1.02,
            velocityX: (isLeftStart ? -1 : 1) * (Math.random() * 1.5 + 0.5) * 60,
            velocityY: -(Math.random() * 3 + 4) * 80,
            gravity: 80 + Math.random() * 40,
            type: isButterfly ? 'butterfly' : 'petal',
            size: isButterfly
              ? 24 + Math.random() * 28
              : 14 + Math.random() * 18,
            color: isButterfly
              ? BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)]
              : PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 180,
            flutterPhase: Math.random() * Math.PI * 2,
            flutterSpeed: 4 + Math.random() * 4,
            life: 0,
            maxLife: 5 + Math.random() * 3, // تعيش أطول قليلاً (5-8 ثوانٍ)
          });
        }
        particlesRef.current = [...particlesRef.current, ...newParticles];
      }

      // تحديث مواقع الجسيمات
      const deltaT = 1 / 60;
      particlesRef.current = particlesRef.current
        .map(p => {
          const newLife = p.life + deltaT / p.maxLife;
          const newVy = p.velocityY + p.gravity * deltaT;
          const dx = (p.velocityX * deltaT) / 400 * 100;
          const dy = (newVy * deltaT) / 800 * 100;
          const flutter = p.type === 'butterfly'
            ? Math.sin(p.flutterPhase + elapsed * p.flutterSpeed) * 0.3
            : 0;
          return {
            ...p,
            startX: p.startX + (dx / 100) + flutter * deltaT,
            startY: p.startY + (dy / 100),
            velocityY: newVy,
            rotation: p.rotation + p.rotationSpeed * deltaT,
            life: newLife,
          };
        })
        .filter(p => p.life < 1 && p.startY < 1.2 && p.startX > -0.2 && p.startX < 1.2);

      // تحديث الحالة للعرض (مرة واحدة لكل إطار)
      const snapshot = [...particlesRef.current];
      requestAnimationFrame(() => setParticles(snapshot));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [active]);

  if (!active && particles.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map(p => {
        const opacity = p.life < 0.2
          ? p.life * 5
          : p.life > 0.7
            ? (1 - p.life) / 0.3
            : 1;
        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.startX * 100}%`,
              top: `${p.startY * 100}%`,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              opacity,
              willChange: 'transform, opacity, left, top',
            }}
          >
            {p.type === 'butterfly' ? (
              <Butterfly color={p.color} size={p.size} />
            ) : (
              <Petal color={p.color} size={p.size} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// قسم الختام الرئيسي
// ============================================================

export function ClosingSection() {
  const [celebrationActive, setCelebrationActive] = useState(false);

  // فعّل النافورة عند تمرير المستخدم في أي مكان بالصفحة
  // النافورة تبقى فعّالة طالما المستخدم يتمرّر، وتتوقف 2 ثانية بعد آخر تمرير
  useEffect(() => {
    let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
    let lastTrigger = 0;

    const onScroll = () => {
      const now = Date.now();
      // اختصار: لا تطلق أكثر من مرة كل 400 مللي ثانية
      if (now - lastTrigger < 400) return;
      lastTrigger = now;

      // فعّل النافورة
      setCelebrationActive(true);

      // أعد ضبط مؤقت الإيقاف — النافورة تبقى فعّالة طالما المستخدم يتمرّر
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setCelebrationActive(false);
      }, 2000); // أوقف بعد 2 ثانية من آخر تمرير
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, []);

  const reveal = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.0, ease: 'easeOut' as const },
  };

  return (
    <>
      {/* النافورة الاحتفالية — تظهر فوق كل شيء */}
      <CelebrationFountain active={celebrationActive} />

      <section
        id="closing"
        className="relative w-full py-8 px-4 sm:px-6 flex flex-col items-center text-center overflow-x-hidden"
      >
        {/* فاصل علوي */}
        <motion.div
          {...reveal}
          className="w-40 h-px bg-white/50 mb-6"
        />

        {/* رسالة الختام */}
        <motion.p
          {...reveal}
          className="text-2xl sm:text-3xl md:text-4xl mb-6 max-w-2xl"
          style={{
            fontFamily: 'var(--font-aref-ruqaa)',
            color: '#ffffff',
            fontWeight: 700,
            textShadow: '0 2px 16px rgba(0,0,0,0.7)',
            lineHeight: 1.5,
          }}
        >
          {weddingData.closing.lines[0]}
        </motion.p>

        <motion.p
          {...reveal}
          className="text-xl sm:text-2xl md:text-3xl mb-6 max-w-2xl italic"
          style={{
            fontFamily: 'var(--font-amiri)',
            color: '#ffffff',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            lineHeight: 1.5,
          }}
        >
          {weddingData.closing.lines[1]}
        </motion.p>

        {/* فاصل زخرفي */}
        <motion.div
          {...reveal}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-16 h-px bg-white/50" />
          <div className="w-2 h-2 rounded-full bg-white/60" />
          <div className="w-16 h-px bg-white/50" />
        </motion.div>

        {/* الدعاء — بنفس نمط الخط العربي الزخرفي (رمادي فضي) */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl md:text-4xl mb-6 max-w-2xl"
          style={{
            fontFamily: 'var(--font-aref-ruqaa)',
            color: '#D5D5D5',
            fontWeight: 400,
            textShadow: '0 2px 16px rgba(0,0,0,0.6)',
            lineHeight: 1.8,
            letterSpacing: '0.02em',
            opacity: 0.95,
          }}
        >
          {weddingData.closing.blessing}
        </motion.p>

        {/* أسماء العريس والعروس في النهاية */}
        <motion.div
          {...reveal}
          className="flex flex-col items-center gap-2"
        >
          <p
            className="text-5xl sm:text-6xl md:text-7xl"
            style={{
              fontFamily: 'var(--font-aref-ruqaa)',
              color: '#ffffff',
              fontWeight: 700,
              textShadow: '0 4px 20px rgba(0,0,0,0.7)',
              lineHeight: 1.2,
            }}
          >
            أشرف و آمنة
          </p>
          <p
            className="text-lg sm:text-xl italic opacity-80 mt-3"
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
            }}
          >
            {weddingData.event.dateDisplayAr}
          </p>
          {/* Save the Date — خط مختلف، حجم أكبر قليلاً */}
          <p
            className="text-lg sm:text-xl mt-4"
            style={{
              fontFamily: 'var(--font-amiri)',
              color: '#ffffff',
              letterSpacing: '0.2em',
              fontStyle: 'italic',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {weddingData.closing.saveTheDate}
          </p>
        </motion.div>

        {/* فاصل سفلي */}
        <motion.div
          {...reveal}
          className="w-40 h-px bg-white/50 mt-8 mb-6"
        />

        {/* Made with love ❤️ — خط مختلف، صغير، بين قلبين */}
        <motion.p
          {...reveal}
          className="text-sm sm:text-base"
          style={{
            fontFamily: 'var(--font-amiri)',
            color: '#ffffff',
            letterSpacing: '0.15em',
            fontStyle: 'italic',
            opacity: 0.9,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          ❤️ {weddingData.closing.madeWithLove.replace(' ❤️', '')} ❤️
        </motion.p>
      </section>
    </>
  );
}
