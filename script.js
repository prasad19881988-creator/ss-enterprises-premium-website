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
const hasConfig = window.SS_CONFIG && window.SS_CONFIG.SUPABASE_URL &&
  window.SS_CONFIG.SUPABASE_URL.startsWith("http") &&
  !window.SS_CONFIG.SUPABASE_URL.includes("PASTE_");
if (hasConfig && window.supabase) sb = window.supabase.createClient(window.SS_CONFIG.SUPABASE_URL, window.SS_CONFIG.SUPABASE_ANON_KEY);

const $ = s => document.querySelector(s);
const escapeHtml = (s="") => String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const safeUrl = (s="") => /^(https?:\/\/|mailto:|tel:)/i.test(String(s).trim()) ? String(s).trim() : "";
const statusLabel = s => s==="ongoing" || s==="active" ? "Ongoing" : s==="upcoming" ? "Upcoming" : "Completed";

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
  merged.settings.about.cards = Array.isArray(merged.settings.about.cards)?merged.settings.about.cards:DEFAULT_DATA.settings.about.cards;
  merged.settings.services.cards = Array.isArray(merged.settings.services.cards)?merged.settings.services.cards:DEFAULT_DATA.settings.services.cards;
  merged.settings.contact.socials = Array.isArray(merged.settings.contact.socials)?merged.settings.contact.socials:DEFAULT_DATA.settings.contact.socials;
  merged.projects = Array.isArray(raw?.projects) ? raw.projects : DEFAULT_DATA.projects;
  merged.team = Array.isArray(raw?.team) ? raw.team : DEFAULT_DATA.team;
  merged.projects = merged.projects.map(p=>({...p,location:p.location||"Bihar",published:p.published!==false,status:p.status==="active"?"ongoing":(p.status||"upcoming")}));
  return merged;
}

function setSection(id,on){const el=document.getElementById(id);if(el)el.style.display=on?"":"none";}

function renderAnnouncement(){
  const s=data.settings.announcement||{}, el=$("#announcement");
  if(!el)return;
  if(!s.enabled || (!s.title && !s.text)){el.style.display="none";return}
  el.style.display="";
  el.innerHTML=`<div><strong>${escapeHtml(s.title)}</strong><span>${escapeHtml(s.text)}</span></div>${safeUrl(s.link)?`<a class="btn ghost" href="${escapeHtml(safeUrl(s.link))}" target="_blank" rel="noopener">${escapeHtml(s.linkLabel||"Learn More")} ↗</a>`:""}`;
}

function renderHomepage(){
  const h=data.settings.homepage||{};
  $("#heroEyebrow") && ($("#heroEyebrow").textContent=h.eyebrow||"");
  $("#heroTitle") && ($("#heroTitle").textContent=h.title||"");
  $("#heroAccent") && ($("#heroAccent").textContent=h.accent||"");
  $("#heroLead") && ($("#heroLead").textContent=h.lead||"");
  renderAnnouncement();
}

function renderAbout(){
  const s=data.settings.about||{}, el=$("#about");
  if(!el)return;
  setSection("about",data.settings.sections.about);
  $("#aboutEyebrow").textContent=s.eyebrow||"";
  $("#aboutTitle").textContent=s.title||"";
  $("#aboutAccent").textContent=s.accent||"";
  $("#aboutText").textContent=s.text||"";
  $("#aboutGrid").innerHTML=(s.cards||[]).map((c,i)=>`<article><div class="icon">${String(i+1).padStart(2,"0")}</div><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.text)}</p></article>`).join("");
}

function renderServices(){
  const s=data.settings.services||{}, el=$("#services");
  if(!el)return;
  setSection("services",data.settings.sections.services);
  $("#servicesEyebrow").textContent=s.eyebrow||"";
  $("#servicesTitle").textContent=s.title||"";
  $("#servicesAccent").textContent=s.accent||"";
  $("#servicesText").textContent=s.text||"";
  $("#servicesGrid").innerHTML=(s.cards||[]).map((c,i)=>`<article><div class="icon">${String(i+1).padStart(2,"0")}</div><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.text)}</p></article>`).join("");
}

function renderProjects(filter="all"){
  const grid=$("#projectGrid"); if(!grid)return;
  setSection("projects",data.settings.sections.projects);
  const list=(filter==="all"?data.projects:data.projects.filter(p=>(filter==="ongoing"?(p.status==="ongoing"||p.status==="active"):p.status===filter))).filter(p=>p.published!==false);
  const featuredId=data.settings.featuredProjectId;
  grid.innerHTML=list.map(p=>{
    const link=safeUrl(p.link), featured=p.id===featuredId;
    return `<article class="project-card ${featured?"featured":""}">
      ${p.photo?`<img class="project-photo" src="${escapeHtml(safeUrl(p.photo))}" alt="${escapeHtml(p.name)}">`:""}
      <span>PROJECT • ${escapeHtml(statusLabel(p.status).toUpperCase())}</span>
      <h3>${escapeHtml(p.name)}</h3>
      <p class="project-meta"><strong>${escapeHtml(p.department||"")}</strong><br>📍 ${escapeHtml(p.location||"Bihar")}</p>
      <p>${escapeHtml(p.description||"")}</p>
      <div class="project-bottom"><b>${escapeHtml(p.date||"")}</b>${link?`<a class="project-link" href="${escapeHtml(link)}" target="_blank" rel="noopener">Open Portal ↗</a>`:""}</div>
    </article>`;
  }).join("") || '<div class="empty">No published projects in this category yet.</div>';
  const featured=data.projects.find(p=>p.id===featuredId && p.published!==false);
  const panel=$("#portalPanel");
  if(panel){
    panel.style.display=featured?.link?"":"none";
    if(featured?.link){
      $("#portalTitle").textContent=featured.name;
      $("#portalText").textContent=featured.description||"Open the featured digital service portal directly from SS Enterprises.";
      $("#portalLink").href=safeUrl(featured.link)||"#";
    }
  }
}

function renderTeam(){
  const grid=$("#teamGrid"); if(!grid)return;
  setSection("team",data.settings.sections.team);
  grid.innerHTML=data.team.map(t=>`<article class="person-card">
    ${safeUrl(t.photo)?`<img src="${escapeHtml(safeUrl(t.photo))}" alt="${escapeHtml(t.name)}">`:`<div class="person-placeholder">♙</div>`}
    <div><span class="role">${escapeHtml(t.role)}</span><h3>${escapeHtml(t.name)}</h3>
    <p>📍 ${escapeHtml(t.location||"Bihar")}</p><p>${escapeHtml(t.responsibilities||"")}</p>
    ${t.contact?`<a class="person-contact" href="tel:${escapeHtml(t.contact)}">📞 ${escapeHtml(t.contact)}</a>`:""}
    </div></article>`).join("");
}

function renderCredentials(){setSection("credentials",data.settings.sections.credentials)}
function renderVision(){setSection("vision",data.settings.sections.vision)}
function renderContact(){
  const s=data.settings.contact||{};
  setSection("contact",data.settings.sections.contact);
  $("#contactEyebrow").textContent=s.eyebrow||"";
  $("#contactTitle").textContent=s.title||"";
  $("#contactText").textContent=s.text||"";
  const phone=(s.phone||"").trim(), wa=(s.whatsapp||phone).trim(), email=(s.email||"").trim();
  const links=[];
  if(phone)links.push(`<a href="tel:${escapeHtml(phone)}">📞 ${escapeHtml(phone)}</a>`);
  if(wa)links.push(`<a href="https://wa.me/${escapeHtml(wa.replace(/\D/g,""))}" target="_blank" rel="noopener">💬 WhatsApp</a>`);
  if(email)links.push(`<a href="mailto:${escapeHtml(email)}">✉️ ${escapeHtml(email)}</a>`);
  links.push(`<span>📍 ${escapeHtml(s.address||data.settings.address||"Bihar")}</span>`);
  (s.socials||[]).filter(x=>x.label&&safeUrl(x.url)).forEach(x=>links.push(`<a href="${escapeHtml(safeUrl(x.url))}" target="_blank" rel="noopener">🔗 ${escapeHtml(x.label)}</a>`));
  $("#contactCard").innerHTML=links.join("");
}

function renderGallery(){
  const sec=$("#gallery"); if(!sec)return;
  setSection("gallery",data.settings.sections.gallery);
  const items=(data.settings.gallery||[]).filter(x=>safeUrl(x.url));
  $("#galleryGrid").innerHTML=items.length?items.map(x=>`<figure><img src="${escapeHtml(safeUrl(x.url))}" alt="${escapeHtml(x.caption||"SS Enterprises")}" loading="lazy">${x.caption?`<figcaption>${escapeHtml(x.caption)}</figcaption>`:""}</figure>`).join(""):'<div class="empty">Gallery photos will appear here.</div>';
}

function applyAll(){
  renderHomepage();renderAbout();renderServices();renderProjects();renderTeam();renderCredentials();renderVision();renderContact();renderGallery();
  const address=data.settings.address||"Donar Road, Darbhanga";
  document.querySelectorAll("[data-address]").forEach(x=>x.textContent=address);
  document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProjects(b.dataset.filter)});
  const year=$("#year");if(year)year.textContent=new Date().getFullYear();
  if(typeof ssApplyLanguage==="function") ssApplyLanguage(localStorage.getItem("ss_language")||"en");
}

async function loadData(){
  if(sb){
    try{
      const {data:row,error}=await sb.from("site_data").select("content").eq("id",1).maybeSingle();
      if(!error && row?.content) data=normalise(row.content); else data=normalise(DEFAULT_DATA);
    }catch(e){data=normalise(DEFAULT_DATA)}
  } else data=normalise(DEFAULT_DATA);
  applyAll();
}
window.addEventListener("load",()=>setTimeout(()=>$("#intro")?.remove(),3200));
$(".menu")?.addEventListener("click",()=>document.querySelector("nav")?.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector("nav")?.classList.remove("open")));
loadData();


/* ---------------- Bilingual website (English default / Hindi optional) ---------------- */
const SS_I18N = {
  en: {
    "Home":"Home","About":"About","Services":"Services","Projects":"Projects","Leadership & Team":"Leadership & Team","Contact":"Contact",
    "Explore Our Work":"Explore Our Work","Contact Us":"Contact Us","🔱 Udyam Registered":"🔱 Udyam Registered",
    "OUR PROJECTS":"OUR PROJECTS","Active work.":"Active work.","Upcoming opportunities.":"Upcoming opportunities.",
    "Project information can be managed from the secure Admin Panel.":"Project information can be managed from the secure Admin Panel.",
    "All":"All","Ongoing":"Ongoing","Upcoming":"Upcoming","Completed":"Completed",
    "FEATURED PROJECT":"FEATURED PROJECT","Featured Project":"Featured Project","Open Portal ↗":"Open Portal ↗",
    "LEADERSHIP & OUR TEAM":"LEADERSHIP & OUR TEAM","Meet the people":"Meet the people","behind the work.":"behind the work.",
    "Leadership and field coordination team.":"Leadership and field coordination team.",
    "CREDENTIALS":"CREDENTIALS","Professional identity,":"Professional identity,","verified honestly.":"verified honestly.",
    "OUR APPROACH":"OUR APPROACH","Reliable people. Responsible execution. A growing company with a long-term vision.":"Reliable people. Responsible execution. A growing company with a long-term vision.",
    "GALLERY":"GALLERY","Our work,":"Our work,","in pictures.":"in pictures.",
    "Project and team photos published from the Admin Panel.":"Project and team photos published from the Admin Panel.",
    "Aapki Seva Mein Hamari Khushi":"Aapki Seva Mein Hamari Khushi","All rights reserved.":"All rights reserved."
  },
  hi: {
    "Home":"होम","About":"हमारे बारे में","Services":"सेवाएँ","Projects":"प्रोजेक्ट्स","Leadership & Team":"नेतृत्व एवं टीम","Contact":"संपर्क",
    "Explore Our Work":"हमारा कार्य देखें","Contact Us":"संपर्क करें","🔱 Udyam Registered":"🔱 उद्यम पंजीकृत",
    "OUR PROJECTS":"हमारे प्रोजेक्ट्स","Active work.":"चल रहा कार्य।","Upcoming opportunities.":"आगामी अवसर।",
    "Project information can be managed from the secure Admin Panel.":"प्रोजेक्ट की जानकारी सुरक्षित Admin Panel से प्रबंधित की जा सकती है।",
    "All":"सभी","Ongoing":"चल रहे","Upcoming":"आगामी","Completed":"पूर्ण",
    "FEATURED PROJECT":"प्रमुख प्रोजेक्ट","Featured Project":"प्रमुख प्रोजेक्ट","Open Portal ↗":"पोर्टल खोलें ↗",
    "LEADERSHIP & OUR TEAM":"नेतृत्व एवं हमारी टीम","Meet the people":"उन लोगों से मिलिए","behind the work.":"जो इस कार्य के पीछे हैं।",
    "Leadership and field coordination team.":"नेतृत्व एवं फील्ड समन्वय टीम।",
    "CREDENTIALS":"प्रमाण-पत्र","Professional identity,":"व्यावसायिक पहचान,","verified honestly.":"ईमानदारी से सत्यापित।",
    "OUR APPROACH":"हमारा दृष्टिकोण","Reliable people. Responsible execution. A growing company with a long-term vision.":"विश्वसनीय लोग। जिम्मेदार कार्यान्वयन। दीर्घकालिक दृष्टि के साथ बढ़ती कंपनी।",
    "GALLERY":"गैलरी","Our work,":"हमारा कार्य,","in pictures.":"तस्वीरों में।",
    "Project and team photos published from the Admin Panel.":"प्रोजेक्ट और टीम की तस्वीरें Admin Panel से प्रकाशित की जाती हैं।",
    "Aapki Seva Mein Hamari Khushi":"आपकी सेवा में हमारी खुशी","All rights reserved.":"सर्वाधिकार सुरक्षित।"
  }
};

function ssApplyLanguage(lang){
  lang = lang === "hi" ? "hi" : "en";
  localStorage.setItem("ss_language", lang);
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
  const dict = SS_I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.getAttribute("data-i18n");
    if(dict[key]!==undefined) el.textContent=dict[key];
  });
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
  ssTranslateDynamicUI(lang);
}

function ssTranslateDynamicUI(lang){
  const hi = lang === "hi";
  // Translate labels generated by the project/team renderer without changing custom project text.
  document.querySelectorAll(".project-card > span").forEach(el=>{
    const txt=el.textContent||"";
    const m=txt.match(/^PROJECT\s*•\s*(.+)$/i);
    if(m){
      const map={ONGOING:"चल रहा",ACTIVE:"सक्रिय",UPCOMING:"आगामी",COMPLETED:"पूर्ण",PLANNED:"नियोजित"};
      el.textContent=hi ? "प्रोजेक्ट • " + (map[m[1].toUpperCase()]||m[1]) : txt.replace(/^PROJECT\s*•\s*/i,"PROJECT • ")+m[1];
    }
  });
  document.querySelectorAll(".person-card .role").forEach(el=>{
    const map={"Founder":"संस्थापक","Director":"निदेशक","Project Manager":"प्रोजेक्ट मैनेजर","Site Engineer":"साइट इंजीनियर","Engineer":"इंजीनियर","Accountant":"अकाउंटेंट","Manager":"मैनेजर","Team Member":"टीम सदस्य"};
    const original=el.dataset.enRole || el.textContent;
    el.dataset.enRole=original;
    if(hi && map[original]) el.textContent=map[original]; else el.textContent=original;
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>ssApplyLanguage(b.dataset.lang)));
  ssApplyLanguage(localStorage.getItem("ss_language")||"en");
});


/* ===== SS Enterprises: English default / Hindi switch ===== */
(function(){
const DICT={
"Home":"होम","About":"हमारे बारे में","Services":"सेवाएँ","Projects":"प्रोजेक्ट्स",
"Leadership & Team":"नेतृत्व एवं टीम","Contact":"संपर्क","Explore Our Work":"हमारा कार्य देखें",
"Contact Us":"संपर्क करें","🔱 Udyam Registered":"🔱 उद्यम पंजीकृत",
"OUR PROJECTS":"हमारे प्रोजेक्ट्स","Active work.":"चल रहा कार्य।",
"Upcoming opportunities.":"आगामी अवसर।",
"Project information can be managed from the secure Admin Panel.":"प्रोजेक्ट की जानकारी सुरक्षित Admin Panel से प्रबंधित की जा सकती है।",
"All":"सभी","Ongoing":"चल रहे","Upcoming":"आगामी","Completed":"पूर्ण",
"FEATURED PROJECT":"प्रमुख प्रोजेक्ट","Featured Project":"प्रमुख प्रोजेक्ट","Open Portal ↗":"पोर्टल खोलें ↗",
"LEADERSHIP & OUR TEAM":"नेतृत्व एवं हमारी टीम","Meet the people":"उन लोगों से मिलिए",
"behind the work.":"जो इस कार्य के पीछे हैं।","Leadership and field coordination team.":"नेतृत्व एवं फील्ड समन्वय टीम।",
"CREDENTIALS":"प्रमाण-पत्र","Professional identity,":"व्यावसायिक पहचान,",
"verified honestly.":"ईमानदारी से सत्यापित।","OUR APPROACH":"हमारा दृष्टिकोण",
"Reliable people. Responsible execution. A growing company with a long-term vision.":"विश्वसनीय लोग। जिम्मेदार कार्यान्वयन। दीर्घकालिक दृष्टि के साथ बढ़ती कंपनी।",
"GALLERY":"गैलरी","Our work,":"हमारा कार्य,","in pictures.":"तस्वीरों में।",
"Project and team photos published from the Admin Panel.":"प्रोजेक्ट और टीम की तस्वीरें Admin Panel से प्रकाशित की जाती हैं।",
"All rights reserved.":"सर्वाधिकार सुरक्षित।"
};
function applyLang(lang){
 lang=lang==="hi"?"hi":"en";
 localStorage.setItem("ss_language",lang);
 document.documentElement.lang=lang;
 document.querySelectorAll("[data-i18n]").forEach(function(el){
   var key=el.getAttribute("data-i18n");
   el.textContent=lang==="hi"?(DICT[key]||key):key;
 });
 document.querySelectorAll(".lang-btn").forEach(function(b){
   b.classList.toggle("active",b.getAttribute("data-lang")===lang);
 });
}
document.addEventListener("DOMContentLoaded",function(){
 document.querySelectorAll(".lang-btn").forEach(function(b){
   b.addEventListener("click",function(){applyLang(b.getAttribute("data-lang"));});
 });
 applyLang(localStorage.getItem("ss_language")||"en");
});
})();
