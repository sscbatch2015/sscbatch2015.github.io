/* =========================================================
   REGISTER FORM (friends.html) — নিজেদের বানানো Bootstrap ফর্ম,
   কোনো Google Form embed লাগে না। সাবমিট করলে সরাসরি Apps Script
   দিয়ে FRIENDS Google Sheet-এ একটা নতুন row যোগ হয় (Status ফাঁকা থাকে,
   অ্যাডমিন ম্যানুয়ালি Status=1 করলে তবেই friends.html-এ দেখাবে)।
   ========================================================= */

/* ছবি ফিল্ডের জন্য PIN-গেটেড সরাসরি আপলোড — গ্যালারি পাতার মতোই মেকানিজম,
   কিন্তু পুরো রেজিস্ট্রেশন ফর্ম লক না, শুধু "সরাসরি ছবি আপলোড করো" অংশটা।
   PIN সঠিক হলে ফাইল বাছার সাথে সাথে অটো আপলোড হয়ে উপরের টেক্সট ফিল্ডে
   লিংক বসে যায় — বাকি ফর্ম আগের মতোই স্বাভাবিকভাবে সাবমিট হয়। */
function initRegisterPhotoUpload(){
  const lockedBox  = document.getElementById("regPhotoUploadLocked");
  const uploadBox  = document.getElementById("regPhotoUploadBox");
  const unlockBtn  = document.getElementById("regPhotoUnlockBtn");
  const fileInput  = document.getElementById("regPhotoFile");
  const photoInput = document.getElementById("regPhotoInput");
  const statusEl   = document.getElementById("regPhotoUploadStatus");
  const modalEl    = document.getElementById("regPhotoPinModal");
  const pinInput   = document.getElementById("regPhotoPinInput");
  const pinSubmit  = document.getElementById("regPhotoPinSubmit");
  const pinError   = document.getElementById("regPhotoPinError");
  if (!lockedBox || !uploadBox || !modalEl) return;

  const modal = new bootstrap.Modal(modalEl);

  function unlock(pinValue){
    lockedBox.style.display = "none";
    uploadBox.style.display = "block";
    sessionStorage.setItem("regPhotoPinOk", "1"); // একই ব্রাউজার সেশনে বারবার PIN চাইবে না
    if (pinValue) sessionStorage.setItem("regPhotoPin", pinValue); // আপলোড রিকোয়েস্টে পাঠানোর জন্য লাগবে
  }

  // আগেই এই সেশনে আনলক করা থাকলে সরাসরি আপলোড বক্স দেখাও
  if (sessionStorage.getItem("regPhotoPinOk") === "1") unlock();

  unlockBtn?.addEventListener("click", () => {
    pinError.style.display = "none";
    pinInput.value = "";
    modal.show();
    setTimeout(() => pinInput.focus(), 300);
  });

  async function checkPin(){
    const entered = (pinInput.value || "").trim();
    if (!entered) return;
    pinSubmit.disabled = true;
    pinSubmit.innerHTML = `<span class="spin"></span> চেক হচ্ছে...`;
    try{
      const rows = await fetchSheet(AUTH_CSV_URL);
      const validPins = rows.map(r => (r.pin || "").trim()).filter(Boolean);
      if (validPins.includes(entered)){
        modal.hide();
        unlock(entered);
      } else {
        pinError.textContent = "ভুল PIN, আবার চেষ্টা করো।";
        pinError.style.display = "block";
      }
    }catch(e){
      console.error(e);
      pinError.textContent = "PIN যাচাই করা যায়নি — একটু পর আবার চেষ্টা করো।";
      pinError.style.display = "block";
    }finally{
      pinSubmit.disabled = false;
      pinSubmit.innerHTML = `<i class="bi bi-unlock-fill me-1"></i> আনলক করো`;
    }
  }

  pinSubmit?.addEventListener("click", checkPin);
  pinInput?.addEventListener("keydown", (e) => { if (e.key === "Enter"){ e.preventDefault(); checkPin(); } });

  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const pin = sessionStorage.getItem("regPhotoPin") || "";

    statusEl.innerHTML = `<span class="spin"></span> আপলোড হচ্ছে...`;
    fileInput.disabled = true;
    try{
      const result = await uploadImageViaScript({ file, pin, target: "friends" });
      if (result.status !== "ok" || !result.url){
        throw new Error(result.message || "আপলোড ব্যর্থ হয়েছে।");
      }
      photoInput.value = result.url;
      statusEl.innerHTML = `✅ আপলোড হয়ে গেছে, লিংক অটো বসে গেছে।`;
    }catch(err){
      console.error(err);
      statusEl.innerHTML = `<span class="text-danger">${err.message || "আপলোড ব্যর্থ হয়েছে, একটু পর আবার চেষ্টা করো।"}</span>`;
    }finally{
      fileInput.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initRegisterPhotoUpload();

  const form = document.getElementById("registerForm");
  if (!form) return;

  const statusEl = document.getElementById("registerStatus");
  const submitBtn = document.getElementById("registerSubmitBtn");

  // ফর্মের সব ফিল্ড বাধ্যতামূলক — নাম ধরে ধরে বাংলা লেবেল, ভ্যালিডেশন এরর দেখানোর জন্য
  const REQUIRED_FIELDS = [
    ["name", "নাম"],
    ["birthday", "জন্ম তারিখ"],
    ["group", "গ্রুপ / শাখা"],
    ["position", "পেশা / অবস্থান"],
    ["location", "এলাকা"],
    ["photo", "ছবির ফাইলের নাম বা লিংক"],
    ["phone", "ফোন নম্বর"],
    ["email", "ইমেইল"],
    ["whatsapp", "WhatsApp নম্বর"],
    ["facebook", "Facebook লিংক"],
    ["instagram", "Instagram লিংক"],
  ];

  function showStatus(msg, isError){
    statusEl.style.display = "block";
    statusEl.innerHTML = msg;
    statusEl.style.borderColor = isError ? "var(--red)" : "var(--line)";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    const missing = REQUIRED_FIELDS.filter(([key]) => !data[key] || !data[key].trim());
    if (missing.length){
      showStatus(`এই তথ্যগুলো অবশ্যই দিতে হবে: <b>${missing.map(([,label]) => label).join(", ")}</b>`, true);
      const firstInput = form.querySelector(`[name="${missing[0][0]}"]`);
      if (firstInput) firstInput.focus();
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim())){
      showStatus("সঠিক ইমেইল ঠিকানা দাও।", true);
      form.querySelector('[name="email"]').focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spin"></span> জমা হচ্ছে...`;

    try{
      await submitToSheet("Friends", data);
      form.reset();
      showStatus(`🎉 ধন্যবাদ, <b>${data.name}</b>! তোমার তথ্য জমা হয়ে গেছে। অ্যাডমিন রিভিউ করে অ্যাপ্রুভ করলে তোমার প্রোফাইল এই পাতায় দেখাবে।`, false);
    }catch(err){
      console.error(err);
      showStatus("দুঃখিত, জমা দেওয়া যায়নি। একটু পর আবার চেষ্টা করো, অথবা অ্যাডমিনকে জানাও।", true);
    }finally{
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="bi bi-send me-1"></i> জমা দাও`;
    }
  });
});
