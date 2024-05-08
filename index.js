let enterStr = "";
const root = {
  interfaceEl: document.querySelector(".interface"),
  fieldResult: document.querySelector(".head-result"),
  fieldHistory: document.querySelector(".head-history"),
  BoxForResult: document.querySelector(".head-flex_box"),
};
root.interfaceEl.addEventListener("click", enterInResult);
function enterInResult(event) {
  const pastEl = enterStr[enterStr.length - 1];
  if (!event.target.classList.contains("interface-list-item-btn")) {
    return;
  }
  const element = event.target?.dataset?.value;
  if (
    (checked(element) && checked(pastEl)) ||
    (checked(element) && enterStr === "")
  ) {
    return;
  }
  if (element === "AC") {
    root.fieldResult.innerHTML = "0";
    root.fieldHistory.innerHTML = "";
    enterStr = "";
    return;
  }
  if (element === "=") {
    let result;
    let processingStr;
    if (enterStr.includes("×")) {
      processingStr = enterStr.replace("×", "*");
    }
    if (enterStr.includes("÷")) {
      processingStr = enterStr.replace("÷", "/");
    }
    result = eval(processingStr);
    root.BoxForResult.insertAdjacentHTML(
      "afterbegin",
      `<p class="head-equals">=</p>`
    );
    root.fieldHistory.innerHTML = enterStr; // вивід історії
    root.fieldResult.innerHTML = result;
    enterStr = result;
    return;
  }
  if (element === ".") {
  }
  enterStr += element;
  root.fieldResult.innerHTML = enterStr;
}

function checked(elem) {
  switch (elem) {
    case "+":
      return true;
    case "-":
      return true;
    case "*":
      return true;
    case "÷":
      return true;
    default:
      return false;
  }
}
