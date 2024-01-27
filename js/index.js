const items = document.querySelectorAll(".item-created");
const viwerBox = document.querySelector("#viwer-box");
const currentItemName = document.querySelector("#current-item");
const pseudoClassesBox = document.querySelector("#pseudo-classes");
let pseudoClasses;
let currentElement = {
  main: null,
  Name: null,
  currentStyle: null,
  temp: null,
};
let pseudoClassesArray = [];
let defaultElement = currentElement;
const pseudos = document.querySelectorAll(".pseudo");
const styleUnits = document.querySelectorAll(".style-unit");
const HTMLCode = document.querySelector("#html-code");
const CSSCode = document.querySelector("#css-code");
const inputsStyle = document.querySelectorAll(".inputs-style");
const mode = document.querySelector("#themeBtn");
const themeColors = document.querySelectorAll(".theme-colors .dropdown-item");
// ###########################################################################
// ###########################################################################
// ###########################################################################
// ###########################################################################
setMode();
setThemeColor();
items.forEach((el) => el.addEventListener("click", (e) => setItem(e.target)));
function setItem(elName) {
  reset();
  switch (getAttrValue(elName, "data-value")) {
    case "Table":
      let myTable = createElement(getAttrValue(elName, "data-value"), true);

      let thead = createElement("thead", true);
      let tbody = createElement("tbody", true);
      let tr = createElement("tr", true);
      for (let i = 0; i < 3; i++) {
        tr.appendChild(createElement("td"));
        thead.appendChild(createElement("th"));
      }
      tbody.appendChild(tr);

      myTable.appendChild(thead);
      myTable.appendChild(tbody);
      viewInHtml(viwerBox, myTable);
      currentElement.main = myTable;
      break;
    default:
      viewInHtml(
        viwerBox,
        (currentElement.main = createElement(
          getAttrValue(elName, "data-value")
        ))
      );
      break;
  }
  currentElement.Name = getAttrValue(elName, "data-value");

  // currentItemName.textContent = currentElement.Name;
  swapName(currentElement.Name);
  setStyleSheets(currentElement.main);
  currentElement.currentStyle = getStyleSheets(currentElement.main);
  // Code(currentElement.currentStyle.cssText, CSSCode);
  setText();
  setTextCode(currentElement.main.parentElement.innerHTML, HTMLCode);
  events();
}
function viewInHtml(viwer, el) {
  // viwer.innerHTML = "";
  viwer.appendChild(el);
}
function createElement(el, empty = false) {
  let element = document.createElement(`${el.toLowerCase()}`);
  if (empty != true) element.textContent = `my${el}`;
  element.className = `my${el}`;
  return element;
}
function setStyle(inp, el, type) {
  if (currentElement.main) {
    if (isNaN(parseInt(inp.value)) == false) {
      el.style[`${type}`] = `${inp.value}${getStyleUnit(inp)}`;
    } else el.style.setProperty(`${type}`, `${inp.value}`);
    setText();
  }
}
function getStyleUnit(element) {
  for (let i = 0; i < styleUnits.length; i++) {
    if (getAttrValue(styleUnits[i], "data-target-connect") == element.id)
      return styleUnits[i].value;
  }
}
function reset() {
  viwerBox.innerHTML = "";
  currentElement = defaultElement;
  CSSCode.textContent = "";
  HTMLCode.textContent = "";
  pseudoClassesArray = [];
  pseudoClassesBox.innerHTML = "";
  pseudos.forEach((ps) => (ps.checked = false));
  resetStyleBoard();
}
function resetStyleBoard() {
  inputsStyle.forEach((is) => {
    if (is.type == "checkbox" || is.type == "radio") is.checked = false;
    else if (is.type == "color") is.value = "#000000";
    else is.value = "";
  });
}
function getAttrValue(el, attr) {
  let str = el.attributes[`${attr}`].value;
  return str.toString();
}
function getStyleSheets(el, pseudoClass = "") {
  let cssRules = document.styleSheets[0].cssRules;
  for (let i = 0; i < cssRules.length; i++) {
    if (cssRules[i].selectorText == `.${el.className}${pseudoClass}`)
      return cssRules[i];
  }
}
function delStyleSheets(el, pseudoClass = "") {
  let cssRules = document.styleSheets[0].cssRules;
  for (let i = 0; i < cssRules.length; i++) {
    if (cssRules[i].selectorText == `.${el.className}${pseudoClass}`)
      document.styleSheets[0].deleteRule(i);
    break;
  }
}
function setStyleSheets(el, pseudoClass = "") {
  document.styleSheets[0].insertRule(`.${el.className}${pseudoClass}{}`, 0);
}

function copyCode(id) {
  if (document.getElementById(id).textContent != "")
    navigator.clipboard.writeText(document.getElementById(id).textContent);
}
function setTextCode(code, textArea) {
  textArea.textContent = code;
}
function createPseudoEl(pName) {
  let ele = document.createElement("span");
  ele.className = "pseudo-class text-capitalize mx-2";
  ele.setAttribute("data-value", `${pName}`);
  ele.id = pName;
  ele.textContent = pName;
  return ele;
}
function setText() {
  CSSCode.textContent = "";
  CSSCode.textContent += `\n${getStyleSheets(currentElement.main).cssText}`;
  for (let i = 0; i < pseudoClassesArray.length; i++) {
    CSSCode.textContent += `\n${
      currentElement[`${pseudoClassesArray[i]}`].cssText
    }`;
  }
}
function swapStyle(chosen) {
  if (currentElement.currentStyle == currentElement[`${chosen}`]) {
    currentElement.currentStyle = currentElement.temp;
    currentElement.temp = null;
    resetStyleBoard();
    swapName(currentElement.Name);
  } else {
    currentElement.temp = currentElement.currentStyle;
    currentElement.currentStyle = currentElement[`${chosen}`];
    swapName(chosen);
  }
}
function swapName(newName) {
  if (currentElement.Name != newName)
    currentItemName.textContent = `${currentElement.Name} \\ ${newName}`;
  else currentItemName.textContent = currentElement.Name;
}
function events() {
  // ----------------------------------------
  // pseudos classes
  pseudos.forEach(
    (el) =>
      (el.onchange = () => {
        if (el.checked) {
          setStyleSheets(currentElement.main, el.name);
          currentElement[`${getAttrValue(el, "data-value")}`] = getStyleSheets(
            currentElement.main,
            el.name
          );
          pseudoClassesArray.push(getAttrValue(el, "data-value"));
          resetStyleBoard();
        } else {
          if (currentElement[`${getAttrValue(el, "data-value")}`] != null) {
            if (
              currentElement[`${getAttrValue(el, "data-value")}`] ==
              currentElement.currentStyle
            )
              swapStyle(getAttrValue(el, "data-value"));

            delStyleSheets(currentElement.main, el.name);
            currentElement[`${getAttrValue(el, "data-value")}`] = null; // should put it in tempMemory
            pseudoClassesArray = pseudoClassesArray.filter(
              (pca) => pca != getAttrValue(el, "data-value")
            );
          }
        }
        setText();
        pseudoClassesBox.innerHTML = "";
        pseudoClassesArray.forEach((pca) =>
          viewInHtml(pseudoClassesBox, createPseudoEl(pca))
        );
        pseudoClasses = pseudoClassesBox.querySelectorAll(".pseudo-class");
        pseudoClasses.forEach((pc) =>
          pc.addEventListener("click", () => {
            swapStyle(getAttrValue(pc, "data-value"));
            if (pc.classList.contains("main-color"))
              pseudoClasses.forEach((pc2) =>
                pc2.classList.remove("main-color")
              );
            else {
              pseudoClasses.forEach((pc2) =>
                pc2.classList.remove("main-color")
              );
              pc.classList.add("main-color");
            }
          })
        );
      })
  );
  //  inputs
  inputsStyle.forEach((el) => {
    const styleType = getAttrValue(el, "data-style-type");
    styleUnits.forEach(
      (su) =>
        (su.onchange = () => {
          inputsStyle.forEach((is) => {
            if (getAttrValue(su, "data-target-connect") == is.id) {
              setStyle(
                is,
                currentElement.currentStyle,
                getAttrValue(is, "data-style-type"),
                su.value
              );
            }
          });
        })
    );
    if (el.type == "color" || el.type == "text" || el.type == "number")
      el.oninput = () => {
        setStyle(el, currentElement.currentStyle, styleType);
        inputsInside =
          el.parentElement.parentElement.querySelectorAll(".inputs-style");
        inputsInside.forEach((inp) => {
          if (
            getAttrValue(el, "data-style-type") ==
              getAttrValue(inp, "data-style-type") &&
            el != inp
          )
            inp.checked = false;
        });
      };
    else if (el.type == "radio")
      el.onchange = () => setStyle(el, currentElement.currentStyle, styleType);
    else
      el.onclick = () => setStyle(el, currentElement.currentStyle, styleType);
  });
  //-----------------------------------------
}

// ================= Themes Functions ===============
themeColors.forEach(
  (tc) => (tc.onclick = () => setThemeColor(getAttrValue(tc, "data-value")))
);
mode.onclick = () => {
  setMode(getAttrValue(mode, "data-value"));
};
function setThemeColor(_COLOR = null) {
  let mainColor = "--blue";
  let mainStyle = document.documentElement.style;
  if (_COLOR) {
    mainColor = _COLOR;
  } else if (localStorage.getItem("themeColor"))
    mainColor = localStorage.themeColor;
  localStorage.setItem("themeColor", `${mainColor}`);
  mainStyle.setProperty("--main-color", `var(${mainColor})`);
}
function setMode(_MODE = null) {
  let currentMode = "light";
  if (_MODE) {
    currentMode = change(_MODE);
    localStorage.setItem("mode", `${currentMode}`);
  } else if (localStorage.getItem("mode"))
    currentMode = localStorage.getItem("mode");
  mode.setAttribute("data-value", `${currentMode}`);
  mode.querySelector("#themeText").textContent = currentMode;
  document
    .querySelector("html")
    .setAttribute("data-bs-theme", `${currentMode}`);
  function change(_MODE_) {
    let modeIcon = mode.querySelector(".mode-icon");
    if (_MODE == "dark") {
      modeIcon.classList.remove("fa-moon");
      modeIcon.classList.add("fa-sun");
      return "light";
    } else {
      modeIcon.classList.remove("fa-sun");
      modeIcon.classList.add("fa-moon");
      return "dark";
    }
  }
}
