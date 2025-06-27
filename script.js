import { isLight, setLightTheme, setDarkTheme } from "./theme.js";
import {
  countLetters,
  getLetters,
  getWords,
  excludeSpacesFrom,
  paddStart,
} from "./utilitys.js";

const charCountEl = document.querySelector(".char-count");
const wordCountEl = document.querySelector(".word-count");
const sentCountEl = document.querySelector(".sent-count");
const form = document.querySelector(".form");
const densitysEl = document.querySelector(".density-values");
const inputLimit = document.querySelector(".input-limit");

form.addEventListener("input", () => {
  const formData = new FormData(form);
  const formValues = {
    text: formData.get("text-input"),
    charLimit: +formData.get("input-limit"),
    hasCharLimit: formData.has("char-limit"),
    hasExcludeSpaces: formData.has("exclude-spaces"),
  };

  setCounters(formValues);
  setCharLimit(formValues);
  setReadingTime(formValues);
  setDensityChars(formValues);
});

function setCounters({ text, hasExcludeSpaces }) {
  const charCount = hasExcludeSpaces
    ? excludeSpacesFrom(text).length
    : text.split("").length;
  const wordCount = getWords(text);
  const sentenceCount = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0).length;

  charCountEl.textContent = paddStart(charCount);
  wordCountEl.textContent = paddStart(wordCount);
  sentCountEl.textContent = paddStart(sentenceCount);
}

function setCharLimit({ text, hasCharLimit, charLimit, hasExcludeSpaces }) {
  const textArea = document.querySelector(".analyzer-textarea");

  if (!hasCharLimit) {
    document.querySelector(".alert-limit")?.remove();
    inputLimit.classList.add("invisible");
    textArea.removeAttribute("maxLength");
    textArea.classList.remove("text-area-limit");
    return;
  }
  inputLimit.classList.remove("invisible");
  const currentLength = hasExcludeSpaces
    ? excludeSpacesFrom(text).length
    : text.split("").length;

  textArea.setAttribute("maxLength", charLimit);
  if (currentLength >= charLimit) {
    displayAlert(charLimit);
    textArea.classList.add("text-area-limit");
    return;
  }
  document.querySelector(".alert-limit")?.remove();
  textArea.classList.remove("text-area-limit");
}

const displayAlert = (charLimit) => {
  document.querySelector(".alert-limit")?.remove();
  const alert = `
  <span class="alert-limit txt-4 flex items-center">
    <img src="assets/images/icon-info.svg" alt="" />
    <p>Limit reached! Your text exceedes ${charLimit} characteres</p>
  </span>
  ; 
  `;

  form.children[0].insertAdjacentHTML("afterend", alert);
};

function setReadingTime({ text }) {
  const words = text
    .trim()
    .split(" ")
    .filter((word) => word !== "" && word !== "\n").length;
  const wordsPerMinute = 200;
  const time = Math.ceil(words / wordsPerMinute);
  document.querySelector(".time").textContent = `<${time}`;
}

let expanded = false;
function setDensityChars({ text }) {
  densitysEl.innerHTML = "";

  const letters = getLetters(text);
  const lettersCount = countLetters(letters);
  const entries = Object.entries(lettersCount).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    densitysEl.textContent =
      "No characters found. Start typing to see letter density.";
    updateSeeMoreBtn(false);
    return;
  }

  displayDensitys(expanded ? entries : entries.slice(0, 5), letters.length);
  updateSeeMoreBtn(entries.length > 5);
}

function displayDensitys(entries, totalLen) {
  for (const [char, count] of entries) {
    const percentage = ((count * 100) / totalLen).toFixed(2);
    densitysEl.insertAdjacentHTML(
      "beforeend",
      `
      <article class="density flex txt-4">
        <span class="density-letter">${char}</span>
        <div class="density-bar">
          <div class="density-value" style="width: 0%"></div>
        </div>
        <div class="density-stat">
          <span class="density-count">${String(count).padStart(2, "0")}</span>
          <span class="density-porcentage">(${percentage}%)</span>
        </div>
      </article>
    `
    );
    const bars = densitysEl.querySelectorAll(".density-value");
    requestAnimationFrame(() => {
      bars[bars.length - 1].style.width = `${percentage}%`;
    });
  }
}

function updateSeeMoreBtn(show) {
  let btn = document.querySelector(".see-more-btn");
  if (!btn && show) {
    btn = document.createElement("button");
    btn.classList.add("see-more-btn", "txt-3");
    btn.textContent = "See more";
    btn.addEventListener("click", handleSeeMoreClick);
    densitysEl.after(btn);
  }
  if (btn && !show) {
    btn.remove();
  }
}

function handleSeeMoreClick() {
  expanded = !expanded;
  setDensityChars({
    text: document.querySelector(".analyzer-textarea").value,
  });
  const btn = document.querySelector(".see-more-btn");
  if (btn) btn.textContent = expanded ? "View less" : "See more";
}
