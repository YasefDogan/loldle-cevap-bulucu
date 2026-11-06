// LoLdle Günün Cevabı — sayfadaki Vue bileşenlerinden çözülmüş cevabı okur.
(function () {
  const BOX_ID = "loldle-cevap-kutu";
  // Sistem diline göre metinler (tr ise Türkçe, değilse İngilizce).
  const LANG = (navigator.language || "en").toLowerCase().startsWith("tr") ? "tr" : "en";
  const T = {
    tr: {
      toggle: "Tıkla: göster / gizle", searching: "Cevap aranıyor…",
      reveal: "👁 Günün cevabını göster", answer: "Cevap", key: "Tuş",
      answerBonus: "Bonusu cevapla", bonusDone: "Bonus soru cevaplandı.",
      letters: { P: "Pasif", Q: "Q", W: "W", E: "E", R: "R (Ulti)" }
    },
    en: {
      toggle: "Click: show / hide", searching: "Looking for the answer…",
      reveal: "👁 Show today's answer", answer: "Answer", key: "Key",
      answerBonus: "Answer bonus", bonusDone: "Bonus question answered.",
      letters: { P: "Passive", Q: "Q", W: "W", E: "E", R: "R (Ultimate)" }
    }
  }[LANG];
  const LETTERS = T.letters;
  let revealed = false;

  function readAnswers() {
    const first = [...document.querySelectorAll("*")].map((e) => e.__vue__).find(Boolean);
    const out = { champion: null, abilityLetter: null, abilityName: null };
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
    return out;
  }

  // Bonus sorudaki doğru tuş düğmesini bulur.
  function findBonusButton(letter) {
    if (!letter) return null;
    const L = letter.toUpperCase();
    const pickers = [...document.querySelectorAll(".letters-container .letter-picker")];
    return pickers.find((b) => {
      const t = b.textContent.trim().toUpperCase();
      return L === "P" ? /^(P|PASIF|PASİF|PASSIVE)$/.test(t) : t === L;
    }) || null;
  }

  function bonusAnswered() {
    return !!document.querySelector(".letters-container .letter-good, .letters-container .letter-bad");
  }

  function render() {
    const a = readAnswers();
    let box = document.getElementById(BOX_ID);
    if (!box) {
      box = document.createElement("div");
      box.id = BOX_ID;
      Object.assign(box.style, {
        position: "fixed", top: "12px", right: "12px", zIndex: 999999,
        background: "rgba(10,20,40,0.92)", color: "#f0e6d2",
        border: "1px solid #c8aa6e", borderRadius: "8px",
        padding: "10px 14px", font: "14px/1.4 sans-serif",
        cursor: "pointer", minWidth: "140px", userSelect: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
      });
      box.title = T.toggle;
      box.addEventListener("click", (e) => {
        if (e.target.dataset.bonus) return;
        revealed = !revealed;
        render();
      });
      document.body.appendChild(box);
    }

    const btn = findBonusButton(a.abilityLetter);
    if (btn) {
      // Cevap açıkken doğru düğmeyi altın çerçeveyle işaretle.
      btn.style.outline = revealed && !bonusAnswered() ? "3px solid #f0c040" : "";
      btn.style.outlineOffset = "2px";
    }

    if (!a.champion) { box.textContent = T.searching; return; }
    if (!revealed) { box.textContent = T.reveal; return; }

    box.innerHTML = "";
    const addRow = (label, value) => {
      const row = document.createElement("div");
      const b = document.createElement("b");
      b.textContent = value;
      row.textContent = label + ": ";
      row.appendChild(b);
      box.appendChild(row);
    };
    addRow(T.answer, a.champion);
    if (location.pathname.startsWith("/ability") && a.abilityLetter) {
      const key = LETTERS[a.abilityLetter.toUpperCase()] || a.abilityLetter;
      addRow(T.key, key + (a.abilityName ? " — " + a.abilityName : ""));

      if (btn && !bonusAnswered()) {
        const go = document.createElement("button");
        go.textContent = T.answerBonus + " (" + key + ")";
        go.dataset.bonus = "1";
        Object.assign(go.style, {
          marginTop: "8px", padding: "4px 10px", cursor: "pointer",
          background: "#c8aa6e", color: "#0a1428", border: "none",
          borderRadius: "4px", fontWeight: "bold"
        });
        go.addEventListener("click", () => { btn.click(); setTimeout(render, 300); });
        box.appendChild(go);
      } else if (btn && bonusAnswered()) {
        const done = document.createElement("div");
        done.style.cssText = "color:#a09b8c;font-size:12px;margin-top:4px";
        done.textContent = T.bonusDone;
        box.appendChild(done);
      }
    }
  }

  // Site tek sayfa uygulaması; mod değişince yeniden kontrol et.
  setInterval(render, 1000);
  render();
})();
