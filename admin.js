const DEFAULT_DATA = {
  settings:{
    locationLabel:"Bihar",
    address:"Donar Road, Darbhanga",
    homepage:{
      eyebrow:"PROJECT EXECUTION • TENDER WORK • MANPOWER",
      title:"Building Work.",
      accent:"Delivering Trust.",
      lead:"SS Enterprises is focused on professional execution of contracted and tender-based projects with reliable manpower, disciplined supervision and responsible coordination."
    },
    announcement:{enabled:false,title:"",text:"",link:"",linkLabel:"Learn More"},
    featuredProjectId:"abha",
    sections:{about:true,services:true,projects:true,team:true,credentials:true,vision:true,gallery:true,contact:true},
    about:{
      eyebrow:"ABOUT SS ENTERPRISES",title:"People, projects &",accent:"professional execution.",
      text:"We take up suitable contracted and tender-based work and build dependable teams to execute it with accountability, coordination and service.",
      cards:[
        {title:"Tender Work",text:"Responsible execution of awarded and contracted work with clear coordination."},
        {title:"Project Execution",text:"Organised manpower, supervision and on-ground coordination for project delivery."},
        {title:"Skilled Manpower",text:"Building dependable teams suited to the requirements of each project."},
        {title:"Workforce Expansion",text:"Scalable staffing as project volume and operational requirements increase."}
      ]
    },
    services:{
      eyebrow:"OUR SERVICES",title:"What we",accent:"do best.",
      text:"Professional services for tender work, project execution, manpower coordination and reliable field support.",
      cards:[
        {title:"Tender & Contract Work",text:"Execution support for awarded tenders and contracted assignments."},
        {title:"Project Manpower",text:"Reliable staffing, supervision and field coordination for active projects."},
        {title:"Digital Service Projects",text:"Operational support for digital service workflows and citizen-facing projects."}
      ]
    },
    contact:{
      eyebrow:"LET'S WORK TOGETHER",title:"Have a project in mind?",
      text:"For business enquiries, project discussions and work opportunities, contact SS Enterprises directly.",
      phone:"+91 73600 25302",whatsapp:"+91 73600 25302",
      email:"ssenterprisesservice@poton.me",address:"Donar Road, Darbhanga",
      socials:[{label:"Facebook",url:""},{label:"Instagram",url:""},{label:"YouTube",url:""}]
    },
    gallery:[]
  },
  projects:[
    {id:"abha",name:"ABHA Card Project",department:"Health / Digital Health Services",location:"Bihar",status:"ongoing",
      description:"ABHA Card service work through the existing SS Enterprises digital service workflow.",date:"Active",
      link:"https://ss-enterprises-abha-app-2026.onrender.com/",photo:"",published:true},
    {id:"ayushman",name:"Ayushman Card KYC Project",department:"Ayushman Bharat",location:"Bihar",status:"upcoming",
      description:"Ayushman Card KYC related project supporting field coordination and service delivery as per project requirements.",
      date:"Upcoming",link:"",photo:"",published:true}
  ],
  team:[
    {id:"founder",role:"Founder",name:"Founder",location:"Darbhanga, Bihar",
      responsibilities:"Overall vision, strategic decisions, business direction and major operations.",photo:"",contact:""},
    {id:"ceo",role:"CEO & Managing Director",name:"CEO & Managing Director",location:"Darbhanga, Bihar",
      responsibilities:"Day-to-day operations, project and tender coordination, team management and organisational growth.",photo:"",contact:""},
    {id:"state-head",role:"State Head",name:"State Head",location:"Bihar",
      responsibilities:"State-level project coordination, field operations and monitoring of district teams.",photo:"",contact:""},
    {id:"district-coordinator",role:"District Coordinator",name:"District Coordinator",location:"Darbhanga, Bihar",
      responsibilities:"District project implementation, field staff coordination and monitoring of assigned work.",photo:"",contact:""}
  ]
};

let data = JSON.parse(JSON.stringify(DEFAULT_DATA));
let sb = null;
let currentTab = "dashboard";

const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g,m=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[m]));

const configured =
  window.SS_CONFIG &&
  window.SS_CONFIG.SUPABASE_URL &&
  window.SS_CONFIG.SUPABASE_URL.startsWith("http") &&
  !window.SS_CONFIG.SUPABASE_URL.includes("PASTE_");

if(configured && window.supabase){
  sb = window.supabase.createClient(
    window.SS_CONFIG.SUPABASE_URL,
    window.SS_CONFIG.SUPABASE_ANON_KEY
  );
}

function merge(defaults,items){
  const arr = Array.isArray(items) ? items : [];
  return defaults
    .map(d=>{
      const f = arr.find(x=>x && x.id===d.id);
      return f ? {...d,...f} : {...d};
    })
    .concat(arr.filter(x=>x && !defaults.some(d=>d.id===x.id)));
}

function normalise(raw){
  const x = raw || {};
  const s = x.settings || {};

  data = {
    settings:{
      ...DEFAULT_DATA.settings,
      ...s,
      homepage:{...DEFAULT_DATA.settings.homepage,...(s.homepage || {})},
      announcement:{...DEFAULT_DATA.settings.announcement,...(s.announcement || {})},
      sections:{...DEFAULT_DATA.settings.sections,...(s.sections || {})},
      about:{...DEFAULT_DATA.settings.about,...(s.about || {})},
      services:{...DEFAULT_DATA.settings.services,...(s.services || {})},
      contact:{...DEFAULT_DATA.settings.contact,...(s.contact || {})},
      gallery:Array.isArray(s.gallery) ? s.gallery : []
    },
    projects:merge(DEFAULT_DATA.projects,x.projects),
    team:merge(DEFAULT_DATA.team,x.team)
  };

  data.projects = data.projects.map(p=>({
    ...p,
    location:"Bihar",
    status:p.status==="active" ? "ongoing" : (p.status || "upcoming"),
    published:p.published !== false
  }));

  if(!data.settings.contact.address){
    data.settings.contact.address = data.settings.address;
  }

  addHindiFields();
}

function addHindiFields(){
  const s = data.settings;
  if(!s.homepage.hi) s.homepage.hi = {};
  if(!s.about.hi) s.about.hi = {};
  if(!s.services.hi) s.services.hi = {};
  if(!s.contact.hi) s.contact.hi = {};

  s.about.cards = Array.isArray(s.about.cards) ? s.about.cards : [];
  s.about.cards.forEach(c=>{ if(!c.hi) c.hi = {}; });

  s.services.cards = Array.isArray(s.services.cards) ? s.services.cards : [];
  s.services.cards.forEach(c=>{ if(!c.hi) c.hi = {}; });

  data.projects.forEach(p=>{ if(!p.hi) p.hi = {}; });
  data.team.forEach(t=>{ if(!t.hi) t.hi = {}; });
}

function setMsg(text,ok=false){
  if(!$("saveMsg")) return;
  $("saveMsg").textContent = text;
  $("saveMsg").className = "admin-msg " + (ok ? "ok" : "");
}

function showTab(tab){
  currentTab = tab;
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  document.querySelectorAll(".tab-page").forEach(p=>p.classList.toggle("active",p.dataset.page===tab));

  const titles = {
    dashboard:"Dashboard",projects:"Projects",team:"Leadership & Team",
    content:"Website Content",controls:"Website Control",gallery:"Gallery / Photos"
  };
  if($("pageTitle")) $("pageTitle").textContent = titles[tab] || "Dashboard";

  window.scrollTo({top:0,behavior:"smooth"});
  document.querySelector(".admin-sidebar")?.classList.remove("open");
}

function setPath(obj,path,value){
  const parts = path.split(".");
  const last = parts.pop();
  let cur = obj;
  parts.forEach(k=>{
    if(!cur[k] || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  });
  cur[last] = value;
}

function getPath(obj,path){
  return path.split(".").reduce((o,k)=>o?.[k],obj);
}

function renderDashboard(){
  if($("statProjects")) $("statProjects").textContent = data.projects.length;
  if($("statUpcoming")) $("statUpcoming").textContent = data.projects.filter(p=>p.status==="upcoming").length;
  if($("statOngoing")) $("statOngoing").textContent = data.projects.filter(p=>p.status==="ongoing").length;
  if($("statPublished")) $("statPublished").textContent = data.projects.filter(p=>p.published!==false).length;
}

function renderProjects(){
  $("projectForms").innerHTML = data.projects.map((p,i)=>`
    <article class="admin-card project-admin-row" data-project-index="${i}">
      <div class="row-head">
        <div>
          <span class="status-pill ${esc(p.status)}">${esc(p.status==="ongoing"?"Ongoing":p.status==="upcoming"?"Upcoming":"Completed")}</span>
          <h3>${esc(p.name)}</h3>
        </div>
        <div class="row-actions">
          ${p.status==="upcoming"?`<button class="mini-btn live-project" type="button">Live / Active</button>`:""}
          <button class="mini-btn ${p.published!==false?"unpublish":"publish"}" type="button">
            ${p.published!==false?"Unpublish":"Publish"}
          </button>
          <button class="mini-btn danger delete-project" type="button">Delete</button>
        </div>
      </div>

      <div class="project-photo-box">
        ${p.photo?`<img src="${esc(p.photo)}" alt="Project photo">`:`<div class="photo-empty">📷<span>No project photo</span></div>`}
        <label class="upload-btn">Upload Photo
          <input type="file" class="project-upload" accept="image/*" hidden>
        </label>
      </div>

      <div class="form-grid">
        <label>Project Name<input data-project="name" value="${esc(p.name)}"></label>
        <label>Department / Client<input data-project="department" value="${esc(p.department)}"></label>
        <label>Work / Project Location<input data-project="location" value="Bihar" disabled></label>
        <label>Status<select data-project="status">
          <option value="upcoming" ${p.status==="upcoming"?"selected":""}>Upcoming</option>
          <option value="ongoing" ${p.status==="ongoing"?"selected":""}>Ongoing</option>
          <option value="completed" ${p.status==="completed"?"selected":""}>Completed</option>
        </select></label>
        <label>Date / Label<input data-project="date" value="${esc(p.date)}" placeholder="e.g. 17 July 2026"></label>
        <label>Portal / Project Link<input data-project="link" value="${esc(p.link)}" placeholder="https://..."></label>
        <label class="span-2">Project Description<textarea data-project="description">${esc(p.description)}</textarea></label>
        <label>Project Name — Hindi<input data-project-hi="name" value="${esc(p.hi?.name || "")}" placeholder="हिंदी नाम"></label>
        <label>Department — Hindi<input data-project-hi="department" value="${esc(p.hi?.department || "")}" placeholder="हिंदी विभाग"></label>
        <label class="span-2">Project Description — Hindi<textarea data-project-hi="description" placeholder="हिंदी में विवरण">${esc(p.hi?.description || "")}</textarea></label>
      </div>
    </article>
  `).join("") || `<div class="admin-card empty-admin">No projects yet. Add your first project.</div>`;

  renderFeatured();
}

function renderTeam(){
  $("teamForms").innerHTML = data.team.map((t,i)=>`
    <article class="admin-card team-admin-row" data-team-index="${i}">
      <div class="row-head">
        <div><span class="role-admin">${esc(t.role)}</span><h3>${esc(t.name)}</h3></div>
        <button class="mini-btn danger delete-team" type="button">Delete Member</button>
      </div>
      <div class="photo-row">
        ${t.photo?`<img class="admin-avatar" src="${esc(t.photo)}" alt="Team photo">`:`<div class="admin-avatar placeholder">♙</div>`}
        <label class="upload-btn">Upload Photo
          <input type="file" class="team-upload" accept="image/*" hidden>
        </label>
      </div>
      <div class="form-grid">
        <label>Name<input data-team="name" value="${esc(t.name)}"></label>
        <label>Designation<input data-team="role" value="${esc(t.role)}"></label>
        <label>Location<input data-team="location" value="${esc(t.location)}"></label>
        <label>Contact No.<input data-team="contact" value="${esc(t.contact)}"></label>
        <label>Photo URL<input data-team="photo" value="${esc(t.photo)}"></label>
        <label class="span-2">Responsibilities<textarea data-team="responsibilities">${esc(t.responsibilities)}</textarea></label>
        <label>Name — Hindi<input data-team-hi="name" value="${esc(t.hi?.name || "")}" placeholder="हिंदी नाम"></label>
        <label>Designation — Hindi<input data-team-hi="role" value="${esc(t.hi?.role || "")}" placeholder="हिंदी पद"></label>
        <label class="span-2">Responsibilities — Hindi<textarea data-team-hi="responsibilities" placeholder="हिंदी में जिम्मेदारियाँ">${esc(t.hi?.responsibilities || "")}</textarea></label>
      </div>
    </article>
  `).join("") || `<div class="admin-card empty-admin">No team members yet.</div>`;
}

function renderContent(){
  document.querySelectorAll("[data-setting]").forEach(el=>{
    el.value = getPath(data.settings,el.dataset.setting) ?? "";
  });

  renderCards("aboutCards",data.settings.about.cards,"about");
  renderCards("serviceCards",data.settings.services.cards,"services");
  renderSocials();
  renderHindiMainContent();
}

function renderHindiMainContent(){
  const about=data.settings.about, services=data.settings.services, homepage=data.settings.homepage, contact=data.settings.contact;
  const box=$("hindiContentBox");
  if(!box) return;

  box.innerHTML=`
    <div class="admin-card">
      <h3>Hindi Website Content</h3>
      <p>यहाँ Hindi version डालें। Website पर Hindi चुनने पर यही text दिखाई देगा।</p>
      <div class="form-grid">
        <label>Homepage Eyebrow — Hindi<input data-hi-setting="homepage.eyebrow" value="${esc(homepage.hi?.eyebrow || "")}"></label>
        <label>Homepage Title — Hindi<input data-hi-setting="homepage.title" value="${esc(homepage.hi?.title || "")}"></label>
        <label>Homepage Accent — Hindi<input data-hi-setting="homepage.accent" value="${esc(homepage.hi?.accent || "")}"></label>
        <label class="span-2">Homepage Description — Hindi<textarea data-hi-setting="homepage.lead">${esc(homepage.hi?.lead || "")}</textarea></label>
        <label>About Eyebrow — Hindi<input data-hi-setting="about.eyebrow" value="${esc(about.hi?.eyebrow || "")}"></label>
        <label>About Title — Hindi<input data-hi-setting="about.title" value="${esc(about.hi?.title || "")}"></label>
        <label>About Accent — Hindi<input data-hi-setting="about.accent" value="${esc(about.hi?.accent || "")}"></label>
        <label class="span-2">About Description — Hindi<textarea data-hi-setting="about.text">${esc(about.hi?.text || "")}</textarea></label>
        <label>Services Eyebrow — Hindi<input data-hi-setting="services.eyebrow" value="${esc(services.hi?.eyebrow || "")}"></label>
        <label>Services Title — Hindi<input data-hi-setting="services.title" value="${esc(services.hi?.title || "")}"></label>
        <label>Services Accent — Hindi<input data-hi-setting="services.accent" value="${esc(services.hi?.accent || "")}"></label>
        <label class="span-2">Services Description — Hindi<textarea data-hi-setting="services.text">${esc(services.hi?.text || "")}</textarea></label>
        <label>Contact Eyebrow — Hindi<input data-hi-setting="contact.eyebrow" value="${esc(contact.hi?.eyebrow || "")}"></label>
        <label>Contact Title — Hindi<input data-hi-setting="contact.title" value="${esc(contact.hi?.title || "")}"></label>
        <label class="span-2">Contact Description — Hindi<textarea data-hi-setting="contact.text">${esc(contact.hi?.text || "")}</textarea></label>
      </div>
    </div>`;
}

function renderCards(id,arr,type){
  $(id).innerHTML=(arr||[]).map((c,i)=>`
    <div class="repeat-row" data-repeat="${type}" data-index="${i}">
      <div class="repeat-title"><b>${type==="about"?"About Card":"Service"} ${i+1}</b><button class="mini-btn danger delete-repeat" type="button">Remove</button></div>
      <label>Title<input data-repeat-field="title" value="${esc(c.title)}"></label>
      <label>Description<textarea data-repeat-field="text">${esc(c.text)}</textarea></label>
      <label>Title — Hindi<input data-repeat-hi="title" value="${esc(c.hi?.title || "")}" placeholder="हिंदी शीर्षक"></label>
      <label>Description — Hindi<textarea data-repeat-hi="text" placeholder="हिंदी विवरण">${esc(c.hi?.text || "")}</textarea></label>
    </div>`).join("");
}

function renderSocials(){
  $("socialLinks").innerHTML=(data.settings.contact.socials||[]).map((x,i)=>`
    <div class="repeat-row social-row" data-social-index="${i}">
      <label>Platform<input data-social="label" value="${esc(x.label)}"></label>
      <label>URL<input data-social="url" value="${esc(x.url)}" placeholder="https://..."></label>
      <button class="mini-btn danger delete-social" type="button">Remove</button>
    </div>`).join("");
}

function renderControls(){
  const labels={about:"About Us",services:"Services",projects:"Projects",team:"Leadership & Team",credentials:"Credentials",vision:"Vision",gallery:"Gallery",contact:"Contact"};

  $("sectionToggles").innerHTML=Object.keys(labels).map(k=>`
    <label class="toggle-card"><span><b>${labels[k]}</b><small>Section visibility</small></span>
      <input type="checkbox" data-section="${k}" ${data.settings.sections[k]?"checked":""}><i></i>
    </label>`).join("");

  document.querySelectorAll("[data-announcement]").forEach(el=>{
    const k=el.dataset.announcement;
    el[el.type==="checkbox"?"checked":"value"]=data.settings.announcement[k] ?? "";
  });

  renderFeatured();
}

function renderFeatured(){
  if(!$("featuredProject")) return;
  $("featuredProject").innerHTML=data.projects.map(p=>`
    <option value="${esc(p.id)}" ${p.id===data.settings.featuredProjectId?"selected":""}>
      ${esc(p.name)} — ${esc(p.status)}
    </option>`).join("");
}

function renderGallery(){
  $("galleryForms").innerHTML=(data.settings.gallery||[]).map((g,i)=>`
    <article class="admin-card gallery-row" data-gallery-index="${i}">
      <div class="gallery-preview">
        ${g.url?`<img src="${esc(g.url)}" alt="${esc(g.caption||"Gallery photo")}">`:`<div>📷 No photo</div>`}
      </div>

      <div class="photo-row">
        <label class="upload-btn">📷 Upload Photo
          <input type="file" class="gallery-upload" accept="image/*" hidden>
        </label>
        <span class="admin-muted gallery-upload-status"></span>
      </div>

      <div class="form-grid">
        <label>Photo URL<input data-gallery="url" value="${esc(g.url)}" placeholder="Upload photo or paste public URL"></label>
        <label>Caption<input data-gallery="caption" value="${esc(g.caption)}" placeholder="Photo caption"></label>
      </div>

      <button class="mini-btn danger delete-gallery" type="button">Remove Photo</button>
    </article>
  `).join("") || `<div class="admin-card empty-admin">No gallery photos yet. Click “Add Photo” to add one.</div>`;
}

function renderAll(){
  renderDashboard();
  renderProjects();
  renderTeam();
  renderContent();
  renderControls();
  renderGallery();
}

async function loadRemote(){
  if(!sb){
    $("setupNotice").hidden=false;
    $("setupNotice").innerHTML=`<b>Supabase is not configured.</b> Add SUPABASE_URL and SUPABASE_ANON_KEY to config.js, then deploy.`;
    return;
  }

  const {data:sessionData,error:sessionError}=await sb.auth.getSession();
  if(sessionError || !sessionData?.session){
    $("loginBox").hidden=false;
    return;
  }
  await openPanel();
}

async function openPanel(){
  $("loginBox").hidden=true;
  $("panel").hidden=false;

  try{
    const {data:row,error}=await sb.from("site_data").select("content").eq("id",1).maybeSingle();
    if(error) throw error;
    normalise(row?.content || DEFAULT_DATA);
    renderAll();
  }catch(e){
    setMsg("Could not load website data: "+e.message);
    normalise(DEFAULT_DATA);
    renderAll();
  }
}

if($("loginBtn")){
  $("loginBtn").onclick=async()=>{
    if(!sb) return;
    const {error}=await sb.auth.signInWithPassword({
      email:$("email").value.trim(),
      password:$("password").value
    });
    if(error) $("loginMsg").textContent=error.message;
    else await openPanel();
  };
}

if($("logout")){
  $("logout").onclick=async()=>{
    if(sb) await sb.auth.signOut();
    location.reload();
  };
}

document.querySelectorAll(".tab").forEach(b=>{
  b.onclick=()=>showTab(b.dataset.tab);
});

document.querySelectorAll(".quick").forEach(b=>{
  b.onclick=()=>showTab(b.dataset.go);
});

if($("mobileMenu")){
  $("mobileMenu").onclick=()=>{
    document.querySelector(".admin-sidebar")?.classList.toggle("open");
  };
}

document.addEventListener("input",e=>{
  const el=e.target;

  if(el.matches("[data-setting]")){
    setPath(data.settings,el.dataset.setting,el.value);
  }

  if(el.matches("[data-hi-setting]")){
    const path=el.dataset.hiSetting;
    setPath(data.settings,path.split(".").slice(0,-1).join(".")+".hi."+path.split(".").pop(),el.value);
  }

  const pr=el.closest("[data-project-index]");
  if(pr && el.matches("[data-project]")){
    const p=data.projects[+pr.dataset.projectIndex];
    p[el.dataset.project]=el.value;
    p.location="Bihar";
  }

  if(pr && el.matches("[data-project-hi]")){
    const p=data.projects[+pr.dataset.projectIndex];
    if(!p.hi) p.hi={};
    p.hi[el.dataset.projectHi]=el.value;
  }

  const tr=el.closest("[data-team-index]");
  if(tr && el.matches("[data-team]")){
    data.team[+tr.dataset.teamIndex][el.dataset.team]=el.value;
  }

  if(tr && el.matches("[data-team-hi]")){
    const t=data.team[+tr.dataset.teamIndex];
    if(!t.hi) t.hi={};
    t.hi[el.dataset.teamHi]=el.value;
  }

  const rr=el.closest("[data-repeat]");
  if(rr && el.matches("[data-repeat-field]")){
    data.settings[rr.dataset.repeat].cards[+rr.dataset.index][el.dataset.repeatField]=el.value;
  }

  if(rr && el.matches("[data-repeat-hi]")){
    const card=data.settings[rr.dataset.repeat].cards[+rr.dataset.index];
    if(!card.hi) card.hi={};
    card.hi[el.dataset.repeatHi]=el.value;
  }

  const sr=el.closest("[data-social-index]");
  if(sr && el.matches("[data-social]")){
    data.settings.contact.socials[+sr.dataset.socialIndex][el.dataset.social]=el.value;
  }

  const gr=el.closest("[data-gallery-index]");
  if(gr && el.matches("[data-gallery]")){
    data.settings.gallery[+gr.dataset.galleryIndex][el.dataset.gallery]=el.value;
  }
});

document.addEventListener("change",async e=>{
  const el=e.target;

  if(el.matches("[data-section]")){
    data.settings.sections[el.dataset.section]=el.checked;
  }

  if(el.matches("[data-announcement]")){
    data.settings.announcement[el.dataset.announcement]=el.type==="checkbox"?el.checked:el.value;
  }

  if(el.matches("#featuredProject")){
    data.settings.featuredProjectId=el.value;
  }

  const pr=el.closest("[data-project-index]");
  if(pr && el.matches("[data-project]")){
    const p=data.projects[+pr.dataset.projectIndex];
    p[el.dataset.project]=el.value;
    if(el.dataset.project==="status" && el.value==="ongoing") p.date="Active";
  }

  const tr=el.closest("[data-team-index]");
  const file=el.files?.[0];

  if(file && el.classList.contains("project-upload")){
    await uploadImage(file,"projects",data.projects[+pr.dataset.projectIndex],"photo");
  }

  if(file && el.classList.contains("team-upload")){
    await uploadImage(file,"team",data.team[+tr.dataset.teamIndex],"photo");
  }

  const gr=el.closest("[data-gallery-index]");
  if(file && el.classList.contains("gallery-upload") && gr){
    const index=+gr.dataset.galleryIndex;
    const status=gr.querySelector(".gallery-upload-status");
    if(status) status.textContent="Uploading…";
    await uploadImage(file,"gallery",data.settings.gallery[index],"url");
  }
});

async function uploadImage(file,folder,obj,key){
  if(!sb){
    alert("Supabase is required for photo upload.");
    return;
  }

  if(!file.type.startsWith("image/")){
    setMsg("Please select an image file.");
    return;
  }

  const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"") || "jpg";
  const path=`${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  setMsg("Uploading photo…");

  const {error}=await sb.storage.from("site-assets").upload(path,file,{
    upsert:false,
    contentType:file.type
  });

  if(error){
    setMsg("Photo upload failed: "+error.message);
    return;
  }

  const {data:pub}=sb.storage.from("site-assets").getPublicUrl(path);
  obj[key]=pub.publicUrl;

  setMsg("Photo uploaded. Now press Save / Publish.",true);

  if(folder==="gallery") renderGallery();
  else if(folder==="projects") renderProjects();
  else if(folder==="team") renderTeam();
}

document.addEventListener("click",e=>{
  if(e.target.matches(".delete-project")){
    const row=e.target.closest("[data-project-index]");
    data.projects.splice(+row.dataset.projectIndex,1);
    renderProjects(); renderDashboard();
  }

  if(e.target.matches(".delete-team")){
    const row=e.target.closest("[data-team-index]");
    data.team.splice(+row.dataset.teamIndex,1);
    renderTeam(); renderDashboard();
  }

  if(e.target.matches(".live-project")){
    const row=e.target.closest("[data-project-index]");
    const p=data.projects[+row.dataset.projectIndex];
    p.status="ongoing"; p.date="Active";
    renderProjects(); renderDashboard();
    setMsg("Project marked Live / Active. Save / Publish to make it public.",true);
  }

  if(e.target.matches(".publish,.unpublish")){
    const row=e.target.closest("[data-project-index]");
    const p=data.projects[+row.dataset.projectIndex];
    p.published=p.published===false;
    renderProjects(); renderDashboard();
    setMsg(p.published?"Project marked Publish. Save / Publish to apply it.":"Project marked Unpublish. Save / Publish to apply it.",true);
  }

  if(e.target.matches(".delete-repeat")){
    const row=e.target.closest("[data-repeat]");
    data.settings[row.dataset.repeat].cards.splice(+row.dataset.index,1);
    renderContent();
  }

  if(e.target.matches(".delete-social")){
    const row=e.target.closest("[data-social-index]");
    data.settings.contact.socials.splice(+row.dataset.socialIndex,1);
    renderSocials();
  }

  if(e.target.matches(".delete-gallery")){
    const row=e.target.closest("[data-gallery-index]");
    data.settings.gallery.splice(+row.dataset.galleryIndex,1);
    renderGallery();
  }
});

if($("addProject")){
  $("addProject").onclick=()=>{
    data.projects.push({
      id:"p-"+Date.now(),name:"New Project",department:"Department / Client",location:"Bihar",
      status:"upcoming",description:"Add genuine project details.",date:"Upcoming",link:"",photo:"",published:false,
      hi:{name:"",department:"",description:""}
    });
    renderProjects(); renderDashboard(); showTab("projects");
  };
}

if($("addTeam")){
  $("addTeam").onclick=()=>{
    data.team.push({
      id:"team-"+Date.now(),role:"Designation",name:"New Member",location:"Bihar",
      responsibilities:"Add responsibilities.",photo:"",contact:"",
      hi:{name:"",role:"",responsibilities:""}
    });
    renderTeam(); showTab("team");
  };
}

if($("addAboutCard")){
  $("addAboutCard").onclick=()=>{
    data.settings.about.cards.push({title:"New About Item",text:"Add description.",hi:{title:"",text:""}});
    renderCards("aboutCards",data.settings.about.cards,"about");
  };
}

if($("addServiceCard")){
  $("addServiceCard").onclick=()=>{
    data.settings.services.cards.push({title:"New Service",text:"Add service description.",hi:{title:"",text:""}});
    renderCards("serviceCards",data.settings.services.cards,"services");
  };
}

if($("addSocial")){
  $("addSocial").onclick=()=>{
    data.settings.contact.socials.push({label:"Social",url:""});
    renderSocials();
  };
}

if($("addGallery")){
  $("addGallery").onclick=()=>{
    data.settings.gallery.push({url:"",caption:""});
    renderGallery();
    showTab("gallery");
  };
}

async function saveAll(){
  if(!sb){
    setMsg("Supabase is not configured.");
    return;
  }

  data.settings.address="Donar Road, Darbhanga";
  data.settings.contact.address="Donar Road, Darbhanga";
  data.projects=data.projects.map(p=>({...p,location:"Bihar"}));

  setMsg("Saving…");

  const {error}=await sb.from("site_data").upsert({
    id:1,
    content:data,
    updated_at:new Date().toISOString()
  });

  if(error){
    setMsg("Save failed: "+error.message);
  }else{
    setMsg("Changes saved and published successfully.",true);
    renderAll();
  }
}

if($("saveAll")) $("saveAll").onclick=saveAll;
if($("saveAllBottom")) $("saveAllBottom").onclick=saveAll;

loadRemote();
