const DEFAULT_DATA={
 projects:[
 {id:"abha",name:"ABHA Card Project",department:"Health / Digital Health Services",location:"Darbhanga",status:"active",description:"ABHA card creation and related service work through the existing service workflow.",date:"Active",link:"https://ss-enterprises-abha-app-2026.onrender.com/"},
 {id:"ayushman",name:"Ayushman Card KYC Project",department:"Ayushman Bharat",location:"Darbhanga",status:"upcoming",description:"Upcoming project; details will be updated after tender award/confirmation.",date:"Tender in Process",link:""}],
 team:[
 {id:"founder",role:"Founder",name:"Add Name",location:"Darbhanga, Bihar",responsibilities:"Overall vision, strategic decisions and major business operations.",contact:"",photo:""},
 {id:"ceo",role:"CEO & Managing Director",name:"Add Name",location:"Darbhanga, Bihar",responsibilities:"Day-to-day operations, projects/tenders, team management and organisational growth.",contact:"",photo:""},
 {id:"state-head",role:"State Head",name:"Add Name",location:"Bihar",responsibilities:"State-level project coordination, field operations and monitoring of district teams.",contact:"",photo:""},
 {id:"district-coordinator",role:"District Coordinator",name:"Add Name",location:"Darbhanga, Bihar",responsibilities:"District project implementation, field staff coordination and monitoring of assigned work.",contact:"",photo:""}]};
let data=DEFAULT_DATA;
const hasConfig=window.SS_CONFIG && window.SS_CONFIG.SUPABASE_URL.startsWith("http") && !window.SS_CONFIG.SUPABASE_URL.includes("PASTE_");
const sb=hasConfig?supabase.createClient(window.SS_CONFIG.SUPABASE_URL,window.SS_CONFIG.SUPABASE_ANON_KEY):null;
const $=s=>document.querySelector(s);
$("#year").textContent=new Date().getFullYear();
window.addEventListener("load",()=>setTimeout(()=>$("#intro")?.remove(),3600));
$(".menu")?.addEventListener("click",()=>{const n=document.querySelector("nav");n.classList.toggle("open")});
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector("nav")?.classList.remove("open")));

function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function statusLabel(s){return s==="active"?"Active":s==="upcoming"?"Upcoming":"Completed"}
function renderProjects(filter="all"){
 const grid=$("#projectGrid"); if(!grid)return;
 const list=filter==="all"?data.projects:data.projects.filter(p=>p.status===filter);
 grid.innerHTML=list.map(p=>`<article class="project-card ${p.status==="active"?"featured":""}">
 <span>PROJECT • ${escapeHtml(statusLabel(p.status).toUpperCase())}</span><h3>${escapeHtml(p.name)}</h3>
 <p class="project-meta"><strong>${escapeHtml(p.department)}</strong><br>📍 ${escapeHtml(p.location)}</p><p>${escapeHtml(p.description)}</p>
 <div class="project-bottom"><b>${escapeHtml(p.date||"")}</b>${p.link?`<a class="project-link" href="${escapeHtml(p.link)}" target="_blank" rel="noopener">Open Portal ↗</a>`:""}</div></article>`).join("")||'<div class="empty">No projects in this category yet.</div>';
}
function renderTeam(){
 const grid=$("#teamGrid"); if(!grid)return;
 grid.innerHTML=data.team.map(t=>`<article class="person-card">${t.photo?`<img src="${t.photo}" alt="${escapeHtml(t.name)}">`:`<div class="person-placeholder">♙</div>`}<div><span class="role">${escapeHtml(t.role)}</span><h3>${escapeHtml(t.name)}</h3><p>📍 ${escapeHtml(t.location)}</p><p>📞 ${escapeHtml(t.contact||"Contact to be added")}</p><p>${escapeHtml(t.responsibilities)}</p></div></article>`).join("");
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProjects(b.dataset.filter)}));

function normalizeRemoteData(remote){
 const fallback=JSON.parse(JSON.stringify(DEFAULT_DATA));
 if(!remote||typeof remote!=="object") return fallback;
 let projects=Array.isArray(remote.projects)?remote.projects:[];
 // Replace the old placeholder project cards that were showing on the live site.
 const hadOldPlaceholders=projects.some(p=>["Current Tender / Project","Upcoming Assignment","Completed Work"].includes(String(p?.name||"")));
 if(hadOldPlaceholders) projects=fallback.projects;
 else if(!projects.length) projects=fallback.projects;
 const team=(Array.isArray(remote.team)&&remote.team.length?remote.team:fallback.team).map(t=>({...t,contact:t.contact||""}));
 return {projects,team};
}

async function loadData(){
 if(!sb){data=JSON.parse(JSON.stringify(DEFAULT_DATA));renderProjects();renderTeam();return}
 const {data:row,error}=await sb.from("site_data").select("content").eq("id",1).maybeSingle();
 data=(!error&&row?.content)?normalizeRemoteData(row.content):JSON.parse(JSON.stringify(DEFAULT_DATA));
 renderProjects();renderTeam();
}
loadData();

window.openAdmin=()=>location.href="admin.html";
