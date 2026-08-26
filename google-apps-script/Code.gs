/**
 * SSC ব্যাচ ২০১৫ ওয়েবসাইট — শেয়ার্ড ফর্ম হ্যান্ডলার
 * ------------------------------------------------------------
 * এই স্ক্রিপ্টটা friends.html-এর রেজিস্ট্রেশন ফর্ম, tools.html-এর
 * গ্রুপ পোল, আর tools.html-এর ব্যাচ ওয়াল — তিনটা থেকেই POST রিকোয়েস্ট
 * নিয়ে সংশ্লিষ্ট Google Sheet ট্যাবে row যোগ/আপডেট করে।
 *
 * কীভাবে বসাবে:
 * ১) যে Google Sheet-টা Friends ডেটার জন্য ব্যবহার করছো (config.js-এর
 *    FRIENDS_SHEET_ID), সেটা খোলো।
 * ২) মেনু থেকে Extensions → Apps Script খোলো।
 * ৩) ডিফল্ট কোড মুছে এই পুরো ফাইলটা পেস্ট করো, সেভ করো।
 * ৪) Deploy → Manage deployments → পুরনো deployment-এর পাশে ✏️ (Edit) আইকনে
 *    ক্লিক করো → Version → "New version" সিলেক্ট করে "Deploy" করো।
 *    (এটা করলে আগের SUBMIT_SCRIPT_URL অপরিবর্তিত থাকবে, নতুন করে config.js
 *    বদলাতে হবে না। একদম নতুন deployment বানালে URL বদলে যাবে।)
 *
 * নিরাপত্তা নোট: এই এন্ডপয়েন্ট পাবলিক (Anyone) — এটা normal, কারণ পাবলিক ফর্ম
 * সাবমিশনের জন্যই এটা দরকার। Friends ডেটা তবুও Status=1 না করা পর্যন্ত
 * সাইটে পাবলিকলি দেখাবে না (friends.js দেখো)।
 */

// প্রতিটা ট্যাবের জন্য প্রত্যাশিত কলাম অর্ডার — ট্যাব প্রথমবার তৈরি হওয়ার সময় হেডার বসাতে ব্যবহার হয়
const SHEET_SCHEMAS = {
  "Friends": ["Name","Photo","Position","Location","Phone","Email","Facebook","Instagram","Whatsapp","Group","Birthday","Status","Timestamp"],
  "PollVotes": ["Name","Choice","Timestamp"],
  "Wall": ["Name","Message","Timestamp"],
  "Gallery": ["Name","PhotoUrl","Caption","Tag","Status","Timestamp"],
};

// এই ট্যাবগুলোতে "Name" কলাম অনুযায়ী ইউনিক রাখা হবে — একই নামে দ্বিতীয়বার
// সাবমিট করলে নতুন row যোগ না হয়ে আগের row-টাই আপডেট (ওভাররাইট) হয়ে যাবে।
// এভাবে কেউ ভোট পরিবর্তন করলে Sheet-এ ডুপ্লিকেট row জমা হয় না।
const UNIQUE_BY_NAME_SHEETS = ["PollVotes"];

function doPost(e) {
  // একসাথে একাধিক রিকোয়েস্ট এলে (দুইজন একসাথে ভোট দিলে, বা ডাবল-ট্যাপে)
  // একটার পর একটা প্রসেস হবে — এতে UNIQUE_BY_NAME_SHEETS-এ ডুপ্লিকেট row
  // জমা হওয়ার race condition আটকানো যায়।
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const params = e.parameter;

    // ছবি আপলোড (Cloudinary সাইনড আপলোড, সার্ভার-সাইড থেকে) — আলাদা action,
    // Sheet-এ সরাসরি row লেখার সাধারণ ফ্লো থেকে আলাদা করা হয়েছে
    if (params.action === "uploadImage") {
      return handleImageUpload(params);
    }

    const sheetName = params.sheetName;
    if (!sheetName) {
      return jsonOut({ status: "error", message: "sheetName missing" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      const headers = SHEET_SCHEMAS[sheetName] ||
        Object.keys(params).filter(k => k !== "sheetName").concat(["Timestamp"]);
      sheet.appendRow(headers);
    }

    const lastCol = Math.max(sheet.getLastColumn(), 1);
    const headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    const row = headerRow.map(h => {
      const key = (h || "").toString().trim();
      if (key.toLowerCase() === "timestamp") return new Date();
      const matchKey = Object.keys(params).find(k => k.toLowerCase() === key.toLowerCase());
      return matchKey ? params[matchKey] : "";
    });

    // "Name" কলাম অনুযায়ী ইউনিক রাখতে হয় এমন শিট হলে, আগে থেকে একই নামে
    // (case-insensitive) কোনো row থাকলে সেটা খুঁজে বের করে আপডেট করি — নতুন row না।
    if (UNIQUE_BY_NAME_SHEETS.indexOf(sheetName) !== -1) {
      const nameColIdx = headerRow.findIndex(h => (h || "").toString().trim().toLowerCase() === "name");
      if (nameColIdx !== -1 && params.name) {
        const newName = params.name.toString().trim().toLowerCase();
        const lastRow = sheet.getLastRow();
        if (lastRow >= 2) {
          const existingNames = sheet.getRange(2, nameColIdx + 1, lastRow - 1, 1).getValues();
          for (let i = 0; i < existingNames.length; i++) {
            const cellName = (existingNames[i][0] || "").toString().trim().toLowerCase();
            if (cellName && cellName === newName) {
              const targetRow = i + 2; // হেডার রো ধরে অফসেট
              sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
              return jsonOut({ status: "ok", updated: true });
            }
          }
        }
      }
    }

    sheet.appendRow(row);
    return jsonOut({ status: "ok", updated: false });
  } catch (err) {
    return jsonOut({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return jsonOut({ status: "ok", message: "SSC 2015 form handler is running." });
}

/**
 * ছবি আপলোড হ্যান্ডলার — গ্যালারি পাতার PIN-গেটেড ফর্ম থেকে আসা রিকোয়েস্ট।
 * ব্রাউজার থেকে সরাসরি Cloudinary-তে সাইনড আপলোড করা যায় (CORS আছে), কিন্তু
 * signature বানাতে API Secret লাগে — সেটা ব্রাউজারে রাখা যাবে না বলে আপলোডটা
 * এখানেই সার্ভার-সাইডে হয়। ব্রাউজার শুধু ছবি + PIN পাঠায়।
 *
 * সেটআপ (একবারই):
 * ১) https://console.cloudinary.com -এ লগইন করে Dashboard থেকে Cloud name,
 *    API Key, API Secret তিনটাই কপি করো (Settings → API Keys)।
 * ২) Apps Script এডিটরে ⚙️ Project Settings → Script Properties →
 *    "Add script property" — এই তিনটা আলাদা করে যোগ করো:
 *    CLOUDINARY_CLOUD_NAME   Value: <তোমার cloud name, যেমন h4ugdxfw>
 *    CLOUDINARY_API_KEY      Value: <তোমার API Key>
 *    CLOUDINARY_API_SECRET   Value: <তোমার API Secret>
 *    ⚠️ বিশেষ করে API_SECRET কখনো Google Sheet-এ, config.js-এ, বা GitHub-এ
 *    বসিও না — শুধু Script Properties-এই রাখো, এটা শুধু এই স্ক্রিপ্ট নিজে
 *    পড়তে পারে, ব্রাউজার/ইউজার কেউ না। (আগে imgtree.co API key যেভাবে
 *    রাখতে, ঠিক সেভাবেই — শুধু এখন তিনটা ভ্যালু।)
 */
function handleImageUpload(params) {
  const pin = (params.pin || "").toString().trim();
  if (!isValidPin(pin)) {
    return jsonOut({ status: "error", message: "ভুল PIN।" });
  }

  const props = PropertiesService.getScriptProperties();
  const cloudName = props.getProperty("CLOUDINARY_CLOUD_NAME");
  const apiKey = props.getProperty("CLOUDINARY_API_KEY");
  const apiSecret = props.getProperty("CLOUDINARY_API_SECRET");
  if (!cloudName || !apiKey || !apiSecret) {
    return jsonOut({ status: "error", message: "সার্ভারে CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET — এই তিনটা Script Properties সেট করা হয়নি।" });
  }

  const base64 = params.file_base64;
  if (!base64) {
    return jsonOut({ status: "error", message: "কোনো ছবি পাওয়া যায়নি।" });
  }
  const contentType = params.contentType || "image/jpeg";

  // Cloudinary সাইনড আপলোডের নিয়ম: file/api_key/signature বাদে বাকি সব
  // পাঠানো প্যারামিটার alphabetically সাজিয়ে "key=value&key=value..." বানিয়ে
  // তার শেষে API Secret জুড়ে SHA-1 হ্যাশ করলেই signature পাওয়া যায়।
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "ssc2015-gallery";
  const paramsToSign = { folder: folder, timestamp: timestamp };

  const toSign = Object.keys(paramsToSign)
    .sort()
    .map(k => k + "=" + paramsToSign[k])
    .join("&");

  const signatureBytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_1,
    toSign + apiSecret
  );
  const signature = signatureBytes
    .map(b => ((b < 0 ? b + 256 : b).toString(16)).padStart(2, "0"))
    .join("");

  const dataUri = "data:" + contentType + ";base64," + base64;

  const resp = UrlFetchApp.fetch(
    "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload",
    {
      method: "post",
      payload: {
        file: dataUri,
        api_key: apiKey,
        timestamp: String(timestamp),
        signature: signature,
        folder: folder,
      },
      muteHttpExceptions: true,
    }
  );

  let body;
  try { body = JSON.parse(resp.getContentText() || "{}"); } catch (e) { body = {}; }

  if (resp.getResponseCode() !== 200 || !body.secure_url) {
    const errMsg = (body.error && body.error.message) || resp.getContentText();
    return jsonOut({ status: "error", message: "Cloudinary আপলোড ব্যর্থ: " + errMsg });
  }

  const directUrl = body.secure_url;

  // target=friends → এটা friends.html-এর রেজিস্ট্রেশন ফর্মের ছবি ফিল্ড থেকে
  // আসা আপলোড, শুধু আপলোড করা ছবির URL ফেরত দিলেই হবে — ফর্মটা নিজে থেকেই
  // পুরো row (নাম, ফোন, ইমেইল ইত্যাদিসহ) আলাদাভাবে "Friends" শিটে জমা দেয়,
  // তাই এখানে Gallery শিটে কিছু লেখার দরকার নেই।
  const target = (params.target || "gallery").toString().trim().toLowerCase();
  if (target === "friends") {
    return jsonOut({ status: "ok", url: directUrl });
  }

  // ডিফল্ট (target=gallery বা অনুল্লিখিত) — আগের মতোই Gallery ট্যাবে row যোগ করি।
  // Status খালি রাখি, অ্যাডমিন Sheet-এ গিয়ে Status = 1 করলে তবেই ছবিটা সবার
  // কাছে দেখাবে (friends.html-এর মতোই)
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Gallery");
  if (!sheet) {
    sheet = ss.insertSheet("Gallery");
    sheet.appendRow(SHEET_SCHEMAS["Gallery"]);
  }
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const rowData = {
    name: params.name || "",
    photourl: directUrl,
    caption: params.caption || "",
    tag: params.tag || "",
    status: "", // ইচ্ছাকৃতভাবে খালি — ম্যানুয়াল অ্যাপ্রুভালের জন্য
  };
  const row = headerRow.map(h => {
    const key = (h || "").toString().trim().toLowerCase();
    if (key === "timestamp") return new Date();
    return Object.prototype.hasOwnProperty.call(rowData, key) ? rowData[key] : "";
  });
  sheet.appendRow(row);

  return jsonOut({ status: "ok", url: directUrl });
}

/** Auth ট্যাবের "PIN" কলামের যেকোনো একটা রো-এর সাথে মিলছে কিনা চেক করে */
function isValidPin(pin) {
  if (!pin) return false;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Auth");
  if (!sheet) return false;
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const pinColIdx = headerRow.findIndex(h => (h || "").toString().trim().toLowerCase() === "pin");
  if (pinColIdx === -1) return false;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  const pins = sheet.getRange(2, pinColIdx + 1, lastRow - 1, 1).getValues();
  return pins.some(r => (r[0] || "").toString().trim() === pin);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


function testAuth() {
  const resp = UrlFetchApp.fetch("https://api.cloudinary.com");
  Logger.log(resp.getResponseCode());
}