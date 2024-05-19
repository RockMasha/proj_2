let enterStr = "";
let processingStr;
const root = {
  interfaceEl: document.querySelector(".interface"),
  fieldResult: document.querySelector(".head-result"),
  fieldHistory: document.querySelector(".head-history"),
  BoxForResult: document.querySelector(".head-flex_box"),
  equals: document.querySelector(".head-equals"),
};
root.interfaceEl.addEventListener("click", enterInResult);
function enterInResult(event) {
  if (!event.target.classList.contains("interface-list-item-btn")) {
    return;
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
  ifLastElemInNumbIsPoint(element);
  if (!(enterStr[enterStr.length - 1] !== ")" || element === ")")) {
    putMultiplicationAfterEndBracket(element);
  }
  if (
    (checkedOperation(enterStr[enterStr.length - 2]) ||
      isBracket(enterStr[enterStr.length - 2])) &&
    enterStr[enterStr.length - 1] === "0"
  ) {
    cutLastElem();
  }
  if (!root.equals.hasAttribute("hidden")) {
    changeEquals();
  }
  enterStr += element;
  root.fieldResult.innerHTML = enterStr;
}

// Функції першої Вкладеності -----------------------------------------------------

function IfCanPressOperation(elem) {
  if (enterStr === "") {
    return false;
  }
  const lastElem = enterStr[enterStr.length - 1];
  if (
    (lastElem === "(" && elem !== "\u1C7C") ||
    (enterStr[enterStr.length - 2] === "(" && elem !== "\u1C7C")
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
  } catch (error) {
    console.log(error);
    return;
  }
  result = redactResult(result);
  changeEquals();
  root.fieldHistory.innerHTML = enterStr; // вивід історії
  root.fieldResult.innerHTML = result;
  enterStr = result;
  return;
}

function resetEnter() {
  root.fieldResult.innerHTML = "0";
  root.fieldHistory.innerHTML = ""; // обнулення історії
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
    if (isBracket(element)) {
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

// Функції другої вкладеності -----------------------------------------------------

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

// Функції третьої порядку

function numbSome(elem) {
  return enterStr.split("").filter((item) => item === elem).length;
}

// Універсальні

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
