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
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", // Replace with a securely stored key
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.5-pro-exp-03-25:free",
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
