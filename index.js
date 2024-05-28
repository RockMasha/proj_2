let enterStr = "";
let processingStr;
const root = {
  interfaceEl: document.querySelector(".interface"),
  fieldResult: document.querySelector(".head-result"),
  fieldHistory: document.querySelector(".head-history"),
  BoxForResult: document.querySelector(".head-flex_box"),
  equals: document.querySelector(".head-equals"),
  checkInput: document.querySelector(".head-theme-change"),
};
root.interfaceEl.addEventListener("click", enterInResult);
function enterInResult(event) {
  if (!event.target.classList.contains("interface-list-item-btn")) {
    return;
  }
  if (root.fieldResult.classList.contains("red")) {
    root.fieldResult.classList.remove("red");
    resetEnter();
  }
  const element = event.target?.dataset?.value;
  switch (element) {
    case "AC":
      resetEnter();
      return;
    case "=":
      TakeAnswer();
      return;
    case ".":
      if (ifNeedPutZeroBeforePoint()) {
        enterStr += "0";
        break;
      }
      if (isPointInNumb()) {
        return;
      }
      break;
    case "00":
      if (ifCanPressDoubleZero()) {
        break;
      }
      return;
    case "0":
      if (ifCanPressZero()) {
        break;
      }
      return;
    case ")":
      if (ifCanPressEndBracket()) {
        break;
      }
      return;
    case "(":
      ifNeedPutMultiplicationBeforeStartBracket();
      break;
    case "+":
    case "\u1C7C":
    case "×":
    case "÷":
      if (IfCanPressOperation(element)) {
        break;
      }
      return;
  }
  if (
    (checkedOperation(enterStr[enterStr.length - 2]) ||
      isBracket(enterStr[enterStr.length - 2])) &&
    enterStr[enterStr.length - 1] === "0" &&
    element !== "." &&
    !checkedOperation(element) &&
    !isBracket(element)
  ) {
    cutLastElem();
  }
  ifLastElemInNumbIsPoint(element);
  if (!(enterStr[enterStr.length - 1] !== ")" || element === ")")) {
    putMultiplicationAfterEndBracket(element);
  }
  if (!root.equals.hasAttribute("hidden")) {
    changeEquals();
  }
  enterStr += element;
  root.fieldResult.textContent = enterStr;
}

function IfCanPressOperation(elem) {
  const lastElem = enterStr[enterStr.length - 1];
  if (
    (enterStr === "" && elem !== "\u1C7C") ||
    (enterStr.length === 1 && lastElem != Number(lastElem))
  ) {
    return false;
  }

  if (
    (lastElem === "(" && elem !== "\u1C7C") ||
    (enterStr[enterStr.length - 2] === "(" &&
      elem !== "\u1C7C" &&
      lastElem != Number(lastElem))
  ) {
    return false;
  }
  if (checkedOperation(lastElem)) {
    cutLastElem();
  }
  return true;
}

function ifNeedPutMultiplicationBeforeStartBracket() {
  const lastElem = enterStr[enterStr.length - 1];
  if (lastElem == Number(lastElem)) {
    enterStr += "×";
  }
  return;
}

function ifCanPressEndBracket() {
  const countDifferenceBracket = countBracket();
  if (countDifferenceBracket <= 0) {
    return false;
  }
  return true;
}

function ifCanPressZero() {
  if (
    isPointInNumb() ||
    findNumbButZeroInNumb() ||
    (enterStr[enterStr.length - 1] !== "0" && enterStr.length !== 0)
  ) {
    return true;
  }
  return false;
}

function ifCanPressDoubleZero() {
  const lastElem = enterStr[enterStr.length - 1];
  if (
    !checkedOperation(lastElem) &&
    !isBracket(lastElem) &&
    (isPointInNumb() ||
      findNumbButZeroInNumb() ||
      (lastElem !== "0" && enterStr.length !== 0))
  ) {
    return true;
  }
  return false;
}

function ifNeedPutZeroBeforePoint() {
  const lastElem = enterStr[enterStr.length - 1];
  return (
    checkedOperation(lastElem) || lastElem === "(" || enterStr.length === 0
  );
}

function TakeAnswer() {
  let result;
  if (checkedOperation(enterStr[enterStr.length - 1])) {
    cutLastElem();
  }
  const numbNotEnough = countBracket();
  for (let i = 0; i < numbNotEnough; i++) {
    enterStr += ")";
  }
  processingStr = enterStr;
  changeOperation("×", "*");
  changeOperation("÷", "/");
  changeOperation("\u1C7C", "-");
  try {
    result = eval(processingStr).toFixed(9);
  } catch {
    error();
    return;
  }
  changeEquals();
  if (result == String(Infinity) || isNaN(result)) {
    error();
    return;
  }
  result = redactResult(result);
  root.fieldHistory.textContent = enterStr;
  root.fieldResult.textContent = result;
  enterStr = result;
  return;
}

function resetEnter() {
  root.fieldResult.textContent = "0";
  root.fieldHistory.textContent = "";
  enterStr = "";
  if (!root.equals.hasAttribute("hidden")) {
    changeEquals();
  }
  return;
}
function ifLastElemInNumbIsPoint(element) {
  if (
    enterStr[enterStr.length - 1] === "." &&
    element !== "." &&
    (isBracket(element) || checkedOperation(element) || enterStr.length === 1)
  ) {
    cutLastElem();
    if (element === "(") {
      enterStr += "×";
    }
  }
}

function putMultiplicationAfterEndBracket(elem) {
  if (!checkedOperation(elem)) {
    enterStr += "×";
  }
  if (elem === ".") {
    enterStr += "0";
  }
  return;
}

function isPointInNumb() {
  for (let i = 0; ; i += 1) {
    const positionElem = enterStr.length - 1 - i;
    if (positionElem <= -1 || checkedOperation(enterStr[positionElem])) {
      return false;
    }
    if (enterStr[positionElem] === ".") {
      return true;
    }
  }
}

function findNumbButZeroInNumb() {
  for (let i = 0; ; i += 1) {
    const positionElem = enterStr.length - 1 - i;
    if (
      !Boolean(positionElem + 1) ||
      checkedOperation(enterStr[positionElem]) ||
      isBracket(enterStr[positionElem])
    ) {
      return false;
    }
    if (enterStr[positionElem] !== "0") {
      return true;
    }
  }
}

function changeOperation(startValue, endValue) {
  if (enterStr.includes(startValue)) {
    processingStr = processingStr.replaceAll(startValue, endValue);
  }
}

function changeEquals() {
  if (!root.equals.hasAttribute("hidden")) {
    root.equals.setAttribute("hidden", "");
  } else {
    root.equals.removeAttribute("hidden");
  }
}

function countBracket() {
  return numbSome("(") - numbSome(")");
}

function redactResult(result) {
  let lineCut;
  return result
    .split("")
    .reverse()
    .filter((item) => {
      if (item !== "0" && item !== ".") {
        lineCut = "YATTA";
      }
      if (item === "." && lineCut !== "YATTA") {
        lineCut = "YATTA";
        return false;
      }
      return lineCut === "YATTA";
    })
    .reverse()
    .join("");
}

function cutLastElem() {
  enterStr = enterStr.split("");
  enterStr.pop();
  enterStr = enterStr.join("");
}

function numbSome(elem) {
  return enterStr.split("").filter((item) => item === elem).length;
}

function checkedOperation(elem) {
  switch (elem) {
    case "+":
      return true;
    case "\u1C7C":
      return true;
    case "×":
      return true;
    case "÷":
      return true;
    default:
      return false;
  }
}

function isBracket(elem) {
  switch (elem) {
    case "(":
      return true;
    case ")":
      return true;
    default:
      return false;
  }
}

function error() {
  root.fieldResult.classList.add("red");
  root.fieldResult.textContent = "ERROR";
  root.fieldHistory.textContent = "";
  enterStr = "";
}

root.fieldHistory.addEventListener("click", enterHistory);
function enterHistory() {
  if (root.fieldHistory.textContent === "") {
    return;
  }
  enterStr = root.fieldHistory.textContent;
  root.fieldResult.textContent = root.fieldHistory.textContent;
  root.fieldHistory.textContent = "";
}

const cssVariableEl = document.querySelector(":root");
root.checkInput.addEventListener("change", changeTheme);
function changeTheme() {
  if (root.checkInput.checked) {
    night();
  } else {
    light();
  }
}

function light() {
  cssVariableEl.style.setProperty("--color-body", "#F66");
  cssVariableEl.style.setProperty("--color-calc", "#fefefe");
  cssVariableEl.style.setProperty("--color-theme", "#a9dcfd");
  cssVariableEl.style.setProperty("--color-sun", "#373737");
  cssVariableEl.style.setProperty("--color-night", "#7b9aae");
  cssVariableEl.style.setProperty("--color-check_span", "#cbeafe");
  cssVariableEl.style.setProperty("--color-history", "rgba(55, 55, 55, 0.5)");
  cssVariableEl.style.setProperty("--color-result", "#373737");
  cssVariableEl.style.setProperty("--color-interface", "#a9dcfd");
  cssVariableEl.style.setProperty("--color-item", "#CBEAFE");
  cssVariableEl.style.setProperty("--color-item-text", "#373737");
  cssVariableEl.style.setProperty("--color-list_operation", "#CBEAFE");
  cssVariableEl.style.setProperty("--color-equals", "rgba(255, 255, 255, 0.3)");
  cssVariableEl.style.setProperty("--color-black-shadow", "#0000000d");
  cssVariableEl.style.setProperty("--color-blue", "#09f");
}

function night() {
  cssVariableEl.style.setProperty("--color-body", "#907");
  cssVariableEl.style.setProperty("--color-calc", "#121212");
  cssVariableEl.style.setProperty("--color-theme", "#1B6A9C");
  cssVariableEl.style.setProperty("--color-sun", "#74A4C2");
  cssVariableEl.style.setProperty("--color-night", "##C9D3DC");
  cssVariableEl.style.setProperty("--color-check_span", "#003661");
  cssVariableEl.style.setProperty("--color-history", "#868686");
  cssVariableEl.style.setProperty("--color-result", "#F9F9F9");
  cssVariableEl.style.setProperty("--color-interface", "#031925");
  cssVariableEl.style.setProperty("--color-item", "#04131C");
  cssVariableEl.style.setProperty("--color-item-text", "#FBFBFB");
  cssVariableEl.style.setProperty("--color-list_operation", "#04131C");
  cssVariableEl.style.setProperty("--color-equals", "#041017");
  cssVariableEl.style.setProperty("--color-black-shadow", "#0000000d");
  cssVariableEl.style.setProperty("--color-blue", "#003661");
}


