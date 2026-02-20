const chatBox = document.getElementById("chatBox");
const avatarName = document.getElementById("avatarName");

let messageCount = 0;
let timeLeft = 600; // 10 minutes

const selectedAvatar = localStorage.getItem("avatar") || "Sakha";
avatarName.innerText = selectedAvatar;

startTimer();

function startTimer(){
  const timer = document.getElementById("timer");
  const interval = setInterval(() => {
    timeLeft--;
    let minutes = Math.floor(timeLeft/60);
    let seconds = timeLeft%60;
    timer.innerText = `${minutes}:${seconds < 10 ? '0':''}${seconds}`;

    if(timeLeft <= 0){
      clearInterval(interval);
      alert("Session ended for today.");
      disableChat();
    }
  },1000);
}

function disableChat(){
  document.getElementById("userInput").disabled = true;
}

async function sendMessage(){
  if(messageCount >= 20){
    alert("Message limit reached.");
    return;
  }

  const input = document.getElementById("userInput");
  const text = input.value;
  if(!text) return;

  if(checkSafety(text)) return;

  addMessage(text,"user");
  input.value = "";
  messageCount++;

  const aiResponse = await fetchAI(text);
  addMessage(aiResponse,"ai");
  speak(aiResponse);
}

function addMessage(text,type){
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchAI(prompt){
  try{
    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-base",{
      method:"POST",
      headers:{
        "Authorization":"Bearer YOUR_HUGGINGFACE_TOKEN",
        "Content-Type":"application/json"
      },
      body:JSON.stringify({inputs: prompt})
    });
    const data = await response.json();
    return data[0].generated_text || "Let’s keep learning together!";
  }catch{
    return "I'm here to support your learning journey.";
  }
}

function speak(text){
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}

function toggleMode(){
  document.body.classList.toggle("dark");
}
