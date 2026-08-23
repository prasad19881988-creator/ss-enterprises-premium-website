/* =========================================================
   SS ENTERPRISES - COMPLETE SCRIPT
   Language system + Supabase data + rendering
   IMPORTANT:
   - Existing Supabase data is NOT deleted.
   - Existing projects/team/gallery/photos/URLs are preserved.
   - English is the default language.
   - Hindi is shown through the translation layer.
   ========================================================= */


/* =========================================================
   DEFAULT DATA
   ========================================================= */

const DEFAULT_DATA = {
  settings: {
    locationLabel: "Bihar",
    address: "Donar Road, Darbhanga",

    homepage: {
      eyebrow: "PROJECT EXECUTION • TENDER WORK • MANPOWER",
      title: "Building Work.",
      accent: "Delivering Trust.",
      lead:
        "SS Enterprises is focused on professional execution of contracted and tender-based projects with reliable manpower, disciplined supervision and responsible coordination."
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
      text:
        "We take up suitable contracted and tender-based work and build dependable teams to execute it with accountability, coordination and service.",

      cards: [
        {
          title: "Tender Work",
          text:
            "Responsible execution of awarded and contracted work with clear coordination."
        },
        {
          title: "Project Execution",
          text:
            "Organised manpower, supervision and on-ground coordination for project delivery."
        },
        {
          title: "Skilled Manpower",
          text:
            "Building dependable teams suited to the requirements of each project."
        },
        {
          title: "Workforce Expansion",
          text:
            "Scalable staffing as project volume and operational requirements increase."
        }
      ]
    },

    services: {
      eyebrow: "OUR SERVICES",
      title: "What we",
      accent: "do best.",
      text:
        "Professional services for tender work, project execution, manpower coordination and reliable field support.",

      cards: [
        {
          title: "Tender & Contract Work",
          text:
            "Execution support for awarded tenders and contracted assignments."
        },
        {
          title: "Project Manpower",
          text:
            "Reliable staffing, supervision and field coordination for active projects."
        },
        {
          title: "Digital Service Projects",
          text:
            "Operational support for digital service workflows and citizen-facing projects."
        }
      ]
    },

    contact: {
      eyebrow: "LET'S WORK TOGETHER",
      title: "Have a project in mind?",
      text:
        "For business enquiries, project discussions and work opportunities, contact SS Enterprises directly.",

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
      description:
        "ABHA Card service work through the existing SS Enterprises digital service workflow.",
      date: "Active",
      link:
        "https://ss-enterprises-abha-app-2026.onrender.com/",
      photo: "",
      published: true
    },

    {
      id: "ayushman",
      name: "Ayushman Card KYC Project",
      department: "Ayushman Bharat",
      location: "Bihar",
      status: "upcoming",
      description:
        "Ayushman Card KYC related project supporting field coordination and service delivery as per project requirements.",
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
      responsibilities:
        "Overall vision, strategic decisions, business direction and major operations.",
      photo: "",
      contact: ""
    },

    {
      id: "ceo",
      role: "CEO & Managing Director",
      name: "CEO & Managing Director",
      location: "Darbhanga, Bihar",
      responsibilities:
        "Day-to-day operations, project and tender coordination, team management and organisational growth.",
      photo: "",
      contact: ""
    },

    {
      id: "state-head",
      role: "State Head",
      name: "State Head",
      location: "Bihar",
      responsibilities:
        "State-level project coordination, field operations and monitoring of district teams.",
      photo: "",
      contact: ""
    },

    {
      id: "district-coordinator",
      role: "District Coordinator",
      name: "District Coordinator",
      location: "Darbhanga, Bihar",
      responsibilities:
        "District project implementation, field staff coordination and monitoring of assigned work.",
      photo: "",
      contact: ""
    }
  ]
};


/* =========================================================
   WORKING DATA
   ========================================================= */

let data = JSON.parse(
  JSON.stringify(DEFAULT_DATA)
);

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


if (
  hasConfig &&
  window.supabase
) {
  try {
    sb = window.supabase.createClient(
      window.SS_CONFIG.SUPABASE_URL,
      window.SS_CONFIG.SUPABASE_ANON_KEY
    );
  } catch (e) {
    console.warn(
      "Supabase client creation failed:",
      e
    );
    sb = null;
  }
}


/* =========================================================
   BASIC HELPERS
   ========================================================= */

const $ = selector =>
  document.querySelector(selector);


const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    match =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[match])
  );


const safeUrl = (value = "") => {
  const text = String(value).trim();

  return /^(https?:\/\/|mailto:|tel:)/i.test(
    text
  )
    ? text
    : "";
};


const statusLabel = status =>
  status === "ongoing" ||
  status === "active"
    ? "Ongoing"
    : status === "upcoming"
      ? "Upcoming"
      : "Completed";


function escapeRegExp(value = "") {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


/* =========================================================
   TRANSLATIONS
   ========================================================= */

const I18N = {

  /* Navigation */

  "Home": "होम",
  "About": "हमारे बारे में",
  "Services": "सेवाएँ",
  "Projects": "प्रोजेक्ट्स",
  "Leadership & Team": "नेतृत्व एवं टीम",
  "Contact": "संपर्क",
  "Gallery": "गैलरी",
  "Credentials": "प्रमाण-पत्र",
  "Vision": "दृष्टिकोण",


  /* Buttons */

  "Explore Our Work":
    "हमारा कार्य देखें",

  "Contact Us":
    "संपर्क करें",

  "Learn More":
    "और जानें",

  "Open Portal ↗":
    "पोर्टल खोलें ↗",


  /* Registration */

  "🔱 Udyam Registered":
    "🔱 उद्यम पंजीकृत",


  /* Projects */

  "OUR PROJECTS":
    "हमारे प्रोजेक्ट्स",

  "Active work.":
    "चल रहा कार्य।",

  "Upcoming opportunities.":
    "आगामी अवसर।",

  "Our ongoing and upcoming projects reflect our commitment to reliable execution and responsible service.":
    "हमारे चल रहे और आगामी प्रोजेक्ट विश्वसनीय कार्यान्वयन और जिम्मेदार सेवा के प्रति हमारी प्रतिबद्धता को दर्शाते हैं।",

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

  "PROJECT":
    "प्रोजेक्ट",

  "Active":
    "सक्रिय",

  "No published projects in this category yet.":
    "इस श्रेणी में अभी कोई प्रकाशित प्रोजेक्ट नहीं है।",


  /* Team */

  "LEADERSHIP & OUR TEAM":
    "नेतृत्व एवं हमारी टीम",

  "Meet the people":
    "उन लोगों से मिलिए",

  "behind the work.":
    "जो इस कार्य के पीछे हैं।",

  "Leadership and field coordination team.":
    "नेतृत्व एवं फील्ड समन्वय टीम।",


  /* Credentials */

  "CREDENTIALS":
    "प्रमाण-पत्र",

  "Professional identity,":
    "व्यावसायिक पहचान,",

  "verified honestly.":
    "ईमानदारी से सत्यापित।",

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
    "केवल वैध पंजीकरण और प्रमाण-पत्र जोड़ें।",


  /* Vision */

  "OUR APPROACH":
    "हमारा दृष्टिकोण",

  "Reliable people. Responsible execution. A growing company with a long-term vision.":
    "विश्वसनीय लोग। जिम्मेदार कार्यान्वयन। दीर्घकालिक दृष्टि के साथ बढ़ती कंपनी।",


  /* Gallery */

  "GALLERY":
    "गैलरी",

  "Our work,":
    "हमारा कार्य,",

  "in pictures.":
    "तस्वीरों में।",

  "See our projects, team and work highlights in pictures.":
    "हमारे प्रोजेक्ट, टीम और कार्य की झलकियाँ तस्वीरों में देखें।",

  "Gallery photos will appear here.":
    "गैलरी की तस्वीरें यहाँ दिखाई देंगी।",


  /* Contact */

  "LET'S WORK TOGETHER":
    "आइए साथ काम करें",

  "Have a project in mind?":
    "क्या आपके मन में कोई प्रोजेक्ट है?",

  "For business enquiries, project discussions and work opportunities, contact SS Enterprises directly.":
    "व्यावसायिक पूछताछ, प्रोजेक्ट चर्चा और कार्य अवसरों के लिए SS Enterprises से सीधे संपर्क करें।",


  /* Common */

  "📍":
    "📍",

  "Aapki Seva Mein Hamari Khushi":
    "आपकी सेवा में हमारी खुशी",

  "All rights reserved.":
    "सर्वाधिकार सुरक्षित।",


  /* Services / About */

  "Tender Work":
    "टेंडर कार्य",

  "Project Execution":
    "प्रोजेक्ट कार्यान्वयन",

  "Skilled Manpower":
    "कुशल जनशक्ति",

  "Workforce Expansion":
    "कार्यबल विस्तार",

  "Tender & Contract Work":
    "टेंडर एवं अनुबंध कार्य",

  "Project Manpower":
    "प्रोजेक्ट जनशक्ति",

  "Digital Service Projects":
    "डिजिटल सेवा प्रोजेक्ट्स",


  /* Team roles */

  "Founder":
    "संस्थापक",

  "CEO & Managing Director":
    "सीईओ एवं प्रबंध निदेशक",

  "State Head":
    "राज्य प्रमुख",

  "District Coordinator":
    "जिला समन्वयक",

  "Director":
    "निदेशक",

  "Project Manager":
    "प्रोजेक्ट मैनेजर",

  "Site Engineer":
    "साइट इंजीनियर",

  "Engineer":
    "इंजीनियर",

  "Accountant":
    "अकाउंटेंट",

  "Manager":
    "मैनेजर",

  "Team Member":
    "टीम सदस्य",


  /* Project information */

  "Health / Digital Health Services":
    "स्वास्थ्य / डिजिटल स्वास्थ्य सेवाएँ",

  "Ayushman Bharat":
    "आयुष्मान भारत",

  "Bihar":
    "बिहार",

  "Donar Road, Darbhanga":
    "डोनार रोड, दरभंगा",


  /* Projects */

  "ABHA Card Project":
    "आभा कार्ड प्रोजेक्ट",

  "Ayushman Card KYC Project":
    "आयुष्मान कार्ड KYC प्रोजेक्ट",

  "ABHA Card service work through the existing SS Enterprises digital service workflow.":
    "SS Enterprises की मौजूदा डिजिटल सेवा प्रक्रिया के माध्यम से आभा कार्ड सेवा कार्य।",

  "Ayushman Card KYC related project supporting field coordination and service delivery as per project requirements.":
    "आयुष्मान कार्ड KYC से संबंधित प्रोजेक्ट, जिसमें प्रोजेक्ट की आवश्यकताओं के अनुसार फील्ड समन्वय और सेवा कार्य शामिल हैं।",


  /* About */

  "ABOUT SS ENTERPRISES":
    "SS ENTERPRISES के बारे में",

  "People, projects &":
    "लोग, प्रोजेक्ट और",

  "professional execution.":
    "पेशेवर कार्यान्वयन।",

  "We take up suitable contracted and tender-based work and build dependable teams to execute it with accountability, coordination and service.":
    "हम उपयुक्त अनुबंधित और टेंडर आधारित कार्य लेते हैं तथा जवाबदेही, समन्वय और सेवा भावना के साथ उसे पूरा करने के लिए भरोसेमंद टीम तैयार करते हैं।",


  /* About cards */

  "Responsible execution of awarded and contracted work with clear coordination.":
    "प्राप्त एवं अनुबंधित कार्य का स्पष्ट समन्वय के साथ जिम्मेदार कार्यान्वयन।",

  "Organised manpower, supervision and on-ground coordination for project delivery.":
    "प्रोजेक्ट पूरा करने के लिए व्यवस्थित जनशक्ति, निगरानी और जमीनी समन्वय।",

  "Building dependable teams suited to the requirements of each project.":
    "प्रत्येक प्रोजेक्ट की आवश्यकताओं के अनुसार भरोसेमंद टीम तैयार करना।",

  "Scalable staffing as project volume and operational requirements increase.":
    "प्रोजेक्ट और संचालन की आवश्यकताओं के बढ़ने के साथ कार्यबल का विस्तार।",


  /* Services */

  "OUR SERVICES":
    "हमारी सेवाएँ",

  "What we":
    "हम",

  "do best.":
    "सबसे अच्छा क्या करते हैं।",

  "Professional services for tender work, project execution, manpower coordination and reliable field support.":
    "टेंडर कार्य, प्रोजेक्ट एक्जीक्यूशन, मैनपावर समन्वय और विश्वसनीय फील्ड सहायता के लिए पेशेवर सेवाएँ।",

  "Execution support for awarded tenders and contracted assignments.":
    "प्राप्त टेंडर और अनुबंधित कार्यों के लिए कार्यान्वयन सहायता।",

  "Reliable staffing, supervision and field coordination for active projects.":
    "चल रहे प्रोजेक्ट्स के लिए भरोसेमंद स्टाफ, निगरानी और फील्ड समन्वय।",

  "Operational support for digital service workflows and citizen-facing projects.":
    "डिजिटल सेवा प्रक्रियाओं और नागरिक-केंद्रित प्रोजेक्ट्स के लिए संचालन सहायता।",


  /* Hero */

  "PROJECT EXECUTION • TENDER WORK • MANPOWER":
    "प्रोजेक्ट कार्यान्वयन • टेंडर कार्य • जनशक्ति",

  "Building Work.":
    "निर्माण कार्य।",

  "Delivering Trust.":
    "विश्वास के साथ कार्य।",

  "SS Enterprises is focused on professional execution of contracted and tender-based projects with reliable manpower, disciplined supervision and responsible coordination.":
    "SS Enterprises भरोसेमंद जनशक्ति, अनुशासित निगरानी और जिम्मेदार समन्वय के साथ अनुबंधित एवं टेंडर आधारित प्रोजेक्ट्स के पेशेवर कार्यान्वयन पर केंद्रित है।",


  /* Team responsibilities */

  "Overall vision, strategic decisions, business direction and major operations.":
    "समग्र दृष्टि, रणनीतिक निर्णय, व्यवसाय की दिशा और प्रमुख संचालन।",

  "Day-to-day operations, project and tender coordination, team management and organisational growth.":
    "दैनिक संचालन, प्रोजेक्ट एवं टेंडर समन्वय, टीम प्रबंधन और संगठनात्मक विकास।",

  "State-level project coordination, field operations and monitoring of district teams.":
    "राज्य स्तर पर प्रोजेक्ट समन्वय, फील्ड संचालन और जिला टीमों की निगरानी।",

  "District project implementation, field staff coordination and monitoring of assigned work.":
    "जिला स्तर पर प्रोजेक्ट कार्यान्वयन, फील्ड स्टाफ समन्वय और सौंपे गए कार्य की निगरानी।"
};


/* =========================================================
   IMPORTANT:
   OLD / MIXED CONTENT NORMALISATION
   =========================================================

   यह हिस्सा आपकी screenshot वाली problem के लिए है।

   अगर Supabase में पहले से:
   "People, प्रोजेक्ट्स &"
   "What We Do Best Professional सेवाएं."
   जैसा mixed content पड़ा है,
   तो पहले उसे clean English base में बदला जाएगा।

   इससे Supabase data delete नहीं होता।
   सिर्फ display के समय सही text दिखाया जाता है.
   ========================================================= */

const CANONICAL_TEXT = {

  /* About heading variants */

  "People, प्रोजेक्ट्स &":
    "People, projects &",

  "People, प्रोजेक्ट्स & professional execution.":
    "People, projects & professional execution.",

  "People, projects & Professional execution.":
    "People, projects & professional execution.",

  "People, projects & professional execution":
    "People, projects & professional execution.",


  /* Services heading variants */

  "What We Do Best Professional सेवाएं.":
    "What we do best.",

  "What We Do Best Professional सेवाएं":
    "What we do best.",

  "What We Do Best":
    "What we do best.",

  "What we Do Best":
    "What we do best.",

  "What we do Best":
    "What we do best.",


  /* Common mixed phrases */

  "Professional सेवाएं.":
    "Professional services.",

  "Professional सेवाएं":
    "Professional services.",

  "पेशेवर execution.":
    "professional execution.",

  "professional Execution.":
    "professional execution.",

  "टेंडर Work":
    "Tender Work",

  "Project कार्यान्वयन":
    "Project Execution",

  "Skilled जनशक्ति":
    "Skilled Manpower",

  "कार्यबल Expansion":
    "Workforce Expansion",


  /* Project mixed variants */

  "ABHA Card प्रोजेक्ट":
    "ABHA Card Project",

  "आभा Card Project":
    "ABHA Card Project",

  "Ayushman Card KYC प्रोजेक्ट":
    "Ayushman Card KYC Project",

  "आयुष्मान Card KYC Project":
    "Ayushman Card KYC Project",


  /* Service mixed variants */

  "Tender एवं Contract Work":
    "Tender & Contract Work",

  "Tender & Contract कार्य":
    "Tender & Contract Work",

  "Project जनशक्ति":
    "Project Manpower",

  "Digital Service प्रोजेक्ट्स":
    "Digital Service Projects"
};


/* =========================================================
   CANONICAL TEXT FUNCTION
   ========================================================= */

function canonicalText(original = "") {

  if (
    original === null ||
    original === undefined
  ) {
    return "";
  }

  let text = String(original);

  /*
    Exact known mixed text.
  */

  if (
    CANONICAL_TEXT[text] !== undefined
  ) {
    return CANONICAL_TEXT[text];
  }


  /*
    Replace known mixed phrases inside
    larger sentences.
  */

  Object.entries(
    CANONICAL_TEXT
  ).forEach(([mixed, english]) => {

    if (
      !mixed ||
      !english ||
      !text.includes(mixed)
    ) {
      return;
    }

    text = text.replace(
      new RegExp(
        escapeRegExp(mixed),
        "g"
      ),
      english
    );

  });


  return text;
}


/* =========================================================
   AUTO TRANSLATION
   ========================================================= */

function autoTranslate(original = "") {

  if (
    original === null ||
    original === undefined
  ) {
    return "";
  }

  /*
    Always clean known old/mixed content first.
  */

  const canonical =
    canonicalText(original);


  /*
    English mode:
    return clean English where known.
  */

  if (
    currentLang !== "hi"
  ) {
    return canonical;
  }


  /*
    Hindi mode:
    exact translation first.
  */

  if (
    I18N[canonical] !== undefined
  ) {
    return I18N[canonical];
  }


  /*
    If exact text is not in dictionary,
    replace known English phrases inside it.
  */

  let result = canonical;


  Object.entries(I18N)
    .sort(
      (a, b) =>
        b[0].length - a[0].length
    )
    .forEach(
      ([english, hindi]) => {

        if (
          !english ||
          !hindi ||
          !result.includes(english)
        ) {
          return;
        }

        result = result.replace(
          new RegExp(
            escapeRegExp(english),
            "g"
          ),
          hindi
        );

      }
    );


  return result;
}


function t(text = "") {
  return autoTranslate(text);
}


function displayText(text = "") {
  return autoTranslate(text);
}


function translateRole(role) {
  return t(role);
}


function translateStatus(status) {
  return t(
    statusLabel(status)
  );
}


/* =========================================================
   NORMALISE DATA STRUCTURE
   ========================================================= */

function normalise(raw) {

  const source =
    raw &&
    typeof raw === "object"
      ? raw
      : {};


  const merged = {
    ...JSON.parse(
      JSON.stringify(
        DEFAULT_DATA
      )
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
    Array.isArray(
      source.settings?.gallery
    )
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


  /*
    IMPORTANT:
    Existing project fields are preserved.
    We only provide missing defaults.
  */

  merged.projects =
    merged.projects.map(project => ({
      ...project,

      location:
        project.location ||
        "Bihar",

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
   SECTION VISIBILITY
   ========================================================= */

function setSection(
  id,
  enabled
) {

  const element =
    document.getElementById(id);

  if (!element) {
    return;
  }

  element.style.display =
    enabled
      ? ""
      : "none";
}


/* =========================================================
   ANNOUNCEMENT
   ========================================================= */

function renderAnnouncement() {

  const settings =
    data.settings.announcement ||
    {};

  const element =
    $("#announcement");

  if (!element) {
    return;
  }


  if (
    !settings.enabled ||
    (
      !settings.title &&
      !settings.text
    )
  ) {

    element.style.display =
      "none";

    return;
  }


  element.style.display =
    "";


  element.innerHTML = `
    <div>
      <strong>
        ${escapeHtml(
          displayText(
            settings.title
          )
        )}
      </strong>

      <span>
        ${escapeHtml(
          displayText(
            settings.text
          )
        )}
      </span>
    </div>

    ${
      safeUrl(settings.link)
        ? `
          <a
            class="btn ghost"
            href="${escapeHtml(
              safeUrl(
                settings.link
              )
            )}"
            target="_blank"
            rel="noopener"
          >
            ${escapeHtml(
              t(
                settings.linkLabel ||
                "Learn More"
              )
            )}
            ↗
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
    data.settings.homepage ||
    {};


  if ($("#heroEyebrow")) {
    $("#heroEyebrow")
      .textContent =
      displayText(
        homepage.eyebrow ||
        ""
      );
  }


  if ($("#heroTitle")) {
    $("#heroTitle")
      .textContent =
      displayText(
        homepage.title ||
        ""
      );
  }


  if ($("#heroAccent")) {
    $("#heroAccent")
      .textContent =
      displayText(
        homepage.accent ||
        ""
      );
  }


  if ($("#heroLead")) {
    $("#heroLead")
      .textContent =
      displayText(
        homepage.lead ||
        ""
      );
  }


  renderAnnouncement();
}


/* =========================================================
   ABOUT
   ========================================================= */

function renderAbout() {

  const settings =
    data.settings.about ||
    {};

  const section =
    $("#about");

  if (!section) {
    return;
  }


  setSection(
    "about",
    data.settings.sections.about
  );


  if ($("#aboutEyebrow")) {
    $("#aboutEyebrow")
      .textContent =
      displayText(
        settings.eyebrow ||
        ""
      );
  }


  if ($("#aboutTitle")) {
    $("#aboutTitle")
      .textContent =
      displayText(
        settings.title ||
        ""
      );
  }


  if ($("#aboutAccent")) {
    $("#aboutAccent")
      .textContent =
      displayText(
        settings.accent ||
        ""
      );
  }


  if ($("#aboutText")) {
    $("#aboutText")
      .textContent =
      displayText(
        settings.text ||
        ""
      );
  }


  if ($("#aboutGrid")) {

    $("#aboutGrid").innerHTML =
      (
        settings.cards ||
        []
      )
        .map(
          (card, index) => `
            <article>

              <div class="icon">
                ${String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )}
              </div>

              <h3>
                ${escapeHtml(
                  displayText(
                    card.title ||
                    ""
                  )
                )}
              </h3>

              <p>
                ${escapeHtml(
                  displayText(
                    card.text ||
                    ""
                  )
                )}
              </p>

            </article>
          `
        )
        .join("");
  }
}


/* =========================================================
   SERVICES
   ========================================================= */

function renderServices() {

  const settings =
    data.settings.services ||
    {};

  const section =
    $("#services");

  if (!section) {
    return;
  }


  setSection(
    "services",
    data.settings.sections.services
  );


  if ($("#servicesEyebrow")) {
    $("#servicesEyebrow")
      .textContent =
      displayText(
        settings.eyebrow ||
        ""
      );
  }


  if ($("#servicesTitle")) {
    $("#servicesTitle")
      .textContent =
      displayText(
        settings.title ||
        ""
      );
  }


  if ($("#servicesAccent")) {
    $("#servicesAccent")
      .textContent =
      displayText(
        settings.accent ||
        ""
      );
  }


  if ($("#servicesText")) {
    $("#servicesText")
      .textContent =
      displayText(
        settings.text ||
        ""
      );
  }


  if ($("#servicesGrid")) {

    $("#servicesGrid").innerHTML =
      (
        settings.cards ||
        []
      )
        .map(
          (card, index) => `
            <article>

              <div class="icon">
                ${String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )}
              </div>

              <h3>
                ${escapeHtml(
                  displayText(
                    card.title ||
                    ""
                  )
                )}
              </h3>

              <p>
                ${escapeHtml(
                  displayText(
                    card.text ||
                    ""
                  )
                )}
              </p>

            </article>
          `
        )
        .join("");
  }
}


/* =========================================================
   PROJECTS
   ========================================================= */

function renderProjects(
  filter = "all"
) {

  const grid =
    $("#projectGrid");

  if (!grid) {
    return;
  }


  setSection(
    "projects",
    data.settings.sections.projects
  );


  const allProjects =
    Array.isArray(data.projects)
      ? data.projects
      : [];


  const filtered =
    filter === "all"
      ? allProjects
      : allProjects.filter(
          project => {

            if (
              filter ===
              "ongoing"
            ) {

              return (
                project.status ===
                  "ongoing" ||
                project.status ===
                  "active"
              );
            }

            return (
              project.status ===
              filter
            );
          }
        );


  const list =
    filtered.filter(
      project =>
        project.published !== false
    );


  const featuredId =
    data.settings
      .featuredProjectId;


  grid.innerHTML =
    list
      .map(project => {

        const link =
          safeUrl(
            project.link
          );


        const featured =
          project.id ===
          featuredId;


        return `
          <article
            class="project-card ${
              featured
                ? "featured"
                : ""
            }"
          >

            ${
              safeUrl(
                project.photo
              )
                ? `
                  <img
                    class="project-photo"
                    src="${escapeHtml(
                      safeUrl(
                        project.photo
                      )
                    )}"
                    alt="${escapeHtml(
                      project.name ||
                      "SS Enterprises"
                    )}"
                  >
                `
                : ""
            }


            <span>
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


            <h3>
              ${escapeHtml(
                displayText(
                  project.name ||
                  ""
                )
              )}
            </h3>


            <p class="project-meta">

              <strong>
                ${escapeHtml(
                  displayText(
                    project.department ||
                    ""
                  )
                )}
              </strong>

              <br>

              📍
              ${escapeHtml(
                displayText(
                  project.location ||
                  "Bihar"
                )
              )}

            </p>


            <p>
              ${escapeHtml(
                displayText(
                  project.description ||
                  ""
                )
              )}
            </p>


            <div class="project-bottom">

              <b>
                ${escapeHtml(
                  displayText(
                    project.date ||
                    ""
                  )
                )}
              </b>


              ${
                link
                  ? `
                    <a
                      class="project-link"
                      href="${escapeHtml(
                        link
                      )}"
                      target="_blank"
                      rel="noopener"
                    >
                      ${escapeHtml(
                        t(
                          "Open Portal ↗"
                        )
                      )}
                    </a>
                  `
                  : ""
              }

            </div>

          </article>
        `;

      })
      .join("")
    ||
    `
      <div class="empty">
        ${escapeHtml(
          t(
            "No published projects in this category yet."
          )
        )}
      </div>
    `;


  const featured =
    allProjects.find(
      project =>
        project.id ===
          featuredId &&
        project.published !== false
    );


  const panel =
    $("#portalPanel");


  if (panel) {

    panel.style.display =
      featured?.link
        ? ""
        : "none";


    if (
      featured?.link
    ) {

      if (
        $("#portalTitle")
      ) {

        $("#portalTitle")
          .textContent =
          displayText(
            featured.name ||
            ""
          );
      }


      if (
        $("#portalText")
      ) {

        $("#portalText")
          .textContent =
          displayText(
            featured.description ||
            "Open the featured digital service portal directly from SS Enterprises."
          );
      }


      if (
        $("#portalLink")
      ) {

        $("#portalLink")
          .href =
          safeUrl(
            featured.link
          ) || "#";


        $("#portalLink")
          .textContent =
          t(
            "Open Portal ↗"
          );
      }
    }
  }
}


/* =========================================================
   TEAM
   ========================================================= */

function renderTeam() {

  const grid =
    $("#teamGrid");

  if (!grid) {
    return;
  }


  setSection(
    "team",
    data.settings.sections.team
  );


  const members =
    Array.isArray(data.team)
      ? data.team
      : [];


  grid.innerHTML =
    members
      .map(
        member => `

          <article
            class="person-card"
          >

            ${
              safeUrl(
                member.photo
              )
                ? `
                  <img
                    src="${escapeHtml(
                      safeUrl(
                        member.photo
                      )
                    )}"
                    alt="${escapeHtml(
                      member.name ||
                      "SS Enterprises"
                    )}"
                  >
                `
                : `
                  <div
                    class="person-placeholder"
                  >
                    ♙
                  </div>
                `
            }


            <div>

              <span class="role">
                ${escapeHtml(
                  translateRole(
                    member.role ||
                    ""
                  )
                )}
              </span>


              <h3>
                ${escapeHtml(
                  displayText(
                    member.name ||
                    ""
                  )
                )}
              </h3>


              <p>
                📍
                ${escapeHtml(
                  displayText(
                    member.location ||
                    "Bihar"
                  )
                )}
              </p>


              <p>
                ${escapeHtml(
                  displayText(
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

        `
      )
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
    data.settings.contact ||
    {};


  setSection(
    "contact",
    data.settings.sections.contact
  );


  if (
    $("#contactEyebrow")
  ) {

    $("#contactEyebrow")
      .textContent =
      displayText(
        settings.eyebrow ||
        ""
      );
  }


  if (
    $("#contactTitle")
  ) {

    $("#contactTitle")
      .textContent =
      displayText(
        settings.title ||
        ""
      );
  }


  if (
    $("#contactText")
  ) {

    $("#contactText")
      .textContent =
      displayText(
        settings.text ||
        ""
      );
  }


  const phone =
    String(
      settings.phone ||
      ""
    ).trim();


  const whatsapp =
    String(
      settings.whatsapp ||
      phone ||
      ""
    ).trim();


  const email =
    String(
      settings.email ||
      ""
    ).trim();


  const links = [];


  if (phone) {

    links.push(`
      <a
        href="tel:${escapeHtml(
          phone
        )}"
      >
        📞
        ${escapeHtml(
          phone
        )}
      </a>
    `);
  }


  if (whatsapp) {

    links.push(`
      <a
        href="https://wa.me/${escapeHtml(
          whatsapp.replace(
            /\D/g,
            ""
          )
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
        href="mailto:${escapeHtml(
          email
        )}"
      >
        ✉️
        ${escapeHtml(
          email
        )}
      </a>
    `);
  }


  links.push(`
    <span>
      📍
      ${escapeHtml(
        displayText(
          settings.address ||
          data.settings.address ||
          "Bihar"
        )
      )}
    </span>
  `);


  (
    settings.socials ||
    []
  )
    .filter(
      item =>
        item &&
        item.label &&
        safeUrl(item.url)
    )
    .forEach(
      item => {

        links.push(`
          <a
            href="${escapeHtml(
              safeUrl(
                item.url
              )
            )}"
            target="_blank"
            rel="noopener"
          >
            🔗
            ${escapeHtml(
              displayText(
                item.label
              )
            )}
          </a>
        `);

      }
    );


  if (
    $("#contactCard")
  ) {

    $("#contactCard")
      .innerHTML =
      links.join("");
  }
}


/* =========================================================
   GALLERY
   ========================================================= */

function renderGallery() {

  const section =
    $("#gallery");

  if (!section) {
    return;
  }


  setSection(
    "gallery",
    data.settings.sections.gallery
  );


  const items =
    (
      data.settings.gallery ||
      []
    ).filter(
      item =>
        item &&
        safeUrl(item.url)
    );


  if (
    !$("#galleryGrid")
  ) {
    return;
  }


  $("#galleryGrid")
    .innerHTML =
      items.length

        ? items
            .map(
              item => `

                <figure>

                  <img
                    src="${escapeHtml(
                      safeUrl(
                        item.url
                      )
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
                        <figcaption>
                          ${escapeHtml(
                            displayText(
                              item.caption
                            )
                          )}
                        </figcaption>
                      `
                      : ""
                  }

                </figure>

              `
            )
            .join("")

        : `
            <div class="empty">
              ${escapeHtml(
                t(
                  "Gallery photos will appear here."
                )
              )}
            </div>
          `;
}


/* =========================================================
   LANGUAGE SWITCHER
   ========================================================= */

function createLanguageSwitcher() {

  const wrappers =
    document.querySelectorAll(
      ".lang-switch, #ss-language-switcher"
    );


  if (!wrappers.length) {
    return;
  }


  wrappers.forEach(
    wrapper => {

      wrapper
        .querySelectorAll(
          "[data-lang], .lang-btn, .ss-lang-btn"
        )
        .forEach(button => {

          if (
            button.dataset.ssBound ===
            "1"
          ) {
            return;
          }


          button.dataset.ssBound =
            "1";


          button.addEventListener(
            "click",
            event => {

              event.preventDefault();

              ssApplyLanguage(
                button.dataset.lang ||
                "en"
              );
            }
          );

        });

    }
  );


  document
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
    First handle elements with data-i18n.
  */

  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      element => {

        const key =
          element.getAttribute(
            "data-i18n"
          );


        if (
          !element.dataset.ssEn
        ) {

          element.dataset.ssEn =
            key;
        }


        const original =
          element.dataset.ssEn;


        element.textContent =
          currentLang === "hi"
            ? autoTranslate(
                original
              )
            : canonicalText(
                original
              );

      }
    );


  /*
    Fallback for buttons and filters
    from older HTML versions.
  */

  document
    .querySelectorAll(
      ".filter, .actions .btn, #portalLink"
    )
    .forEach(
      element => {

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
            ? autoTranslate(
                english
              )
            : canonicalText(
                english
              );

      }
    );


  /*
    Older HTML without data-i18n.
  */

  const staticSelectors = [

    "#heroEyebrow",
    "#heroTitle",
    "#heroAccent",
    "#heroLead",

    "#aboutEyebrow",
    "#aboutTitle",
    "#aboutAccent",
    "#aboutText",

    "#servicesEyebrow",
    "#servicesTitle",
    "#servicesAccent",
    "#servicesText",

    "#contactEyebrow",
    "#contactTitle",
    "#contactText"
  ];


  staticSelectors.forEach(
    selector => {

      document
        .querySelectorAll(
          selector
        )
        .forEach(
          element => {

            /*
              Dynamic render functions already
              put the current language here.

              We store the clean English source
              only once when it is not available.
            */

            if (
              !element.dataset.ssEn
            ) {

              const current =
                element.textContent.trim();

              const clean =
                canonicalText(
                  current
                );

              element.dataset.ssEn =
                clean;
            }

          }
        );

    }
  );
}


/* =========================================================
   RESET STATIC HTML TO ENGLISH
   ========================================================= */

function resetStaticHTMLToEnglish() {

  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      element => {

        const key =
          element.getAttribute(
            "data-i18n"
          );


        if (
          !element.dataset.ssEn
        ) {

          element.dataset.ssEn =
            key;
        }


        element.textContent =
          canonicalText(
            element.dataset.ssEn
          );
      }
    );


  document
    .querySelectorAll(
      ".filter, .actions .btn, #portalLink"
    )
    .forEach(
      element => {

        if (
          !element.dataset.ssEn
        ) {

          element.dataset.ssEn =
            element.textContent.trim();
        }


        element.textContent =
          canonicalText(
            element.dataset.ssEn
          );
      }
    );
}


/* =========================================================
   APPLY LANGUAGE
   ========================================================= */

function ssApplyLanguage(
  language
) {

  currentLang =
    language === "hi"
      ? "hi"
      : "en";


  localStorage.setItem(
    "ss_language",
    currentLang
  );


  document.documentElement.lang =
    currentLang;


  /*
    First restore static text.
  */

  if (
    currentLang === "en"
  ) {

    resetStaticHTMLToEnglish();
  }


  /*
    Re-render every dynamic section.
  */

  applyAll();


  /*
    Static data-i18n content.
  */

  applyLanguageToStaticHTML();


  /*
    Active button state.
  */

  document
    .querySelectorAll(
      "[data-lang], .lang-btn, .ss-lang-btn"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          (
            button.dataset.lang ||
            "en"
          ) === currentLang
        );

      }
    );
}


/* =========================================================
   LEGACY DATA CLEANUP
   =========================================================

   IMPORTANT:
   This DOES NOT write anything to Supabase.
   It only makes old legacy text display correctly.

   Existing user data is preserved.
   ========================================================= */

function cleanLegacyCustomerText() {

  const settings =
    data.settings ||
    {};


  /*
    Old service text.
  */

  if (
    settings.services &&
    settings.services.text ===
      "Professional services for tender work, project execution, manpower coordination and reliable field support."
  ) {

    settings.services.text =
      "Professional services for tender work, project execution, manpower coordination and reliable field support.";
  }


  /*
    Old project description.
  */

  if (
    Array.isArray(
      data.projects
    )
  ) {

    data.projects.forEach(
      project => {

        if (
          project.description ===
            "Ayushman Card KYC related project. Details can be updated from the Admin Panel when confirmed."
        ) {

          project.description =
            "Ayushman Card KYC related project supporting field coordination and service delivery as per project requirements.";
        }

      }
    );
  }
}


/* =========================================================
   RENDER ALL
   ========================================================= */

function applyAll() {

  /*
    IMPORTANT:
    Nothing is deleted from Supabase here.

    This only changes the in-memory display data.
  */

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
    Address fields.
  */

  const address =
    data.settings.address ||
    "Donar Road, Darbhanga";


  document
    .querySelectorAll(
      "[data-address]"
    )
    .forEach(
      element => {

        element.textContent =
          displayText(
            address
          );
      }
    );


  /*
    Project filters.
  */

  document
    .querySelectorAll(
      ".filter"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            document
              .querySelectorAll(
                ".filter"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "active"
                  )
              );


            button.classList.add(
              "active"
            );


            renderProjects(
              button.dataset.filter ||
              "all"
            );
          };

      }
    );


  /*
    Footer year.
  */

  const year =
    $("#year");


  if (year) {

    year.textContent =
      new Date()
        .getFullYear();
  }


  createLanguageSwitcher();


  /*
    Keep active language button correct.
  */

  document
    .querySelectorAll(
      ".ss-lang-btn, .lang-btn"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.lang ===
            currentLang
        );

      }
    );
}


/* =========================================================
   LOAD DATA FROM SUPABASE
   ========================================================= */

async function loadData() {

  /*
    Start with safe default data.
  */

  data =
    normalise(
      DEFAULT_DATA
    );


  /*
    If Supabase is configured,
    load existing data.
  */

  if (sb) {

    try {

      const result =
        await sb
          .from("site_data")
          .select("content")
          .eq("id", 1)
          .maybeSingle();


      const row =
        result?.data;


      const error =
        result?.error;


      if (
        !error &&
        row &&
        row.content
      ) {

        /*
          Existing Supabase content is preserved.

          normalise() only fills missing
          structures. It does NOT delete fields.
        */

        data =
          normalise(
            row.content
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


      /*
        Keep the site working even if
        Supabase temporarily fails.
      */

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
    Render website.
  */

  applyAll();


  /*
    If Hindi was selected previously,
    ensure static HTML is translated.
  */

  if (
    currentLang === "hi"
  ) {

    applyLanguageToStaticHTML();
  }
}


/* =========================================================
   INTRO
   ========================================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        const intro =
          $("#intro");

        if (intro) {
          intro.remove();
        }

      },
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

    /*
      Language switcher.
    */

    createLanguageSwitcher();


    /*
      Mobile menu.
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
      Close menu after navigation.
    */

    document
      .querySelectorAll(
        "nav a"
      )
      .forEach(
        anchor => {

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

        }
      );


    /*
      Restore saved language.

      English is default.
    */

    currentLang =
      localStorage.getItem(
        "ss_language"
      ) === "hi"
        ? "hi"
        : "en";


    document.documentElement.lang =
      currentLang;


    /*
      Do not render here.
      loadData() handles rendering
      after Supabase data is loaded.
    */

  }
);


/* =========================================================
   START WEBSITE
   ========================================================= */

loadData();


/* =========================================================
   LANGUAGE SWITCHER STYLE
   No styles.css modification required.
   ========================================================= */

(function () {

  const style =
    document.createElement(
      "style"
    );


  style.textContent = `

    .ss-language-switcher {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 12px;
      flex-shrink: 0;
    }

    .ss-lang-btn {
      border: 1px solid
        rgba(255,255,255,.28);

      background: transparent;

      color: inherit;

      padding: 7px 10px;

      border-radius: 999px;

      font: inherit;

      font-size: 12px;

      line-height: 1;

      cursor: pointer;

      white-space: nowrap;
    }

    .ss-lang-btn.active {
      background: #b7df73;

      color: #071a3a;

      border-color: #b7df73;

      font-weight: 700;
    }

    @media (max-width: 760px) {

      .ss-language-switcher {
        margin: 12px 0 0;

        justify-content: flex-start;
      }

      header.nav nav.open
      .ss-language-switcher {
        display: flex;
      }

    }

  `;


  document.head.appendChild(
    style
  );

})();
