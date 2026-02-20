const avatarPlayer = document.getElementById("avatarAnimation");
const avatarNameDisplay = document.getElementById("avatarName");
const chatBox = document.getElementById("chatBox");

const selectedAvatar = localStorage.getItem("avatar") || "sakha";

avatarNameDisplay.innerText =
  selectedAvatar === "sakha" ? "Sakha" : "Sakhi";

// Cartoon Online Animations
const animations = {
  sakha: {
    idle: "https://assets9.lottiefiles.com/packages/lf20_8wREpI.json",
    talk: "https://assets10.lottiefiles.com/packages/lf20_touohxv0.json"
  },
  sakhi: {
    idle: "https://assets3.lottiefiles.com/packages/lf20_khzniaya.json",
    talk: "https://assets10.lottiefiles.com/packages/lf20_touohxv0.json"
  }
};

function loadIdle() {
  avatarPlayer.setAttribute("src", animations[selectedAvatar].idle);
}

function loadTalking() {
  avatarPlayer.setAttribute("src", animations[selectedAvatar].talk);
}

loadIdle();

// TIMER
let timeLeft = 600;
const timerDisplay = document.getElementById("timer");

setInterval(() => {
  if (timeLeft <= 0) return;
  timeLeft--;
  let m = Math.floor(timeLeft / 60);
  let s = timeLeft % 60;
  timerDisplay.innerText = `${m}:${s < 10 ? "0" : ""}${s}`;
}, 1000);

// MESSAGE LIMIT
let messageCount = 0;

function sendMessage() {

  if (messageCount >= 20) {
    addMessage("Daily message limit reached.", "ai");
    return;
  }

  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  addMessage(text, "user");

  if (checkSafety(text)) return;

  messageCount++;

  let response = generateResponse(text);
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

// Safety Override
function checkSafety(text) {
  const risky = ["suicide", "kill myself", "self harm", "die"];
  for (let word of risky) {
    if (text.toLowerCase().includes(word)) {
      addMessage(
        "I'm really sorry you're feeling this way. If you're in India, call KIRAN 1800-599-0019. Are you safe right now?",
        "ai"
      );
      return true;
    }
  }
  return false;
}

// Motivation Logic
function generateResponse(text) {
  if (text.toLowerCase().includes("fail") ||
      text.toLowerCase().includes("tired") ||
      text.toLowerCase().includes("give up")) {

    const examples = [
      "Thomas Edison failed 1000 times before success.",
      "A.P.J. Abdul Kalam faced many setbacks before becoming President.",
      "J.K. Rowling was rejected before publishing Harry Potter."
    ];

    return `I understand it feels tough.\n\nRemember: ${examples[Math.floor(Math.random()*examples.length)]}\n\nTry studying for 15 focused minutes. Small steps matter.`;
  }

  return "Let's break this topic into small steps. What part do you want help with?";
}

// Speech
function speak(text) {
  loadTalking();
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.onend = loadIdle;
  window.speechSynthesis.speak(speech);
}

function toggleMode() {
  document.body.classList.toggle("dark");
}
