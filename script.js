const DEFAULT_DATA = {
 projects:[
  {id:"abha",name:"ABHA Card Project",department:"Health / Digital Health Services",location:"Darbhanga",status:"active",description:"ABHA Card service work through the existing SS Enterprises digital service workflow.",date:"Active",link:"https://ss-enterprises-abha-app-2026.onrender.com/"},
  {id:"ayushman",name:"Ayushman Card KYC Project",department:"Ayushman Bharat",location:"Darbhanga",status:"upcoming",description:"Ayushman Card KYC related project. Details can be updated from the Admin Panel when confirmed.",date:"Upcoming",link:""}
 ],
 team:[
  {id:"founder",role:"Founder",name:"Add Name",location:"Darbhanga, Bihar",responsibilities:"Overall vision, strategic decisions, business direction and major operations.",photo:"",contact:""},
  {id:"ceo",role:"CEO & Managing Director",name:"Add Name",location:"Darbhanga, Bihar",responsibilities:"Day-to-day operations, project and tender coordination, team management and organisational growth.",photo:"",contact:""},
  {id:"state-head",role:"State Head",name:"Add Name",location:"Bihar",responsibilities:"State-level project coordination, field operations and monitoring of district teams.",photo:"",contact:""},
  {id:"district-coordinator",role:"District Coordinator",name:"Add Name",location:"Darbhanga, Bihar",responsibilities:"District project implementation, field staff coordination and monitoring of assigned work.",photo:"",contact:""}
 ]};

let data = JSON.parse(JSON.stringify(DEFAULT_DATA));
const hasConfig = window.SS_CONFIG && window.SS_CONFIG.SUPABASE_URL &&
  window.SS_CONFIG.SUPABASE_URL.startsWith("http") &&
  !window.SS_CONFIG.SUPABASE_URL.includes("PASTE_");
const sb = hasConfig ? supabase.createClient(window.SS_CONFIG.SUPABASE_URL, window.SS_CONFIG.SUPABASE_ANON_KEY) : null;
const $ = s => document.querySelector(s);
$("#year").textContent = new Date().getFullYear();

window.addEventListener("load",()=>setTimeout(()=>$("#intro")?.remove(),3200));
$(".menu")?.addEventListener("click",()=>document.querySelector("nav")?.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector("nav")?.classList.remove("open")));

function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function escapeAttr(s=""){return escapeHtml(s)}
function statusLabel(s){return s==="active"?"Active":s==="upcoming"?"Upcoming":"Completed"}

function renderProjects(filter="all"){
 const grid=$("#projectGrid"); if(!grid)return;
 const list=filter==="all"?data.projects:data.projects.filter(p=>p.status===filter);
 grid.innerHTML=list.map(p=>`<article class="project-card ${p.status==="active"?"featured":""}">
 <span>PROJECT • ${escapeHtml(statusLabel(p.status).toUpperCase())}</span>
 <h3>${escapeHtml(p.name)}</h3>
 <p class="project-meta"><strong>${escapeHtml(p.department)}</strong><br>📍 ${escapeHtml(p.location)}</p>
 <p>${escapeHtml(p.description)}</p>
 <div class="project-bottom"><b>${escapeHtml(p.date||"")}</b>${p.link?`<a class="project-link" href="${escapeAttr(p.link)}" target="_blank" rel="noopener">Open Portal ↗</a>`:""}</div>
 </article>`).join("") || '<div class="empty">No projects in this category yet.</div>';
}

function renderTeam(){
 const grid=$("#teamGrid"); if(!grid)return;
 grid.innerHTML=data.team.map(t=>`<article class="person-card">
 ${t.photo?`<img src="${escapeAttr(t.photo)}" alt="${escapeAttr(t.name)}">`:`<div class="person-placeholder">♙</div>`}
 <div><span class="role">${escapeHtml(t.role)}</span><h3>${escapeHtml(t.name)}</h3>
 <p>📍 ${escapeHtml(t.location)}</p>
 <p>${escapeHtml(t.responsibilities)}</p>
 ${t.contact?`<a class="person-contact" href="tel:${escapeAttr(t.contact)}">📞 ${escapeHtml(t.contact)}</a>`:`<p class="person-contact muted">📞 Contact number to be added</p>`}
 </div></article>`).join("");
}

document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
 b.classList.add("active"); renderProjects(b.dataset.filter);
}));

async function loadData(){
 if(!sb){renderProjects();renderTeam();return}
 try{
  const {data:row,error}=await sb.from("site_data").select("content").eq("id",1).maybeSingle();
  if(!error && row?.content){
    data = {...DEFAULT_DATA,...row.content};
    if(!Array.isArray(data.projects)||!Array.isArray(data.team)) data=JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
 }catch(e){}
 renderProjects();renderTeam();
}
loadData();