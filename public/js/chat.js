const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $buttonSendLocation = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const urlTemplate = document.querySelector("#url-template").innerHTML;
const sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (message) => {
  const htmlFromTemplate = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", htmlFromTemplate);
});

socket.on("locationMessage", (locationMessage) => {
  const htmlFromTemplate = Mustache.render(urlTemplate, {
    username: locationMessage.username,
    url: locationMessage.location,
    createdAt: moment(locationMessage.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", htmlFromTemplate);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // $messageFormButton.setAttribute('disabled', 'disabled')
  $messageFormButton.disabled = true;
  const message = e.target.elements.message.value;
  socket.emit("messageSent", message, (error) => {
    // $messageFormButton.removeAttribute('disabled')
    $messageFormButton.disabled = false;
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return error;
    }
  });
});

$buttonSendLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  $buttonSendLocation.disabled = true;
  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    socket.emit("sendLocation", location, (acknowledged) => {
      $buttonSendLocation.disabled = false;
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
