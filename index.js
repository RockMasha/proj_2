let enterStr = "";
let indexNow = -1;
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
  if (
    (checked(element) && checked(enterStr[enterStr.length - 1])) ||
    (checked(element) && enterStr === "")
  ) {
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
      pressDoubleZero();
      break;
  }
  if (checked(element)) {
    pressOperation();
  }

  if (!root.equals.hasAttribute("hidden")) {
    changeEquals();
  }
  indexNow += 1;
  enterStr += element;
  root.fieldResult.innerHTML = enterStr;
}

// Функції першої Вкладеності -----------------------------------------------------

function pressDoubleZero() {
  indexNow += 1;
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
  if (enterStr[indexNow] === ".") {
    enterStr = enterStr.split("");
    enterStr.pop();
    enterStr = enterStr.join("");
    indexNow -= 1;
  }
}

function pressEquals() {
  let result;
  let processingStr = enterStr;
  if (enterStr.includes("×")) {
    processingStr = processingStr.replace("×", "*");
  }
  if (enterStr.includes("÷")) {
    processingStr = processingStr.replace("÷", "/");
  }
  result = eval(processingStr).toFixed(10);
  let lineCut;
  result = result
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

// Функції другої вкладеності -----------------------------------------------------

function findPointInNumb() {
  for (let i = 1; !checked(enterStr[indexNow - i]); i += 1) {
    if (indexNow - i === -1) {
      break;
    }
    if (enterStr[indexNow - i] === ".") {
      return true;
    }
  }
}

function changeEquals() {
  if (!root.equals.hasAttribute("hidden")) {
    root.equals.setAttribute("hidden", "");
  } else {
    root.equals.removeAttribute("hidden");
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
