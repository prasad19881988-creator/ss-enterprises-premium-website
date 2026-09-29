/* =========================================================
   SS ENTERPRISES
   FINAL SCRIPT.JS
   English / Hindi Language Support
   Existing Supabase data preserved
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
      location: "Bihar",
      responsibilities:
        "District project implementation, field staff coordination and monitoring of assigned work.",
      photo: "",
      contact: ""
    }
  ]
};


/* =========================================================
   GLOBAL STATE
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
      "Supabase client could not be created:",
      e
    );
    sb = null;
  }
}


/* =========================================================
   HELPERS
   ========================================================= */

const $ = selector =>
  document.querySelector(selector);


function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char])
  );
}


function safeUrl(value = "") {
  const url = String(value || "").trim();

  return /^(https?:\/\/|mailto:|tel:)/i.test(url)
    ? url
    : "";
}


function statusLabel(status) {
  if (
    status === "ongoing" ||
    status === "active"
  ) {
    return "Ongoing";
  }

  if (status === "upcoming") {
    return "Upcoming";
  }

  if (status === "completed") {
    return "Completed";
  }

  return status || "";
}


/* =========================================================
   TRANSLATION DATABASE
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
  "Careers": "करियर",

  /* Careers / Job Application */
  "CAREERS": "करियर",
  "Apply for a": "के लिए आवेदन करें",
  "Job": "नौकरी",
  "Interested in working with SS Enterprises? Submit your application and our team will review it.": "SS Enterprises के साथ काम करने में रुचि है? अपना आवेदन जमा करें, हमारी टीम इसकी समीक्षा करेगी।",
  "Full Name": "पूरा नाम",
  "Mobile Number": "मोबाइल नंबर",
  "Email": "ईमेल",
  "Apply For Post": "किस पद के लिए आवेदन",
  "Select Post": "पद चुनें",
  "Qualification": "शैक्षणिक योग्यता",
  "Experience": "अनुभव",
  "Fresher / Years": "फ्रेशर / वर्षों का अनुभव",
  "Address": "पता",
  "Photo URL (optional)": "फोटो URL (वैकल्पिक)",
  "Public photo URL": "सार्वजनिक फोटो URL",
  "Resume/CV URL (optional)": "रिज्यूमे/CV URL (वैकल्पिक)",
  "Public resume URL": "सार्वजनिक रिज्यूमे URL",
  "Message": "संदेश",
  "Tell us briefly about yourself": "अपने बारे में संक्षेप में बताएं",
  "Submit Job Application": "नौकरी के लिए आवेदन जमा करें",


  /* Buttons */

  "Explore Our Work": "हमारा कार्य देखें",
  "Contact Us": "संपर्क करें",
  "Learn More": "और जानें",
  "Open Portal ↗": "पोर्टल खोलें ↗",


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



  /* ABHA information */
  "ABHA INFORMATION": "ABHA की जानकारी",
  "Understand ABHA": "ABHA को समझें",
  "in simple language.": "सरल भाषा में।",
  "Learn what ABHA is, why the ABHA Number is useful, how digital health records can work, and how consent-based sharing works.": "जानिए ABHA क्या है, ABHA Number का उद्देश्य क्या है, digital health records कैसे काम कर सकते हैं और consent के आधार पर records sharing कैसे होती है।",
  "What is ABHA?": "ABHA क्या है?",
  "ABHA is short for Ayushman Bharat Health Account. It is a 14-digit unique number designed to help a person connect with India's digital health ecosystem. You can think of it as a digital health identity that can help organise and access eligible digital health information. Having an ABHA number does not by itself mean that every medical record will automatically appear in it; records need to be available and linked through the relevant digital systems.": "ABHA का पूरा नाम Ayushman Bharat Health Account है। यह 14 अंकों का एक unique number है, जो व्यक्ति को भारत के digital health ecosystem से जुड़ने में मदद करता है। इसे आसान भाषा में digital health identity समझ सकते हैं, जो उपलब्ध digital health information को व्यवस्थित करने और जरूरत के अनुसार access करने में मदद कर सकती है। केवल ABHA number बनने से हर medical record अपने-आप उसमें नहीं आ जाता; record उपलब्ध होना और संबंधित digital system से link होना जरूरी है।",
  "Purpose of the ABHA Number": "ABHA Number का उद्देश्य",
  "The ABHA Number helps connect a person with digital health services and can make it easier to organise health information across participating digital systems. Depending on the service and records available, it may help a person access or manage linked health information instead of relying only on paper documents. It is not a replacement for a doctor's advice, treatment, or an emergency service.": "ABHA Number व्यक्ति को digital health services से जोड़ने में मदद करता है और participating digital systems में उपलब्ध health information को व्यवस्थित करना आसान बना सकता है। सेवा और उपलब्ध records के अनुसार, यह केवल कागजी documents पर निर्भर रहने के बजाय linked health information को access या manage करने में मदद कर सकता है। यह डॉक्टर की सलाह, इलाज या emergency service का विकल्प नहीं है।",
  "Digital Health Records": "Digital Health Records",
  "Digital health records are health-related documents and information available in digital form. Depending on the participating healthcare facility and digital service, records such as prescriptions, laboratory reports, vaccination information and other health information may be linked, viewed or managed digitally. The availability of a record depends on whether it has been created and made available through the relevant system.": "Digital health records का मतलब स्वास्थ्य से जुड़े documents और information का digital रूप में उपलब्ध होना है। संबंधित healthcare facility और digital service के अनुसार prescriptions, laboratory reports, vaccination information और अन्य health information को digitally link, view या manage किया जा सकता है। कोई record तभी उपलब्ध होगा जब वह संबंधित system में बनाया गया हो और वहाँ उपलब्ध कराया गया हो।",
  "Consent-based Health Record Sharing": "Consent के आधार पर Health Record Sharing",
  "A key part of the digital health framework is consent. Where a digital health service asks for access to a person's health information, sharing can take place through the applicable consent process. In simple words, a person's health information should not be treated as something that can be shared freely without the applicable permission or consent mechanism. The exact options depend on the digital service being used.": "Digital health framework का एक महत्वपूर्ण हिस्सा consent यानी अनुमति है। जब कोई digital health service किसी व्यक्ति की health information तक access मांगती है, तो applicable consent process के माध्यम से information sharing हो सकती है। आसान भाषा में, health information को बिना लागू permission या consent mechanism के मनमाने तरीके से share नहीं किया जाना चाहिए। उपलब्ध विकल्प इस्तेमाल की जा रही digital service पर निर्भर करते हैं।",
  "OFFICIAL INFORMATION VIDEO": "आधिकारिक जानकारी का वीडियो",
  "Prime Minister's address at the launch of Ayushman Bharat Digital Mission": "आयुष्मान भारत डिजिटल मिशन के शुभारंभ पर प्रधानमंत्री का संबोधन",
  "This video is published by PMO India and is included here as an official public-information resource about the launch of the Ayushman Bharat Digital Mission.": "यह वीडियो PMO India द्वारा प्रकाशित किया गया है और यहाँ आयुष्मान भारत डिजिटल मिशन के शुभारंभ की आधिकारिक सार्वजनिक जानकारी के स्रोत के रूप में दिया गया है।",
  "View the official PMO page ↗": "आधिकारिक PMO पेज देखें ↗",
  "SERVICE CHARGE INFORMATION": "सेवा शुल्क की जानकारी",
  "Assistance and service charges": "सहायता एवं सेवा शुल्क",
  "ABHA is part of the digital health ecosystem. SS Enterprises may provide assistance or field support for services assigned to it. Where a separate assistance or service charge applies for a service, the amount should be clearly informed to the person before the service is provided. Such a charge is an SS Enterprises service or assistance charge; it should not be presented as a government fee for creating an ABHA number.": "ABHA digital health ecosystem का हिस्सा है। SS Enterprises को सौंपे गए कार्यों में आवश्यकता के अनुसार सहायता या field support उपलब्ध करा सकता है। जहाँ किसी सेवा के लिए अलग assistance या service charge लागू हो, वहाँ सेवा देने से पहले व्यक्ति को शुल्क की जानकारी स्पष्ट रूप से दी जानी चाहिए। ऐसा शुल्क SS Enterprises की service या assistance का charge है; इसे ABHA number बनाने का सरकारी शुल्क नहीं बताया जाना चाहिए।",
  "PVC CARD PRINTING": "PVC कार्ड प्रिंटिंग",
  "PVC ABHA Card Printing Service": "PVC ABHA Card Printing Service",
  "If a person wants a durable physical copy of their available ABHA card information, SS Enterprises can provide a PVC printing service where available. PVC is a plastic-type, durable card format that is more suitable for carrying in a wallet than an ordinary paper print. The PVC card is a physical printed convenience copy; it does not create a new ABHA number or replace the official digital account.": "यदि कोई व्यक्ति अपने उपलब्ध ABHA card की मजबूत physical copy रखना चाहता है, तो जहाँ यह सुविधा उपलब्ध हो वहाँ SS Enterprises PVC printing service दे सकता है। PVC एक plastic-type, टिकाऊ card format है, जिसे सामान्य paper print की तुलना में wallet में रखना अधिक सुविधाजनक होता है। PVC card केवल physical printed convenience copy है; इससे नया ABHA number नहीं बनता और यह official digital account का replacement नहीं है।",
  "A normal printing/service charge may apply. This is a printing or service charge, not a government fee for creating ABHA.": "सामान्य printing/service charge लागू हो सकता है। यह printing या service charge है, ABHA बनाने का सरकारी शुल्क नहीं।",
  "TENDER / ASSIGNMENT CONTEXT": "टेंडर / असाइनमेंट की जानकारी",
  "How project and field-service assignments can work": "Project और field-service assignments कैसे दिए जा सकते हैं",
  "Government departments, public organisations and other institutions may engage eligible companies or service providers through tenders, contracts, empanelment or specific assignments for defined project activities. A company can perform only the activities covered by its applicable project documents and authorization. SS Enterprises provides services only within the scope of the assignments and documents applicable to its work; this website does not claim that SS Enterprises is a government department or that every ABHA-related activity is a government tender.": "सरकारी विभाग, सार्वजनिक संस्थाएँ और अन्य संस्थाएँ निर्धारित project activities के लिए eligible companies या service providers को tender, contract, empanelment या specific assignment के माध्यम से कार्य दे सकती हैं। कोई company वही activities कर सकती है जो उसके लागू project documents और authorization के scope में हों। SS Enterprises भी अपने काम पर लागू assignments और documents के scope के भीतर ही सेवाएँ प्रदान करता है; यह website SS Enterprises को सरकारी विभाग नहीं बताती और न ही यह दावा करती है कि हर ABHA-related activity किसी सरकारी tender का हिस्सा है।",
  "ABHA services and official health information are subject to the applicable ABDM/ABHA rules and the relevant healthcare or project authority. For official ABHA services and account information, use the official government platforms.": "ABHA services और official health information लागू ABDM/ABHA rules तथा संबंधित healthcare या project authority के अधीन हैं। Official ABHA services और account information के लिए सरकारी official platforms का उपयोग करें।",

  /* App / visual interface */
  "SS ENTERPRISES APP": "SS ENTERPRISES ऐप",
  "Our official app,": "हमारा आधिकारिक ऐप,",
  "available here.": "यहाँ उपलब्ध है।",
  "Download the SS Enterprises Android app directly from our official website.": "SS Enterprises का Android ऐप हमारी आधिकारिक वेबसाइट से सीधे डाउनलोड करें।",
  "✓ Official SS Enterprises app": "✓ आधिकारिक SS Enterprises ऐप",
  "✓ Android download": "✓ Android डाउनलोड",
  "✓ Direct website download": "✓ वेबसाइट से सीधे डाउनलोड",
  "Download SS Enterprises App ↓": "SS Enterprises ऐप डाउनलोड करें ↓",
  "Android APK • Please allow installation from your browser/file source if Android asks for permission.": "Android APK • यदि Android अनुमति मांगे तो अपने ब्राउज़र/फ़ाइल स्रोत से इंस्टॉलेशन की अनुमति दें।",
  "Professional Project Execution": "पेशेवर प्रोजेक्ट कार्यान्वयन",
  "Professional Project Execution Across Bihar": "पूरे बिहार में पेशेवर प्रोजेक्ट कार्यान्वयन",
  "Tender Work • Manpower • Digital Services": "टेंडर कार्य • जनशक्ति • डिजिटल सेवाएँ",
  "Tender Work • Manpower • Digital Services • Bihar": "टेंडर कार्य • जनशक्ति • डिजिटल सेवाएँ • बिहार",
  "BIHAR": "बिहार",
  "TRUST": "विश्वास",
  "EXECUTION": "कार्यान्वयन",

  /* Common */

  "SS Enterprises Bihar": "SS Enterprises बिहार",
  "Professional services across Bihar": "पूरे बिहार में पेशेवर सेवाएँ",
  "Across Bihar": "पूरे बिहार में",

  "Aapki Seva Mein Hamari Khushi":
    "आपकी सेवा में हमारी खुशी",

  "All rights reserved.":
    "सर्वाधिकार सुरक्षित।",


  /* About */

  "ABOUT SS ENTERPRISES":
    "SS ENTERPRISES के बारे में",

  "People, projects &":
    "लोग, प्रोजेक्ट और",

  "professional execution.":
    "पेशेवर कार्यान्वयन।",

  "Tender Work":
    "टेंडर कार्य",

  "Project Execution":
    "प्रोजेक्ट कार्यान्वयन",

  "Skilled Manpower":
    "कुशल जनशक्ति",

  "Workforce Expansion":
    "कार्यबल विस्तार",

  "Responsible execution of awarded and contracted work with clear coordination.":
    "प्राप्त एवं अनुबंधित कार्य का स्पष्ट समन्वय के साथ जिम्मेदार कार्यान्वयन।",

  "Organised manpower, supervision and on-ground coordination for project delivery.":
    "प्रोजेक्ट पूरा करने के लिए व्यवस्थित जनशक्ति, निगरानी और जमीनी समन्वय।",

  "Building dependable teams suited to the requirements of each project.":
    "प्रत्येक प्रोजेक्ट की आवश्यकताओं के अनुसार भरोसेमंद टीम तैयार करना।",

  "Scalable staffing as project volume and operational requirements increase.":
    "प्रोजेक्ट और संचालन की आवश्यकताओं के बढ़ने के साथ कार्यबल का विस्तार।",

  "We take up suitable contracted and tender-based work and build dependable teams to execute it with accountability, coordination and service.":
    "हम उपयुक्त अनुबंधित और टेंडर आधारित कार्य लेते हैं तथा जवाबदेही, समन्वय और सेवा भावना के साथ उसे पूरा करने के लिए भरोसेमंद टीम तैयार करते हैं।",
   

"Professional Execution Building Trust Through Responsible Work.":
  "पेशेवर कार्यान्वयन और जिम्मेदार कार्य के साथ विश्वास का निर्माण।",
"Professional Execution":
  "पेशेवर कार्यान्वयन",

"Building Trust Through Responsible Work.":
  "जिम्मेदार कार्य के साथ विश्वास का निर्माण",

  /* Services */

  "OUR SERVICES":
    "हमारी सेवाएँ",

  "What we":
    "हम",

  "do best.":
    "सबसे अच्छा क्या करते हैं।",

  "What We":
    "हम",

  "Do Best":
    "सबसे अच्छा क्या करते हैं",

  "What We Do Best":
    "हमारी सेवाएँ",

  "WHAT WE DO BEST":
    "हमारी सेवाएँ",

  "Professional services for tender work, project execution, manpower coordination and reliable field support.":
    "टेंडर कार्य, प्रोजेक्ट कार्यान्वयन, जनशक्ति समन्वय और विश्वसनीय फील्ड सहायता के लिए पेशेवर सेवाएँ।",

  "Tender & Contract Work":
    "टेंडर एवं अनुबंध कार्य",

  "Project Manpower":
    "प्रोजेक्ट जनशक्ति",

  "Digital Service Projects":
    "डिजिटल सेवा प्रोजेक्ट्स",

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


  /* Projects information */

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
    "आयुष्मान कार्ड KYC से संबंधित प्रोजेक्ट, जिसमें प्रोजेक्ट की आवश्यकताओं के अनुसार फील्ड समन्वय और सेवा कार्य शामिल हैं।",


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


  /* Team responsibilities */

  "Overall vision, strategic decisions, business direction and major operations.":
    "समग्र दृष्टि, रणनीतिक निर्णय, व्यवसाय की दिशा और प्रमुख संचालन।",

  "Day-to-day operations, project and tender coordination, team management and organisational growth.":
    "दैनिक संचालन, प्रोजेक्ट एवं टेंडर समन्वय, टीम प्रबंधन और संगठनात्मक विकास।",

  "State-level project coordination, field operations and monitoring of district teams.":
    "राज्य स्तर पर प्रोजेक्ट समन्वय, फील्ड संचालन और जिला टीमों की निगरानी।",

  "District project implementation, field staff coordination and monitoring of assigned work.":
    "जिला स्तर पर प्रोजेक्ट कार्यान्वयन, फील्ड स्टाफ समन्वय और सौंपे गए कार्य की निगरानी।",


  /* Mixed / old content */

  "Professional सेवाएं.":
    "पेशेवर सेवाएँ।",

  "Professional सेवाएं":
    "पेशेवर सेवाएँ।",

  "Professional Services":
    "पेशेवर सेवाएँ",

  "Professional services.":
    "पेशेवर सेवाएँ।",

  "What we do best.":
    "हमारी सेवाएँ।",

  "What we do":
    "हम क्या करते हैं",

  "what we do best":
    "हमारी सेवाएँ"
};


/* =========================================================
   CASE-INSENSITIVE TRANSLATION
   ========================================================= */

function translateLookup(text) {

  const value = String(text ?? "").trim();

  if (!value) {
    return "";
  }

  if (I18N[value] !== undefined) {
    return I18N[value];
  }

  const lower =
    value.toLowerCase();

  const exact =
    Object.keys(I18N).find(
      key =>
        key.toLowerCase() === lower
    );

  if (exact) {
    return I18N[exact];
  }

  return null;
}


function escapeRegExp(value = "") {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


function autoTranslate(text = "") {

  if (
    text === null ||
    text === undefined
  ) {
    return "";
  }

  const original =
    String(text);

  if (currentLang !== "hi") {
    return original;
  }

  const exact =
    translateLookup(original);

  if (exact !== null) {
    return exact;
  }

  let result =
    original;

  /*
    Longest phrases first.
    इससे "What We Do Best" पहले translate होगा
    और बाद में उसके छोटे हिस्से अलग से नहीं टूटेंगे।
  */

  const entries =
    Object.entries(I18N)
      .sort(
        (a,b) =>
          b[0].length - a[0].length
      );

  entries.forEach(
    ([english, hindi]) => {

      if (!english) {
        return;
      }

      const regex =
        new RegExp(
          escapeRegExp(english),
          "gi"
        );

      result =
        result.replace(
          regex,
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
  return currentLang === "hi"
    ? autoTranslate(text)
    : String(text ?? "");
}


/* =========================================================
   NORMALISE DATA
   ========================================================= */

function normalise(raw) {

  const source =
    raw || {};

  const result = {
    ...JSON.parse(
      JSON.stringify(DEFAULT_DATA)
    ),
    ...source
  };

  result.settings = {
    ...DEFAULT_DATA.settings,
    ...(source.settings || {})
  };

  result.settings.homepage = {
    ...DEFAULT_DATA.settings.homepage,
    ...(source.settings?.homepage || {})
  };

  result.settings.announcement = {
    ...DEFAULT_DATA.settings.announcement,
    ...(source.settings?.announcement || {})
  };

  result.settings.sections = {
    ...DEFAULT_DATA.settings.sections,
    ...(source.settings?.sections || {})
  };

  result.settings.about = {
    ...DEFAULT_DATA.settings.about,
    ...(source.settings?.about || {})
  };

  result.settings.services = {
    ...DEFAULT_DATA.settings.services,
    ...(source.settings?.services || {})
  };

  result.settings.contact = {
    ...DEFAULT_DATA.settings.contact,
    ...(source.settings?.contact || {})
  };

  result.settings.gallery =
    Array.isArray(
      source.settings?.gallery
    )
      ? source.settings.gallery
      : [];

  result.settings.about.cards =
    Array.isArray(
      result.settings.about.cards
    )
      ? result.settings.about.cards
      : DEFAULT_DATA.settings.about.cards;

  result.settings.services.cards =
    Array.isArray(
      result.settings.services.cards
    )
      ? result.settings.services.cards
      : DEFAULT_DATA.settings.services.cards;

  result.settings.contact.socials =
    Array.isArray(
      result.settings.contact.socials
    )
      ? result.settings.contact.socials
      : DEFAULT_DATA.settings.contact.socials;

  result.projects =
    Array.isArray(source.projects)
      ? source.projects
      : DEFAULT_DATA.projects;

  result.team =
    Array.isArray(source.team)
      ? source.team
      : DEFAULT_DATA.team;

  result.projects =
    result.projects.map(
      project => ({
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
      })
    );

  return result;
}


/* =========================================================
   SECTION VISIBILITY
   ========================================================= */

function setSection(id, visible) {

  const element =
    document.getElementById(id);

  if (!element) {
    return;
  }

  element.style.display =
    visible
      ? ""
      : "none";
}


/* =========================================================
   ANNOUNCEMENT
   ========================================================= */

function renderAnnouncement() {

  const settings =
    data.settings.announcement || {};

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

  const link =
    safeUrl(settings.link);

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
      link
        ? `
          <a
            class="btn ghost"
            href="${escapeHtml(link)}"
            target="_blank"
            rel="noopener"
          >
            ${escapeHtml(
              t(
                settings.linkLabel ||
                "Learn More"
              )
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

  if ($("#heroEyebrow")) {
    $("#heroEyebrow").textContent =
      displayText(
        homepage.eyebrow || ""
      );
  }

  if ($("#heroTitle")) {
    $("#heroTitle").textContent =
      displayText(
        homepage.title || ""
      );
  }

  if ($("#heroAccent")) {
    $("#heroAccent").textContent =
      displayText(
        homepage.accent || ""
      );
  }

  if ($("#heroLead")) {
    $("#heroLead").textContent =
      displayText(
        homepage.lead || ""
      );
  }

  renderAnnouncement();
}


/* =========================================================
   ABOUT
   ========================================================= */

function renderAbout() {

  const section =
    data.settings.about || {};

  setSection(
    "about",
    data.settings.sections.about
  );

  if ($("#aboutEyebrow")) {
    $("#aboutEyebrow").textContent =
      displayText(
        section.eyebrow || ""
      );
  }

  if ($("#aboutTitle")) {
    $("#aboutTitle").textContent =
      displayText(
        section.title || ""
      );
  }

  if ($("#aboutAccent")) {
    $("#aboutAccent").textContent =
      displayText(
        section.accent || ""
      );
  }

  if ($("#aboutText")) {
    $("#aboutText").textContent =
      displayText(
        section.text || ""
      );
  }

  if ($("#aboutGrid")) {

    $("#aboutGrid").innerHTML =
      (section.cards || [])
        .map(
          (card, index) => `
            <article>

              <div class="icon">
                ${String(index + 1).padStart(2, "0")}
              </div>

              <h3>
                ${escapeHtml(
                  displayText(
                    card.title
                  )
                )}
              </h3>

              <p>
                ${escapeHtml(
                  displayText(
                    card.text
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

  const section =
    data.settings.services || {};

  setSection(
    "services",
    data.settings.sections.services
  );

  if ($("#servicesEyebrow")) {
    $("#servicesEyebrow").textContent =
      currentLang === "hi"
        ? "हमारी सेवाएँ"
        : displayText(
            section.eyebrow || "OUR SERVICES"
          );
  }

  /*
    SERVICES TITLE
    -------------------------
    Hindi:
      केवल "हमारी सेवाएँ"

    English:
      "What We Do Best"

    अगर Supabase में पुराना combined
    "What We Do Best Professional Services"
    पड़ा है तो उसे भी साफ कर दिया जाएगा।
  */

  if ($("#servicesTitle")) {

    let title =
      String(
        section.title || ""
      ).trim();

    if (currentLang === "hi") {

      $("#servicesTitle").textContent =
        "हमारी सेवाएँ";

    } else {

      if (
        title.toLowerCase().includes(
          "what we do best"
        )
      ) {
        $("#servicesTitle").textContent =
          "What We Do Best";
      } else {
        $("#servicesTitle").textContent =
          title || "What We Do Best";
      }
    }
  }


  /*
    ACCENT
    -------------------------
    Hindi में पुराने
    "Professional Services"
    को बिल्कुल नहीं दिखाना है।
  */

  if ($("#servicesAccent")) {

    if (currentLang === "hi") {

      $("#servicesAccent").textContent =
        "";

      $("#servicesAccent").style.display =
        "none";

    } else {

      $("#servicesAccent").style.display =
        "";

      $("#servicesAccent").textContent =
        "Professional Services.";
    }
  }


  /*
    SERVICES DESCRIPTION
  */

  if ($("#servicesText")) {

    $("#servicesText").textContent =
      currentLang === "hi"
        ? "टेंडर कार्य, प्रोजेक्ट कार्यान्वयन, जनशक्ति समन्वय और विश्वसनीय फील्ड सहायता के लिए पेशेवर सेवाएँ।"
        : (
            section.text ||
            "Professional services for tender work, project execution, manpower coordination and reliable field support."
          );
  }


  /*
    SERVICE CARDS
  */

  if ($("#servicesGrid")) {

    $("#servicesGrid").innerHTML =
      (section.cards || [])
        .map(
          (card, index) => `
            <article>

              <div class="icon">
                ${String(index + 1).padStart(2, "0")}
              </div>

              <h3>
                ${escapeHtml(
                  displayText(
                    card.title || ""
                  )
                )}
              </h3>

              <p>
                ${escapeHtml(
                  displayText(
                    card.text || ""
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

  let projects =
    Array.isArray(data.projects)
      ? data.projects
      : [];

  if (filter !== "all") {

    projects =
      projects.filter(
        project => {

          if (
            filter === "ongoing"
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
  }

  projects =
    projects.filter(
      project =>
        project.published !== false
    );

  const featuredId =
    data.settings.featuredProjectId;

  if (!projects.length) {

    grid.innerHTML = `
      <div class="empty">
        ${escapeHtml(
          t(
            "No published projects in this category yet."
          )
        )}
      </div>
    `;

  } else {

    grid.innerHTML =
      projects
        .map(
          project => {

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
                        loading="lazy"
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
          }
        )
        .join("");
  }


  const featured =
    data.projects.find(
      project =>
        project.id ===
          featuredId &&
        project.published !== false
    );

  const panel =
    $("#portalPanel");

  if (!panel) {
    return;
  }

  panel.style.display =
    featured?.link
      ? ""
      : "none";

  if (
    featured &&
    safeUrl(featured.link)
  ) {

    if ($("#portalTitle")) {
      $("#portalTitle").textContent =
        displayText(
          featured.name ||
          "Featured Project"
        );
    }

    if ($("#portalText")) {
      $("#portalText").textContent =
        displayText(
          featured.description ||
          "Open the featured digital service portal directly from SS Enterprises."
        );
    }

    if ($("#portalLink")) {

      $("#portalLink").href =
        safeUrl(
          featured.link
        );

      $("#portalLink").textContent =
        t(
          "Open Portal ↗"
        );
    }
  }
}


function translateStatus(status) {
  return t(
    statusLabel(status)
  );
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

  grid.innerHTML =
    (data.team || [])
      .map(
        member => `
          <article class="person-card">

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
                    loading="lazy"
                  >
                `
                : `
                  <div class="person-placeholder">
                    ♙
                  </div>
                `
            }

            <div>

              <span class="role">
                ${escapeHtml(
                  t(
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
    data.settings.contact || {};

  setSection(
    "contact",
    data.settings.sections.contact
  );

  if ($("#contactEyebrow")) {
    $("#contactEyebrow").textContent =
      displayText(
        settings.eyebrow ||
        ""
      );
  }

  if ($("#contactTitle")) {
    $("#contactTitle").textContent =
      displayText(
        settings.title ||
        ""
      );
  }

  if ($("#contactText")) {
    $("#contactText").textContent =
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
      social =>
        social &&
        social.label &&
        safeUrl(
          social.url
        )
    )
    .forEach(
      social => {

        links.push(`
          <a
            href="${escapeHtml(
              safeUrl(
                social.url
              )
            )}"
            target="_blank"
            rel="noopener"
          >
            🔗
            ${escapeHtml(
              displayText(
                social.label
              )
            )}
          </a>
        `);
      }
    );


  if ($("#contactCard")) {

    $("#contactCard").innerHTML =
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

  const grid =
    $("#galleryGrid");

  if (!grid) {
    return;
  }

  const items =
    (
      data.settings.gallery ||
      []
    ).filter(
      item =>
        safeUrl(
          item.url
        )
    );


  if (!items.length) {

    grid.innerHTML = `
      <div class="empty">
        ${escapeHtml(
          t(
            "Gallery photos will appear here."
          )
        )}
      </div>
    `;

    return;
  }


  grid.innerHTML =
    items
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
      .join("");
}


/* =========================================================
   STATIC HTML TRANSLATION
   ========================================================= */

function translateCareerForm() {
  const hi = currentLang === "hi";
  const posts = {
    "Field Executive": hi ? "फील्ड एग्जीक्यूटिव" : "Field Executive",
    "District Coordinator": hi ? "जिला समन्वयक" : "District Coordinator",
    "Sales Executive": hi ? "सेल्स एग्जीक्यूटिव" : "Sales Executive",
    "Data Entry Operator": hi ? "डेटा एंट्री ऑपरेटर" : "Data Entry Operator",
    "Office Assistant": hi ? "ऑफिस असिस्टेंट" : "Office Assistant",
    "Other": hi ? "अन्य" : "Other"
  };
  document.querySelectorAll('#ja_post option').forEach(o=>{
    if(o.value==='') o.textContent=hi?'पद चुनें':'Select Post';
    else if(posts[o.textContent]) o.textContent=posts[o.textContent];
  });
}

function applyStaticTranslations() {

  /*
    1. data-i18n elements
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
          ) || "";

        if (
          !element.dataset.ssOriginal
        ) {
          element.dataset.ssOriginal =
            key;
        }

        const original =
          element.dataset.ssOriginal;

        element.textContent =
          currentLang === "hi"
            ? autoTranslate(
                original
              )
            : original;
      }
    );


  /*
    2. Language buttons
  */

  document
    .querySelectorAll(
      "[data-lang]"
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
   LANGUAGE SWITCHER
   ========================================================= */

function createLanguageSwitcher() {

  document
    .querySelectorAll(
      ".lang-btn, .ss-lang-btn"
    )
    .forEach(
      button => {

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
      }
    );


  document
    .querySelectorAll(
      ".lang-btn, .ss-lang-btn"
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
   LANGUAGE APPLY
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

  applyAll();

  applyStaticTranslations();

  createLanguageSwitcher();
}


/* =========================================================
   OLD / LEGACY CONTENT CLEANUP
   ========================================================= */

function cleanLegacyCustomerText() {

  /*
    यह केवल पुराने गलत/default text को
    सही करता है।

    Existing user data, photos, URLs,
    projects और team members delete नहीं होते।
  */

  const settings =
    data.settings || {};


  /*
    पुराने Services description
  */

  if (
    settings.services &&
    (
      settings.services.text ===
        "Professional services for tender work, project execution, manpower coordination and reliable field support." ||
      settings.services.text ===
        "Professional सेवाएं."
    )
  ) {

    settings.services.text =
      "Professional services for tender work, project execution, manpower coordination and reliable field support.";
  }


  /*
    पुराने Ayushman description
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
   ALL RENDER
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
    Address attributes
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
    Project filters
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
    Current year
  */

  const year =
    $("#year");

  if (year) {

    year.textContent =
      new Date()
        .getFullYear();
  }


  /*
    Static HTML
  */

  applyStaticTranslations();

  createLanguageSwitcher();
}


/* =========================================================
   LOAD FROM SUPABASE
   ========================================================= */

async function loadData() {

  /*
    Default data पहले से मौजूद है।
    इसलिए Supabase fail होने पर भी website blank नहीं होगी।
  */

  data =
    normalise(
      DEFAULT_DATA
    );


  if (sb) {

    try {

      const response =
        await sb
          .from("site_data")
          .select("content")
          .eq("id", 1)
          .maybeSingle();


      const row =
        response?.data;

      const error =
        response?.error;


      if (
        !error &&
        row &&
        row.content
      ) {

        /*
          Existing Supabase content preserved.
        */

        data =
          normalise(
            row.content
          );
      }

    } catch (error) {

      console.warn(
        "Supabase load failed. Default data will be used:",
        error
      );

      data =
        normalise(
          DEFAULT_DATA
        );
    }
  }


  /*
    Website render
  */

  applyAll();


  /*
    Saved language
  */

  if (
    currentLang === "hi"
  ) {
    applyStaticTranslations();
  }
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
      Language switch
    */

    createLanguageSwitcher();


    /*
      Mobile menu
    */

    const menu =
      $(".menu");

    if (menu) {

      menu.addEventListener(
        "click",
        () => {

          const nav =
            document.querySelector(
              "nav"
            );

          if (nav) {
            nav.classList.toggle(
              "open"
            );
          }
        }
      );
    }


    /*
      Close mobile menu after navigation
    */

    document
      .querySelectorAll(
        "nav a"
      )
      .forEach(
        link => {

          link.addEventListener(
            "click",
            () => {

              document
                .querySelector(
                  "nav"
                )
                ?.classList.remove(
                  "open"
                );
            }
          );
        }
      );


    /*
      Saved language
    */

    currentLang =
      localStorage.getItem(
        "ss_language"
      ) === "hi"
        ? "hi"
        : "en";
     loadData();
  }
);


/* =========================================================
   INTRO
   ========================================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        $("#intro")?.remove();

      },
      3200
    );
  }
);



/* =========================================================
   LANGUAGE SWITCHER STYLE
   ========================================================= */

(function addLanguageStyles() {

  if (
    document.getElementById(
      "ss-language-style"
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "ss-language-style";

  style.textContent = `

    .ss-language-switcher {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 12px;
      flex-shrink: 0;
    }

    .ss-lang-btn {
      border: 1px solid rgba(255,255,255,.28);
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

    .lang-switch {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .lang-btn {
      border: 1px solid rgba(255,255,255,.28);
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

    .lang-btn.active {
      background: #b7df73;
      color: #071a3a;
      border-color: #b7df73;
      font-weight: 700;
    }

    @media (max-width: 760px) {

      .lang-switch,
      .ss-language-switcher {
        margin: 12px 0 0;
        justify-content: flex-start;
      }

      nav.open .lang-switch,
      nav.open .ss-language-switcher {
        display: flex;
      }
    }

  `;

  document.head.appendChild(
    style
  );

})();

// Public Careers / Job Application — robust submit handler
(function () {
  function initJobApplication() {
    const form = document.getElementById("jobApplicationForm");
    if (!form || form.dataset.ssJobHandler === "1") return;
    form.dataset.ssJobHandler = "1";

    const get = id => document.getElementById(id);
    const msgEl = get("jobApplicationMsg");

    function setMsg(en, hi) {
      if (msgEl) msgEl.textContent = currentLang === "hi" ? hi : en;
    }

    async function uploadCareerFile(client, file, folder) {
      if (!file) return "";
      const ext = (file.name.split(".").pop() || "bin")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") || "bin";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const result = await client.storage
        .from("site-assets")
        .upload(path, file, {
          upsert: false,
          contentType: file.type || "application/octet-stream"
        });
      if (result.error) throw result.error;
      return client.storage.from("site-assets").getPublicUrl(path).data.publicUrl || "";
    }

    async function submitApplication(e) {
      if (e) e.preventDefault();
      if (e) e.stopPropagation();

      setMsg("Submitting application…", "आवेदन जमा हो रहा है…");

      if (!sb) {
        setMsg(
          "Application service is not configured. Please try again later.",
          "आवेदन सेवा अभी उपलब्ध नहीं है। कृपया बाद में फिर प्रयास करें।"
        );
        return false;
      }

      const name = (get("ja_name")?.value || "").trim();
      const mobile = (get("ja_mobile")?.value || "").trim();
      const email = (get("ja_email")?.value || "").trim();
      const post = (get("ja_post")?.value || "").trim();
      const qualification = (get("ja_qualification")?.value || "").trim();
      const experience = (get("ja_experience")?.value || "").trim();
      const address = (get("ja_address")?.value || "").trim();
      const message = (get("ja_message")?.value || "").trim();
      const photoFile = get("ja_photo_file")?.files?.[0] || null;
      const resumeFile = get("ja_resume_file")?.files?.[0] || null;

      if (!name || !mobile || !post || !address) {
        setMsg(
          "Please fill all required fields.",
          "कृपया सभी आवश्यक जानकारी भरें।"
        );
        return false;
      }

      try {
        setMsg("Uploading files…", "फाइलें अपलोड हो रही हैं…");

        const photoUrl = await uploadCareerFile(
          sb,
          photoFile,
          "job-applications/photos"
        );
        const resumeUrl = await uploadCareerFile(
          sb,
          resumeFile,
          "job-applications/resumes"
        );

        const obj = {
          full_name: name,
          mobile: mobile,
          email: email,
          applied_post: post,
          qualification: qualification,
          experience: experience,
          address: address,
          photo_url: photoUrl,
          resume_url: resumeUrl,
          message: message,
          status: "new"
        };

        setMsg("Saving application…", "आवेदन सेव हो रहा है…");

        const result = await sb.from("job_applications").insert(obj);

        if (result.error) {
          throw result.error;
        }

        form.reset();
        setMsg(
          "Application submitted successfully. SS Enterprises will contact you after review.",
          "आवेदन सफलतापूर्वक जमा हो गया। समीक्षा के बाद SS Enterprises आपसे संपर्क करेगा।"
        );
      } catch (err) {
        console.error("Job application submission failed:", err);
        setMsg(
          "Application could not be submitted: " + (err?.message || "Unknown error"),
          "आवेदन जमा नहीं हो सका: " + (err?.message || "अज्ञात त्रुटि")
        );
      }

      return false;
    }

    // Submit event for normal form submission.
    form.addEventListener("submit", submitApplication, true);

    // Click fallback: ensures the button responds even if browser validation
    // or another script interferes with the native submit event.
    const button = form.querySelector('button[type="submit"], input[type="submit"]');
    if (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        submitApplication(e);
      }, true);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJobApplication, { once: true });
  } else {
    initJobApplication();
  }
})();

try {
  if (typeof translateCareerForm === "function") translateCareerForm();
} catch (e) {}

/* SS ENTERPRISES — lightweight pointer 3D tilt for desktop only */
(function(){
  function initPremiumTilt(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if(window.matchMedia('(hover: none)').matches) return;
    const items=document.querySelectorAll('.hero-visual-card, .app-download-card');
    items.forEach(function(el){
      let raf=0;
      el.addEventListener('pointermove',function(e){
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        cancelAnimationFrame(raf);
        raf=requestAnimationFrame(function(){
          el.style.setProperty('--tilt-x',(y*-5).toFixed(2)+'deg');
          el.style.setProperty('--tilt-y',(x*7).toFixed(2)+'deg');
          el.style.setProperty('--tilt-z',(x*2).toFixed(2)+'deg');
          el.classList.add('pointer-tilt');
        });
      },{passive:true});
      el.addEventListener('pointerleave',function(){
        cancelAnimationFrame(raf);
        el.style.setProperty('--tilt-x','0deg');
        el.style.setProperty('--tilt-y','0deg');
        el.style.setProperty('--tilt-z','0deg');
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initPremiumTilt,{once:true});
  else initPremiumTilt();
})();
