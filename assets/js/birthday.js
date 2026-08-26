/* =========================================================
   BIRTHDAY টুল
   Friends শিটে ঐচ্ছিক "Birthday" কলাম দাও — ফরম্যাট YYYY-MM-DD বা MM-DD
   এটা থেকেই সাইটজুড়ে "আজ কার জন্মদিন" ব্যানার আর tools.html-এ
   "আসছে যাদের জন্মদিন" লিস্ট বানানো হয়
   ========================================================= */

function extractMonthDay(raw){
  if (!raw) return null;
  const v = raw.trim();
  let m, d;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) { const p = v.split("-"); m = +p[1]; d = +p[2]; }
  else if (/^\d{1,2}-\d{1,2}$/.test(v)) { const p = v.split("-"); m = +p[0]; d = +p[1]; }
  else if (/^\d{1,2}\/\d{1,2}(\/\d{2,4})?$/.test(v)) { const p = v.split("/"); m = +p[0]; d = +p[1]; }
  else return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { m, d };
}

function nextOccurrence(m, d){
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), m - 1, d, 23, 59, 59);
  if (thisYear >= new Date(now.getFullYear(), now.getMonth(), now.getDate())) return thisYear;
  return new Date(now.getFullYear() + 1, m - 1, d);
}

function daysUntil(date){
  const now = new Date(); now.setHours(0,0,0,0);
  const target = new Date(date); target.setHours(0,0,0,0);
  return Math.round((target - now) / 86400000);
}

async function getUpcomingBirthdays(limit){
  const rows = await loadFriendsData();
  const withBday = rows
    .map(f => {
      const md = extractMonthDay(f.birthday || f.dob || "");
      if (!md) return null;
      const occ = nextOccurrence(md.m, md.d);
      return { ...f, _occ: occ, _days: daysUntil(occ) };
    })
    .filter(Boolean)
    .sort((a, b) => a._days - b._days);
  return limit ? withBday.slice(0, limit) : withBday;
}

async function checkBirthdayBanner(){
  const banner = document.getElementById("birthdayBanner");
  if (!banner) return;
  try{
    const upcoming = await getUpcomingBirthdays();
    const todays = upcoming.filter(f => f._days === 0);
    if (!todays.length) return;
    const names = todays.map(f => f.name).join(", ");
    banner.innerHTML = `🎂 আজ জন্মদিন — <strong>${names}</strong>! সবাই মিলে শুভেচ্ছা জানাও।
      <button onclick="this.parentElement.style.display='none'" aria-label="বন্ধ করো">✕</button>`;
    banner.style.display = "block";
  }catch(e){ /* সাইলেন্টলি স্কিপ — শিট কনফিগার না থাকলে ব্যানার দেখাবে না */ }
}

function bdayItem(f){
  const photo = resolveImage(f.photo, f.name);
  const isToday = f._days === 0;
  const label = isToday ? "আজ! 🎉" : f._days === 1 ? "আগামীকাল" : `আর ${f._days} দিন পর`;
  const dateLabel = f._occ.toLocaleDateString("bn-BD", { day:"numeric", month:"long" });
  return `
    <div class="bday-item ${isToday ? "today" : ""}">
      <img src="${photo}" alt="${f.name}" onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(f.name)}&backgroundColor=ece2c8'">
      <div>
        <div class="nm">${f.name}</div>
        <div class="dt">${dateLabel} · ${label}</div>
      </div>
    </div>`;
}

const BDAY_PAGE_SIZE = 10;
let _bdayAll = [];
let _bdayPage = 0;

function renderBirthdayPage(){
  const wrap = document.getElementById("birthdayList");
  const pager = document.getElementById("birthdayPager");
  if (!wrap) return;

  const totalPages = Math.max(1, Math.ceil(_bdayAll.length / BDAY_PAGE_SIZE));
  if (_bdayPage >= totalPages) _bdayPage = totalPages - 1;
  if (_bdayPage < 0) _bdayPage = 0;

  const start = _bdayPage * BDAY_PAGE_SIZE;
  const pageItems = _bdayAll.slice(start, start + BDAY_PAGE_SIZE);

  wrap.innerHTML = pageItems.map(bdayItem).join("");

  if (!pager) return;
  if (_bdayAll.length <= BDAY_PAGE_SIZE){
    pager.innerHTML = "";
    return;
  }

  const from = start + 1;
  const to = Math.min(start + BDAY_PAGE_SIZE, _bdayAll.length);
  pager.innerHTML = `
    <button type="button" class="page-btn" id="bdayPrevBtn" ${_bdayPage === 0 ? "disabled" : ""}>
      <i class="bi bi-chevron-left"></i> আগের
    </button>
    <span class="page-info">${from}–${to} / ${_bdayAll.length} জন · পাতা ${_bdayPage + 1} / ${totalPages}</span>
    <button type="button" class="page-btn" id="bdayNextBtn" ${_bdayPage >= totalPages - 1 ? "disabled" : ""}>
      পরবর্তী <i class="bi bi-chevron-right"></i>
    </button>
  `;

  const prevBtn = document.getElementById("bdayPrevBtn");
  const nextBtn = document.getElementById("bdayNextBtn");
  if (prevBtn) prevBtn.addEventListener("click", () => {
    _bdayPage--;
    renderBirthdayPage();
    wrap.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  if (nextBtn) nextBtn.addEventListener("click", () => {
    _bdayPage++;
    renderBirthdayPage();
    wrap.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

async function initBirthdayList(){
  const wrap = document.getElementById("birthdayList");
  if (!wrap) return;
  try{
    _bdayAll = await getUpcomingBirthdays();
    _bdayPage = 0;
    if (!_bdayAll.length){
      wrap.innerHTML = `<div class="state-msg">Friends শিটে এখনো কারো "Birthday" কলাম ভরা হয়নি।</div>`;
      const pager = document.getElementById("birthdayPager");
      if (pager) pager.innerHTML = "";
      return;
    }
    renderBirthdayPage();
  }catch(e){
    wrap.innerHTML = `<div class="state-msg">জন্মদিনের তালিকা লোড করা যায়নি।</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkBirthdayBanner();
  initBirthdayList();
});
