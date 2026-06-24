'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle, User } from 'lucide-react';
import { weddingData } from '@/lib/wedding-data';

/**
 * قسم التواصل
 * يعرض بطاقات للأشخاص الرئيسيين مع أزرار:
 *  - اتصال مباشر (tel:)
 *  - رسالة واتساب (https://wa.me/)
 *
 * التصميم: الأرقام في سطر واحد مع تسمية "اتصال فقط" على الجانب،
 * والأيقونات (اتصال/واتساب) مرتبة عمودياً تحت بعضها.
 */

// تنسيق الرقم للعرض (مع مسافات للتسهيل)
function formatPhone(phone: string): string {
  const clean = phone.replace(/[\s-]/g, '');
  if (clean.startsWith('+216')) {
    return `+216 ${clean.slice(4, 6)} ${clean.slice(6, 9)} ${clean.slice(9)}`;
  }
  if (clean.startsWith('+974')) {
    return `+974 ${clean.slice(4, 8)} ${clean.slice(8)}`;
  }
  return phone;
}

// تحويل الرقم لصيغة wa.me
function toWhatsapp(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

interface ContactCardProps {
  role: string;
  name: string;
  callOnly?: string;
  callAndWhatsapp?: string;
  delay: number;
}

function ContactCard({ role, name, callOnly, callAndWhatsapp, delay }: ContactCardProps) {
  const reveal = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.0, ease: 'easeOut' as const, delay },
  };

  return (
    <motion.div
      {...reveal}
      className="w-full max-w-xs rounded-xl p-4 flex flex-col items-center text-center"
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
      }}
    >
      {/* أيقونة المستخدم */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
        }}
      >
        <User className="w-5 h-5 text-white" />
      </div>

      {/* الدور */}
      <span
        className="text-sm tracking-[0.2em] uppercase opacity-80 mb-1"
        style={{ fontFamily: 'var(--font-reem-kufi)', color: '#ffffff' }}
      >
        {role}
      </span>

      {/* الاسم */}
      <h3
        className="text-2xl sm:text-3xl mb-5"
        style={{
          fontFamily: 'var(--font-aref-ruqaa)',
          color: '#ffffff',
          fontWeight: 700,
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          lineHeight: 1.2,
        }}
      >
        {name}
      </h3>

      {/* فاصل */}
      <div className="w-16 h-px bg-white/40 mb-5" />

      {/* ============================================================
          صندوق الأرقام — كل الأرقام في صندوق واحد منظم
          التسميات على الجانب، الأرقام في المنتصف، الأيقونات في عمود
          ============================================================ */}
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {/* رقم الاتصال فقط (إن وُجد) */}
        {callOnly && (
          <a
            href={`tel:${callOnly.replace(/\s/g, '')}`}
            className="flex items-center gap-3 w-full px-3 py-2 transition-colors hover:bg-white/5"
            style={{ direction: 'ltr' }}
          >
            {/* أيقونة الاتصال - على اليسار */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <Phone className="w-4 h-4 text-white" />
            </div>

            {/* الرقم - في المنتصف، يتم محاذاته مع باقي الأرقام */}
            <span
              className="flex-1 text-left font-mono"
              style={{
                fontFamily: 'var(--font-reem-kufi)',
                color: '#ffffff',
                fontSize: '16px',
                letterSpacing: '0.04em',
              }}
            >
              {formatPhone(callOnly)}
            </span>

            {/* تسمية "اتصال فقط" - على اليمين */}
            <span
              className="flex-shrink-0 text-xs px-2 py-1 rounded-full"
              style={{
                fontFamily: 'var(--font-amiri)',
                color: '#ffffff',
                background: 'rgba(255,255,255,0.10)',
                direction: 'rtl',
              }}
            >
              اتصال فقط
            </span>
          </a>
        )}

        {/* فاصل بين الأرقام */}
        {callOnly && callAndWhatsapp && (
          <div className="w-full h-px bg-white/10" />
        )}

        {/* رقم الاتصال + واتساب (إن وُجد) */}
        {callAndWhatsapp && (
          <a
            href={`tel:${callAndWhatsapp.replace(/\s/g, '')}`}
            className="flex items-center gap-3 w-full px-3 py-2 transition-colors hover:bg-white/5"
            style={{ direction: 'ltr' }}
          >
            {/* أيقونة الاتصال - على اليسار */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <Phone className="w-4 h-4 text-white" />
            </div>

            {/* الرقم - في المنتصف */}
            <span
              className="flex-1 text-left font-mono"
              style={{
                fontFamily: 'var(--font-reem-kufi)',
                color: '#ffffff',
                fontSize: '16px',
                letterSpacing: '0.04em',
              }}
            >
              {formatPhone(callAndWhatsapp)}
            </span>

            {/* مساحة فارغة لمحاذاة التسمية مع البطاقة الأخرى */}
            {callOnly ? (
              <span className="flex-shrink-0 w-[68px]" />
            ) : (
              <span
                className="flex-shrink-0 text-xs px-2 py-1 rounded-full"
                style={{
                  fontFamily: 'var(--font-amiri)',
                  color: '#ffffff',
                  background: 'rgba(37, 211, 102, 0.20)',
                  direction: 'rtl',
                }}
              >
                اتصال
              </span>
            )}
          </a>
        )}
      </div>

      {/* زر الواتساب (إن وُجد) — تحت الأرقام مباشرة */}
      {callAndWhatsapp && (
        <a
          href={`https://wa.me/${toWhatsapp(callAndWhatsapp)}?text=${encodeURIComponent('السلام عليكم، بخصوص دعوة زفاف غسان و نهى')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'rgba(37, 211, 102, 0.20)',
            border: '1px solid rgba(37, 211, 102, 0.45)',
          }}
        >
          <MessageCircle className="w-5 h-5 text-white flex-shrink-0" />
          <span
            className="text-base"
            style={{
              fontFamily: 'var(--font-reem-kufi)',
              color: '#ffffff',
            }}
          >
            مراسلة عبر واتساب
          </span>
        </a>
      )}
    </motion.div>
  );
}

export function ContactSection() {
  const reveal = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.0, ease: 'easeOut' as const },
  };

  return (
    <section
      id="contact"
      className="relative w-full py-8 px-4 sm:px-6 flex flex-col items-center text-center overflow-x-hidden"
    >
      {/* عنوان القسم */}
      <motion.div
        {...reveal}
        className="flex flex-col items-center gap-3 mb-4 w-full max-w-full"
      >
        <div className="w-32 h-px bg-white/40 flex-shrink-0" />

        <motion.h2
          {...reveal}
          className="text-4xl sm:text-5xl md:text-6xl whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-aref-ruqaa)',
            color: '#ffffff',
            fontWeight: 700,
            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
            lineHeight: 1.2,
          }}
        >
          تواصل معنا
        </motion.h2>

        <motion.p
          {...reveal}
          className="text-sm sm:text-base italic max-w-md"
          style={{
            fontFamily: 'var(--font-amiri)',
            color: '#ffffff',
            textShadow: '0 1px 8px rgba(0,0,0,0.6)',
          }}
        >
          ل أي استفسار أو تأكيد الحضور
        </motion.p>

        <div className="w-32 h-px bg-white/40 flex-shrink-0" />
      </motion.div>

      {/* بطاقات التواصل */}
      <div className="w-full flex flex-col items-center gap-3 max-w-md">
        {weddingData.contacts.map((c, i) => (
          <ContactCard
            key={c.name}
            role={c.role}
            name={c.name}
            callOnly={c.callOnly}
            callAndWhatsapp={c.callAndWhatsapp}
            delay={i * 0.15}
          />
        ))}
      </div>
    </section>
  );
}
