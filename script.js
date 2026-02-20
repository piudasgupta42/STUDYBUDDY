// =========================
// SAFE AVATAR LOADER
// =========================

const avatarPlayer = document.getElementById("avatarAnimation");
const avatarNameDisplay = document.getElementById("avatarName");

const selectedAvatar = localStorage.getItem("avatar") || "sakha";
avatarNameDisplay.innerText =
  selectedAvatar === "sakha" ? "Sakha" : "Sakhi";

// SAFE PATH BUILDER
function getPath(type) {
  return "./assets/" + selectedAvatar + "_" + type + ".json";
}

// Load Idle Animation
function loadIdle() {
  const path = getPath("idle");

  avatarPlayer.setAttribute("src", path);

  avatarPlayer.addEventListener("error", () => {
    console.log("Idle animation not found. Loading fallback.");
    avatarPlayer.setAttribute(
      "src",
      "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
    );
  });
}

// Load Talking Animation
function loadTalking() {
  const path = getPath("talk");

  avatarPlayer.setAttribute("src", path);

  avatarPlayer.addEventListener("error", () => {
    console.log("Talk animation not found.");
  });
}

loadIdle();

// =========================
// SPEECH SYSTEM
// =========================

function speak(text) {

  loadTalking();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";

  speech.onend = function () {
    loadIdle();
  };

  window.speechSynthesis.speak(speech);
}

// =========================
// SIMPLE CHAT (TEST)
// =========================

const chatBox = document.getElementById("chatBox");

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const response = "I'm here to support your studies!";
  addMessage(response, "ai");

  speak(response);
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// =========================
// DARK MODE
// =========================

function toggleMode() {
  document.body.classList.toggle("dark");
}
