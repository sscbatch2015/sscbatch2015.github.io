/* =========================================================
   CONFIG — এই ফাইলটাই একমাত্র জায়গা যেখানে তোমাকে হাত দিতে হবে।
   নিচের প্রতিটা ভ্যালু বদলে নাও, তাহলেই পুরো সাইট লাইভ হয়ে যাবে।
   ========================================================= */

const CONFIG = {

  // ---------- 1) FRIENDS GOOGLE SHEET ----------
  // Google Sheet ওপেন করো -> Share -> "Anyone with the link" -> Viewer
  // URL থেকে SHEET_ID কপি করো: https://docs.google.com/spreadsheets/d/[[এইটুকু]]/edit
  // GID = নিচের ট্যাব বার-এ ওই sheet tab এ ক্লিক করলে URL এর শেষে #gid=123456 — ওই নাম্বারটা
  // ⚠️ এই sheet-এ একটা "Status" কলাম থাকতে হবে — যে রো-তে Status = 1 করবে, শুধু সেই বন্ধুর প্রোফাইল সাইটে দেখাবে
  FRIENDS_SHEET_ID: "1BxwiMfOgb4UwEwr8-T41C8OL-os54ex6UsCBSGtYolw",
  FRIENDS_SHEET_GID: "0",

  // FRIENDS_REGISTER_FORM_EMBED_URL: (ঐচ্ছিক / আর ব্যবহার হয় না)
  // friends.html এখন নিজস্ব HTML/Bootstrap ফর্ম ব্যবহার করে যেটা সরাসরি SUBMIT_SCRIPT_URL
  // দিয়ে Sheet-এ লেখে (নিচে ১১ নম্বর দেখো)। এই ভ্যারিয়েবলটা রাখা হয়েছে শুধু ব্যাকওয়ার্ড-কম্প্যাটিবিলিটির জন্য।
  FRIENDS_REGISTER_FORM_EMBED_URL: "",

  // ---------- 2) EVENTS GOOGLE SHEET ----------
  EVENTS_SHEET_ID: "1BxwiMfOgb4UwEwr8-T41C8OL-os54ex6UsCBSGtYolw",
  EVENTS_SHEET_GID: "1742796814",

  // ---------- 3) গ্যালারি GOOGLE SHEET (বন্ধুরা নিজেরাই ছবি যোগ করতে পারবে) ----------
  // wall.html-এর মতোই — gallery.html-এ একটা ফর্ম থাকবে, বন্ধুরা Google Drive/অন্য
  // কোনো ছবির লিংক পেস্ট করে সাবমিট করলে Apps Script "Gallery" নামের একটা ট্যাব
  // নিজে থেকেই বানিয়ে সেখানে row যোগ করবে। প্রথম সাবমিশনের পর Sheet-এ গিয়ে
  // "Gallery" ট্যাবে ক্লিক করে URL-এর #gid=... নাম্বারটা নিচে বসাও (WALL_SHEET_GID-এর মতোই)।
  GALLERY_SHEET_ID: "1BxwiMfOgb4UwEwr8-T41C8OL-os54ex6UsCBSGtYolw",
  GALLERY_SHEET_GID: "598944864", // প্রথম সাবমিশনের পর আসল GID বসাও
  // ⚠️ Gallery Sheet-এও একটা "Status" কলাম থাকতে হবে (Friends Sheet-এর মতোই)।
  // নতুন সাবমিশনে Status খালি থাকবে -> গ্যালারিতে দেখাবে না। Sheet-এ গিয়ে
  // Status কলামে 1 বসালে তবেই ছবিটা সবাই দেখতে পাবে। (নিচে GALLERY_REQUIRE_APPROVAL দেখো)
  GALLERY_REQUIRE_APPROVAL: true,

  // ---------- 3.2) গ্যালারি PIN গেট (ঐচ্ছিক) ----------
  // "ছবি যোগ করো" ফর্মটা এখন একটা PIN দিয়ে লক করা থাকে, যাতে যে কেউ এসে
  // স্প্যাম না করতে পারে। PIN গুলো এই স্প্রেডশিটেরই একটা "Auth" নামের ট্যাবে
  // রাখো, কলাম নাম "PIN" (একটা কলামে একাধিক রো — প্রতিটা রো একটা করে বৈধ PIN)।
  // ⚠️ এই স্প্রেডশিটটা "Anyone with the link -> Viewer" হিসেবে শেয়ার করা, তাই
  // এখানে রাখা PIN কোনো real security না — এটা শুধু "না বুঝেই র‍্যান্ডম কেউ যোগ
  // করে ফেলল" এটা আটকানোর জন্য একটা soft gate। কখনোই কোনো ইমেইল/পাসওয়ার্ড এই
  // শিটে রেখো না — নিচের নোট দেখো কেন।
  AUTH_SHEET_ID: "1BxwiMfOgb4UwEwr8-T41C8OL-os54ex6UsCBSGtYolw",
  AUTH_SHEET_GID: "1455921031",

  // ---------- 3.1) GITHUB IMAGE BASE ----------
  // তোমার GitHub রিপোর সব ছবি যে ফোল্ডারে রাখবে তার raw base URL।
  // যেমন: https://raw.githubusercontent.com/username/reponame/main/images/
  // এরপর Sheet এর "Photo" কলামে শুধু ফাইলের নাম দিলেই চলবে (e.g. rafi.jpg)
  // অথবা Sheet এ পুরো লিংক দিলে এটা লাগবে না, কোডে auto-detect হয়ে যাবে।
  GITHUB_IMAGE_BASE: "https://raw.githubusercontent.com/USERNAME/REPO/main/images/",

  // ---------- 4) EMAILJS (মেইল পাঠানোর জন্য) ----------
  // https://www.emailjs.com -> ফ্রি অ্যাকাউন্ট খুলে Service + Template বানাও
  // README.md এ ধাপে ধাপে লেখা আছে
  EMAILJS_PUBLIC_KEY: "PASTE_EMAILJS_PUBLIC_KEY",
  EMAILJS_SERVICE_ID: "PASTE_EMAILJS_SERVICE_ID",
  EMAILJS_TEMPLATE_ID: "PASTE_EMAILJS_TEMPLATE_ID",

  // ---------- 5) BATCH META (হোমপেজের হেডলাইন/স্ট্যাট) ----------
  BATCH_NAME: "SSC ব্যাচ ২০১৫",
  SCHOOL_NAME: "তোমার স্কুলের নাম এখানে বসাও",
  TAGLINE: "একই বেঞ্চ, একই মাঠ, একই দুষ্টুমি — আজও একই আমরা।",

  // ---------- 6) NOTICE BOARD SHEET (ঐচ্ছিক টুল) ----------
  // কলাম: Title | Message | Date | Pinned (yes/no খালি রাখলে চলবে)
  NOTICES_SHEET_ID: "1BxwiMfOgb4UwEwr8-T41C8OL-os54ex6UsCBSGtYolw",
  NOTICES_SHEET_GID: "114438715",

  // ---------- 7) ফান্ড ট্র্যাকার SHEET (ঐচ্ছিক টুল) ----------
  // কলাম: Name | Amount | Note | Date
  FUND_SHEET_ID: "1BxwiMfOgb4UwEwr8-T41C8OL-os54ex6UsCBSGtYolw",
  FUND_SHEET_GID: "86209502",
  FUND_GOAL: 50000, // টার্গেট এমাউন্ট (টাকা) — প্রগ্রেস বার এই সংখ্যা অনুযায়ী দেখাবে
  FUND_INFO: "ব্যাচ রিইউনিয়ন, বিপদে-আপদে বন্ধুর পাশে দাঁড়ানো আর ছোটখাটো ব্যাচ-খরচের জন্য এই ফান্ড। কে কত দিয়েছে সেটা শুধু এখানে হিসাব হিসেবে দেখানো হয় — টাকা পাঠানো হয় bKash/Nagad/হাতে হাতে, নিজেদের মধ্যে; ওয়েবসাইট শুধু স্বচ্ছতার জন্য হিসাবটা সবাইকে দেখায়।", // ফান্ড সেকশনের উপরে এই লেখাটা দেখাবে, চাইলে বদলে নাও

  // ---------- 8) ব্যাচ ওয়াল (tools.html, ঐচ্ছিক টুল) ----------
  // friends.html-এর রেজিস্ট্রেশন ফর্মের মতোই — কোনো Google Form লাগে না।
  // SUBMIT_SCRIPT_URL (নিচে ১১ নম্বর) দিয়েই সরাসরি Sheet-এ পোস্ট লেখা হয়,
  // Apps Script নিজে থেকেই "Wall" নামের একটা নতুন ট্যাব বানিয়ে নেবে (প্রথম পোস্টের সময়)।
  // ওয়াল পড়ার জন্য ওই ট্যাবের Sheet ID/GID এখানে বসাও — Friends Sheet-এর মতোই একই স্প্রেডশিটে
  // থাকবে (যেটাতে Apps Script ডিপ্লয় করেছো), শুধু ট্যাব বদলাবে। প্রথমবার কেউ পোস্ট করার পর
  // Sheet-এ গিয়ে "Wall" ট্যাবে ক্লিক করে URL-এর #gid=... নাম্বারটা এখানে বসাও (PollVotes-এর মতোই)।
  WALL_SHEET_ID: "1BxwiMfOgb4UwEwr8-T41C8OL-os54ex6UsCBSGtYolw",
  WALL_SHEET_GID: "646983352",

  // ---------- 9) কমিউনিটি লিংক (ঐচ্ছিক) ----------
  WHATSAPP_GROUP_URL: "", // যেমন: https://chat.whatsapp.com/xxxxxxx
  FACEBOOK_GROUP_URL: "", // যেমন: https://facebook.com/groups/xxxxxxx
  TELEGRAM_GROUP_URL: "", // যেমন: https://t.me/xxxxxxx
  MESSENGER_GROUP_URL: "https://m.me/j/AbYJV5D53nO_ppPN/?send_source=gc%3Acopy_invite_link_t", // ব্যাচের Messenger গ্রুপ চ্যাট লিংক

  // ---------- 10) সাইট ক্রেডিট ----------
  CREDIT_NAME: "PSBMLabs",
  CREDIT_URL: "https://psbmlabs.github.io",

  // ---------- 11) SUBMIT SCRIPT (Google Apps Script Web App) ----------
  // friends.html-এর রেজিস্ট্রেশন ফর্ম আর গ্রুপ পোল — দুটোই এই এক URL দিয়ে
  // সরাসরি Google Sheet-এ ডেটা লেখে। কীভাবে বানাবে সেটা google-apps-script/README.md-এ লেখা আছে।
  SUBMIT_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxrzlBNl0P5jl6rJPRvzz8n93Xs4Lu7NxlMNGTl521NVrQIVJOdA39ztSAhh6WBF7w/exec",

  // ---------- 12) গ্রুপ পোল (tools.html) ----------
  // প্রশ্ন আর অপশন এখানে বদলাও — যত খুশি অপশন দিতে পারো
  POLL_QUESTION: "এবারের রিইউনিয়ন কোথায় হওয়া উচিত?",
  POLL_OPTIONS: ["স্কুল ক্যাম্পাসে", "রিসোর্টে", "কারো বাসায়/ছাদে", "রেস্টুরেন্টে"],
  // ভোটগুলো যে শিটে জমা হবে তার ID/GID (Apps Script এই শিটেই "PollVotes" নামের ট্যাবে লিখবে)
  POLL_SHEET_ID: "1BxwiMfOgb4UwEwr8-T41C8OL-os54ex6UsCBSGtYolw",
  POLL_SHEET_GID: "675489945",
};



/* ---------- Helper: Google Sheet -> CSV URL (গোপন কোনো API key লাগে না) ---------- */
function sheetCsvUrl(sheetId, gid){
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

const FRIENDS_CSV_URL   = sheetCsvUrl(CONFIG.FRIENDS_SHEET_ID, CONFIG.FRIENDS_SHEET_GID);
const EVENTS_CSV_URL    = sheetCsvUrl(CONFIG.EVENTS_SHEET_ID, CONFIG.EVENTS_SHEET_GID);
const NOTICES_CSV_URL   = sheetCsvUrl(CONFIG.NOTICES_SHEET_ID, CONFIG.NOTICES_SHEET_GID);
const FUND_CSV_URL      = sheetCsvUrl(CONFIG.FUND_SHEET_ID, CONFIG.FUND_SHEET_GID);
const WALL_CSV_URL      = sheetCsvUrl(CONFIG.WALL_SHEET_ID, CONFIG.WALL_SHEET_GID);
const POLL_CSV_URL      = sheetCsvUrl(CONFIG.POLL_SHEET_ID, CONFIG.POLL_SHEET_GID);
const GALLERY_CSV_URL   = sheetCsvUrl(CONFIG.GALLERY_SHEET_ID, CONFIG.GALLERY_SHEET_GID);
const AUTH_CSV_URL      = sheetCsvUrl(CONFIG.AUTH_SHEET_ID, CONFIG.AUTH_SHEET_GID);

/* ---------- Helper: ফর্ম/পোল ডেটা Apps Script দিয়ে Google Sheet-এ পাঠানো ---------- */
// sheetName = Apps Script-এর মধ্যে কোন ট্যাবে row যোগ হবে ("Friends", "PollVotes" ইত্যাদি)
// data = { column: value, ... } — key গুলো ওই শিটের header নামের সাথে case-insensitive মিলবে
async function submitToSheet(sheetName, data){
  if (!CONFIG.SUBMIT_SCRIPT_URL || CONFIG.SUBMIT_SCRIPT_URL.startsWith("PASTE_")){
    throw new Error("SUBMIT_SCRIPT_URL সেট করা হয়নি — config.js দেখো।");
  }
  const body = new URLSearchParams({ sheetName, ...data });
  // Apps Script Web App CORS প্রিফ্লাইট সাপোর্ট করে না, তাই no-cors mode ব্যবহার করা হচ্ছে —
  // মানে রেসপন্স পড়া যাবে না, কিন্তু রিকোয়েস্টটা ঠিকভাবে শিটে পৌঁছায়।
  await fetch(CONFIG.SUBMIT_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body,
  });
}

/* ---------- Helper: একটা File অবজেক্টকে base64 স্ট্রিং-এ কনভার্ট করে (data: প্রিফিক্স ছাড়া) ---------- */
function fileToBase64(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- Helper: ছবি সরাসরি ফাইল আপলোড হলে — Apps Script দিয়ে (PIN + base64 পাঠিয়ে)
   Cloudinary-তে আপলোড করানো হয়। গ্যালারি ফর্ম আর রেজিস্ট্রেশন ফর্ম দুটোই এই একই
   হেল্পার ব্যবহার করে — শুধু `target` আলাদা, যাতে Apps Script বুঝতে পারে ছবিটা
   Gallery শিটে সরাসরি row হিসেবে যোগ করবে নাকি শুধু URL রিটার্ন করবে (Friends
   ফর্মের বেলায়, কারণ সেটা নিজে থেকেই আলাদা করে "Friends" শিটে পুরো row জমা দেয়)। */
async function uploadImageViaScript({ file, pin, name, caption, tag, target }){
  const base64 = await fileToBase64(file);
  const body = new URLSearchParams({
    action: "uploadImage",
    target: target || "gallery",
    pin,
    name: name || "",
    caption: caption || "",
    tag: tag || "",
    filename: file.name || "photo.jpg",
    contentType: file.type || "image/jpeg",
    file_base64: base64,
  });
  // এখানে ইচ্ছাকৃতভাবে no-cors ব্যবহার করা হচ্ছে না — কারণ আসল URL/success
  // ব্রাউজারে ফেরত দরকার। x-www-form-urlencoded body হওয়ায় এটা "simple request"
  // (কোনো preflight লাগে না)।
  const res = await fetch(CONFIG.SUBMIT_SCRIPT_URL, { method: "POST", body });
  return res.json(); // { status: "ok", url } অথবা { status: "error", message }
}

/* ---------- Helper: resolve an image field to a real URL ---------- */
function resolveImage(value, fallbackSeed){
  if (!value || !value.trim()){
    // ছবি না থাকলে initials দিয়ে placeholder বানাই
    const seed = encodeURIComponent(fallbackSeed || "Friend");
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundType=solid&backgroundColor=ece2c8&fontFamily=Georgia`;
  }
  value = value.trim();
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return CONFIG.GITHUB_IMAGE_BASE.replace(/\/$/, "") + "/" + value.replace(/^\//, "");
}

/* ---------- Helper: Google Drive শেয়ার লিংক -> সরাসরি হটলিংক-যোগ্য URL ----------
   বন্ধুরা Drive-এ ছবি আপলোড করে "Anyone with the link -> Viewer" করে যে শেয়ার
   লিংক পাবে (যেমন https://drive.google.com/file/d/FILE_ID/view?usp=sharing),
   সেটা সরাসরি <img src> এ বসালে কাজ করে না — এই ফাংশন FILE_ID বের করে
   drive.google.com/thumbnail ফরম্যাটে বদলে দেয়, যেটা হটলিংকে রিলায়েবল। */
function resolveImageLink(value){
  if (!value) return "";
  value = value.trim();
  const driveMatch =
    value.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    value.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    value.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && value.includes("drive.google.com")) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1200`;
  }
  return value; // ইতিমধ্যে সরাসরি ইমেজ লিংক (imgbb, GitHub raw ইত্যাদি)
}
