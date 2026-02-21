const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const avatarImg = document.getElementById("avatarImg");
const avatarName = document.getElementById("avatarName");

const selectedAvatar = localStorage.getItem("avatar") || "sakhi";

const avatars = {
  sakha: {
    name: "Sakha",
    img: "https://i.imgur.com/3ZQ3Z9v.png"
  },
  sakhi: {
    name: "Sakhi",
    img: "https://i.imgur.com/8Km9tLL.png"
  }
};

avatarImg.src = avatars[selectedAvatar].img;
avatarName.innerText = avatars[selectedAvatar].name;

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const typing = document.createElement("div");
  typing.classList.add("message", "bot");
  typing.innerText = "Typing...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(
      "https://sakha-backend.onrender.com/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      }
    );

    const data = await response.json();

    chatBox.removeChild(typing);
    addMessage(data.reply, "bot");

  } catch (error) {
    chatBox.removeChild(typing);
    addMessage("Server not responding.", "bot");
  }
}
