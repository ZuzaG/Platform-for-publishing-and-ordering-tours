import "./../css/common.css";
import "./../css/admin.css";
import { showError, removeError } from "./common";

import ExcursionsAPI from "./ExcursionsAPI";

const api = new ExcursionsAPI();
const form = document.querySelector(".form");
const addBtnEl = document.querySelector(".order__field-add");
const ulEl = document.querySelector(".excursions");
const propotypeBox = document.querySelector(".excursions__item--prototype");

document.addEventListener("DOMContentLoaded", init);
addBtnEl.addEventListener("click", addNewExcursion);
ulEl.addEventListener("click", editExcursion);
ulEl.addEventListener("click", removeExcursion);

function init() {
  loadExcursions();
}

function loadExcursions(data) {
  api
    .getExcursion(data)
    .then((data) => createExcursionList(data))
    .catch((err) => console.error(err));
  return data;
}

function createExcursionList(excursionsArr) {
  ulEl.innerHTML = "";

  createExcursionInfo(excursionsArr, propotypeBox);
}

function createExcursionInfo(excursionsArr, propotypeBox) {
  for (let i = 0; i < excursionsArr.length; i++) {
    const createdTripBox = propotypeBox.cloneNode(true);
    createdTripBox.classList.remove("excursions__item--prototype");
    createdTripBox.dataset.id = excursionsArr[i].id;
    createdTripBox.querySelector("h2").innerText = excursionsArr[i].title;
    createdTripBox.querySelector("p").innerText = excursionsArr[i].description;
    createdTripBox.querySelector(".excursions__price--adult").innerText =
      excursionsArr[i].priceAdult;
    createdTripBox.querySelector(".excursions__price--child").innerText =
      excursionsArr[i].priceChild;
    ulEl.appendChild(createdTripBox);
  }
}

function takeInfoFromInputs() {
  const inputs = form.querySelectorAll(".form__field");
  const inputsValuesArr = [];

  for (let i = 0; i < inputs.length; i++) {
    const inputsValues = inputs[i].value;

    if (inputsValues.length < 1) {
      showError(inputs[i].nextElementSibling, "Pole nie została uzupełnione");
    } else {
      inputsValuesArr.push(inputsValues);
      removeError(inputs[i].nextElementSibling);
    }
  }

  return inputsValuesArr;
}

function addNewExcursion(event) {
  event.preventDefault();

  if (takeInfoFromInputs().length == 4) {
    const [title, description, priceAdult, priceChild] = takeInfoFromInputs();

    const data = {
      title: title,
      description: description,
      priceAdult: priceAdult,
      priceChild: priceChild,
    };

    api
      .postExcursion(data)
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
    setTimeout(loadExcursions, 1);
  }
}

function editExcursion(event) {
  event.preventDefault();

  if (
    event.target.classList.value ===
    "excursions__field-input excursions__field-input--update"
  ) {
    const liEL = event.target.parentElement.parentElement.parentElement;
    const elementsToEdit = liEL.querySelectorAll(
      "span, .excursions__title, .excursions__description"
    );
    const isEditable = [...elementsToEdit].every(
      (element) => element.isContentEditable
    );

    const elementsToEditInnerText = Array.from(elementsToEdit).map(
      (x) => x.innerText
    );

    if (isEditable) {
      const id = liEL.dataset.id;
      const [title, description, priceAdult, priceChild] =
        elementsToEditInnerText;

      const data = {
        title: title,
        description: description,
        priceAdult: priceAdult,
        priceChild: priceChild,
      };

      api
        .editExcursion(data, id)
        .then((data) => console.log(data))
        .catch((err) => console.error(err))
        .finally(() => {
          disableEdits(event, elementsToEdit);
        });
    } else {
      enableEdits(event, elementsToEdit);
    }
  }
}

function enableEdits(event, elementsToEdit) {
  event.target.value = "Zapisz";
  elementsToEdit.forEach((element) => (element.contentEditable = true));
}

function disableEdits(event, elementsToEdit) {
  event.target.value = "Edytuj";
  elementsToEdit.forEach((element) => (element.contentEditable = false));
}

function removeExcursion(event) {
  event.preventDefault();

  if (
    event.target.classList.value ===
    "excursions__field-input excursions__field-input--remove"
  ) {
    const liEL = event.target.parentElement.parentElement.parentElement;
    const id = liEL.dataset.id;

    api
      .deleteExcursion(id)
      .then((resp) => console.log(resp))
      .catch((err) => console.error(err))
      .finally(loadExcursions);
  }
}
