const DEFAULT_DATA = {
  settings: {
    locationLabel: "Bihar",
    address: "Donar Road, Darbhanga",

    homepage: {
      eyebrow: "PROJECT EXECUTION • TENDER WORK • MANPOWER",
      title: "Building Work.",
      accent: "Delivering Trust.",
      lead: "SS Enterprises is focused on professional execution of contracted and tender-based projects with reliable manpower, disciplined supervision and responsible coordination."
    },

    announcement: {
      enabled: false,
      title: "",
      text: "",
      link: "",
      linkLabel: "Learn More"
    },

    featuredProjectId: "abha",

    sections: {
      about: true,
      services: true,
      projects: true,
      team: true,
      credentials: true,
      vision: true,
      gallery: true,
      contact: true
    },

    about: {
      eyebrow: "ABOUT SS ENTERPRISES",
      title: "People, projects &",
      accent: "professional execution.",
      text: "We take up suitable contracted and tender-based work and build dependable teams to execute it with accountability, coordination and service.",

      cards: [
        {
          title: "Tender Work",
          text: "Responsible execution of awarded and contracted work with clear coordination."
        },
        {
          title: "Project Execution",
          text: "Organised manpower, supervision and on-ground coordination for project delivery."
        },
        {
          title: "Skilled Manpower",
          text: "Building dependable teams suited to the requirements of each project."
        },
        {
          title: "Workforce Expansion",
          text: "Scalable staffing as project volume and operational requirements increase."
        }
      ]
    },

    services: {
      eyebrow: "OUR SERVICES",
      title: "What we",
      accent: "do best.",
      text: "Professional services for tender work, project execution, manpower coordination and reliable field support.",

      cards: [
        {
          title: "Tender & Contract Work",
          text: "Execution support for awarded tenders and contracted assignments."
        },
        {
          title: "Project Manpower",
          text: "Reliable staffing, supervision and field coordination for active projects."
        },
        {
          title: "Digital Service Projects",
          text: "Operational support for digital service workflows and citizen-facing projects."
        }
      ]
    },

    contact: {
      eyebrow: "LET'S WORK TOGETHER",
      title: "Have a project in mind?",
      text: "For business enquiries, project discussions and work opportunities, contact SS Enterprises directly.",

      phone: "+91 73600 25302",
      whatsapp: "+91 73600 25302",
      email: "ssenterprisesservice@poton.me",

      address: "Donar Road, Darbhanga",

      socials: [
        {
          label: "Facebook",
          url: ""
        },
        {
          label: "Instagram",
          url: ""
        },
        {
          label: "YouTube",
          url: ""
        }
      ]
    },

    gallery: []
  },

  projects: [
    {
      id: "abha",
      name: "ABHA Card Project",
      department: "Health / Digital Health Services",
      location: "Bihar",
      status: "ongoing",
      description: "ABHA Card service work through the existing SS Enterprises digital service workflow.",
      date: "Active",
      link: "https://ss-enterprises-abha-app-2026.onrender.com/",
      photo: "",
      published: true
    },

    {
      id: "ayushman",
      name: "Ayushman Card KYC Project",
      department: "Ayushman Bharat",
      location: "Bihar",
      status: "upcoming",
      description: "Ayushman Card KYC related project supporting field coordination and service delivery as per project requirements.",
      date: "Upcoming",
      link: "",
      photo: "",
      published: true
    }
  ],

  team: [
    {
      id: "founder",
      role: "Founder",
      name: "Founder",
      location: "Darbhanga, Bihar",
      responsibilities: "Overall vision, strategic decisions, business direction and major operations.",
      photo: "",
      contact: ""
    },

    {
      id: "ceo",
      role: "CEO & Managing Director",
      name: "CEO & Managing Director",
      location: "Darbhanga, Bihar",
      responsibilities: "Day-to-day operations, project and tender coordination, team management and organisational growth.",
      photo: "",
      contact: ""
    },

    {
      id: "state-head",
      role: "State Head",
      name: "State Head",
      location: "Bihar",
      responsibilities: "State-level project coordination, field operations and monitoring of district teams.",
      photo: "",
      contact: ""
    },

    {
      id: "district-coordinator",
      role: "District Coordinator",
      name: "District Coordinator",
      location: "Darbhanga, Bihar",
      responsibilities: "District project implementation, field staff coordination and monitoring of assigned work.",
      photo: "",
      contact: ""
    }
  ]
};


let data = JSON.parse(JSON.stringify(DEFAULT_DATA));
let sb = null;

let currentLang =
  localStorage.getItem("ss_language") === "hi"
    ? "hi"
    : "en";


/* =========================================================
   SUPABASE
   ========================================================= */

const hasConfig =
  window.SS_CONFIG &&
  window.SS_CONFIG.SUPABASE_URL &&
  window.SS_CONFIG.SUPABASE_URL.startsWith("http") &&
  !window.SS_CONFIG.SUPABASE_URL.includes("PASTE_");


if (hasConfig && window.supabase) {
  sb = window.supabase.createClient(
    window.SS_CONFIG.SUPABASE_URL,
    window.SS_CONFIG.SUPABASE_ANON_KEY
  );
}


/* =========================================================
   HELPERS
   ========================================================= */

const $ = selector => document.querySelector(selector);


const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));


const safeUrl = (value = "") => {
  const text = String(value).trim();

  return /^(https?:\/\/|mailto:|tel:)/i.test(text)
    ? text
    : "";
};


const statusLabel = status =>
  status === "ongoing" || status === "active"
    ? "Ongoing"
    : status === "upcoming"
      ? "Upcoming"
      : "Completed";


const markAuto = element => {
  if (element) {
    element.setAttribute("data-ss-auto", "1");
  }

  return element;
};


const setText = (selector, value = "", translate = true) => {
  const element = $(selector);

  if (!element) return;

  element.textContent = value;

  if (translate) {
    markAuto(element);
  }
};


const setSection = (id, enabled) => {
  const element = document.getElementById(id);

  if (element) {
    element.style.display = enabled ? "" : "none";
  }
};


/* =========================================================
   ENGLISH / HINDI TRANSLATION
   ========================================================= */

const I18N = {

  "Home": "होम",
  "About": "हमारे बारे में",
  "Services": "सेवाएँ",
  "Projects": "प्रोजेक्ट्स",
  "Leadership & Team": "नेतृत्व एवं टीम",
  "Contact": "संपर्क",
  "Gallery": "गैलरी",
  "Credentials": "प्रमाण-पत्र",
  "Vision": "दृष्टिकोण",

  "Explore Our Work": "हमारा कार्य देखें",
  "Contact Us": "संपर्क करें",

  "🔱 Udyam Registered": "🔱 उद्यम पंजीकृत",

  "OUR PROJECTS": "हमारे प्रोजेक्ट्स",
  "Active work.": "चल रहा कार्य।",
  "Upcoming opportunities.": "आगामी अवसर।",

  "Our ongoing and upcoming projects reflect our commitment to reliable execution and responsible service.":
    "हमारे चल रहे और आगामी प्रोजेक्ट विश्वसनीय कार्यान्वयन और जिम्मेदार सेवा के प्रति हमारी प्रतिबद्धता को दर्शाते हैं।",

  "All": "सभी",
  "Ongoing": "चल रहे",
  "Upcoming": "आगामी",
  "Completed": "पूर्ण",

  "FEATURED PROJECT": "प्रमुख प्रोजेक्ट",
  "Featured Project": "प्रमुख प्रोजेक्ट",

  "Open Portal ↗": "पोर्टल खोलें ↗",

  "LEADERSHIP & OUR TEAM": "नेतृत्व एवं हमारी टीम",
  "Meet the people": "उन लोगों से मिलिए",
  "behind the work.": "जो इस कार्य के पीछे हैं।",
  "Leadership and field coordination team.":
    "नेतृत्व एवं फील्ड समन्वय टीम।",

  "CREDENTIALS": "प्रमाण-पत्र",
  "Professional identity,": "व्यावसायिक पहचान,",
  "verified honestly.": "ईमानदारी से सत्यापित।",

  "OUR APPROACH": "हमारा दृष्टिकोण",

  "Reliable people. Responsible execution. A growing company with a long-term vision.":
    "विश्वसनीय लोग। जिम्मेदार कार्यान्वयन। दीर्घकालिक दृष्टि के साथ बढ़ती कंपनी।",

  "GALLERY": "गैलरी",
  "Our work,": "हमारा कार्य,",
  "in pictures.": "तस्वीरों में।",

  "See our projects, team and work highlights in pictures.":
    "हमारे प्रोजेक्ट, टीम और कार्य की झलकियाँ तस्वीरों में देखें।",

  "Aapki Seva Mein Hamari Khushi":
    "आपकी सेवा में हमारी खुशी",

  "All rights reserved.": "सर्वाधिकार सुरक्षित।",

  "PROJECT": "प्रोजेक्ट",

  "Active": "सक्रिय",

  "No published projects in this category yet.":
    "इस श्रेणी में अभी कोई प्रकाशित प्रोजेक्ट नहीं है।",

  "Gallery photos will appear here.":
    "गैलरी की तस्वीरें यहाँ दिखाई देंगी।",

  "Learn More": "और जानें",

  "LET'S WORK TOGETHER":
    "आइए साथ काम करें",

  "Have a project in mind?":
    "क्या आपके मन में कोई प्रोजेक्ट है?",

  "For business enquiries, project discussions and work opportunities, contact SS Enterprises directly.":
    "व्यावसायिक पूछताछ, प्रोजेक्ट चर्चा और कार्य अवसरों के लिए SS Enterprises से सीधे संपर्क करें।",

  "Tender Work": "टेंडर कार्य",
  "Project Execution": "प्रोजेक्ट कार्यान्वयन",
  "Skilled Manpower": "कुशल जनशक्ति",
  "Workforce Expansion": "कार्यबल विस्तार",

  "Tender & Contract Work":
    "टेंडर एवं अनुबंध कार्य",

  "Project Manpower":
    "प्रोजेक्ट जनशक्ति",

  "Digital Service Projects":
    "डिजिटल सेवा प्रोजेक्ट्स",

  "Founder": "संस्थापक",
  "CEO & Managing Director": "सीईओ एवं प्रबंध निदेशक",
  "State Head": "राज्य प्रमुख",
  "District Coordinator": "जिला समन्वयक",
  "Director": "निदेशक",
  "Project Manager": "प्रोजेक्ट मैनेजर",
  "Site Engineer": "साइट इंजीनियर",
  "Engineer": "इंजीनियर",
  "Accountant": "अकाउंटेंट",
  "Manager": "मैनेजर",
  "Team Member": "टीम सदस्य",

  "Health / Digital Health Services":
    "स्वास्थ्य / डिजिटल स्वास्थ्य सेवाएँ",

  "Ayushman Bharat":
    "आयुष्मान भारत",

  "Bihar":
    "बिहार",

  "Donar Road, Darbhanga":
    "डोनार रोड, दरभंगा",

  "ABHA Card Project":
    "आभा कार्ड प्रोजेक्ट",

  "Ayushman Card KYC Project":
    "आयुष्मान कार्ड KYC प्रोजेक्ट",

  "ABHA Card service work through the existing SS Enterprises digital service workflow.":
    "SS Enterprises की मौजूदा डिजिटल सेवा प्रक्रिया के माध्यम से आभा कार्ड सेवा कार्य।",

  "Ayushman Card KYC related project supporting field coordination and service delivery as per project requirements.":
    "आयुष्मान कार्ड KYC से संबंधित प्रोजेक्ट, जिसमें प्रोजेक्ट की आवश्यकताओं के अनुसार फील्ड समन्वय और सेवा कार्य किया जाता है।",

  "Responsible execution of awarded and contracted work with clear coordination.":
    "प्राप्त एवं अनुबंधित कार्य का स्पष्ट समन्वय के साथ जिम्मेदार कार्यान्वयन।",

  "Organised manpower, supervision and on-ground coordination for project delivery.":
    "प्रोजेक्ट पूरा करने के लिए व्यवस्थित जनशक्ति, निगरानी और जमीनी समन्वय।",

  "Building dependable teams suited to the requirements of each project.":
    "प्रत्येक प्रोजेक्ट की आवश्यकताओं के अनुसार भरोसेमंद टीम तैयार करना।",

  "Scalable staffing as project volume and operational requirements increase.":
    "प्रोजेक्ट और संचालन की आवश्यकताओं के बढ़ने के साथ कार्यबल का विस्तार।",

  "Execution support for awarded tenders and contracted assignments.":
    "प्राप्त टेंडर और अनुबंधित कार्यों के लिए कार्यान्वयन सहायता।",

  "Reliable staffing, supervision and field coordination for active projects.":
    "चल रहे प्रोजेक्ट्स के लिए भरोसेमंद स्टाफ, निगरानी और फील्ड समन्वय।",

  "Operational support for digital service workflows and citizen-facing projects.":
    "डिजिटल सेवा प्रक्रियाओं और नागरिक-केंद्रित प्रोजेक्ट्स के लिए संचालन सहायता।",

  "Professional services for tender work, project execution, manpower coordination and reliable field support.":
    "टेंडर कार्य, प्रोजेक्ट एक्जीक्यूशन, मैनपावर समन्वय और विश्वसनीय फील्ड सहायता के लिए पेशेवर सेवाएँ।",

  "We take up suitable contracted and tender-based work and build dependable teams to execute it with accountability, coordination and service.":
    "हम उपयुक्त अनुबंधित और टेंडर आधारित कार्य लेते हैं तथा जवाबदेही, समन्वय और सेवा भावना के साथ उसे पूरा करने के लिए भरोसेमंद टीम तैयार करते हैं।",

  "People, projects &":
    "लोग, प्रोजेक्ट और",

  "professional execution.":
    "पेशेवर कार्यान्वयन।",

  "ABOUT SS ENTERPRISES":
    "SS ENTERPRISES के बारे में",

  "OUR SERVICES":
    "हमारी सेवाएँ",

  "What we":
    "हम",

  "do best.":
    "सबसे अच्छा क्या करते हैं।",

  "PROJECT EXECUTION • TENDER WORK • MANPOWER":
    "प्रोजेक्ट कार्यान्वयन • टेंडर कार्य • जनशक्ति",

  "Building Work.":
    "निर्माण कार्य।",

  "Delivering Trust.":
    "विश्वास के साथ कार्य।",

  "SS Enterprises is focused on professional execution of contracted and tender-based projects with reliable manpower, disciplined supervision and responsible coordination.":
    "SS Enterprises भरोसेमंद जनशक्ति, अनुशासित निगरानी और जिम्मेदार समन्वय के साथ अनुबंधित एवं टेंडर आधारित प्रोजेक्ट्स के पेशेवर कार्यान्वयन पर केंद्रित है।",

  "Overall vision, strategic decisions, business direction and major operations.":
    "समग्र दृष्टि, रणनीतिक निर्णय, व्यवसाय की दिशा और प्रमुख संचालन।",

  "Day-to-day operations, project and tender coordination, team management and organisational growth.":
    "दैनिक संचालन, प्रोजेक्ट एवं टेंडर समन्वय, टीम प्रबंधन और संगठनात्मक विकास।",

  "State-level project coordination, field operations and monitoring of district teams.":
    "राज्य स्तर पर प्रोजेक्ट समन्वय, फील्ड संचालन और जिला टीमों की निगरानी।",

  "District project implementation, field staff coordination and monitoring of assigned work.":
    "जिला स्तर पर प्रोजेक्ट कार्यान्वयन, फील्ड स्टाफ समन्वय और सौंपे गए कार्य की निगरानी।",

  "Professional identity,":
    "व्यावसायिक पहचान,",

  "GST":
    "GST",

  "PAN":
    "PAN",

  "Other registrations":
    "अन्य पंजीकरण",

  "Udyam / MSME":
    "उद्यम / MSME",

  "To be added when applicable/available":
    "उपलब्ध होने पर जोड़ा जाएगा",

  "Not publicly displayed unless required.":
    "आवश्यकता होने तक सार्वजनिक रूप से प्रदर्शित नहीं किया जाता।",

  "Add only valid registrations and certifications.":
    "केवल वैध पंजीकरण और प्रमाण-पत्र जोड़ें।"
};


/* =========================================================
   AUTO TRANSLATION MAP
   Existing I18N remains the first and safest translation.
   ========================================================= */

const AUTO_TRANSLATIONS = {
  ...I18N,

  "Home": "होम",
  "About Us": "हमारे बारे में",
  "About": "हमारे बारे में",
  "Our Services": "हमारी सेवाएँ",
  "Services": "सेवाएँ",
  "Our Projects": "हमारे प्रोजेक्ट्स",
  "Projects": "प्रोजेक्ट्स",
  "Contact Us": "संपर्क करें",
  "Contact": "संपर्क",
  "Gallery": "गैलरी",
  "Team": "टीम",
  "Leadership & Team": "नेतृत्व एवं टीम",

  "Learn More": "और जानें",
  "Read More": "और पढ़ें",
  "View More": "और देखें",
  "View Project": "प्रोजेक्ट देखें",
  "Open Portal": "पोर्टल खोलें",
  "Open Portal ↗": "पोर्टल खोलें ↗",

  "Ongoing": "चल रहा",
  "Upcoming": "आगामी",
  "Completed": "पूर्ण",
  "Active": "सक्रिय",

  "Founder": "संस्थापक",
  "Director": "निदेशक",
  "Manager": "मैनेजर",
  "Engineer": "इंजीनियर",
  "Accountant": "अकाउंटेंट",
  "Team Member": "टीम सदस्य",

  "Tender Work": "टेंडर कार्य",
  "Project Execution": "प्रोजेक्ट कार्यान्वयन",
  "Skilled Manpower": "कुशल जनशक्ति",
  "Workforce Expansion": "कार्यबल विस्तार",
  "Tender & Contract Work": "टेंडर एवं अनुबंध कार्य",
  "Project Manpower": "प्रोजेक्ट जनशक्ति",
  "Digital Service Projects": "डिजिटल सेवा प्रोजेक्ट्स"
};


/* =========================================================
   TEXT TRANSLATION
   ========================================================= */

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function autoTranslate(text = "") {

  const original = String(text);

  if (!original.trim()) {
    return original;
  }

  if (currentLang !== "hi") {
    return original;
  }

  const exact =
    AUTO_TRANSLATIONS[original] ??
    AUTO_TRANSLATIONS[original.trim()];

  if (exact !== undefined) {
    return exact;
  }

  let result = original;

  const entries = Object.entries(AUTO_TRANSLATIONS)
    .sort((a, b) => b[0].length - a[0].length);

  entries.forEach(([en, hi]) => {

    if (!en || !en.trim()) return;

    const regex = new RegExp(
      escapeRegExp(en),
      "gi"
    );

    result = result.replace(regex, hi);
  });

  return result;
}


function t(text = "") {
  return autoTranslate(text);
}


function translateRole(role = "") {
  return t(role);
}


function translateStatus(status = "") {
  return t(statusLabel(status));
}


/* =========================================================
   ONLINE TRANSLATION FOR NEW ADMIN CONTENT
   ---------------------------------------------------------
   Fixed translations above work immediately.

   If Admin Panel contains a new English sentence which is
   not present in I18N, the browser will try to translate it
   when Hindi is selected.

   If online translation is unavailable, original English
   text remains visible instead of breaking the website.
   ========================================================= */

const TRANSLATION_CACHE_KEY = "ss_translation_cache_hi_v2";


let translationCache = {};

try {
  translationCache =
    JSON.parse(
      localStorage.getItem(TRANSLATION_CACHE_KEY) || "{}"
    ) || {};
} catch (e) {
  translationCache = {};
}


function saveTranslationCache() {
  try {
    localStorage.setItem(
      TRANSLATION_CACHE_KEY,
      JSON.stringify(translationCache)
    );
  } catch (e) {
    /* Ignore localStorage errors */
  }
}


async function translateOnline(text = "") {

  const original = String(text).trim();

  if (!original) {
    return original;
  }

  if (currentLang !== "hi") {
    return original;
  }

  const known = AUTO_TRANSLATIONS[original];

  if (known !== undefined) {
    return known;
  }

  if (translationCache[original]) {
    return translationCache[original];
  }

  /*
   * Very short numeric / URL / email / phone text should not
   * be sent for translation.
   */
  if (
    /^https?:\/\//i.test(original) ||
    /^mailto:/i.test(original) ||
    /^tel:/i.test(original) ||
    /^\+?[\d\s().-]+$/.test(original) ||
    original.length < 2
  ) {
    return original;
  }

  try {

    const endpoint =
      "https://translate.googleapis.com/translate_a/single" +
      "?client=gtx" +
      "&sl=en" +
      "&tl=hi" +
      "&dt=t" +
      "&q=" +
      encodeURIComponent(original);

    const response = await fetch(endpoint, {
      method: "GET",
      mode: "cors",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        "Translation request failed: " + response.status
      );
    }

    const json = await response.json();

    const translated =
      Array.isArray(json?.[0])
        ? json[0]
            .map(part => part?.[0] || "")
            .join("")
            .trim()
        : "";

    if (translated) {

      translationCache[original] = translated;

      saveTranslationCache();

      return translated;
    }

  } catch (error) {

    console.warn(
      "Online Hindi translation unavailable:",
      error
    );
  }

  return original;
}


/* =========================================================
   TRANSLATE NEW DYNAMIC CONTENT
   Only elements marked data-ss-auto are processed.

   This prevents:
   - project names from changing
   - team names from changing
   - image URLs from changing
   - links from changing
   ========================================================= */

let translationRunId = 0;


async function translateDynamicContent() {

  if (currentLang !== "hi") {
    return;
  }

  const runId = ++translationRunId;

  const elements =
    Array.from(
      document.querySelectorAll(
        '[data-ss-auto="1"]'
      )
    );

  const textNodes = [];

  elements.forEach(element => {

    if (
      !element ||
      element.closest(
        "script,style,noscript,input,textarea,select"
      )
    ) {
      return;
    }

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {

          if (!node.nodeValue?.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          if (
            node.parentElement?.closest(
              "script,style,noscript,input,textarea,select"
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;

    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
  });


  const unique = new Map();

  textNodes.forEach(node => {

    const value = node.nodeValue.trim();

    if (
      value &&
      !AUTO_TRANSLATIONS[value] &&
      !unique.has(value)
    ) {
      unique.set(value, []);
    }

    if (value) {
      unique.get(value)?.push(node);
    }
  });


  for (const [text, nodes] of unique.entries()) {

    if (runId !== translationRunId) {
      return;
    }

    const translated =
      await translateOnline(text);

    if (
      currentLang !== "hi" ||
      runId !== translationRunId
    ) {
      return;
    }

    nodes.forEach(node => {

      const leading =
        node.nodeValue.match(/^\s*/)?.[0] || "";

      const trailing =
        node.nodeValue.match(/\s*$/)?.[0] || "";

      node.nodeValue =
        leading +
        translated +
        trailing;
    });

    /*
     * Small delay prevents too many immediate requests.
     */
    await new Promise(resolve =>
      setTimeout(resolve, 80)
    );
  }
}


/* =========================================================
   NORMALISE DATA
   ========================================================= */

function normalise(raw) {

  const source = raw || {};

  const merged = {
    ...JSON.parse(
      JSON.stringify(DEFAULT_DATA)
    ),
    ...source
  };


  merged.settings = {
    ...DEFAULT_DATA.settings,
    ...(source.settings || {})
  };


  merged.settings.homepage = {
    ...DEFAULT_DATA.settings.homepage,
    ...(source.settings?.homepage || {})
  };


  merged.settings.announcement = {
    ...DEFAULT_DATA.settings.announcement,
    ...(source.settings?.announcement || {})
  };


  merged.settings.sections = {
    ...DEFAULT_DATA.settings.sections,
    ...(source.settings?.sections || {})
  };


  merged.settings.about = {
    ...DEFAULT_DATA.settings.about,
    ...(source.settings?.about || {})
  };


  merged.settings.services = {
    ...DEFAULT_DATA.settings.services,
    ...(source.settings?.services || {})
  };


  merged.settings.contact = {
    ...DEFAULT_DATA.settings.contact,
    ...(source.settings?.contact || {})
  };


  merged.settings.gallery =
    Array.isArray(source.settings?.gallery)
      ? source.settings.gallery
      : [];


  merged.settings.about.cards =
    Array.isArray(
      merged.settings.about.cards
    )
      ? merged.settings.about.cards
      : DEFAULT_DATA.settings.about.cards;


  merged.settings.services.cards =
    Array.isArray(
      merged.settings.services.cards
    )
      ? merged.settings.services.cards
      : DEFAULT_DATA.settings.services.cards;


  merged.settings.contact.socials =
    Array.isArray(
      merged.settings.contact.socials
    )
      ? merged.settings.contact.socials
      : DEFAULT_DATA.settings.contact.socials;


  merged.projects =
    Array.isArray(source.projects)
      ? source.projects
      : DEFAULT_DATA.projects;


  merged.team =
    Array.isArray(source.team)
      ? source.team
      : DEFAULT_DATA.team;


  merged.projects =
    merged.projects.map(project => ({
      ...project,

      location:
        project.location || "Bihar",

      published:
        project.published !== false,

      status:
        project.status === "active"
          ? "ongoing"
          : (
              project.status ||
              "upcoming"
            )
    }));


  return merged;
}


/* =========================================================
   ANNOUNCEMENT
   ========================================================= */

function renderAnnouncement() {

  const settings =
    data.settings.announcement || {};

  const element =
    $("#announcement");

  if (!element) return;


  if (
    !settings.enabled ||
    (
      !settings.title &&
      !settings.text
    )
  ) {

    element.style.display = "none";

    return;
  }


  element.style.display = "";


  const title =
    settings.title || "";

  const text =
    settings.text || "";

  const link =
    safeUrl(settings.link);


  element.innerHTML = `
    <div>
      <strong data-ss-auto="1">
        ${escapeHtml(t(title))}
      </strong>

      <span data-ss-auto="1">
        ${escapeHtml(t(text))}
      </span>
    </div>

    ${
      link
        ? `
          <a
            class="btn ghost"
            href="${escapeHtml(link)}"
            target="_blank"
            rel="noopener"
          >
            ${escapeHtml(
              t(settings.linkLabel || "Learn More")
            )} ↗
          </a>
        `
        : ""
    }
  `;
}


/* =========================================================
   HOMEPAGE
   ========================================================= */

function renderHomepage() {

  const homepage =
    data.settings.homepage || {};


  setText(
    "#heroEyebrow",
    homepage.eyebrow || ""
  );

  setText(
    "#heroTitle",
    homepage.title || ""
  );

  setText(
    "#heroAccent",
    homepage.accent || ""
  );

  setText(
    "#heroLead",
    homepage.lead || ""
  );


  renderAnnouncement();
}


/* =========================================================
   ABOUT
   ========================================================= */

function renderAbout() {

  const settings =
    data.settings.about || {};

  const section =
    $("#about");

  if (!section) return;


  setSection(
    "about",
    data.settings.sections.about
  );


  setText(
    "#aboutEyebrow",
    settings.eyebrow || ""
  );

  setText(
    "#aboutTitle",
    settings.title || ""
  );

  setText(
    "#aboutAccent",
    settings.accent || ""
  );

  setText(
    "#aboutText",
    settings.text || ""
  );


  const grid =
    $("#aboutGrid");

  if (!grid) return;


  grid.innerHTML =
    (settings.cards || [])
      .map((card, index) => `
        <article>

          <div class="icon">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <h3 data-ss-auto="1">
            ${escapeHtml(
              t(card.title || "")
            )}
          </h3>

          <p data-ss-auto="1">
            ${escapeHtml(
              t(card.text || "")
            )}
          </p>

        </article>
      `)
      .join("");
}


/* =========================================================
   SERVICES
   ========================================================= */

function renderServices() {

  const settings =
    data.settings.services || {};

  const section =
    $("#services");

  if (!section) return;


  setSection(
    "services",
    data.settings.sections.services
  );


  setText(
    "#servicesEyebrow",
    settings.eyebrow || ""
  );

  setText(
    "#servicesTitle",
    settings.title || ""
  );

  setText(
    "#servicesAccent",
    settings.accent || ""
  );

  setText(
    "#servicesText",
    settings.text || ""
  );


  const grid =
    $("#servicesGrid");

  if (!grid) return;


  grid.innerHTML =
    (settings.cards || [])
      .map((card, index) => `
        <article>

          <div class="icon">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <h3 data-ss-auto="1">
            ${escapeHtml(
              t(card.title || "")
            )}
          </h3>

          <p data-ss-auto="1">
            ${escapeHtml(
              t(card.text || "")
            )}
          </p>

        </article>
      `)
      .join("");
}


/* =========================================================
   PROJECTS
   ========================================================= */

function renderProjects(filter = "all") {

  const grid =
    $("#projectGrid");

  if (!grid) return;


  setSection(
    "projects",
    data.settings.sections.projects
  );


  const list =
    (
      filter === "all"
        ? data.projects
        : data.projects.filter(project => {

            if (filter === "ongoing") {
              return (
                project.status === "ongoing" ||
                project.status === "active"
              );
            }

            return project.status === filter;
          })
    )
    .filter(
      project =>
        project.published !== false
    );


  const featuredId =
    data.settings.featuredProjectId;


  grid.innerHTML =
    list.map(project => {

      const link =
        safeUrl(project.link);

      const featured =
        project.id === featuredId;


      return `
        <article
          class="project-card ${
            featured ? "featured" : ""
          }"
        >

          ${
            safeUrl(project.photo)
              ? `
                <img
                  class="project-photo"
                  src="${escapeHtml(
                    safeUrl(project.photo)
                  )}"
                  alt="${escapeHtml(
                    project.name || "Project"
                  )}"
                >
              `
              : ""
          }


          <span data-ss-auto="1">
            ${escapeHtml(
              t("PROJECT")
            )}
            •
            ${escapeHtml(
              translateStatus(
                project.status
              ).toUpperCase()
            )}
          </span>


          <!-- Project NAME is intentionally NOT auto-translated -->
          <h3>
            ${escapeHtml(
              project.name || ""
            )}
          </h3>


          <p class="project-meta">

            <strong data-ss-auto="1">
              ${escapeHtml(
                t(project.department || "")
              )}
            </strong>

            <br>

            <span data-ss-auto="1">
              📍
              ${escapeHtml(
                t(project.location || "Bihar")
              )}
            </span>

          </p>


          <p data-ss-auto="1">
            ${escapeHtml(
              t(project.description || "")
            )}
          </p>


          <div class="project-bottom">

            <b data-ss-auto="1">
              ${escapeHtml(
                t(project.date || "")
              )}
            </b>


            ${
              link
                ? `
                  <a
                    class="project-link"
                    href="${escapeHtml(link)}"
                    target="_blank"
                    rel="noopener"
                  >
                    ${escapeHtml(
                      t("Open Portal ↗")
                    )}
                  </a>
                `
                : ""
            }

          </div>

        </article>
      `;
    })
    .join("");


  if (!list.length) {

    grid.innerHTML = `
      <div class="empty" data-ss-auto="1">
        ${escapeHtml(
          t(
            "No published projects in this category yet."
          )
        )}
      </div>
    `;
  }


  const featured =
    data.projects.find(
      project =>
        project.id === featuredId &&
        project.published !== false
    );


  const panel =
    $("#portalPanel");


  if (!panel) return;


  panel.style.display =
    featured?.link
      ? ""
      : "none";


  if (featured?.link) {

    setText(
      "#portalTitle",
      featured.name || "",
      false
    );


    setText(
      "#portalText",
      featured.description ||
      "Open the featured digital service portal directly from SS Enterprises."
    );


    const portalLink =
      $("#portalLink");

    if (portalLink) {

      portalLink.href =
        safeUrl(featured.link) || "#";

      portalLink.textContent =
        t("Open Portal ↗");
    }
  }
}


/* =========================================================
   TEAM
   ========================================================= */

function renderTeam() {

  const grid =
    $("#teamGrid");

  if (!grid) return;


  setSection(
    "team",
    data.settings.sections.team
  );


  grid.innerHTML =
    data.team
      .map(member => `

        <article class="person-card">

          ${
            safeUrl(member.photo)
              ? `
                <img
                  src="${escapeHtml(
                    safeUrl(member.photo)
                  )}"
                  alt="${escapeHtml(
                    member.name || "Team Member"
                  )}"
                >
              `
              : `
                <div class="person-placeholder">
                  ♙
                </div>
              `
          }


          <div>

            <span
              class="role"
              data-ss-auto="1"
            >
              ${escapeHtml(
                translateRole(
                  member.role || ""
                )
              )}
            </span>


            <!-- Team NAME is intentionally NOT auto-translated -->
            <h3>
              ${escapeHtml(
                member.name || ""
              )}
            </h3>


            <p data-ss-auto="1">
              📍
              ${escapeHtml(
                t(
                  member.location ||
                  "Bihar"
                )
              )}
            </p>


            <p data-ss-auto="1">
              ${escapeHtml(
                t(
                  member.responsibilities ||
                  ""
                )
              )}
            </p>


            ${
              member.contact
                ? `
                  <a
                    class="person-contact"
                    href="tel:${escapeHtml(
                      member.contact
                    )}"
                  >
                    📞
                    ${escapeHtml(
                      member.contact
                    )}
                  </a>
                `
                : ""
            }

          </div>

        </article>
      `)
      .join("");
}


/* =========================================================
   CREDENTIALS
   ========================================================= */

function renderCredentials() {

  setSection(
    "credentials",
    data.settings.sections.credentials
  );
}


/* =========================================================
   VISION
   ========================================================= */

function renderVision() {

  setSection(
    "vision",
    data.settings.sections.vision
  );
}


/* =========================================================
   CONTACT
   ========================================================= */

function renderContact() {

  const settings =
    data.settings.contact || {};


  setSection(
    "contact",
    data.settings.sections.contact
  );


  setText(
    "#contactEyebrow",
    settings.eyebrow || ""
  );

  setText(
    "#contactTitle",
    settings.title || ""
  );

  setText(
    "#contactText",
    settings.text || ""
  );


  const phone =
    (settings.phone || "").trim();

  const whatsapp =
    (
      settings.whatsapp ||
      phone ||
      ""
    ).trim();

  const email =
    (settings.email || "").trim();


  const links = [];


  if (phone) {

    links.push(`
      <a
        href="tel:${escapeHtml(phone)}"
      >
        📞
        ${escapeHtml(phone)}
      </a>
    `);
  }


  if (whatsapp) {

    links.push(`
      <a
        href="https://wa.me/${escapeHtml(
          whatsapp.replace(/\D/g, "")
        )}"
        target="_blank"
        rel="noopener"
      >
        💬 WhatsApp
      </a>
    `);
  }


  if (email) {

    links.push(`
      <a
        href="mailto:${escapeHtml(email)}"
      >
        ✉️
        ${escapeHtml(email)}
      </a>
    `);
  }


  links.push(`
    <span data-ss-auto="1">
      📍
      ${escapeHtml(
        t(
          settings.address ||
          data.settings.address ||
          "Bihar"
        )
      )}
    </span>
  `);


  (settings.socials || [])
    .filter(
      social =>
        social.label &&
        safeUrl(social.url)
    )
    .forEach(social => {

      links.push(`
        <a
          href="${escapeHtml(
            safeUrl(social.url)
          )}"
          target="_blank"
          rel="noopener"
        >
          🔗
          ${escapeHtml(
            t(social.label)
          )}
        </a>
      `);
    });


  const contactCard =
    $("#contactCard");


  if (contactCard) {
    contactCard.innerHTML =
      links.join("");
  }
}


/* =========================================================
   GALLERY
   ========================================================= */

function renderGallery() {

  const section =
    $("#gallery");

  if (!section) return;


  setSection(
    "gallery",
    data.settings.sections.gallery
  );


  const items =
    (data.settings.gallery || [])
      .filter(
        item =>
          safeUrl(item.url)
      );


  const grid =
    $("#galleryGrid");

  if (!grid) return;


  if (items.length) {

    grid.innerHTML =
      items
        .map(item => `

          <figure>

            <img
              src="${escapeHtml(
                safeUrl(item.url)
              )}"
              alt="${escapeHtml(
                item.caption ||
                "SS Enterprises"
              )}"
              loading="lazy"
            >

            ${
              item.caption
                ? `
                  <figcaption
                    data-ss-auto="1"
                  >
                    ${escapeHtml(
                      t(item.caption)
                    )}
                  </figcaption>
                `
                : ""
            }

          </figure>

        `)
        .join("");

  } else {

    grid.innerHTML = `
      <div
        class="empty"
        data-ss-auto="1"
      >
        ${escapeHtml(
          t(
            "Gallery photos will appear here."
          )
        )}
      </div>
    `;
  }
}


/* =========================================================
   LANGUAGE SWITCHER
   ========================================================= */

function createLanguageSwitcher() {

  const wrap =
    document.querySelector(
      ".lang-switch"
    ) ||
    document.getElementById(
      "ss-language-switcher"
    );


  if (!wrap) {
    return;
  }


  wrap
    .querySelectorAll(
      "[data-lang], .lang-btn, .ss-lang-btn"
    )
    .forEach(button => {

      if (
        button.dataset.ssBound === "1"
      ) {
        return;
      }


      button.dataset.ssBound = "1";


      button.addEventListener(
        "click",
        () => {

          ssApplyLanguage(
            button.dataset.lang ||
            "en"
          );

        }
      );
    });


  wrap
    .querySelectorAll(
      "[data-lang], .lang-btn, .ss-lang-btn"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        (
          button.dataset.lang ||
          "en"
        ) === currentLang
      );
    });
}


/* =========================================================
   STATIC HTML TRANSLATION
   ========================================================= */

function applyLanguageToStaticHTML() {

  /*
   * Elements explicitly marked data-i18n.
   */
  document
    .querySelectorAll("[data-i18n]")
    .forEach(element => {

      const key =
        element.getAttribute(
          "data-i18n"
        );


      if (!element.dataset.ssEn) {
        element.dataset.ssEn =
          key;
      }


      const english =
        element.dataset.ssEn;


      element.textContent =
        currentLang === "hi"
          ? (
              I18N[english] ??
              english
            )
          : english;
    });


  /*
   * Older HTML files may not have data-i18n.
   * Preserve their original English text.
   */
  const fallback = {

    "Explore Our Work":
      "हमारा कार्य देखें",

    "Contact Us":
      "संपर्क करें",

    "All":
      "सभी",

    "Ongoing":
      "चल रहे",

    "Upcoming":
      "आगामी",

    "Completed":
      "पूर्ण",

    "FEATURED PROJECT":
      "प्रमुख प्रोजेक्ट",

    "Featured Project":
      "प्रमुख प्रोजेक्ट",

    "Open Portal ↗":
      "पोर्टल खोलें ↗"
  };


  document
    .querySelectorAll(
      ".filter, .actions .btn, #portalLink"
    )
    .forEach(element => {

      if (
        !element.dataset.ssEn
      ) {

        element.dataset.ssEn =
          element.textContent.trim();
      }


      const english =
        element.dataset.ssEn;


      element.textContent =
        currentLang === "hi"
          ? (
              I18N[english] ||
              fallback[english] ||
              english
            )
          : english;
    });
}


/* =========================================================
   RESET STATIC HTML TO ENGLISH
   ========================================================= */

function resetStaticHTMLToEnglish() {

  currentLang = "en";

  applyLanguageToStaticHTML();
}


/* =========================================================
   APPLY LANGUAGE
   ========================================================= */

async function ssApplyLanguage(lang) {

  currentLang =
    lang === "hi"
      ? "hi"
      : "en";


  localStorage.setItem(
    "ss_language",
    currentLang
  );


  document.documentElement.lang =
    currentLang;


  /*
   * Cancel older online translation run.
   */
  translationRunId++;


  /*
   * Render everything again from original data.
   */
  applyAll();


  /*
   * Static HTML.
   */
  applyLanguageToStaticHTML();


  createLanguageSwitcher();


  document
    .querySelectorAll(".ss-lang-btn")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.lang ===
        currentLang
      );
    });


  /*
   * Hindi:
   * First fixed translations are shown.
   * Then unknown Admin-entered English
   * content is translated online.
   */
  if (currentLang === "hi") {

    await translateDynamicContent();

  } else {

    /*
     * English is rendered directly from
     * original Supabase data by applyAll().
     */
    applyLanguageToStaticHTML();
  }
}


/* =========================================================
   LEGACY DATA CLEANUP
   ---------------------------------------------------------
   Does NOT delete data from Supabase.
   Only fixes old unwanted text in memory before rendering.
   ========================================================= */

function cleanLegacyCustomerText() {

  const settings =
    data.settings || {};


  if (
    settings.services &&
    settings.services.text ===
      "Professional services for tender work, project execution, manpower coordination and reliable field support."
  ) {

    settings.services.text =
      "Professional services for tender work, project execution, manpower coordination and reliable field support.";
  }


  if (
    Array.isArray(data.projects)
  ) {

    data.projects.forEach(project => {

      if (
        project.description ===
          "Ayushman Card KYC related project. Details can be updated from the Admin Panel when confirmed."
      ) {

        project.description =
          "Ayushman Card KYC related project supporting field coordination and service delivery as per project requirements.";
      }

    });
  }
}


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function applyAll() {

  cleanLegacyCustomerText();


  renderHomepage();

  renderAbout();

  renderServices();

  renderProjects();

  renderTeam();

  renderCredentials();

  renderVision();

  renderContact();

  renderGallery();


  /*
   * Address elements in existing HTML.
   */
  const address =
    data.settings.address ||
    "Donar Road, Darbhanga";


  document
    .querySelectorAll(
      "[data-address]"
    )
    .forEach(element => {

      element.textContent =
        t(address);

      markAuto(element);
    });


  /*
   * Project filters.
   */
  document
    .querySelectorAll(".filter")
    .forEach(button => {

      button.onclick = () => {

        document
          .querySelectorAll(".filter")
          .forEach(item =>
            item.classList.remove(
              "active"
            )
          );


        button.classList.add(
          "active"
        );


        renderProjects(
          button.dataset.filter
        );


        if (
          currentLang === "hi"
        ) {
          translateDynamicContent();
        }
      };
    });


  /*
   * Current year.
   */
  const year =
    $("#year");


  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  createLanguageSwitcher();


  document
    .querySelectorAll(
      ".ss-lang-btn"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.lang ===
        currentLang
      );
    });
}


/* =========================================================
   LOAD DATA
   ========================================================= */

async function loadData() {

  if (sb) {

    try {

      const result =
        await sb
          .from("site_data")
          .select("content")
          .eq("id", 1)
          .maybeSingle();


      if (
        !result.error &&
        result.data?.content
      ) {

        data =
          normalise(
            result.data.content
          );

      } else {

        data =
          normalise(
            DEFAULT_DATA
          );
      }

    } catch (error) {

      console.warn(
        "Supabase load failed:",
        error
      );


      data =
        normalise(
          DEFAULT_DATA
        );
    }

  } else {

    data =
      normalise(
        DEFAULT_DATA
      );
  }


  /*
   * First render the complete website.
   * Nothing is removed here.
   */
  applyAll();


  /*
   * Restore saved language.
   */
  if (
    currentLang === "hi"
  ) {

    applyLanguageToStaticHTML();

    /*
     * Translate any new content
     * which is not in I18N.
     */
    translateDynamicContent();
  }
}


/* =========================================================
   INTRO
   ========================================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () =>
        $("#intro")?.remove(),
      3200
    );
  }
);


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    createLanguageSwitcher();


    /*
     * Mobile menu.
     */
    const menu =
      $(".menu");


    if (menu) {

      menu.addEventListener(
        "click",
        () => {

          document
            .querySelector("nav")
            ?.classList.toggle(
              "open"
            );
        }
      );
    }


    /*
     * Close mobile menu after
     * navigation click.
     */
    document
      .querySelectorAll(
        "nav a"
      )
      .forEach(anchor => {

        anchor.addEventListener(
          "click",
          () => {

            document
              .querySelector("nav")
              ?.classList.remove(
                "open"
              );
          }
        );
      });


    /*
     * Saved language.
     */
    currentLang =
      localStorage.getItem(
        "ss_language"
      ) === "hi"
        ? "hi"
        : "en";
  }
);


/* =========================================================
   START WEBSITE
   ========================================================= */

loadData();


/* =========================================================
   LANGUAGE SWITCHER STYLE
   No styles.css change required.
   ========================================================= */

(function () {

  const style =
    document.createElement(
      "style"
    );


  style.textContent = `

    .ss-language-switcher{
      display:flex;
      align-items:center;
      gap:6px;
      margin-left:12px;
      flex-shrink:0;
    }

    .ss-lang-btn{
      border:1px solid rgba(255,255,255,.28);
      background:transparent;
      color:inherit;
      padding:7px 10px;
      border-radius:999px;
      font:inherit;
      font-size:12px;
      line-height:1;
      cursor:pointer;
      white-space:nowrap;
    }

    .ss-lang-btn.active{
      background:#b7df73;
      color:#071a3a;
      border-color:#b7df73;
      font-weight:700;
    }

    @media (max-width:760px){

      .ss-language-switcher{
        margin:12px 0 0;
        justify-content:flex-start;
      }

      header.nav nav.open
      .ss-language-switcher{
        display:flex;
      }

    }

  `;


  document.head.appendChild(
    style
  );

})();
