document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat-messages");
  const input = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  function addMessage(text, cls) {
    const msg = document.createElement("div");
    msg.classList.add("message", cls);
    msg.textContent = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  async function getAIResponse(message) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", // Replace with a securely stored key
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "llama-3.3-70b-versatile",
          "messages": [{ "role": "user", "content": message }]
        })
      });

      const data = await response.json();
      console.log("API Response:", data); // Log response for debugging

      if (!response.ok) {
        return `Error: ${data.error?.message || "Something went wrong."}`;
      }

      return data.choices?.[0]?.message?.content || "I don't understand.";
    } catch (error) {
      console.error("Fetch Error:", error);
      return "Error getting response.";
    }
  }

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, "user-message");
    input.value = "";

    setTimeout(async () => {
      const botResponse = await getAIResponse(message);
      addMessage(botResponse, "bot-message");
    }, 500);
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

  addMessage("Hello! How can I help you?", "bot-message");
});
