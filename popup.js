// Aktif loldle.net sekmesinde çözülmüş cevabı okuyup popup'ta gösterir.
function readAnswers() {
  const first = [...document.querySelectorAll("*")].map((e) => e.__vue__).find(Boolean);
  const out = { champion: null, abilityLetter: null, abilityName: null, bonusState: "none" };
  if (!first) return out;
  let root = first;
  while (root.$parent) root = root.$parent;
  const stack = [root];
  while (stack.length) {
    const vm = stack.pop();
    const d = vm.$data || {};
    if (!out.champion && typeof d.todayAnswerDecrypted === "string") out.champion = d.todayAnswerDecrypted;
    if (!out.abilityLetter && d.abilityLetter) out.abilityLetter = String(d.abilityLetter);
    if (!out.abilityName && d.abilityName) out.abilityName = String(d.abilityName);
    (vm.$children || []).forEach((c) => stack.push(c));
  }
  if (document.querySelector(".letters-container .letter-picker")) {
    out.bonusState = document.querySelector(".letters-container .letter-good, .letters-container .letter-bad")
      ? "answered" : "open";
  }
  return out;
}

// Bonus sorudaki doğru düğmeye tıklar.
function clickBonus(letter) {
  const L = String(letter).toUpperCase();
  const btn = [...document.querySelectorAll(".letters-container .letter-picker")].find((b) => {
    const t = b.textContent.trim().toUpperCase();
    return L === "P" ? /^(P|PASIF|PASİF|PASSIVE)$/.test(t) : t === L;
  });
  if (!btn) return false;
  btn.click();
  return true;
}

// Sistem diline göre metinler (tr ise Türkçe, değilse İngilizce).
const LANG = (navigator.language || "en").toLowerCase().startsWith("tr") ? "tr" : "en";
const T = {
  tr: {
    title: "Günün Cevabı", loading: "Yükleniyor…",
    openTab: "Önce bir loldle.net sekmesi aç.",
    notFound: "Cevap bulunamadı. Sayfa tam yüklendikten sonra tekrar dene.",
    abilityKey: "Yetenek tuşu", answerBonus: "Bonusu cevapla",
    bonusDone: "Bonus soru cevaplandı.",
    bonusLater: "Bonus soru, şampiyonu bulunca açılır.",
    readError: "Sayfa okunamadı: ",
    modes: { classic: "Klasik", quote: "Alıntı", ability: "Yetenek", emoji: "Emoji", splash: "Splash" },
    letters: { P: "Pasif", Q: "Q", W: "W", E: "E", R: "R (Ulti)" }
  },
  en: {
    title: "Today's Answer", loading: "Loading…",
    openTab: "Open a loldle.net tab first.",
    notFound: "Answer not found. Try again after the page fully loads.",
    abilityKey: "Ability key", answerBonus: "Answer bonus",
    bonusDone: "Bonus question answered.",
    bonusLater: "The bonus question unlocks after you find the champion.",
    readError: "Could not read the page: ",
    modes: { classic: "Classic", quote: "Quote", ability: "Ability", emoji: "Emoji", splash: "Splash" },
    letters: { P: "Passive", Q: "Q", W: "W", E: "E", R: "R (Ultimate)" }
  }
}[LANG];
const MODES = T.modes;
const LETTERS = T.letters;
document.documentElement.lang = LANG;
document.getElementById("title").textContent = T.title;
document.getElementById("out").textContent = T.loading;

function show(html) { document.getElementById("out").innerHTML = html; }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

async function load() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !tab.url.startsWith("https://loldle.net/")) {
    show('<div class="info">' + esc(T.openTab) + '</div>');
    return;
  }
  try {
    const [res] = await chrome.scripting.executeScript({
      target: { tabId: tab.id }, world: "MAIN", func: readAnswers
    });
    const a = (res && res.result) || {};
    if (!a.champion) {
      show('<div class="info">' + esc(T.notFound) + '</div>');
      return;
    }
    const path = new URL(tab.url).pathname.replace(/\//g, "");
    const mode = MODES[path] || path || MODES.classic;
    let html = `<div class="row"><div class="mode">${esc(mode)}</div><div class="name">${esc(a.champion)}</div></div>`;
    if (path === "ability" && a.abilityLetter) {
      const key = LETTERS[a.abilityLetter.toUpperCase()] || a.abilityLetter;
      html += `<div class="row"><div class="mode">${esc(T.abilityKey)}</div><div class="name">${esc(key)}</div>`;
      if (a.abilityName) html += `<div class="info">${esc(a.abilityName)}</div>`;
      html += `</div>`;
      if (a.bonusState === "open") {
        html += `<button id="bonus">${esc(T.answerBonus)} (${esc(key)})</button>`;
      } else if (a.bonusState === "answered") {
        html += `<div class="info">${esc(T.bonusDone)}</div>`;
      } else {
        html += `<div class="info">${esc(T.bonusLater)}</div>`;
      }
    }
    show(html);
    const b = document.getElementById("bonus");
    if (b) b.addEventListener("click", async () => {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id }, world: "MAIN", func: clickBonus, args: [a.abilityLetter]
      });
      setTimeout(load, 400);
    });
  } catch (e) {
    show('<div class="info">' + esc(T.readError + e.message) + '</div>');
  }
}
load();
