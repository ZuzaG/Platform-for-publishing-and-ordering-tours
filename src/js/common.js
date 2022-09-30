export function showError(element, txt) {
  element.style.color = "#fc3434";
  element.style.fontSize = "10px";
  element.style.fontWeight = "bold";
  element.innerHTML = txt;
}

export function removeError(element) {
  element.removeAttribute("style");
  element.innerHTML = " ";
}
