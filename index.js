let enterStr = "";
const root = {
  interfaceEl: document.querySelector(".interface"),
  fieldResult: document.querySelector(".head-result"),
  fieldHistory: document.querySelector(".head-history"),
  BoxForResult: document.querySelector(".head-flex_box"),
  equals: document.querySelector(".head-equals"),
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
    hiddenEquals();
    return;
  }
  if (element === "=") {
    let result;
    let processingStr = enterStr;
    if (enterStr.includes("×")) {
      processingStr = processingStr.replace("×", "*");
    }
    if (enterStr.includes("÷")) {
      processingStr = processingStr.replace("÷", "/");
    }
    result = String(eval(processingStr))
      .split("")
      .filter((item, index) => index < 12)
      .join("");
    root.equals.removeAttribute("hidden");
    root.fieldHistory.innerHTML = enterStr; // вивід історії
    root.fieldResult.innerHTML = result;
    enterStr = result;
    return;
  }
  if (element === ".") {
  }
  hiddenEquals();
  enterStr += element;
  root.equals.setAttribute("hidden", "");
  root.fieldResult.innerHTML = enterStr;
}

function hiddenEquals() {
  if (!root.equals.hasAttribute("hidden")) {
    root.equals.setAttribute("hidden", "");
  }
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
