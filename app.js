/* ============================================================================
   FULL CIRCLE — SOP LIBRARY  |  APP LOGIC
   You normally never need to touch this file.
   To change the team password, edit the ONE line just below.
   ============================================================================ */

const TEAM_PASSWORD = "fullcircle2026";   // <- change this to your team password

/* --------------------------------------------------------------------------
   1. PASSWORD GATE  (light protection — deters casual access, not hackers)
   -------------------------------------------------------------------------- */
const gate      = document.getElementById("gate");
const app       = document.getElementById("app");
const gateForm  = document.getElementById("gate-form");
const gateInput = document.getElementById("gate-input");
const gateError = document.getElementById("gate-error");

function unlock() {
  gate.hidden = true;
  app.hidden = false;
  renderCategories(SOP_CATEGORIES);
}

if (sessionStorage.getItem("fc_sop_unlocked") === "yes") {
  unlock();
} else {
  gateInput && gateInput.focus();
}

gateForm && gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (gateInput.value === TEAM_PASSWORD) {
    sessionStorage.setItem("fc_sop_unlocked", "yes");
    gateError.hidden = true;
    unlock();
  } else {
    gateError.hidden = false;
    gateInput.value = "";
    gateInput.focus();
  }
});

document.getElementById("lock-btn") &&
  document.getElementById("lock-btn").addEventListener("click", () => {
    sessionStorage.removeItem("fc_sop_unlocked");
    location.reload();
  });

/* --------------------------------------------------------------------------
   2. LINK PARSER
   Takes whatever Google / PDF link is pasted in sops-data.js and returns a
   clean embeddable "preview" URL so the doc renders as a web page in-app.
   -------------------------------------------------------------------------- */
function toEmbedUrl(rawLink) {
  if (!rawLink) return null;
  const link = rawLink.trim();

  // Google Docs / Sheets / Slides:  /document|spreadsheets|presentation/d/<ID>/...
  const gsuite = link.match(/\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/);
  if (gsuite) {
    return `https://docs.google.com/${gsuite[1]}/d/${gsuite[2]}/preview`;
  }

  // Google Drive file (PDFs, images, etc.):  /file/d/<ID>/...
  const driveFile = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFile) {
    return `https://drive.google.com/file/d/${driveFile[1]}/preview`;
  }

  // Google Drive "open?id=<ID>" or "...?id=<ID>" style links
  const driveId = link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId[1]}/preview`;
  }

  // Already a direct PDF or any other web page — embed as-is.
  return link;
}

/* --------------------------------------------------------------------------
   3. RENDER CATEGORIES + CARDS
   -------------------------------------------------------------------------- */
const content   = document.getElementById("content");
const emptyState = document.getElementById("empty");

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

const arrowSvg = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M8 5l8 7-8 7V5z"/></svg>';

function renderCategories(categories, query) {
  content.innerHTML = "";
  let totalShown = 0;

  categories.forEach((cat) => {
    const matches = (cat.sops || []).filter((sop) => sopMatches(sop, cat, query));
    if (matches.length === 0) return;
    totalShown += matches.length;

    const section = document.createElement("section");
    section.className = "category";
    section.innerHTML = `
      <div class="category-head">
        <div class="category-emoji">${escapeHtml(cat.icon || "📁")}</div>
        <div class="category-title">${escapeHtml(cat.category)}
          <span class="category-count">· ${matches.length}</span>
        </div>
      </div>
      <div class="grid"></div>`;
    const grid = section.querySelector(".grid");

    matches.forEach((sop) => {
      const card = document.createElement("button");
      card.className = "card";
      card.innerHTML = `
        <div class="card-icon">${escapeHtml(sop.icon || "📄")}</div>
        <div class="card-title">${highlight(sop.title, query)}</div>
        ${sop.desc ? `<div class="card-desc">${highlight(sop.desc, query)}</div>` : ""}
        <span class="card-cta">Open ${arrowSvg}</span>`;
      card.addEventListener("click", () => openViewer(sop));
      grid.appendChild(card);
    });

    content.appendChild(section);
  });

  emptyState.hidden = totalShown > 0 || !query;
  if (totalShown === 0 && query) {
    emptyState.hidden = false;
  }
}

/* --------------------------------------------------------------------------
   4. SEARCH
   -------------------------------------------------------------------------- */
function sopMatches(sop, cat, query) {
  if (!query) return true;
  const haystack = [
    sop.title, sop.desc, sop.tags, cat.category
  ].join(" ").toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

function highlight(text, query) {
  const safe = escapeHtml(text);
  if (!query) return safe;
  const words = query.trim().split(/\s+/).filter(Boolean).map(escapeRegex);
  if (!words.length) return safe;
  const re = new RegExp(`(${words.join("|")})`, "gi");
  return safe.replace(re, "<mark>$1</mark>");
}
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

const searchInput = document.getElementById("search");
const searchClear = document.getElementById("search-clear");

searchInput && searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  searchClear.hidden = q.length === 0;
  renderCategories(SOP_CATEGORIES, q);
});
searchClear && searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchClear.hidden = true;
  renderCategories(SOP_CATEGORIES);
  searchInput.focus();
});
document.getElementById("empty-reset") &&
  document.getElementById("empty-reset").addEventListener("click", () => {
    searchInput.value = "";
    searchClear.hidden = true;
    renderCategories(SOP_CATEGORIES);
  });

/* --------------------------------------------------------------------------
   5. DOC VIEWER
   -------------------------------------------------------------------------- */
const viewer       = document.getElementById("viewer");
const viewerFrame  = document.getElementById("viewer-frame");
const viewerTitle  = document.getElementById("viewer-title");
const viewerOpen   = document.getElementById("viewer-open");
const viewerLoad   = document.getElementById("viewer-loading");

function openViewer(sop) {
  const embed = toEmbedUrl(sop.link);
  viewerTitle.textContent = sop.title;
  viewerOpen.href = sop.link;
  viewerLoad.hidden = false;
  viewerFrame.src = embed;
  viewer.hidden = false;
  document.body.style.overflow = "hidden";
}

viewerFrame && viewerFrame.addEventListener("load", () => { viewerLoad.hidden = true; });

function closeViewer() {
  viewer.hidden = true;
  viewerFrame.src = "";
  document.body.style.overflow = "";
}
document.getElementById("viewer-close").addEventListener("click", closeViewer);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !viewer.hidden) closeViewer(); });
viewer.addEventListener("click", (e) => { if (e.target === viewer) closeViewer(); });
