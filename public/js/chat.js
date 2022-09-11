const socket = io();
// const Mustache = require('mus');

//Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocation = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (message) => {
  if (!message) return;

  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("HH:mm"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (location) => {
  const html = Mustache.render(locationTemplate, {
    location: location.text,
    createdAt: moment(location.createdAt).format("HH:mm"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

//Send a message and get ack
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //disable the form
  $messageFormButton.setAttribute("disabled", "disabled");
  $messageFormInput;
  const inputMessage = e.target.elements.message.value;
  socket.emit("clientMessage", inputMessage, (error) => {
    //enable the form
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    console.log(error ? error : "The message was delivered!");
  });
});

//Send location and get ack
$sendLocation.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Not supported");
  }
  $sendLocation.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (error) => {
        $sendLocation.removeAttribute("disabled");
        console.log(error ? error : "Location shared!");
      }
    );
  });
});
