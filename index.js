let enterStr = "";
let indexNow = 0;
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
    indexNow = 0;
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
    result = eval(processingStr).toFixed(10);
    // if (result[result.length - 1] === 0) {
    //   result
    //     .split("")
    //     .filter((item, index) => enterStr[enterStr - index - 1] < 12)
    //     .join("");
    // }
    root.equals.removeAttribute("hidden");
    root.fieldHistory.innerHTML = enterStr; // вивід історії
    root.fieldResult.innerHTML = result;
    enterStr = result;
    indexNow = enterStr.length - 1;
    console.log(indexNow);
    return;
  }
  if (element === ".") {
    if (checked(enterStr[indexNow - 1]) || enterStr.length === 0) {
      enterStr += "0";
      indexNow += 1;
    } else if (findPointInNumb(indexNow)) {
      return;
    }
  }
  if (checked(element)) {
    console.log(indexNow);
    if (enterStr[indexNow - 1] === ".") {
      enterStr = enterStr.split("");
      enterStr.pop();
      enterStr = enterStr.join("");
      indexNow -= 1;
    }
  }
  hiddenEquals();
  indexNow += 1;
  enterStr += element;
  root.equals.setAttribute("hidden", "");
  root.fieldResult.innerHTML = enterStr;
}

function findPointInNumb(indexNow) {
  for (let i = 1; !checked(enterStr[indexNow - i]); i += 1) {
    if (indexNow - i === -1) {
      break;
    }
    if (enterStr[indexNow - i] === ".") {
      return true;
    }
  }
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
    case "×":
      return true;
    case "÷":
      return true;
    default:
      return false;
  }
}
