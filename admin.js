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
        { label: "Facebook", url: "" },
        { label: "Instagram", url: "" },
        { label: "YouTube", url: "" }
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

let data = clone(DEFAULT_DATA);
let sb = null;
let currentTab = "dashboard";
let saveInProgress = false;

const $ = id => document.getElementById(id);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

const configured =
  !!window.SS_CONFIG &&
  typeof window.SS_CONFIG.SUPABASE_URL === "string" &&
  window.SS_CONFIG.SUPABASE_URL.startsWith("http") &&
  !window.SS_CONFIG.SUPABASE_URL.includes("PASTE_") &&
  typeof window.SS_CONFIG.SUPABASE_ANON_KEY === "string" &&
  window.SS_CONFIG.SUPABASE_ANON_KEY.length > 20 &&
  !window.SS_CONFIG.SUPABASE_ANON_KEY.includes("PASTE_");

if (configured && window.supabase) {
  sb = window.supabase.createClient(
    window.SS_CONFIG.SUPABASE_URL,
    window.SS_CONFIG.SUPABASE_ANON_KEY
  );
}

/* =========================================================
   DATA HELPERS
========================================================= */

function merge(defaults, items) {
  const arr = Array.isArray(items) ? items : [];

  return defaults
    .map(d => {
      const found = arr.find(x => x && x.id === d.id);
      return found ? { ...clone(d), ...found } : clone(d);
    })
    .concat(
      arr.filter(x => x && !defaults.some(d => d.id === x.id))
    );
}

function normalise(raw) {
  const x = raw && typeof raw === "object" ? raw : {};
  const s = x.settings && typeof x.settings === "object" ? x.settings : {};

  data = {
    settings: {
      ...clone(DEFAULT_DATA.settings),
      ...s,

      homepage: {
        ...clone(DEFAULT_DATA.settings.homepage),
        ...(s.homepage || {})
      },

      announcement: {
        ...clone(DEFAULT_DATA.settings.announcement),
        ...(s.announcement || {})
      },

      sections: {
        ...clone(DEFAULT_DATA.settings.sections),
        ...(s.sections || {})
      },

      about: {
        ...clone(DEFAULT_DATA.settings.about),
        ...(s.about || {})
      },

      services: {
        ...clone(DEFAULT_DATA.settings.services),
        ...(s.services || {})
      },

      contact: {
        ...clone(DEFAULT_DATA.settings.contact),
        ...(s.contact || {})
      },

      gallery: Array.isArray(s.gallery) ? s.gallery : []
    },

    projects: merge(DEFAULT_DATA.projects, x.projects),

    team: merge(DEFAULT_DATA.team, x.team)
  };

  data.projects = data.projects.map(p => ({
    ...p,
    location: "Bihar",
    status:
      p.status === "active"
        ? "ongoing"
        : (p.status || "upcoming"),
    published: p.published !== false,
    hi: p.hi && typeof p.hi === "object" ? p.hi : {}
  }));

  data.team = data.team.map(t => ({
    ...t,
    hi: t.hi && typeof t.hi === "object" ? t.hi : {}
  }));

  if (!data.settings.contact.address) {
    data.settings.contact.address = data.settings.address;
  }

  if (!Array.isArray(data.settings.about.cards)) {
    data.settings.about.cards = [];
  }

  if (!Array.isArray(data.settings.services.cards)) {
    data.settings.services.cards = [];
  }

  if (!Array.isArray(data.settings.contact.socials)) {
    data.settings.contact.socials = [];
  }

  addHindiFields();
}

function addHindiFields() {
  const s = data.settings;

  s.homepage.hi ||= {};
  s.about.hi ||= {};
  s.services.hi ||= {};
  s.contact.hi ||= {};

  s.about.cards.forEach(c => {
    c.hi ||= {};
  });

  s.services.cards.forEach(c => {
    c.hi ||= {};
  });

  data.projects.forEach(p => {
    p.hi ||= {};
  });

  data.team.forEach(t => {
    t.hi ||= {};
  });
}

function setPath(obj, path, value) {
  const parts = path.split(".");
  const last = parts.pop();
  let cur = obj;

  parts.forEach(key => {
    if (!cur[key] || typeof cur[key] !== "object") {
      cur[key] = {};
    }
    cur = cur[key];
  });

  cur[last] = value;
}

function getPath(obj, path) {
  return path.split(".").reduce(
    (o, key) => o?.[key],
    obj
  );
}

/* =========================================================
   MESSAGE / TAB
========================================================= */

function setMsg(text, ok = false) {
  const el = $("saveMsg");
  if (!el) return;

  el.textContent = text;
  el.className = "admin-msg " + (ok ? "ok" : "");
}

function showTab(tab) {
  currentTab = tab;

  document.querySelectorAll(".tab").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });

  document.querySelectorAll(".tab-page").forEach(page => {
    page.classList.toggle("active", page.dataset.page === tab);
  });

  const titles = {
    dashboard: "Dashboard",
    projects: "Projects",
    team: "Leadership & Team",
    content: "Website Content",
    controls: "Website Control",
    gallery: "Gallery / Photos"
  };

  setText("pageTitle", titles[tab] || "Dashboard");

  const sidebar = document.querySelector(".admin-sidebar");
  if (sidebar) sidebar.classList.remove("open");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {
  setText("statProjects", data.projects.length);

  setText(
    "statUpcoming",
    data.projects.filter(p => p.status === "upcoming").length
  );

  setText(
    "statOngoing",
    data.projects.filter(p => p.status === "ongoing").length
  );

  setText(
    "statPublished",
    data.projects.filter(p => p.published !== false).length
  );
}

/* =========================================================
   PROJECTS
========================================================= */

function renderProjects() {
  const box = $("projectForms");
  if (!box) return;

  box.innerHTML = data.projects.map((p, i) => `
    <article class="admin-card project-admin-row" data-project-index="${i}">

      <div class="row-head">
        <div>
          <span class="status-pill ${esc(p.status)}">
            ${esc(
              p.status === "ongoing"
                ? "Ongoing"
                : p.status === "upcoming"
                  ? "Upcoming"
                  : "Completed"
            )}
          </span>
          <h3>${esc(p.name)}</h3>
        </div>

        <div class="row-actions">
          ${
            p.status === "upcoming"
              ? `<button type="button" class="mini-btn live-project">Live / Active</button>`
              : ""
          }

          <button type="button" class="mini-btn ${p.published !== false ? "unpublish" : "publish"}">
            ${p.published !== false ? "Unpublish" : "Publish"}
          </button>

          <button type="button" class="mini-btn danger delete-project">
            Delete
          </button>
        </div>
      </div>

      <div class="project-photo-box">
        ${
          p.photo
            ? `<img src="${esc(p.photo)}" alt="Project photo">`
            : `<div class="photo-empty">📷<span>No project photo</span></div>`
        }

        <label class="upload-btn">
          Upload Photo
          <input type="file" class="project-upload" accept="image/*" hidden>
        </label>
      </div>

      <div class="form-grid">

        <label>
          Project Name
          <input data-project="name" value="${esc(p.name)}">
        </label>

        <label>
          Department / Client
          <input data-project="department" value="${esc(p.department)}">
        </label>

        <label>
          Work / Project Location
          <input data-project="location" value="Bihar" disabled>
        </label>

        <label>
          Status
          <select data-project="status">
            <option value="upcoming" ${p.status === "upcoming" ? "selected" : ""}>Upcoming</option>
            <option value="ongoing" ${p.status === "ongoing" ? "selected" : ""}>Ongoing</option>
            <option value="completed" ${p.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
        </label>

        <label>
          Date / Label
          <input data-project="date" value="${esc(p.date)}" placeholder="e.g. 17 July 2026">
        </label>

        <label>
          Portal / Project Link
          <input data-project="link" value="${esc(p.link)}" placeholder="https://...">
        </label>

        <label class="span-2">
          Project Description
          <textarea data-project="description">${esc(p.description)}</textarea>
        </label>

        <label>
          Project Name — Hindi
          <input data-project-hi="name" value="${esc(p.hi?.name || "")}" placeholder="हिंदी नाम">
        </label>

        <label>
          Department — Hindi
          <input data-project-hi="department" value="${esc(p.hi?.department || "")}" placeholder="हिंदी विभाग">
        </label>

        <label class="span-2">
          Project Description — Hindi
          <textarea data-project-hi="description" placeholder="हिंदी में विवरण">${esc(p.hi?.description || "")}</textarea>
        </label>

      </div>
    </article>
  `).join("");

  if (!data.projects.length) {
    box.innerHTML = `
      <div class="admin-card empty-admin">
        No projects yet. Add your first project.
      </div>
    `;
  }

  renderFeatured();
}

/* =========================================================
   TEAM
========================================================= */

function renderTeam() {
  const box = $("teamForms");
  if (!box) return;

  box.innerHTML = data.team.map((t, i) => `
    <article class="admin-card team-admin-row" data-team-index="${i}">

      <div class="row-head">
        <div>
          <span class="role-admin">${esc(t.role)}</span>
          <h3>${esc(t.name)}</h3>
        </div>

        <button type="button" class="mini-btn danger delete-team">
          Delete Member
        </button>
      </div>

      <div class="photo-row">
        ${
          t.photo
            ? `<img class="admin-avatar" src="${esc(t.photo)}" alt="Team member photo">`
            : `<div class="admin-avatar placeholder">♙</div>`
        }

        <label class="upload-btn">
          Upload Photo
          <input type="file" class="team-upload" accept="image/*" hidden>
        </label>
      </div>

      <div class="form-grid">

        <label>
          Name
          <input data-team="name" value="${esc(t.name)}">
        </label>

        <label>
          Designation
          <input data-team="role" value="${esc(t.role)}">
        </label>

        <label>
          Location
          <input data-team="location" value="${esc(t.location)}">
        </label>

        <label>
          Contact No.
          <input data-team="contact" value="${esc(t.contact)}">
        </label>

        <label>
          Photo URL
          <input data-team="photo" value="${esc(t.photo)}">
        </label>

        <label class="span-2">
          Responsibilities
          <textarea data-team="responsibilities">${esc(t.responsibilities)}</textarea>
        </label>

        <label>
          Name — Hindi
          <input data-team-hi="name" value="${esc(t.hi?.name || "")}" placeholder="हिंदी नाम">
        </label>

        <label>
          Designation — Hindi
          <input data-team-hi="role" value="${esc(t.hi?.role || "")}" placeholder="हिंदी पद">
        </label>

        <label class="span-2">
          Responsibilities — Hindi
          <textarea data-team-hi="responsibilities" placeholder="हिंदी में जिम्मेदारियाँ">${esc(t.hi?.responsibilities || "")}</textarea>
        </label>

      </div>
    </article>
  `).join("");

  if (!data.team.length) {
    box.innerHTML = `
      <div class="admin-card empty-admin">
        No team members yet.
      </div>
    `;
  }
}

/* =========================================================
   WEBSITE CONTENT
========================================================= */

function renderContent() {
  document.querySelectorAll("[data-setting]").forEach(el => {
    el.value = getPath(data.settings, el.dataset.setting) ?? "";
  });

  renderCards("aboutCards", data.settings.about.cards, "about");
  renderCards("serviceCards", data.settings.services.cards, "services");
  renderSocials();
  renderHindiMainContent();
}

function renderHindiMainContent() {
  const box = $("hindiContentBox");
  if (!box) return;

  const about = data.settings.about;
  const services = data.settings.services;
  const homepage = data.settings.homepage;
  const contact = data.settings.contact;

  box.innerHTML = `
    <div class="admin-card">
      <h3>Hindi Website Content</h3>
      <p class="admin-muted">
        यहाँ Hindi version डालें। Website पर Hindi चुनने पर यही text दिखाई देगा।
      </p>

      <div class="form-grid">

        <label>
          Homepage Eyebrow — Hindi
          <input data-hi-setting="homepage.eyebrow" value="${esc(homepage.hi?.eyebrow || "")}">
        </label>

        <label>
          Homepage Title — Hindi
          <input data-hi-setting="homepage.title" value="${esc(homepage.hi?.title || "")}">
        </label>

        <label>
          Homepage Accent — Hindi
          <input data-hi-setting="homepage.accent" value="${esc(homepage.hi?.accent || "")}">
        </label>

        <label class="span-2">
          Homepage Description — Hindi
          <textarea data-hi-setting="homepage.lead">${esc(homepage.hi?.lead || "")}</textarea>
        </label>

        <label>
          About Eyebrow — Hindi
          <input data-hi-setting="about.eyebrow" value="${esc(about.hi?.eyebrow || "")}">
        </label>

        <label>
          About Title — Hindi
          <input data-hi-setting="about.title" value="${esc(about.hi?.title || "")}">
        </label>

        <label>
          About Accent — Hindi
          <input data-hi-setting="about.accent" value="${esc(about.hi?.accent || "")}">
        </label>

        <label class="span-2">
          About Description — Hindi
          <textarea data-hi-setting="about.text">${esc(about.hi?.text || "")}</textarea>
        </label>

        <label>
          Services Eyebrow — Hindi
          <input data-hi-setting="services.eyebrow" value="${esc(services.hi?.eyebrow || "")}">
        </label>

        <label>
          Services Title — Hindi
          <input data-hi-setting="services.title" value="${esc(services.hi?.title || "")}">
        </label>

        <label>
          Services Accent — Hindi
          <input data-hi-setting="services.accent" value="${esc(services.hi?.accent || "")}">
        </label>

        <label class="span-2">
          Services Description — Hindi
          <textarea data-hi-setting="services.text">${esc(services.hi?.text || "")}</textarea>
        </label>

        <label>
          Contact Eyebrow — Hindi
          <input data-hi-setting="contact.eyebrow" value="${esc(contact.hi?.eyebrow || "")}">
        </label>

        <label>
          Contact Title — Hindi
          <input data-hi-setting="contact.title" value="${esc(contact.hi?.title || "")}">
        </label>

        <label class="span-2">
          Contact Description — Hindi
          <textarea data-hi-setting="contact.text">${esc(contact.hi?.text || "")}</textarea>
        </label>

      </div>
    </div>
  `;
}

/* =========================================================
   ABOUT / SERVICES
========================================================= */

function renderCards(id, arr, type) {
  const box = $(id);
  if (!box) return;

  box.innerHTML = (arr || []).map((c, i) => `
    <div class="repeat-row" data-repeat="${type}" data-index="${i}">

      <div class="repeat-title">
        <b>${type === "about" ? "About Card" : "Service"} ${i + 1}</b>
        <button type="button" class="mini-btn danger delete-repeat">Remove</button>
      </div>

      <label>
        Title
        <input data-repeat-field="title" value="${esc(c.title)}">
      </label>

      <label>
        Description
        <textarea data-repeat-field="text">${esc(c.text)}</textarea>
      </label>

      <label>
        Title — Hindi
        <input data-repeat-hi="title" value="${esc(c.hi?.title || "")}" placeholder="हिंदी शीर्षक">
      </label>

      <label>
        Description — Hindi
        <textarea data-repeat-hi="text" placeholder="हिंदी विवरण">${esc(c.hi?.text || "")}</textarea>
      </label>

    </div>
  `).join("");
}

function renderSocials() {
  const box = $("socialLinks");
  if (!box) return;

  box.innerHTML = (data.settings.contact.socials || []).map((x, i) => `
    <div class="repeat-row social-row" data-social-index="${i}">

      <label>
        Platform
        <input data-social="label" value="${esc(x.label)}">
      </label>

      <label>
        URL
        <input data-social="url" value="${esc(x.url)}" placeholder="https://...">
      </label>

      <button type="button" class="mini-btn danger delete-social">Remove</button>
    </div>
  `).join("");
}

/* =========================================================
   CONTROLS
========================================================= */

function renderControls() {
  const box = $("sectionToggles");
  if (!box) return;

  const labels = {
    about: "About Us",
    services: "Services",
    projects: "Projects",
    team: "Leadership & Team",
    credentials: "Credentials",
    vision: "Vision",
    gallery: "Gallery",
    contact: "Contact"
  };

  box.innerHTML = Object.keys(labels).map(key => `
    <label class="toggle-card">
      <span>
        <b>${labels[key]}</b>
        <small>Section visibility</small>
      </span>

      <input type="checkbox" data-section="${key}" ${data.settings.sections[key] ? "checked" : ""}>
      <i></i>
    </label>
  `).join("");

  document.querySelectorAll("[data-announcement]").forEach(el => {
    const key = el.dataset.announcement;
    if (el.type === "checkbox") {
      el.checked = !!data.settings.announcement[key];
    } else {
      el.value = data.settings.announcement[key] ?? "";
    }
  });

  renderFeatured();
}

function renderFeatured() {
  const select = $("featuredProject");
  if (!select) return;

  const published = data.projects.filter(p => p.published !== false);

  const options = published.length ? published : data.projects;

  select.innerHTML = options.map(p => `
    <option value="${esc(p.id)}" ${p.id === data.settings.featuredProjectId ? "selected" : ""}>
      ${esc(p.name)} — ${esc(p.status)}
    </option>
  `).join("");

  if (
    options.length &&
    !options.some(p => p.id === data.settings.featuredProjectId)
  ) {
    data.settings.featuredProjectId = options[0].id;
    select.value = options[0].id;
  }

  if (!options.length) {
    select.innerHTML = `<option value="">No projects available</option>`;
  }
}

/* =========================================================
   GALLERY
========================================================= */

function renderGallery() {
  const box = $("galleryForms");
  if (!box) return;

  box.innerHTML = (data.settings.gallery || []).map((g, i) => `
    <article class="admin-card gallery-row" data-gallery-index="${i}">

      <div class="gallery-preview">
        ${
          g.url
            ? `<img src="${esc(g.url)}" alt="Gallery photo">`
            : `<div>📷 No photo URL</div>`
        }
      </div>

      <div class="form-grid">

        <label>
          Photo URL
          <input data-gallery="url" value="${esc(g.url)}">
        </label>

        <label>
          Caption
          <input data-gallery="caption" value="${esc(g.caption)}">
        </label>

      </div>

      <button type="button" class="mini-btn danger delete-gallery">
        Remove Photo
      </button>
    </article>
  `).join("");

  if (!data.settings.gallery.length) {
    box.innerHTML = `
      <div class="admin-card empty-admin">
        No gallery photos yet.
      </div>
    `;
  }
}

/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {
  renderDashboard();
  renderProjects();
  renderTeam();
  renderContent();
  renderControls();
  renderGallery();
}

/* =========================================================
   LOAD / OPEN PANEL
========================================================= */

async function loadRemote() {
  if (!configured || !sb) {
    const notice = $("setupNotice");
    if (notice) {
      notice.hidden = false;
      notice.innerHTML = `
        <b>Supabase is not configured.</b><br>
        Add SUPABASE_URL and SUPABASE_ANON_KEY to config.js, then deploy.
      `;
    }
    return;
  }

  try {
    const { data: sessionData, error: sessionError } =
      await sb.auth.getSession();

    if (sessionError) throw sessionError;

    if (!sessionData?.session) {
      $("loginBox").hidden = false;
      $("panel").hidden = true;
      return;
    }

    await openPanel();
  } catch (error) {
    setText("loginMsg", error.message || "Could not check login session.");
  }
}

async function openPanel() {
  $("loginBox").hidden = true;
  $("panel").hidden = false;

  try {
    const {
      data: row,
      error
    } = await sb
      .from("site_data")
      .select("content")
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;

    normalise(row?.content || DEFAULT_DATA);
    renderAll();
    showTab(currentTab);
    setMsg("Website data loaded.", true);
  } catch (error) {
    normalise(DEFAULT_DATA);
    renderAll();

    setMsg(
      "Could not load saved website data: " +
      (error.message || "Unknown error")
    );
  }
}

/* =========================================================
   LOGIN / LOGOUT
========================================================= */

if ($("loginBtn")) {
  $("loginBtn").addEventListener("click", async () => {
    if (!sb) {
      setText("loginMsg", "Supabase is not configured.");
      return;
    }

    const email = $("email").value.trim();
    const password = $("password").value;

    if (!email || !password) {
      setText("loginMsg", "Please enter email and password.");
      return;
    }

    $("loginBtn").disabled = true;
    setText("loginMsg", "Logging in…");

    try {
      const { error } = await sb.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setText("loginMsg", "");
      await openPanel();
    } catch (error) {
      setText("loginMsg", error.message || "Login failed.");
    } finally {
      $("loginBtn").disabled = false;
    }
  });
}

if ($("logout")) {
  $("logout").addEventListener("click", async () => {
    if (!sb) {
      location.reload();
      return;
    }

    try {
      await sb.auth.signOut();
    } finally {
      location.reload();
    }
  });
}

/* =========================================================
   TABS
========================================================= */

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    showTab(button.dataset.tab);
  });
});

document.querySelectorAll(".quick").forEach(button => {
  button.addEventListener("click", () => {
    showTab(button.dataset.go);
  });
});

if ($("mobileMenu")) {
  $("mobileMenu").addEventListener("click", () => {
    const sidebar = document.querySelector(".admin-sidebar");
    if (sidebar) sidebar.classList.toggle("open");
  });
}

/* =========================================================
   INPUT EVENTS
========================================================= */

document.addEventListener("input", event => {
  const el = event.target;

  if (el.matches("[data-setting]")) {
    setPath(
      data.settings,
      el.dataset.setting,
      el.value
    );
  }

  if (el.matches("[data-hi-setting]")) {
    const path = el.dataset.hiSetting;
    const parts = path.split(".");
    const section = parts.shift();
    const field = parts.join(".");

    setPath(
      data.settings,
      `${section}.hi.${field}`,
      el.value
    );
  }

  const projectRow = el.closest("[data-project-index]");

  if (projectRow && el.matches("[data-project]")) {
    const project = data.projects[+projectRow.dataset.projectIndex];
    if (!project) return;

    project[el.dataset.project] = el.value;
    project.location = "Bihar";
  }

  if (projectRow && el.matches("[data-project-hi]")) {
    const project = data.projects[+projectRow.dataset.projectIndex];
    if (!project) return;

    project.hi ||= {};
    project.hi[el.dataset.projectHi] = el.value;
  }

  const teamRow = el.closest("[data-team-index]");

  if (teamRow && el.matches("[data-team]")) {
    const member = data.team[+teamRow.dataset.teamIndex];
    if (!member) return;

    member[el.dataset.team] = el.value;
  }

  if (teamRow && el.matches("[data-team-hi]")) {
    const member = data.team[+teamRow.dataset.teamIndex];
    if (!member) return;

    member.hi ||= {};
    member.hi[el.dataset.teamHi] = el.value;
  }

  const repeatRow = el.closest("[data-repeat]");

  if (repeatRow && el.matches("[data-repeat-field]")) {
    const group = data.settings[repeatRow.dataset.repeat];
    const card = group?.cards?.[+repeatRow.dataset.index];
    if (!card) return;

    card[el.dataset.repeatField] = el.value;
  }

  if (repeatRow && el.matches("[data-repeat-hi]")) {
    const group = data.settings[repeatRow.dataset.repeat];
    const card = group?.cards?.[+repeatRow.dataset.index];
    if (!card) return;

    card.hi ||= {};
    card.hi[el.dataset.repeatHi] = el.value;
  }

  const socialRow = el.closest("[data-social-index]");

  if (socialRow && el.matches("[data-social]")) {
    const social = data.settings.contact.socials[
      +socialRow.dataset.socialIndex
    ];

    if (!social) return;
    social[el.dataset.social] = el.value;
  }

  const galleryRow = el.closest("[data-gallery-index]");

  if (galleryRow && el.matches("[data-gallery]")) {
    const gallery = data.settings.gallery[
      +galleryRow.dataset.galleryIndex
    ];

    if (!gallery) return;
    gallery[el.dataset.gallery] = el.value;
  }
});

/* =========================================================
   CHANGE EVENTS
========================================================= */

document.addEventListener("change", async event => {
  const el = event.target;

  if (el.matches("[data-section]")) {
    data.settings.sections[el.dataset.section] = el.checked;
  }

  if (el.matches("[data-announcement]")) {
    data.settings.announcement[el.dataset.announcement] =
      el.type === "checkbox" ? el.checked : el.value;
  }

  if (el.matches("#featuredProject")) {
    data.settings.featuredProjectId = el.value;
  }

  const projectRow = el.closest("[data-project-index]");

  if (projectRow && el.matches("[data-project]")) {
    const project = data.projects[+projectRow.dataset.projectIndex];
    if (!project) return;

    project[el.dataset.project] = el.value;
    project.location = "Bihar";

    if (
      el.dataset.project === "status" &&
      el.value === "ongoing"
    ) {
      project.date = "Active";

      const dateInput = projectRow.querySelector('[data-project="date"]');
      if (dateInput) dateInput.value = "Active";
    }
  }

  const file = el.files?.[0];

  if (
    file &&
    el.classList.contains("project-upload") &&
    projectRow
  ) {
    await uploadImage(
      file,
      "projects",
      data.projects[+projectRow.dataset.projectIndex],
      "photo"
    );
  }

  const teamRow = el.closest("[data-team-index]");

  if (
    file &&
    el.classList.contains("team-upload") &&
    teamRow
  ) {
    await uploadImage(
      file,
      "team",
      data.team[+teamRow.dataset.teamIndex],
      "photo"
    );
  }
});

/* =========================================================
   IMAGE UPLOAD
========================================================= */

async function uploadImage(file, folder, obj, key) {
  if (!sb) {
    alert("Supabase is required for photo upload.");
    return;
  }

  if (!file || !obj) return;

  const ext = (
    file.name.split(".").pop() || "jpg"
  )
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") || "jpg";

  const path =
    `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  setMsg("Uploading photo…");

  try {
    const { error } = await sb.storage
      .from("site-assets")
      .upload(path, file, {
        upsert: false,
        contentType: file.type || "image/jpeg"
      });

    if (error) throw error;

    const { data: pub } = sb.storage
      .from("site-assets")
      .getPublicUrl(path);

    if (!pub?.publicUrl) {
      throw new Error("Public image URL could not be generated.");
    }

    obj[key] = pub.publicUrl;

    setMsg(
      "Photo uploaded. Save / Publish to apply it.",
      true
    );

    renderProjects();
    renderTeam();
  } catch (error) {
    setMsg(
      "Photo upload failed: " +
      (error.message || "Unknown error")
    );
  }
}

/* =========================================================
   CLICK EVENTS
========================================================= */

document.addEventListener("click", event => {

  if (event.target.matches(".delete-project")) {
    const row = event.target.closest("[data-project-index]");
    if (!row) return;

    const index = +row.dataset.projectIndex;
    if (!Number.isInteger(index)) return;

    data.projects.splice(index, 1);

    if (data.settings.featuredProjectId &&
        !data.projects.some(p => p.id === data.settings.featuredProjectId)) {
      data.settings.featuredProjectId =
        data.projects.find(p => p.published !== false)?.id ||
        data.projects[0]?.id ||
        "";
    }

    renderProjects();
    renderDashboard();
  }

  if (event.target.matches(".delete-team")) {
    const row = event.target.closest("[data-team-index]");
    if (!row) return;

    data.team.splice(+row.dataset.teamIndex, 1);

    renderTeam();
    renderDashboard();
  }

  if (event.target.matches(".live-project")) {
    const row = event.target.closest("[data-project-index]");
    if (!row) return;

    const project = data.projects[+row.dataset.projectIndex];
    if (!project) return;

    project.status = "ongoing";
    project.date = "Active";

    renderProjects();
    renderDashboard();

    setMsg(
      "Project marked Live / Active. Save / Publish to make it public.",
      true
    );
  }

  if (event.target.matches(".publish, .unpublish")) {
    const row = event.target.closest("[data-project-index]");
    if (!row) return;

    const project = data.projects[+row.dataset.projectIndex];
    if (!project) return;

    project.published = project.published === false;

    renderProjects();
    renderDashboard();

    setMsg(
      project.published
        ? "Project marked Publish. Save / Publish to apply it."
        : "Project marked Unpublish. Save / Publish to apply it.",
      true
    );
  }

  if (event.target.matches(".delete-repeat")) {
    const row = event.target.closest("[data-repeat]");
    if (!row) return;

    const group = data.settings[row.dataset.repeat];
    if (!group?.cards) return;

    group.cards.splice(+row.dataset.index, 1);

    renderContent();
  }

  if (event.target.matches(".delete-social")) {
    const row = event.target.closest("[data-social-index]");
    if (!row) return;

    data.settings.contact.socials.splice(
      +row.dataset.socialIndex,
      1
    );

    renderSocials();
  }

  if (event.target.matches(".delete-gallery")) {
    const row = event.target.closest("[data-gallery-index]");
    if (!row) return;

    data.settings.gallery.splice(
      +row.dataset.galleryIndex,
      1
    );

    renderGallery();
  }
});

/* =========================================================
   ADD PROJECT
========================================================= */

if ($("addProject")) {
  $("addProject").addEventListener("click", () => {
    data.projects.push({
      id: "p-" + Date.now(),
      name: "New Project",
      department: "Department / Client",
      location: "Bihar",
      status: "upcoming",
      description: "Add genuine project details.",
      date: "Upcoming",
      link: "",
      photo: "",
      published: false,
      hi: {
        name: "",
        department: "",
        description: ""
      }
    });

    renderProjects();
    renderDashboard();
    showTab("projects");
  });
}

/* =========================================================
   ADD TEAM
========================================================= */

if ($("addTeam")) {
  $("addTeam").addEventListener("click", () => {
    data.team.push({
      id: "team-" + Date.now(),
      role: "Designation",
      name: "New Member",
      location: "Bihar",
      responsibilities: "Add responsibilities.",
      photo: "",
      contact: "",
      hi: {
        name: "",
        role: "",
        responsibilities: ""
      }
    });

    renderTeam();
    showTab("team");
  });
}

/* =========================================================
   ADD ABOUT CARD
========================================================= */

if ($("addAboutCard")) {
  $("addAboutCard").addEventListener("click", () => {
    data.settings.about.cards.push({
      title: "New About Item",
      text: "Add description.",
      hi: {
        title: "",
        text: ""
      }
    });

    renderCards(
      "aboutCards",
      data.settings.about.cards,
      "about"
    );
  });
}

/* =========================================================
   ADD SERVICE CARD
========================================================= */

if ($("addServiceCard")) {
  $("addServiceCard").addEventListener("click", () => {
    data.settings.services.cards.push({
      title: "New Service",
      text: "Add service description.",
      hi: {
        title: "",
        text: ""
      }
    });

    renderCards(
      "serviceCards",
      data.settings.services.cards,
      "services"
    );
  });
}

/* =========================================================
   ADD SOCIAL
========================================================= */

if ($("addSocial")) {
  $("addSocial").addEventListener("click", () => {
    data.settings.contact.socials.push({
      label: "Social",
      url: ""
    });

    renderSocials();
  });
}

/* =========================================================
   ADD GALLERY
========================================================= */

if ($("addGallery")) {
  $("addGallery").addEventListener("click", () => {
    data.settings.gallery.push({
      url: "",
      caption: ""
    });

    renderGallery();
    showTab("gallery");
  });
}

/* =========================================================
   SAVE ALL
========================================================= */

async function saveAll() {
  if (saveInProgress) return;

  if (!sb) {
    setMsg("Supabase is not configured.");
    return;
  }

  saveInProgress = true;

  const buttons = [
    $("saveAll"),
    $("saveAllBottom")
  ].filter(Boolean);

  buttons.forEach(button => {
    button.disabled = true;
  });

  try {
    /*
     * These values are intentionally protected.
     * Project location always remains Bihar.
     * Public address always remains Donar Road, Darbhanga.
     */
    data.settings.locationLabel = "Bihar";
    data.settings.address = "Donar Road, Darbhanga";
    data.settings.contact.address = "Donar Road, Darbhanga";

    data.projects = data.projects.map(project => ({
      ...project,
      location: "Bihar"
    }));

    setMsg("Saving…");

    const {
      error
    } = await sb
      .from("site_data")
      .upsert({
        id: 1,
        content: data,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    setMsg(
      "Changes saved and published successfully.",
      true
    );

    renderAll();
  } catch (error) {
    setMsg(
      "Save failed: " +
      (error.message || "Unknown error")
    );
  } finally {
    saveInProgress = false;

    buttons.forEach(button => {
      button.disabled = false;
    });
  }
}

if ($("saveAll")) {
  $("saveAll").addEventListener("click", saveAll);
}

if ($("saveAllBottom")) {
  $("saveAllBottom").addEventListener("click", saveAll);
}

/* =========================================================
   START
========================================================= */

loadRemote();
