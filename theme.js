const logos = document.querySelectorAll(".logo");
const iconsTheme = document.querySelectorAll(".theme-icon ");
const body = document.body;
const btnTheme = document.querySelector(".btn-theme");
export let isLight = document.body.classList.contains("light-theme");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") setLightTheme();

btnTheme.addEventListener("click", () => {
  if (!isLight) setLightTheme();
  else setDarkTheme();
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

export function setLightTheme() {
  logos.forEach((logo) => logo.classList.toggle("hidden"));
  body.classList.add("light-theme");
  iconsTheme.forEach((icon) => icon.classList.toggle("hidden"));
  isLight = true;
}
export function setDarkTheme() {
  logos.forEach((logo) => logo.classList.toggle("hidden"));
  body.classList.remove("light-theme");
  iconsTheme.forEach((icon) => icon.classList.toggle("hidden"));
  isLight = false;
}
