function checkSafety(text){
  const riskyWords = ["suicide","kill myself","self harm","die"];

  for(let word of riskyWords){
    if(text.toLowerCase().includes(word)){
      const safetyMessage =
      "I'm really sorry you're feeling this way. You're not alone. " +
      "If you're in India, please contact Kiran (1800-599-0019). " +
      "Would you like to continue when you're feeling safe?";

      addMessage(safetyMessage,"ai");
      return true;
    }
  }
  return false;
}
