import "./../css/common.css";
import "./../css/client.css";
import { showError, removeError } from "./common";

import ExcursionsAPI from "./ExcursionsAPI";

document.addEventListener("DOMContentLoaded", init);

const ulEl = document.querySelector(".panel__excursions");
const propotypeBox = document.querySelector(".excursions__item--prototype");
const api = new ExcursionsAPI();
const list = document.querySelector(".panel__summary");
const form = document.querySelector(".panel__order");
const summaryUl = document.querySelector(".panel__summary");
const summaryPrice = document.querySelector(".order__total-price");
summaryPrice.innerText = "";
let basket = [];

ulEl.addEventListener("click", updateOrder);
list.addEventListener("click", removeLiOrder);
form.addEventListener("submit", valideDataToSendOrder);

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
  ulEl.innerHTML = " ";

  excursionsInnerText(excursionsArr, propotypeBox, ulEl);
}
function excursionsInnerText(excursionsArr, propotypeBox) {
  for (let i = 0; i < excursionsArr.length; i++) {
    const createdTripBox = propotypeBox.cloneNode(true);
    createdTripBox.classList.remove("excursions__item--prototype");
    createdTripBox.querySelector("h2").innerText = excursionsArr[i].title;
    createdTripBox.querySelector("p").innerText = excursionsArr[i].description;
    createdTripBox.querySelector(".excursions__price--adult").innerText =
      excursionsArr[i].priceAdult;
    createdTripBox.querySelector(".excursions__price--child").innerText =
      excursionsArr[i].priceChild;
    ulEl.appendChild(createdTripBox);
  }
}

function fillBasket(title, adultNumber, adultPrice, childNumber, childPrice) {
  this.title = title;
  this.adultNumber = adultNumber;
  this.adultPrice = adultPrice;
  this.childNumber = childNumber;
  this.childPrice = childPrice;
}

function updateOrder(event) {
  event.preventDefault();
  if (
    event.target.className ===
    "excursions__field-input excursions__field-input--submit"
  ) {
    const index = [
      ...document.querySelectorAll(".excursions__field-input--submit"),
    ].indexOf(event.target);

    updateBasket(index);
    changeTotalSum();
    addSummary(index);
    updateAddedTrips(event.target);
  }
}

function updateBasket(index) {
  const ulChild = document.querySelectorAll("li");
  const tripTitle = ulChild[index].querySelector("h2").innerText;
  const noOfAdults = ulChild[index].querySelector("input[name='adults']");
  const adultPrice = ulChild[index].querySelector(
    ".excursions__price--adult"
  ).innerText;
  const noOfChildren = ulChild[index].querySelector("input[name='children']");
  const childPrice = ulChild[index].querySelector(
    ".excursions__price--child"
  ).innerText;

  removeError(noOfAdults.nextElementSibling);
  removeError(noOfChildren.nextElementSibling);

  if (noOfAdults.value < 1 && noOfChildren.value < 1) {
    alert("Sprawdź czy liczba uczestników została wpisana poprawnie!");
  }
  if (isNaN(noOfAdults.value * 1)) {
    showError(noOfAdults.nextElementSibling, "Pole nalezy uzupełnić liczbą");
  }
  if (isNaN(noOfChildren.value * 1)) {
    showError(noOfChildren.nextElementSibling, "Pole nalezy uzupełnić liczbą");
  }
  if (areFormFieldsCorrect(noOfAdults, noOfChildren)) {
    const tripData = new fillBasket(
      tripTitle,
      noOfAdults.value * 1,
      adultPrice,
      noOfChildren.value * 1,
      childPrice
    );
    basket.push(tripData);
  }
}

function areFormFieldsCorrect(noOfAdults, noOfChildren) {
  if (
    !(noOfAdults.value < 1 && noOfChildren.value < 1) &&
    !isNaN(noOfAdults.value * 1) &&
    !isNaN(noOfChildren.value * 1)
  )
    return true;
}

function changeTotalSum() {
  const priceForOneOptionArr = [];
  const totalPrice = document.querySelector(".order__total-price");
  let totalSum = 0;
  for (let i = 0; i < basket.length; i++) {
    let priceForOneOption =
      basket[i].adultNumber * basket[i].adultPrice +
      basket[i].childNumber * basket[i].childPrice;
    if (isNaN(priceForOneOption)) {
      priceForOneOption = 0;
    }
    priceForOneOptionArr.push(priceForOneOption);
    const sum = priceForOneOptionArr.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    totalSum = sum;
  }
  if (totalSum > 0 && basket.length > 0) {
    totalPrice.innerText = "Razem: " + totalSum + "PLN";
  } else {
    totalPrice.innerText = "";
  }
}

function addSummary(i) {
  const summaryLi = document.querySelector(".summary__item--prototype");
  if (basket[i]) {
    const createdLi = summaryLi.cloneNode(true);
    createdLi.classList.remove("summary__item--prototype");
    createdLi.querySelector("span").innerHTML = basket[i].title;
    createdLi.querySelector("strong").innerHTML =
      basket[i].adultNumber * basket[i].adultPrice +
      basket[i].childNumber * basket[i].childPrice +
      "PLN";
    createdLi.querySelector(
      "p"
    ).innerHTML = `dorośli: ${basket[i].adultNumber} x ${basket[i].adultPrice}PLN, dzieci: ${basket[i].childNumber} x ${basket[i].childPrice}PLN`;
    summaryUl.appendChild(createdLi);
  }
}

function removeLiOrder(event) {
  event.preventDefault();
  if (event.target && event.target.nodeName == "BUTTON") {
    event.target.parentNode.parentNode.remove();
    for (let i = 0; i < basket.length; i++) {
      if (
        event.target.previousElementSibling.previousElementSibling.innerText ==
        basket[i].title
      ) {
        basket.splice(i, 1);

        updateAddedTrips(
          document.querySelectorAll(".excursions__field-input--submit")[i]
        );
      }
    }
    changeTotalSum();
  }
}

function updateAddedTrips(eventTarget) {
  if (
    basket.find(
      (trip) =>
        trip.title ===
        eventTarget.parentElement.parentElement.previousElementSibling
          .firstElementChild.innerText
    )
  ) {
    eventTarget.disabled = true;
  } else {
    eventTarget.disabled = false;
  }
}

function valideDataToSendOrder(event) {
  event.preventDefault();
  const nameField = event.target.elements.name;
  const nameFieldText = document.querySelector(".order__error--name");
  const emailField = event.target.elements.email;
  const emailFieldText = document.querySelector(".order__error--email");

  if (nameField.value.length === 0) {
    showError(nameFieldText, "Pole nie zostało uzupełnione");
  } else {
    removeError(nameFieldText);
  }
  if (
    emailField.value.length < 1 ||
    (emailField.value.length > 1 && !emailField.value.includes("@"))
  ) {
    showError(emailFieldText, "Pole nie zostało poprawnie uzupełnione");
  } else {
    removeError(emailFieldText);
  }
  if (
    nameField.value.length > 0 &&
    emailField.value.length > 0 &&
    emailField.value.includes("@")
  ) {
    addOrder();
    setTimeout(() => {
      clearAll();
    }, "300");
  }
}

function takeDataAboutUser() {
  const name = document.querySelector('[name="name"]');
  const email = document.querySelector('[name="email"]');

  return [name.value, email.value];
}

function takeDataAboutTrips() {
  const allTrips = [];

  for (let i = 0; i < basket.length; i++) {
    const { adultNumber, adultPrice, childNumber, childPrice, title } =
      basket[i];

    const tripInfo = {
      adultNumber,
      adultPrice,
      childNumber,
      childPrice,
      title,
    };

    allTrips.push(tripInfo);
  }
  return allTrips;
}

function addOrder() {
  const [name, email] = takeDataAboutUser();

  const selectedTours = takeDataAboutTrips();

  const data = {
    name: name,
    email: email,
    selectedTours: selectedTours,
  };

  sendOrdersToApi(data);
}

function sendOrdersToApi(data) {
  api
    .postOrders(data)
    .then((resp) => console.log(resp))
    .catch((err) => console.error(err));
}

function clearAll() {
  basket = [];
  const allInputs = document.querySelectorAll("input");
  const allButtons = document.querySelectorAll(
    ".excursions__field-input--submit"
  );

  for (let i = 0; i < allInputs.length; i++) {
    if (allInputs[i].type !== "submit") {
      allInputs[i].value = "";
    }
  }
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].disabled = false;
  }
  summaryUl.innerHTML = "";
  summaryPrice.innerHTML = "";
}
