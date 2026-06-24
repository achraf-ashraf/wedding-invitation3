// Wedding invitation data — fully Arabic, RTL
// محتوى دعوة الزفاف بالكامل بالعربية
// العريس: أشرف بن روينة  •  العروس: آمنة التريكي
// التاريخ: الجمعة 24 جويلية 2026

export const weddingData = {
  // معلومات العريسين
  couple: {
    name1: "أشرف بن روينة",
    name2: "آمنة التريكي",
    familyGroom: "عائلة خالد بن روينة",
    headline: "أشرف\nو\nآمنة",
  },

  // النص الافتتاحي (بسم الله، الآية، دعوة العائلة)
  intro: {
    bismillah: "بسم الله الرحمن الرحيم",
    bismillahImage: "/wooow/images/bismillah-calligraphy.jpeg",
    title: "دعوة زفاف",
    verse: "﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً﴾",
    invitationLines: [
      "بعد إهدائكم عاطر التحية وأزكى السلام",
      "تتشرف عائلتا",
      "السيد خالد بن روينة وحرمه",
      "والسيد مصطفى التريكي وحرمه",
      "بدعوتكم أنتم وعائلتكم الكريمة لحضور حفل زفاف ابنيهما",
      "أشرف بن روينة",
      "على الآنسة الكريمة",
      "آمنة التريكي",
    ],
  },

  // معلومات الحفل
  event: {
    date: "2026-07-24",
    startTime: "21:00",
    endTime: "01:00",
    startDateISO: "2026-07-24T21:00:00",
    endDateISO: "2026-07-25T01:00:00",
    // عربي (بأرقام لاتينية، شهر "جويلية")
    dateDisplayAr: "24 جويلية 2026",
    dateLongAr: "الجمعة 24 جويلية 2026",
    timeDisplayAr: "من 9:00 مساءً حتى 1:00 صباحاً",
    title: "حفل زفاف أشرف و آمنة",
    type: "زفاف",
  },

  // مكان الحفل — مكانان: حفل العشاء + حفل الزفاف
  venues: [
    {
      title: "حفل العشاء",
      name: "Espace Lella Khadija",
      subtitle: "Salle de fêtes",
      address: "صفاقس، تونس",
      addressFr: "Sfax, Tunisie",
      city: "Sfax, Tunisie",
      lat: 34.7375616,
      lng: 10.6856532,
      mapsUrl: "https://maps.app.goo.gl/TL89LJqMKCqQzvkC9",
      mapsEmbedUrl: "https://www.google.com/maps?q=Espace+Lella+Khadija+Sfax&z=16&output=embed&t=k",
      mapsLabel: "Espace Lella Khadija pour Les Fetes, Sfax, Tunisie",
      // معلومات حفل العشاء
      date: "22 جويلية 2026",
      time: "من السابعة مساءً حتى العاشرة ليلاً",
      note: "تقام الحفلة الغنائية بعد العشاء",
    },
    {
      title: "حفل الزفاف",
      name: "Le Palace Miami Salle de fêtes",
      subtitle: "",
      address: "طريق سيدي منصور كم 2، صفاقس، تونس",
      addressFr: "Route Sidi Mansour Km 2, Sfax, Tunisie",
      city: "Sfax, Tunisie",
      lat: 34.7555355,
      lng: 10.7830093,
      mapsUrl: "https://maps.app.goo.gl/8qeUWnr7L7f8DeyN8",
      mapsEmbedUrl: "https://www.google.com/maps?q=Le+Palace+Miami+salle+des+fetes+Sfax&z=16&output=embed&t=k",
      mapsLabel: "Le Palace Miami salle des fetes, Complexe sportif Miami, Sidi Mansour Road, Sfax 3094, Tunisie",
      // معلومات حفل الزفاف
      date: "24 جويلية 2026",
      time: "من 9:00 مساءً حتى 1:00 صباحاً",
      note: "",
    },
  ],
  // Legacy single venue (kept for backwards compat)
  venue: {
    name: "Le Palace Miami Salle de fêtes",
    subtitle: "",
    address: "طريق سيدي منصور كم 2، صفاقس، تونس",
    addressFr: "Route Sidi Mansour Km 2, Sfax, Tunisie",
    city: "Sfax, Tunisie",
    lat: 34.7555355,
    lng: 10.7830093,
    mapsUrl: "https://maps.app.goo.gl/8qeUWnr7L7f8DeyN8",
    mapsEmbedUrl: "https://www.google.com/maps?q=Le+Palace+Miami+salle+des+fetes+Sfax&z=16&output=embed&t=k",
    mapsLabel: "Le Palace Miami salle des fetes, Complexe sportif Miami, Sidi Mansour Road, Sfax 3094, Tunisie",
  },

  // أرقام التواصل
  contacts: [
    {
      role: "العريس",
      name: "أشرف بن روينة",
      // رقم للاتصال + واتساب (قطر)
      callAndWhatsapp: "+97431481698",
    },
    {
      role: "والد العريس",
      name: "خالد بن روينة",
      // رقم للاتصال + واتساب (تونس)
      callAndWhatsapp: "+21626464509",
    },
  ],

  // الختام
  closing: {
    lines: [
      "نتشرف بحضوركم ومشاركتكم أفراحنا",
      "سعداء بوجودكم بيننا",
    ],
    blessing: "بارك الله لهما وبارك عليهما وجمع بينهما في خير",
    saveTheDate: "❤️ Save the Date ❤️",
    madeWithLove: "Made with love ❤️",
    calligraphyImage: "/wooow/images/closing-calligraphy.jpeg",
  },

  // السمة — Fairy Tale intro (مستوحاة من Vowlee Paris)
  theme: {
    id: "enchanted",
    name: "Enchanted",
    // Vowlee color palette
    bodyBgColor: "#EAD7E5",         // light rose pink (rgb(234, 215, 229))
    sectionBgColor: "#726C82",      // muted purple-gray (rgb(114, 108, 130))
    sectionAltBgColor: "#0E1225",   // dark navy (rgb(14, 18, 37))
    textColor: "#FAF8F2",           // cream white (rgb(250, 248, 242))
    headingColor: "#FAF8F2",
    // Arabic fonts (keep our luxury Arabic fonts)
    fontFamily: "Amiri",
    headlineFontStyle: "Aref Ruqaa",
    subtitleFontStyle: "Reem Kufi",
    envelopeFontStyle: "Reem Kufi",
    envelopeTextColor: "#FAF8F2",
    dateFontStyle: "Reem Kufi",
    // Fairy Tale intro video (vertical, 8s) — تم استبداله بالفيديو الجديد
    openingAnimation: "/wooow/videos/enchanted-opening-mobile.mp4",
    openingPoster: "/wooow/images/enchanted-opening-poster.jpg",
    // Invitation background image (lace/pearls/bride-groom frame)
    invitationBackground: "/wooow/images/invitation-background.jpeg",
    // Background video (no loop — Vowlee uses static backgrounds)
    backgroundVideo: null,  // Enchanted uses static colored backgrounds
    backgroundPoster: null,
    // Decorative SVGs
    photoFrameSvg: "/wooow/images/enchanted/photo-frame.svg",
    weddingHandSvg: "/wooow/images/enchanted/wedding-hand.svg",
    // Legacy (kept for backwards compat)
    backgroundColor: "#EAD7E5",
    textColorLegacy: "#FAF8F2",
    // Aliases used elsewhere in code
    textColorLegacy2: "#FAF8F2",
    blockTextColor: "#FAF8F2",
    subtitleColor: "#FAF8F2",
    fontFamilyLegacy: "Amiri",
    envelopeImage: "/wooow/images/envelope-floral-cream-baby-pink.png",
    embroideryBeige: "/wooow/images/embroidery-beige-bg.png",
    embroideryWhite: "/wooow/images/embroidery-white-bg.png",
    embroiderySky: "/wooow/images/embroidery-sky-bg.png",
    embroideryBlush: "/wooow/images/embroidery-blush-bg.png",
  },

  // الموسيقى — ملف MP3 محلي (حسين الجسمي - ادخلي أمري)
  music: {
    type: "mp3",
    src: "/wooow/audio/wedding-music.mp3",
    title: "حسين الجسمي - ادخلي أمري",
    author: "Hussain Al Jassmi | حسين الجسمي",
    thumbnail: "/wooow/audio/song-thumbnail.jpg",
  },

  // إعدادات RSVP
  rsvp: {
    replyByDate: "2026-06-30",
    showGuestCount: true,
    showSongRequest: true,
    showDietaryOptions: true,
    showOtherDietary: true,
    showAllQuestionsUpfront: true,
    showScrollButton: true,
    dietaryOptions: [
      { id: "gluten-free", enabled: true, label: "خالٍ من الغلوتين" },
      { id: "lactose-free", enabled: true, label: "خالٍ من اللاكتوز" },
      { id: "vegetarian", enabled: true, label: "نباتي" },
      { id: "vegan", enabled: true, label: "نباتي صرف" },
      { id: "nut-allergy", enabled: true, label: "حساسية المكسرات" },
      { id: "seafood-allergy", enabled: true, label: "حساسية المأكولات البحرية" },
    ],
  },

  // أقسام المحتوى
  blocks: [
    "countdown",
    "timeline",
    "venue",
    "dress-code",
    "our-story",
    "gallery",
    "gift-list",
    "faq",
    "rsvp",
  ],
} as const;

export type WeddingData = typeof weddingData;
