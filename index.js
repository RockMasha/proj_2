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
      pressAC();
      return;
    case "=":
      pressEquals();
      return;
    case ".":
      if (pressPoint()) {
        break;
      }
      return;
    case "00":
      if (pressDoubleZero()) {
        break;
      }
      return;
    case "0":
      if (!pressZero()) {
        return;
      }
      break;
    case ")":
      if (!pressEndBracket()) {
        return;
      }
      break;
    case "(":
      pressStartBracket();
      break;
  }
  if (checkedOperation(element)) {
    if (enterStr === "") {
      return;
    }
    pressOperation();
  }
  checkedOfZeroAfterOperation(element);
  putMultiplicationAfterBracketIfFollowedByNumber(element);
  if (!root.equals.hasAttribute("hidden")) {
    changeEquals();
  }
  enterStr += element;
  root.fieldResult.innerHTML = enterStr;
}

// Функції першої Вкладеності -----------------------------------------------------

function pressStartBracket() {
  const lastElem = enterStr[enterStr.length - 1];
  if (lastElem == Number(lastElem)) {
    enterStr += "×";
  }
  return;
}

function pressEndBracket() {
  const countDifferenceBracket = countBracket();
  if (countDifferenceBracket <= 0) {
    return false;
  }

  return true;
}

function pressZero() {
  if (findPointInNumb()) {
    return true;
  }
  if (
    findNumbButZeroInNumb() ||
    (enterStr[enterStr.length - 1] !== "0" && enterStr.length !== 0)
  ) {
    return true;
  }
  return false;
}

function pressDoubleZero() {
  if (checkedOperation(enterStr[enterStr.length - 1])) {
    return false;
  }
  if (findPointInNumb()) {
    return true;
  }
  if (
    findNumbButZeroInNumb() ||
    (enterStr[enterStr.length - 1] !== "0" && enterStr.length !== 0)
  ) {
    return true;
  }
  return false;
}

function pressPoint() {
  const lastElem = enterStr[enterStr.length - 1];
  if (checkedOperation(lastElem) || lastElem === "(" || enterStr.length === 0) {
    enterStr += "0";
    return true;
  }
  if (findPointInNumb()) {
    return false;
  }
  return true;
}

function pressOperation() {
  if (
    enterStr[enterStr.length - 1] === "." ||
    checkedOperation(enterStr[enterStr.length - 1])
  ) {
    cutLastElem();
  }
}

function pressEquals() {
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
    result = eval(processingStr).toFixed(10);
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

function pressAC() {
  root.fieldResult.innerHTML = "0";
  root.fieldHistory.innerHTML = ""; // обнулення історії
  enterStr = "";
  if (!root.equals.hasAttribute("hidden")) {
    changeEquals();
  }
  return;
}

function checkedOfZeroAfterOperation(element) {
  if (
    (checkedOperation(enterStr[enterStr.length - 2]) ||
      enterStr.length === 1) &&
    enterStr[enterStr.length - 1] === "0" &&
    element !== "." &&
    !checkedOperation(element)
  ) {
    cutLastElem();
  }
}

function putMultiplicationAfterBracketIfFollowedByNumber(elem) {
  if (enterStr[enterStr.length - 1] === ")" && !checkedOperation(elem)) {
    enterStr += "×";
  }
  return;
}

// Функції другої вкладеності -----------------------------------------------------

function findPointInNumb() {
  for (
    let i = 1;
    !checkedOperation(enterStr[enterStr.length - 1 - i]);
    i += 1
  ) {
    const positionElem = enterStr.length - 1 - i;
    if (positionElem <= -1) {
      return;
    }
    if (enterStr[positionElem] === ".") {
      return true;
    }
  }
}

function findNumbButZeroInNumb() {
  for (
    let i = 1;
    !checkedOperation(enterStr[enterStr.length - 1 - i]);
    i += 1
  ) {
    const positionElem = enterStr.length - 1 - i;
    if (positionElem <= -1) {
      return false;
    }
    if (enterStr[positionElem] !== 0) {
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

// Функції третьої функції

function numbSome(elem) {
  return enterStr.split("").filter((item) => item === elem).length;
}
