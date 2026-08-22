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
    announcement: {enabled:false, title:"", text:"", link:"", linkLabel:"Learn More"},
    featuredProjectId: "abha",
    sections: {about:true, services:true, projects:true, team:true, credentials:true, vision:true, gallery:true, contact:true},
    about: {
      eyebrow:"ABOUT SS ENTERPRISES", title:"People, projects &", accent:"professional execution.",
      text:"We take up suitable contracted and tender-based work and build dependable teams to execute it with accountability, coordination and service.",
      cards:[
        {title:"Tender Work",text:"Responsible execution of awarded and contracted work with clear coordination."},
        {title:"Project Execution",text:"Organised manpower, supervision and on-ground coordination for project delivery."},
        {title:"Skilled Manpower",text:"Building dependable teams suited to the requirements of each project."},
        {title:"Workforce Expansion",text:"Scalable staffing as project volume and operational requirements increase."}
      ]
    },
    services: {
      eyebrow:"OUR SERVICES", title:"What we", accent:"do best.",
      text:"Services can be updated from the Admin Panel without changing the website code.",
      cards:[
        {title:"Tender & Contract Work",text:"Execution support for awarded tenders and contracted assignments."},
        {title:"Project Manpower",text:"Reliable staffing, supervision and field coordination for active projects."},
        {title:"Digital Service Projects",text:"Operational support for digital service workflows and citizen-facing projects."}
      ]
    },
    contact: {
      eyebrow:"LET'S WORK TOGETHER", title:"Have a project in mind?",
      text:"For business enquiries, project discussions and work opportunities, contact SS Enterprises directly.",
      phone:"+91 73600 25302", whatsapp:"+91 73600 25302", email:"ssenterprisesservice@poton.me",
      address:"Donar Road, Darbhanga", socials:[
        {label:"Facebook",url:""}, {label:"Instagram",url:""}, {label:"YouTube",url:""}
      ]
    },
    gallery: []
  },
  projects:[
    {id:"abha",name:"ABHA Card Project",department:"Health / Digital Health Services",location:"Bihar",status:"ongoing",description:"ABHA Card service work through the existing SS Enterprises digital service workflow.",date:"Active",link:"https://ss-enterprises-abha-app-2026.onrender.com/",photo:"",published:true},
    {id:"ayushman",name:"Ayushman Card KYC Project",department:"Ayushman Bharat",location:"Bihar",status:"upcoming",description:"Ayushman Card KYC related project. Details can be updated from the Admin Panel when confirmed.",date:"Upcoming",link:"",photo:"",published:true}
  ],
  team:[
    {id:"founder",role:"Founder",name:"Founder",location:"Darbhanga, Bihar",responsibilities:"Overall vision, strategic decisions, business direction and major operations.",photo:"",contact:""},
    {id:"ceo",role:"CEO & Managing Director",name:"CEO & Managing Director",location:"Darbhanga, Bihar",responsibilities:"Day-to-day operations, project and tender coordination, team management and organisational growth.",photo:"",contact:""},
    {id:"state-head",role:"State Head",name:"State Head",location:"Bihar",responsibilities:"State-level project coordination, field operations and monitoring of district teams.",photo:"",contact:""},
    {id:"district-coordinator",role:"District Coordinator",name:"District Coordinator",location:"Darbhanga, Bihar",responsibilities:"District project implementation, field staff coordination and monitoring of assigned work.",photo:"",contact:""}
  ]
};

let data = JSON.parse(JSON.stringify(DEFAULT_DATA));
let sb = null;
let currentLang = localStorage.getItem("ss_language") === "hi" ? "hi" : "en";

const hasConfig = window.SS_CONFIG && window.SS_CONFIG.SUPABASE_URL &&
  window.SS_CONFIG.SUPABASE_URL.startsWith("http") &&
  !window.SS_CONFIG.SUPABASE_URL.includes("PASTE_");

if (hasConfig && window.supabase) {
  sb = window.supabase.createClient(
    window.SS_CONFIG.SUPABASE_URL,
    window.SS_CONFIG.SUPABASE_ANON_KEY
  );
}

const $ = s => document.querySelector(s);
const escapeHtml = (s="") => String(s).replace(/[&<>"']/g,m=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[m]));

const safeUrl = (s="") =>
  /^(https?:\/\/|mailto:|tel:)/i.test(String(s).trim())
    ? String(s).trim()
    : "";

const statusLabel = s =>
  s==="ongoing" || s==="active" ? "Ongoing" :
  s==="upcoming" ? "Upcoming" : "Completed";

/* =========================================================
   FULL ENGLISH / HINDI TRANSLATION
   English remains the default.
   User-entered names/photos/URLs are NOT changed.
   ========================================================= */

const I18N = {
  "Home":"होम",
  "About":"हमारे बारे में",
  "Services":"सेवाएँ",
  "Projects":"प्रोजेक्ट्स",
  "Leadership & Team":"नेतृत्व एवं टीम",
  "Contact":"संपर्क",
  "Gallery":"गैलरी",
  "Credentials":"प्रमाण-पत्र",
  "Vision":"दृष्टिकोण",
  "Explore Our Work":"हमारा कार्य देखें",
  "Contact Us":"संपर्क करें",
  "🔱 Udyam Registered":"🔱 उद्यम पंजीकृत",
  "OUR PROJECTS":"हमारे प्रोजेक्ट्स",
  "Active work.":"चल रहा कार्य।",
  "Upcoming opportunities.":"आगामी अवसर।",
  "Project information can be managed from the secure Admin Panel.":"प्रोजेक्ट की जानकारी सुरक्षित Admin Panel से प्रबंधित की जा सकती है।",
  "All":"सभी",
  "Ongoing":"चल रहे",
  "Upcoming":"आगामी",
  "Completed":"पूर्ण",
  "FEATURED PROJECT":"प्रमुख प्रोजेक्ट",
  "Featured Project":"प्रमुख प्रोजेक्ट",
  "Open Portal ↗":"पोर्टल खोलें ↗",
  "LEADERSHIP & OUR TEAM":"नेतृत्व एवं हमारी टीम",
  "Meet the people":"उन लोगों से मिलिए",
  "behind the work.":"जो इस कार्य के पीछे हैं।",
  "Leadership and field coordination team.":"नेतृत्व एवं फील्ड समन्वय टीम।",
  "CREDENTIALS":"प्रमाण-पत्र",
  "Professional identity,":"व्यावसायिक पहचान,",
  "verified honestly.":"ईमानदारी से सत्यापित।",
  "OUR APPROACH":"हमारा दृष्टिकोण",
  "Reliable people. Responsible execution. A growing company with a long-term vision.":"विश्वसनीय लोग। जिम्मेदार कार्यान्वयन। दीर्घकालिक दृष्टि के साथ बढ़ती कंपनी।",
  "GALLERY":"गैलरी",
  "Our work,":"हमारा कार्य,",
  "in pictures.":"तस्वीरों में।",
  "Project and team photos published from the Admin Panel.":"प्रोजेक्ट और टीम की तस्वीरें Admin Panel से प्रकाशित की जाती हैं।",
  "Aapki Seva Mein Hamari Khushi":"आपकी सेवा में हमारी खुशी",
  "All rights reserved.":"सर्वाधिकार सुरक्षित।",
  "PROJECT":"प्रोजेक्ट",
  "📍":"📍",
  "Active":"सक्रिय",
  "No published projects in this category yet.":"इस श्रेणी में अभी कोई प्रकाशित प्रोजेक्ट नहीं है।",
  "Gallery photos will appear here.":"गैलरी की तस्वीरें यहाँ दिखाई देंगी।",
  "Learn More":"और जानें",
  "LET'S WORK TOGETHER":"आइए साथ काम करें",
  "Have a project in mind?":"क्या आपके मन में कोई प्रोजेक्ट है?",
  "For business enquiries, project discussions and work opportunities, contact SS Enterprises directly.":"व्यावसायिक पूछताछ, प्रोजेक्ट चर्चा और कार्य अवसरों के लिए SS Enterprises से सीधे संपर्क करें।",
  "Tender Work":"टेंडर कार्य",
  "Project Execution":"प्रोजेक्ट कार्यान्वयन",
  "Skilled Manpower":"कुशल जनशक्ति",
  "Workforce Expansion":"कार्यबल विस्तार",
  "Tender & Contract Work":"टेंडर एवं अनुबंध कार्य",
  "Project Manpower":"प्रोजेक्ट जनशक्ति",
  "Digital Service Projects":"डिजिटल सेवा प्रोजेक्ट्स",
  "Founder":"संस्थापक",
  "CEO & Managing Director":"सीईओ एवं प्रबंध निदेशक",
  "State Head":"राज्य प्रमुख",
  "District Coordinator":"जिला समन्वयक",
  "Director":"निदेशक",
  "Project Manager":"प्रोजेक्ट मैनेजर",
  "Site Engineer":"साइट इंजीनियर",
  "Engineer":"इंजीनियर",
  "Accountant":"अकाउंटेंट",
  "Manager":"मैनेजर",
  "Team Member":"टीम सदस्य",
  "Health / Digital Health Services":"स्वास्थ्य / डिजिटल स्वास्थ्य सेवाएँ",
  "Ayushman Bharat":"आयुष्मान भारत",
  "Bihar":"बिहार",
  "Donar Road, Darbhanga":"डोनार रोड, दरभंगा",
  "Tender Work":"टेंडर कार्य",
  "ABHA Card Project":"आभा कार्ड प्रोजेक्ट",
  "Ayushman Card KYC Project":"आयुष्मान कार्ड KYC प्रोजेक्ट",
  "ABHA Card service work through the existing SS Enterprises digital service workflow.":"SS Enterprises की मौजूदा डिजिटल सेवा प्रक्रिया के माध्यम से आभा कार्ड सेवा कार्य।",
  "Ayushman Card KYC related project. Details can be updated from the Admin Panel when confirmed.":"आयुष्मान कार्ड KYC से संबंधित प्रोजेक्ट। पुष्टि होने पर विवरण Admin Panel से अपडेट किया जा सकता है।",
  "Responsible execution of awarded and contracted work with clear coordination.":"प्राप्त एवं अनुबंधित कार्य का स्पष्ट समन्वय के साथ जिम्मेदार कार्यान्वयन।",
  "Organised manpower, supervision and on-ground coordination for project delivery.":"प्रोजेक्ट पूरा करने के लिए व्यवस्थित जनशक्ति, निगरानी और जमीनी समन्वय।",
  "Building dependable teams suited to the requirements of each project.":"प्रत्येक प्रोजेक्ट की आवश्यकताओं के अनुसार भरोसेमंद टीम तैयार करना।",
  "Scalable staffing as project volume and operational requirements increase.":"प्रोजेक्ट और संचालन की आवश्यकताओं के बढ़ने के साथ कार्यबल का विस्तार।",
  "Execution support for awarded tenders and contracted assignments.":"प्राप्त टेंडर और अनुबंधित कार्यों के लिए कार्यान्वयन सहायता।",
  "Reliable staffing, supervision and field coordination for active projects.":"चल रहे प्रोजेक्ट्स के लिए भरोसेमंद स्टाफ, निगरानी और फील्ड समन्वय।",
  "Operational support for digital service workflows and citizen-facing projects.":"डिजिटल सेवा प्रक्रियाओं और नागरिक-केंद्रित प्रोजेक्ट्स के लिए संचालन सहायता।",
  "Services can be updated from the Admin Panel without changing the website code.":"वेबसाइट का कोड बदले बिना सेवाओं को Admin Panel से अपडेट किया जा सकता है।",
  "We take up suitable contracted and tender-based work and build dependable teams to execute it with accountability, coordination and service.":"हम उपयुक्त अनुबंधित और टेंडर आधारित कार्य लेते हैं तथा जवाबदेही, समन्वय और सेवा भावना के साथ उसे पूरा करने के लिए भरोसेमंद टीम तैयार करते हैं।",
  "People, projects &":"लोग, प्रोजेक्ट और",
  "professional execution.":"पेशेवर कार्यान्वयन।",
  "ABOUT SS ENTERPRISES":"SS ENTERPRISES के बारे में",
  "OUR SERVICES":"हमारी सेवाएँ",
  "What we":"हम",
  "do best.":"सबसे अच्छा क्या करते हैं।",
  "PROJECT EXECUTION • TENDER WORK • MANPOWER":"प्रोजेक्ट कार्यान्वयन • टेंडर कार्य • जनशक्ति",
  "Building Work.":"निर्माण कार्य।",
  "Delivering Trust.":"विश्वास के साथ कार्य।",
  "SS Enterprises is focused on professional execution of contracted and tender-based projects with reliable manpower, disciplined supervision and responsible coordination.":"SS Enterprises भरोसेमंद जनशक्ति, अनुशासित निगरानी और जिम्मेदार समन्वय के साथ अनुबंधित एवं टेंडर आधारित प्रोजेक्ट्स के पेशेवर कार्यान्वयन पर केंद्रित है।",
  "Overall vision, strategic decisions, business direction and major operations.":"समग्र दृष्टि, रणनीतिक निर्णय, व्यवसाय की दिशा और प्रमुख संचालन।",
  "Day-to-day operations, project and tender coordination, team management and organisational growth.":"दैनिक संचालन, प्रोजेक्ट एवं टेंडर समन्वय, टीम प्रबंधन और संगठनात्मक विकास।",
  "State-level project coordination, field operations and monitoring of district teams.":"राज्य स्तर पर प्रोजेक्ट समन्वय, फील्ड संचालन और जिला टीमों की निगरानी।",
  "District project implementation, field staff coordination and monitoring of assigned work.":"जिला स्तर पर प्रोजेक्ट कार्यान्वयन, फील्ड स्टाफ समन्वय और सौंपे गए कार्य की निगरानी।",
  "Professional identity,":"व्यावसायिक पहचान,",
  "GST":"GST",
  "PAN":"PAN",
  "Other registrations":"अन्य पंजीकरण",
  "Udyam / MSME":"उद्यम / MSME",
  "To be added when applicable/available":"उपलब्ध होने पर जोड़ा जाएगा",
  "Not publicly displayed unless required.":"आवश्यकता होने तक सार्वजनिक रूप से प्रदर्शित नहीं किया जाता।",
  "Add only valid registrations and certifications.":"केवल वैध पंजीकरण और प्रमाण-पत्र जोड़ें।"
};

function t(text){
  if(currentLang !== "hi") return text;
  return I18N[text] !== undefined ? I18N[text] : text;
}

function translateRole(role){
  return t(role);
}

function translateStatus(status){
  return t(statusLabel(status));
}

function normalise(raw){
  const merged = {...JSON.parse(JSON.stringify(DEFAULT_DATA)), ...(raw||{})};

  merged.settings = {...DEFAULT_DATA.settings,...(raw?.settings||{})};
  merged.settings.homepage = {...DEFAULT_DATA.settings.homepage,...(raw?.settings?.homepage||{})};
  merged.settings.announcement = {...DEFAULT_DATA.settings.announcement,...(raw?.settings?.announcement||{})};
  merged.settings.sections = {...DEFAULT_DATA.settings.sections,...(raw?.settings?.sections||{})};
  merged.settings.about = {...DEFAULT_DATA.settings.about,...(raw?.settings?.about||{})};
  merged.settings.services = {...DEFAULT_DATA.settings.services,...(raw?.settings?.services||{})};
  merged.settings.contact = {...DEFAULT_DATA.settings.contact,...(raw?.settings?.contact||{})};
  merged.settings.gallery = Array.isArray(raw?.settings?.gallery) ? raw.settings.gallery : [];

  merged.settings.about.cards =
    Array.isArray(merged.settings.about.cards)
      ? merged.settings.about.cards
      : DEFAULT_DATA.settings.about.cards;

  merged.settings.services.cards =
    Array.isArray(merged.settings.services.cards)
      ? merged.settings.services.cards
      : DEFAULT_DATA.settings.services.cards;

  merged.settings.contact.socials =
    Array.isArray(merged.settings.contact.socials)
      ? merged.settings.contact.socials
      : DEFAULT_DATA.settings.contact.socials;

  merged.projects =
    Array.isArray(raw?.projects) ? raw.projects : DEFAULT_DATA.projects;

  merged.team =
    Array.isArray(raw?.team) ? raw.team : DEFAULT_DATA.team;

  merged.projects = merged.projects.map(p=>({
    ...p,
    location:p.location||"Bihar",
    published:p.published!==false,
    status:p.status==="active" ? "ongoing" : (p.status||"upcoming")
  }));

  return merged;
}

function setSection(id,on){
  const el=document.getElementById(id);
  if(el) el.style.display=on ? "" : "none";
}

function renderAnnouncement(){
  const s=data.settings.announcement||{};
  const el=$("#announcement");
  if(!el) return;

  if(!s.enabled || (!s.title && !s.text)){
    el.style.display="none";
    return;
  }

  el.style.display="";
  el.innerHTML=`
    <div>
      <strong>${escapeHtml(s.title)}</strong>
      <span>${escapeHtml(s.text)}</span>
    </div>
    ${safeUrl(s.link)
      ? `<a class="btn ghost" href="${escapeHtml(safeUrl(s.link))}" target="_blank" rel="noopener">${escapeHtml(t(s.linkLabel||"Learn More"))} ↗</a>`
      : ""}
  `;
}

function renderHomepage(){
  const h=data.settings.homepage||{};

  $("#heroEyebrow") && ($("#heroEyebrow").textContent=t(h.eyebrow||""));
  $("#heroTitle") && ($("#heroTitle").textContent=t(h.title||""));
  $("#heroAccent") && ($("#heroAccent").textContent=t(h.accent||""));
  $("#heroLead") && ($("#heroLead").textContent=t(h.lead||""));

  renderAnnouncement();
}

function renderAbout(){
  const s=data.settings.about||{};
  const el=$("#about");
  if(!el) return;

  setSection("about",data.settings.sections.about);

  $("#aboutEyebrow").textContent=t(s.eyebrow||"");
  $("#aboutTitle").textContent=t(s.title||"");
  $("#aboutAccent").textContent=t(s.accent||"");
  $("#aboutText").textContent=t(s.text||"");

  $("#aboutGrid").innerHTML=(s.cards||[]).map((c,i)=>`
    <article>
      <div class="icon">${String(i+1).padStart(2,"0")}</div>
      <h3>${escapeHtml(t(c.title))}</h3>
      <p>${escapeHtml(t(c.text))}</p>
    </article>
  `).join("");
}

function renderServices(){
  const s=data.settings.services||{};
  const el=$("#services");
  if(!el) return;

  setSection("services",data.settings.sections.services);

  $("#servicesEyebrow").textContent=t(s.eyebrow||"");
  $("#servicesTitle").textContent=t(s.title||"");
  $("#servicesAccent").textContent=t(s.accent||"");
  $("#servicesText").textContent=t(s.text||"");

  $("#servicesGrid").innerHTML=(s.cards||[]).map((c,i)=>`
    <article>
      <div class="icon">${String(i+1).padStart(2,"0")}</div>
      <h3>${escapeHtml(t(c.title))}</h3>
      <p>${escapeHtml(t(c.text))}</p>
    </article>
  `).join("");
}

function renderProjects(filter="all"){
  const grid=$("#projectGrid");
  if(!grid) return;

  setSection("projects",data.settings.sections.projects);

  const list = (
    filter==="all"
      ? data.projects
      : data.projects.filter(p =>
          filter==="ongoing"
            ? (p.status==="ongoing" || p.status==="active")
            : p.status===filter
        )
  ).filter(p=>p.published!==false);

  const featuredId=data.settings.featuredProjectId;

  grid.innerHTML=list.map(p=>{
    const link=safeUrl(p.link);
    const featured=p.id===featuredId;

    return `
      <article class="project-card ${featured?"featured":""}">
        ${safeUrl(p.photo)
          ? `<img class="project-photo" src="${escapeHtml(safeUrl(p.photo))}" alt="${escapeHtml(p.name)}">`
          : ""}
        <span>${escapeHtml(t("PROJECT"))} • ${escapeHtml(translateStatus(p.status).toUpperCase())}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="project-meta">
          <strong>${escapeHtml(t(p.department||""))}</strong><br>
          📍 ${escapeHtml(t(p.location||"Bihar"))}
        </p>
        <p>${escapeHtml(t(p.description||""))}</p>
        <div class="project-bottom">
          <b>${escapeHtml(t(p.date||""))}</b>
          ${link
            ? `<a class="project-link" href="${escapeHtml(link)}" target="_blank" rel="noopener">${escapeHtml(t("Open Portal ↗"))}</a>`
            : ""}
        </div>
      </article>
    `;
  }).join("") || `<div class="empty">${escapeHtml(t("No published projects in this category yet."))}</div>`;

  const featured=data.projects.find(
    p=>p.id===featuredId && p.published!==false
  );

  const panel=$("#portalPanel");

  if(panel){
    panel.style.display=featured?.link ? "" : "none";

    if(featured?.link){
      $("#portalTitle").textContent=t(featured.name);
      $("#portalText").textContent=t(
        featured.description ||
        "Open the featured digital service portal directly from SS Enterprises."
      );
      $("#portalLink").href=safeUrl(featured.link)||"#";
      $("#portalLink").textContent=t("Open Portal ↗");
    }
  }
}

function renderTeam(){
  const grid=$("#teamGrid");
  if(!grid) return;

  setSection("team",data.settings.sections.team);

  grid.innerHTML=data.team.map(tMember=>`
    <article class="person-card">
      ${safeUrl(tMember.photo)
        ? `<img src="${escapeHtml(safeUrl(tMember.photo))}" alt="${escapeHtml(tMember.name)}">`
        : `<div class="person-placeholder">♙</div>`
      }
      <div>
        <span class="role">${escapeHtml(translateRole(tMember.role))}</span>
        <h3>${escapeHtml(tMember.name)}</h3>
        <p>📍 ${escapeHtml(t(tMember.location||"Bihar"))}</p>
        <p>${escapeHtml(t(tMember.responsibilities||""))}</p>
        ${tMember.contact
          ? `<a class="person-contact" href="tel:${escapeHtml(tMember.contact)}">📞 ${escapeHtml(tMember.contact)}</a>`
          : ""}
      </div>
    </article>
  `).join("");
}

function renderCredentials(){
  setSection("credentials",data.settings.sections.credentials);
}

function renderVision(){
  setSection("vision",data.settings.sections.vision);
}

function renderContact(){
  const s=data.settings.contact||{};

  setSection("contact",data.settings.sections.contact);

  $("#contactEyebrow").textContent=t(s.eyebrow||"");
  $("#contactTitle").textContent=t(s.title||"");
  $("#contactText").textContent=t(s.text||"");

  const phone=(s.phone||"").trim();
  const wa=(s.whatsapp||phone).trim();
  const email=(s.email||"").trim();

  const links=[];

  if(phone){
    links.push(`<a href="tel:${escapeHtml(phone)}">📞 ${escapeHtml(phone)}</a>`);
  }

  if(wa){
    links.push(
      `<a href="https://wa.me/${escapeHtml(wa.replace(/\D/g,""))}" target="_blank" rel="noopener">💬 WhatsApp</a>`
    );
  }

  if(email){
    links.push(`<a href="mailto:${escapeHtml(email)}">✉️ ${escapeHtml(email)}</a>`);
  }

  links.push(
    `<span>📍 ${escapeHtml(t(s.address||data.settings.address||"Bihar"))}</span>`
  );

  (s.socials||[])
    .filter(x=>x.label&&safeUrl(x.url))
    .forEach(x=>{
      links.push(
        `<a href="${escapeHtml(safeUrl(x.url))}" target="_blank" rel="noopener">🔗 ${escapeHtml(t(x.label))}</a>`
      );
    });

  $("#contactCard").innerHTML=links.join("");
}

function renderGallery(){
  const sec=$("#gallery");
  if(!sec) return;

  setSection("gallery",data.settings.sections.gallery);

  const items=(data.settings.gallery||[]).filter(x=>safeUrl(x.url));

  $("#galleryGrid").innerHTML=items.length
    ? items.map(x=>`
        <figure>
          <img src="${escapeHtml(safeUrl(x.url))}" alt="${escapeHtml(x.caption||"SS Enterprises")}" loading="lazy">
          ${x.caption ? `<figcaption>${escapeHtml(t(x.caption))}</figcaption>` : ""}
        </figure>
      `).join("")
    : `<div class="empty">${escapeHtml(t("Gallery photos will appear here."))}</div>`;
}

/* =========================================================
   LANGUAGE BUTTON
   The button is created automatically, so index.html
   does NOT need to be edited.
   ========================================================= */

function createLanguageSwitcher(){
  const wrap = document.querySelector('.lang-switch') || document.getElementById('ss-language-switcher');
  if(!wrap) return;

  wrap.querySelectorAll('[data-lang], .lang-btn, .ss-lang-btn').forEach(btn=>{
    if(btn.dataset.ssBound === '1') return;
    btn.dataset.ssBound = '1';
    btn.addEventListener('click',()=>{
      ssApplyLanguage(btn.dataset.lang || 'en');
    });
  });

  wrap.querySelectorAll('[data-lang], .lang-btn, .ss-lang-btn').forEach(btn=>{
    btn.classList.toggle('active', (btn.dataset.lang || 'en') === currentLang);
  });
}

function applyLanguageToStaticHTML(){
  // Static labels are marked with data-i18n in index.html.
  // Their English source text is preserved in data-ss-en so switching
  // back to English never depends on what was displayed previously.
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(!el.dataset.ssEn) el.dataset.ssEn = key;
    el.textContent = currentLang === 'hi' ? (I18N[key] ?? key) : el.dataset.ssEn;
  });

  // Static buttons/labels that are not marked in older index files.
  const fallback = {
    'Explore Our Work':'हमारा कार्य देखें',
    'Contact Us':'संपर्क करें',
    'All':'सभी','Ongoing':'चल रहे','Upcoming':'आगामी','Completed':'पूर्ण',
    'FEATURED PROJECT':'प्रमुख प्रोजेक्ट','Featured Project':'प्रमुख प्रोजेक्ट',
    'Open Portal ↗':'पोर्टल खोलें ↗'
  };
  document.querySelectorAll('.filter, .actions .btn, #portalLink').forEach(el=>{
    if(!el.dataset.ssEn) el.dataset.ssEn = el.textContent.trim();
    const en=el.dataset.ssEn;
    el.textContent = currentLang==='hi' ? (I18N[en] || fallback[en] || en) : en;
  });
}

function resetStaticHTMLToEnglish(){
  currentLang='en';
  applyLanguageToStaticHTML();
}

function ssApplyLanguage(lang){
  currentLang=lang==="hi" ? "hi" : "en";
  localStorage.setItem("ss_language",currentLang);
  document.documentElement.lang=currentLang;

  if(currentLang==="en") resetStaticHTMLToEnglish();

  applyAll();
  createLanguageSwitcher();

  document.querySelectorAll(".ss-lang-btn").forEach(b=>{
    b.classList.toggle("active",b.dataset.lang===currentLang);
  });

  if(currentLang==="hi") applyLanguageToStaticHTML();
}

/* =========================================================
   RENDER ALL
   ========================================================= */

function applyAll(){
  renderHomepage();
  renderAbout();
  renderServices();
  renderProjects();
  renderTeam();
  renderCredentials();
  renderVision();
  renderContact();
  renderGallery();

  const address=data.settings.address||"Donar Road, Darbhanga";
  document.querySelectorAll("[data-address]").forEach(x=>{
    x.textContent=t(address);
  });

  document.querySelectorAll(".filter").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      renderProjects(b.dataset.filter);
    };
  });

  const year=$("#year");
  if(year) year.textContent=new Date().getFullYear();

  createLanguageSwitcher();

  document.querySelectorAll(".ss-lang-btn").forEach(b=>{
    b.classList.toggle("active",b.dataset.lang===currentLang);
  });
}

async function loadData(){
  if(sb){
    try{
      const {data:row,error}=await sb
        .from("site_data")
        .select("content")
        .eq("id",1)
        .maybeSingle();

      if(!error && row?.content){
        data=normalise(row.content);
      }else{
        data=normalise(DEFAULT_DATA);
      }
    }catch(e){
      console.warn("Supabase load failed:",e);
      data=normalise(DEFAULT_DATA);
    }
  }else{
    data=normalise(DEFAULT_DATA);
  }

  applyAll();

  if(currentLang==="hi"){
    applyLanguageToStaticHTML();
  }
}

window.addEventListener("load",()=>{
  setTimeout(()=>$("#intro")?.remove(),3200);
});

document.addEventListener("DOMContentLoaded",()=>{
  createLanguageSwitcher();

  const menu=$(".menu");
  if(menu){
    menu.addEventListener("click",()=>{
      document.querySelector("nav")?.classList.toggle("open");
    });
  }

  document.querySelectorAll("nav a").forEach(a=>{
    a.addEventListener("click",()=>{
      document.querySelector("nav")?.classList.remove("open");
    });
  });

  /* Always start with saved language, English if no choice was made. */
  currentLang=localStorage.getItem("ss_language")==="hi" ? "hi" : "en";
});

loadData();


/* =========================================================
   LANGUAGE SWITCHER STYLE
   No styles.css change is required.
   ========================================================= */
(function(){
  const style=document.createElement("style");
  style.textContent=`
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
      header.nav nav.open .ss-language-switcher{
        display:flex;
      }
    }
  `;
  document.head.appendChild(style);
})();
