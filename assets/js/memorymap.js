/* =========================================================
   মেমোরি ম্যাপ (Memory Map)
   friends.js এর ডেটা থেকে প্রতিটা বন্ধুর "Location" (রেজিস্ট্রেশনে যা
   লেখা হয়েছিল) পড়ে ম্যাপে পিন করে দেখায় — কে এখন কোথায় আছে।

   কীভাবে কাজ করে:
   ১) প্রথমে বাংলাদেশের ৬৪ জেলা + কিছু জনপ্রিয় প্রবাসী দেশের একটা রেডি লিস্ট
      (BD_PLACES) থেকে মেলানোর চেষ্টা হয় — এটা তাৎক্ষণিক, কোনো ইন্টারনেট
      কল লাগে না।
   ২) না মিললে, OpenStreetMap-এর ফ্রি Nominatim সার্ভিস দিয়ে ওই এলাকার
      টেক্সট থেকে lat/lng খোঁজা হয় (রেট-লিমিট মেনে, একটার পর একটা)।
      ফলাফল ব্রাউজারের localStorage-এ ক্যাশ হয়ে থাকে, তাই একই এলাকা
      বারবার লোড করতে হয় না।
   ৩) কোনোভাবেই না মিললে সেই বন্ধুর পিন বসে না, কিন্তু বাকি সবার পিন ঠিকই বসে।

   এটা আনুমানিক অবস্থান দেখায় (জেলা/শহর লেভেলে) — নির্দিষ্ট বাসার ঠিকানা না,
   কারো প্রাইভেসি প্রকাশ পায় না।
   ========================================================= */

const BD_PLACES = {
  "dhaka":[23.8103,90.4125], "ঢাকা":[23.8103,90.4125],
  "faridpur":[23.6070,89.8429], "ফরিদপুর":[23.6070,89.8429],
  "gazipur":[23.9999,90.4203], "গাজীপুর":[23.9999,90.4203],
  "gopalganj":[23.0050,89.8266], "গোপালগঞ্জ":[23.0050,89.8266],
  "kishoreganj":[24.4260,90.9763], "কিশোরগঞ্জ":[24.4260,90.9763],
  "madaripur":[23.1642,90.1897], "মাদারীপুর":[23.1642,90.1897],
  "manikganj":[23.8644,89.9987], "মানিকগঞ্জ":[23.8644,89.9987],
  "munshiganj":[23.5422,90.5305], "মুন্সিগঞ্জ":[23.5422,90.5305],
  "narayanganj":[23.6238,90.5000], "নারায়ণগঞ্জ":[23.6238,90.5000],
  "narsingdi":[23.9223,90.7150], "নরসিংদী":[23.9223,90.7150],
  "rajbari":[23.7574,89.6444], "রাজবাড়ী":[23.7574,89.6444],
  "shariatpur":[23.2423,90.4348], "শরীয়তপুর":[23.2423,90.4348],
  "tangail":[24.2513,89.9167], "টাঙ্গাইল":[24.2513,89.9167],

  "chattogram":[22.3569,91.7832], "chittagong":[22.3569,91.7832], "চট্টগ্রাম":[22.3569,91.7832],
  "cox's bazar":[21.4272,92.0058], "coxsbazar":[21.4272,92.0058], "কক্সবাজার":[21.4272,92.0058],
  "cumilla":[23.4607,91.1809], "comilla":[23.4607,91.1809], "কুমিল্লা":[23.4607,91.1809],
  "brahmanbaria":[23.9571,91.1119], "ব্রাহ্মণবাড়িয়া":[23.9571,91.1119],
  "chandpur":[23.2333,90.6667], "চাঁদপুর":[23.2333,90.6667],
  "feni":[23.0159,91.3976], "ফেনী":[23.0159,91.3976],
  "khagrachari":[23.1193,91.9847], "খাগড়াছড়ি":[23.1193,91.9847],
  "lakshmipur":[22.9447,90.8282], "লক্ষ্মীপুর":[22.9447,90.8282],
  "noakhali":[22.8696,91.0995], "নোয়াখালী":[22.8696,91.0995],
  "rangamati":[22.7324,92.2985], "রাঙ্গামাটি":[22.7324,92.2985],
  "bandarban":[22.1953,92.2183], "বান্দরবান":[22.1953,92.2183],

  "khulna":[22.8456,89.5403], "খুলনা":[22.8456,89.5403],
  "bagerhat":[22.6602,89.7895], "বাগেরহাট":[22.6602,89.7895],
  "chuadanga":[23.6402,88.8410], "চুয়াডাঙ্গা":[23.6402,88.8410],
  "jashore":[23.1667,89.2167], "jessore":[23.1667,89.2167], "যশোর":[23.1667,89.2167],
  "jhenaidah":[23.5448,89.1539], "ঝিনাইদহ":[23.5448,89.1539],
  "kushtia":[23.9013,89.1206], "কুষ্টিয়া":[23.9013,89.1206],
  "magura":[23.4855,89.4198], "মাগুরা":[23.4855,89.4198],
  "meherpur":[23.7622,88.6318], "মেহেরপুর":[23.7622,88.6318],
  "narail":[23.1725,89.5126], "নড়াইল":[23.1725,89.5126],
  "satkhira":[22.7185,89.0705], "সাতক্ষীরা":[22.7185,89.0705],

  "rajshahi":[24.3745,88.6042], "রাজশাহী":[24.3745,88.6042],
  "bogura":[24.8465,89.3773], "bogra":[24.8465,89.3773], "বগুড়া":[24.8465,89.3773],
  "joypurhat":[25.0968,89.0227], "জয়পুরহাট":[25.0968,89.0227],
  "naogaon":[24.7936,88.9318], "নওগাঁ":[24.7936,88.9318],
  "natore":[24.4206,88.9873], "নাটোর":[24.4206,88.9873],
  "chapainawabganj":[24.5965,88.2775], "নবাবগঞ্জ":[24.5965,88.2775], "চাঁপাইনবাবগঞ্জ":[24.5965,88.2775],
  "pabna":[23.9985,89.2332], "পাবনা":[23.9985,89.2332],
  "sirajganj":[24.4533,89.7000], "সিরাজগঞ্জ":[24.4533,89.7000],

  "rangpur":[25.7439,89.2752], "রংপুর":[25.7439,89.2752],
  "dinajpur":[25.6279,88.6332], "দিনাজপুর":[25.6279,88.6332],
  "gaibandha":[25.3288,89.5289], "গাইবান্ধা":[25.3288,89.5289],
  "kurigram":[25.8054,89.6362], "কুড়িগ্রাম":[25.8054,89.6362],
  "lalmonirhat":[25.9923,89.2847], "লালমনিরহাট":[25.9923,89.2847],
  "nilphamari":[25.9317,88.8560], "নীলফামারী":[25.9317,88.8560],
  "panchagarh":[26.3411,88.5541], "পঞ্চগড়":[26.3411,88.5541],
  "thakurgaon":[26.0336,88.4616], "ঠাকুরগাঁও":[26.0336,88.4616],

  "sylhet":[24.8949,91.8687], "সিলেট":[24.8949,91.8687],
  "habiganj":[24.3745,91.4155], "হবিগঞ্জ":[24.3745,91.4155],
  "moulvibazar":[24.4829,91.7774], "মৌলভীবাজার":[24.4829,91.7774],
  "sunamganj":[25.0658,91.3950], "সুনামগঞ্জ":[25.0658,91.3950],

  "barishal":[22.7010,90.3535], "barisal":[22.7010,90.3535], "বরিশাল":[22.7010,90.3535],
  "barguna":[22.0953,90.1121], "বরগুনা":[22.0953,90.1121],
  "bhola":[22.6841,90.6474], "ভোলা":[22.6841,90.6474],
  "jhalokati":[22.6406,90.1987], "ঝালকাঠি":[22.6406,90.1987],
  "patuakhali":[22.3596,90.3296], "পটুয়াখালী":[22.3596,90.3296],
  "pirojpur":[22.5841,89.9720], "পিরোজপুর":[22.5841,89.9720],

  "mymensingh":[24.7471,90.4203], "ময়মনসিংহ":[24.7471,90.4203],
  "jamalpur":[24.9375,89.9370], "জামালপুর":[24.9375,89.9370],
  "netrokona":[24.8829,90.7275], "নেত্রকোণা":[24.8829,90.7275],
  "sherpur":[25.0197,90.0161], "শেরপুর":[25.0197,90.0161],

  // জনপ্রিয় প্রবাসী দেশ/শহর (কান্ট্রি-লেভেল পিন)
  "india":[22.3511,78.6677], "ইন্ডিয়া":[22.3511,78.6677], "ভারত":[22.3511,78.6677],
  "usa":[39.8283,-98.5795], "united states":[39.8283,-98.5795], "আমেরিকা":[39.8283,-98.5795],
  "uk":[54.7024,-3.2766], "united kingdom":[54.7024,-3.2766], "england":[54.7024,-3.2766], "লন্ডন":[51.5072,-0.1276], "london":[51.5072,-0.1276],
  "canada":[56.1304,-106.3468], "কানাডা":[56.1304,-106.3468],
  "australia":[-25.2744,133.7751], "অস্ট্রেলিয়া":[-25.2744,133.7751],
  "malaysia":[4.2105,101.9758], "মালয়েশিয়া":[4.2105,101.9758],
  "singapore":[1.3521,103.8198], "সিঙ্গাপুর":[1.3521,103.8198],
  "saudi arabia":[23.8859,45.0792], "সৌদি":[23.8859,45.0792], "সৌদি আরব":[23.8859,45.0792],
  "uae":[23.4241,53.8478], "dubai":[25.2048,55.2708], "দুবাই":[25.2048,55.2708], "আরব আমিরাত":[23.4241,53.8478],
  "qatar":[25.3548,51.1839], "কাতার":[25.3548,51.1839],
  "kuwait":[29.3117,47.4818], "কুয়েত":[29.3117,47.4818],
  "oman":[21.4735,55.9754], "ওমান":[21.4735,55.9754],
  "bahrain":[26.0667,50.5577], "বাহরাইন":[26.0667,50.5577],
  "japan":[36.2048,138.2529], "জাপান":[36.2048,138.2529],
  "south korea":[35.9078,127.7669], "কোরিয়া":[35.9078,127.7669],
  "italy":[41.8719,12.5674], "ইতালি":[41.8719,12.5674],
  "germany":[51.1657,10.4515], "জার্মানি":[51.1657,10.4515],
  "france":[46.2276,2.2137], "ফ্রান্স":[46.2276,2.2137],
};

const MEMMAP_CACHE_KEY = "memmap_geocode_v1";

function loadGeoCache(){
  try{ return JSON.parse(localStorage.getItem(MEMMAP_CACHE_KEY) || "{}"); }
  catch(e){ return {}; }
}
function saveGeoCache(cache){
  try{ localStorage.setItem(MEMMAP_CACHE_KEY, JSON.stringify(cache)); }catch(e){ /* কোনো সমস্যা নেই, শুধু ক্যাশ হবে না */ }
}

function normalizeLoc(text){
  return (text || "").toString().trim().toLowerCase();
}

// রেডি লিস্ট থেকে মেলানোর চেষ্টা — সবচেয়ে লম্বা কী (key) আগে চেক হয়, যাতে
// "ঢাকা সিটি" এর মধ্যে "ঢাকা" ধরা পড়ে, আর নির্দিষ্ট শহরকে দেশের চেয়ে প্রায়োরিটি দেওয়া যায়
const BD_PLACE_KEYS = Object.keys(BD_PLACES).sort((a,b) => b.length - a.length);

function matchStaticPlace(locationText){
  const norm = normalizeLoc(locationText);
  if (!norm) return null;
  for (const key of BD_PLACE_KEYS){
    if (norm.includes(key)) return BD_PLACES[key];
  }
  return null;
}

function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }

async function geocodeViaNominatim(locationText){
  const q = encodeURIComponent(locationText);
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
  try{
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length){
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  }catch(e){ /* নেটওয়ার্ক সমস্যা হলে চুপচাপ স্কিপ */ }
  return null;
}

// প্রতিটা ইউনিক লোকেশন টেক্সটের জন্য একবারই coords বের করে {locationText: [lat,lng]|null} রিটার্ন করে
async function resolveLocations(uniqueLocationTexts){
  const cache = loadGeoCache();
  const result = {};
  const toFetch = [];

  uniqueLocationTexts.forEach(loc => {
    const norm = normalizeLoc(loc);
    const staticHit = matchStaticPlace(loc);
    if (staticHit){ result[loc] = staticHit; return; }
    if (Object.prototype.hasOwnProperty.call(cache, norm)){ result[loc] = cache[norm]; return; }
    toFetch.push(loc);
  });

  // Nominatim-এর ব্যবহারবিধি মেনে একটার পর একটা, মাঝে বিরতি দিয়ে কল করা হয়
  for (const loc of toFetch){
    const coords = await geocodeViaNominatim(loc + ", Bangladesh") || await geocodeViaNominatim(loc);
    result[loc] = coords;
    cache[normalizeLoc(loc)] = coords;
    saveGeoCache(cache);
    await sleep(1100);
  }

  return result;
}

function escapeHtml(str){
  return (str || "").toString()
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ম্যাপের উপর "ক্লিক করে আনলক" ওভারলে — এটা না থাকলে পেজ স্ক্রল করার সময়
// মাউস/আঙুল ম্যাপের উপর দিয়ে গেলে পেজের বদলে ম্যাপ জুম/প্যান হয়ে যায়, স্ক্রল আটকে যায়।
// ক্লিক/ট্যাপ করলে আনলক হয়ে স্বাভাবিক জুম-স্ক্রল কাজ করে; ম্যাপ থেকে বাইরে ক্লিক করলে
// বা মাউস সরিয়ে নিলে আবার লক হয়ে যায়, যাতে পরের বার স্ক্রল করতে সমস্যা না হয়।
function setupMapScrollLock(map, mapEl, lockEl){
  function lock(){
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    if (map.touchZoom) map.touchZoom.disable();
    if (map.tap) map.tap.disable();
    lockEl.classList.remove("memmap-lock-hidden");
  }
  function unlock(){
    map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    if (map.touchZoom) map.touchZoom.enable();
    if (map.tap) map.tap.enable();
    lockEl.classList.add("memmap-lock-hidden");
  }

  lock(); // শুরুতে লক করা থাকবে

  lockEl.addEventListener("click", (e) => { e.stopPropagation(); unlock(); });
  mapEl.addEventListener("mouseleave", lock);
  document.addEventListener("click", (e) => {
    if (!mapEl.contains(e.target) && e.target !== lockEl) lock();
  });
}

// একটা গ্রুপ (একই এলাকার সব বন্ধু) এর জন্য প্রোফাইল ছবি দিয়ে "পিন" আকৃতির মার্কার আইকন বানায়
// (উপরে গোল ফ্রেমে ছবি, নিচে সরু হয়ে একটা পয়েন্ট — ঠিক ম্যাপ পিনের মতো)
let pinIconCounter = 0;
function buildAvatarIcon(group){
  const count = group.friends.length;
  const lead = group.friends[0];
  const photo = resolveImage(lead.photo, lead.name);
  const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(lead.name || "Friend")}&backgroundColor=ece2c8`;
  const badge = count > 1 ? `<span class="memmap-avatar-badge">${count}</span>` : "";

  // এই viewBox-এ পিনের শেপ ফিক্সড থাকে, চূড়ান্ত সাইজ CSS/iconSize দিয়ে ঠিক হয়
  const vbW = 32, vbH = 42;
  const cx = 16, cy = 15.5, r = 12.5; // ছবির গোল অংশ
  const uid = "memmapPin" + (pinIconCounter++);

  const width = count > 1 ? 44 : 38;
  const height = Math.round(width * (vbH / vbW));

  const html = `
    <div class="memmap-pin" style="width:${width}px;height:${height}px;">
      <svg viewBox="0 0 ${vbW} ${vbH}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="${uid}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
        </defs>
        <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z"
          fill="#16223d" stroke="#fff" stroke-width="1.6"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ece2c8"/>
        <foreignObject x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" clip-path="url(#${uid})">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;">
            <img src="${escapeHtml(photo)}" alt="${escapeHtml(lead.name)}"
              style="width:100%;height:100%;object-fit:cover;display:block;"
              onerror="this.onerror=null;this.src='${fallback}';">
          </div>
        </foreignObject>
      </svg>
      ${badge}
    </div>
  `;

  return L.divIcon({
    className: "memmap-avatar-icon",
    html,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height + 6],
  });
}

async function initMemoryMap(){
  const mapEl = document.getElementById("memoryMapEl");
  const statusEl = document.getElementById("memoryMapStatus");
  const lockEl = document.getElementById("memoryMapLock");
  if (!mapEl) return;

  try{
    if (typeof L === "undefined"){
      statusEl.innerHTML = `ম্যাপ লাইব্রেরি (Leaflet) লোড হয়নি — ইন্টারনেট কানেকশন চেক করো বা পেজ রিফ্রেশ করো। কোনো Ad-blocker/VPN CDN আটকে দিচ্ছে কিনা সেটাও দেখো।`;
      return;
    }
    if (typeof loadFriendsData !== "function"){
      statusEl.innerHTML = `friends.js লোড হয়নি — assets/js/friends.js ফাইলটা friends.html-এ memorymap.js এর আগে লোড হচ্ছে কিনা চেক করো।`;
      return;
    }

    const friends = await loadFriendsData();
    const withLocation = friends.filter(f => f.location && f.location.trim());

    if (!withLocation.length){
      statusEl.innerHTML = `কারো এলাকার তথ্য এখনো পাওয়া যায়নি।`;
      return;
    }

    const uniqueLocs = [...new Set(withLocation.map(f => f.location.trim()))];
    statusEl.innerHTML = `<span class="spin"></span> ${uniqueLocs.length} টা এলাকা খুঁজে দেখা হচ্ছে...`;

    const resolved = await resolveLocations(uniqueLocs);

    // একই কো-অর্ডিনেটে (একই এলাকা) যত বন্ধু আছে, সবাইকে একসাথে গ্রুপ করা হয়
    const groups = {};
    let pinnedCount = 0;
    withLocation.forEach(f => {
      const coords = resolved[f.location.trim()];
      if (!coords) return;
      const key = coords[0].toFixed(2) + "," + coords[1].toFixed(2);
      if (!groups[key]) groups[key] = { coords, locationLabel: f.location.trim(), friends: [] };
      groups[key].friends.push(f);
      pinnedCount++;
    });

    const groupList = Object.values(groups);
    if (!groupList.length){
      statusEl.innerHTML = `কারো এলাকা ম্যাপে দেখানো যায়নি — এলাকার নামগুলো আরেকটু নির্দিষ্ট করে (যেমন জেলার নাম) লিখতে বলো।`;
      return;
    }

    const map = L.map(mapEl, { scrollWheelZoom: false }).setView([23.8, 90.3], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    if (lockEl) setupMapScrollLock(map, mapEl, lockEl);

    const bounds = [];
    groupList.forEach(g => {
      const count = g.friends.length;
      const marker = L.marker(g.coords, { icon: buildAvatarIcon(g) }).addTo(map);

      const names = g.friends.slice(0, 12).map(f => {
        const photo = resolveImage(f.photo, f.name);
        return `<div class="memmap-friend">
          <img src="${photo}" alt="${escapeHtml(f.name)}" onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(f.name||"Friend")}&backgroundColor=ece2c8'">
          <span>${escapeHtml(f.name)}${f.position ? ` <small>· ${escapeHtml(f.position)}</small>` : ""}</span>
        </div>`;
      }).join("");
      const more = count > 12 ? `<div class="text-secondary small mt-1">+ আরও ${count - 12} জন</div>` : "";

      marker.bindPopup(`
        <div class="memmap-popup">
          <div class="memmap-popup-title"><i class="bi bi-geo-alt-fill"></i> ${escapeHtml(g.locationLabel)} <span class="mono">(${count} জন)</span></div>
          <div class="memmap-friend-list">${names}${more}</div>
        </div>
      `);

      bounds.push(g.coords);
    });

    if (bounds.length > 1) map.fitBounds(bounds, { padding: [30, 30] });

    statusEl.innerHTML = `${pinnedCount} / ${withLocation.length} জন বন্ধুর এলাকা ম্যাপে পিন করা হয়েছে।`;
  }catch(err){
    console.error("Memory map failed:", err);
    statusEl.innerHTML = `
      ম্যাপ লোড করা যায়নি। সম্ভাব্য কারণ:<br>
      ১) config.js এ FRIENDS_SHEET_ID/FRIENDS_SHEET_GID ঠিকমতো বসানো আছে কিনা দেখো (এটা friends.html এর গ্রিডেও লাগে)।<br>
      ২) Friends Google Sheet Share → "Anyone with the link" (Viewer) করা আছে কিনা দেখো।<br>
      ৩) Sheet-এ অন্তত একজনের Status = 1 এবং Location কলাম ভরা আছে কিনা দেখো।<br>
      <span class="mono" style="font-size:.7rem; opacity:.75;">${escapeHtml(err && err.message ? err.message : String(err))}</span>
    `;
  }
}

document.addEventListener("DOMContentLoaded", initMemoryMap);
