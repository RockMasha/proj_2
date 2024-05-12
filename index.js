let enterStr = "";
let indexNow = -1;
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
  if (checked(element) && enterStr === "") {
    return;
  }

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
  }
  if (checked(element)) {
    pressOperation();
  }
  checkedOfZeroAfterOperation(element);
  if (!root.equals.hasAttribute("hidden")) {
    changeEquals();
  }
  indexNow += 1;
  enterStr += element;
  root.fieldResult.innerHTML = enterStr;
}

// Функції першої Вкладеності -----------------------------------------------------

function pressZero() {
  if (findPointInNumb()) {
    return true;
  }
  if (findNumbButZeroInNumb() || enterStr[indexNow] !== "0") {
    return true;
  }
  return false;
}

function pressDoubleZero() {
  if (checked(enterStr[enterStr.length - 1])) {
    return false;
  }
  if (findPointInNumb()) {
    indexNow += 1;
    return true;
  }
  if (findNumbButZeroInNumb() || enterStr[indexNow] !== "0") {
    indexNow += 1;
    return true;
  }
  return false;
}

function pressPoint() {
  if (checked(enterStr[indexNow]) || enterStr.length === 0) {
    enterStr += "0";
    indexNow += 1;
    return true;
  }
  if (findPointInNumb()) {
    return false;
  }
  return true;
}

function pressOperation() {
  if (enterStr[indexNow] === "." || checked(enterStr[indexNow])) {
    cutLastElem();
    indexNow -= 1;
  }
}

function pressEquals() {
  let result;
  if (checked(enterStr[enterStr.length - 1])) {
    cutLastElem();
  }
  processingStr = enterStr;
  changeOperation("×", "*");
  changeOperation("÷", "/");
  changeOperation("\u1C7C", "-");
  console.log(enterStr);
  result = eval(processingStr).toFixed(10);
  result = redactResult(result);
  console.log();
  changeEquals();
  root.fieldHistory.innerHTML = enterStr; // вивід історії
  root.fieldResult.innerHTML = result;
  enterStr = result;
  indexNow = enterStr.length - 1;
  return;
}

function pressAC() {
  root.fieldResult.innerHTML = "0";
  root.fieldHistory.innerHTML = "";
  enterStr = "";
  indexNow = -1;
  if (!root.equals.hasAttribute("hidden")) {
    changeEquals();
  }
  return;
}

function checkedOfZeroAfterOperation(element) {
  if (
    (checked(enterStr[enterStr.length - 2]) || enterStr.length === 1) &&
    enterStr[enterStr.length - 1] === "0" &&
    element !== "." &&
    !checked(element)
  ) {
    cutLastElem();
    indexNow -= 1;
  }
}

// Функції другої вкладеності -----------------------------------------------------

function findPointInNumb() {
  for (let i = 1; !checked(enterStr[indexNow - i]); i += 1) {
    if (indexNow - i <= -1) {
      return;
    }
    if (enterStr[indexNow - i] === ".") {
      return true;
    }
  }
}

function findNumbButZeroInNumb() {
  for (let i = 1; !checked(enterStr[indexNow - i]); i += 1) {
    if (indexNow - i <= -1) {
      return false;
    }
    if (enterStr[indexNow - i] !== 0) {
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

function checked(elem) {
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
