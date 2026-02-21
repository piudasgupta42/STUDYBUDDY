// ==============================
// Sakha & Sakhi – Final Working Version
// ==============================

const avatarPlayer = document.getElementById("avatarAnimation");
const avatarNameDisplay = document.getElementById("avatarName");
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const selectedAvatar = localStorage.getItem("avatar") || "sakhi";

if (avatarNameDisplay) {
  avatarNameDisplay.innerText =
    selectedAvatar === "sakha" ? "Sakha" : "Sakhi";
}

// ==============================
// ONLINE CARTOON AVATARS
// ==============================

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
  if (avatarPlayer) {
    avatarPlayer.setAttribute("src", animations[selectedAvatar].idle);
  }
}

function loadTalking() {
  if (avatarPlayer) {
    avatarPlayer.setAttribute("src", animations[selectedAvatar].talk);
  }
}

loadIdle();

// ==============================
// GEMINI BACKEND CALL
// ==============================

async function generateResponse(prompt) {
  try {
    const response = await fetch(
      "https://sakha-backend.onrender.com/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt,
          avatar: selectedAvatar
        })
      }
    );

    const data = await response.json();

    return data.reply || "Let’s keep learning together.";
  } catch (error) {
    console.error("Error:", error);
    return "Connection issue. Please try again.";
  }
}

// ==============================
// SEND BUTTON
// ==============================

if (sendBtn) {
  sendBtn.addEventListener("click", async () => {
    const prompt = userInput.value.trim();
    if (!prompt) return;

    // Show user message
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.innerText = prompt;
    chatBox.appendChild(userMessage);

    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    loadTalking();

    // Get AI reply
    const reply = await generateResponse(prompt);

    loadIdle();

    const aiMessage = document.createElement("div");
    aiMessage.className = "ai-message";
    aiMessage.innerText = reply;
    chatBox.appendChild(aiMessage);

    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
