(() => {
  const config = window.ELTON_CHAT_CONFIG || {};
  const apiUrl = (config.apiUrl || "").replace(/\/$/, "");

  const root = document.querySelector("[data-chat-root]");
  if (!root) return;

  const launcher = root.querySelector("[data-chat-launcher]");
  const panel = root.querySelector("[data-chat-panel]");
  const closeBtn = root.querySelector("[data-chat-close]");
  const messagesEl = root.querySelector("[data-chat-messages]");
  const form = root.querySelector("[data-chat-form]");
  const input = root.querySelector("[data-chat-input]");
  const sendBtn = root.querySelector("[data-chat-send]");
  const statusEl = root.querySelector("[data-chat-status]");

  const history = [];
  let open = false;
  let busy = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text || "";
  }

  function setOpen(next) {
    open = next;
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      input.focus();
      if (!messagesEl.children.length) {
        addMessage(
          "assistant",
          "Hi — I can answer questions about our packages, pricing, and the AI chatbot add-on. What would you like to know?"
        );
      }
    }
  }

  function addMessage(role, text) {
    const wrap = document.createElement("div");
    wrap.className = `chat-msg chat-msg--${role}`;

    const bubble = document.createElement("div");
    bubble.className = "chat-msg-bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);

    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    if (role === "user" || role === "assistant") {
      history.push({ role, content: text });
      if (history.length > 12) history.splice(0, history.length - 12);
    }
  }

  function setBusy(next) {
    busy = next;
    input.disabled = next;
    sendBtn.disabled = next;
    setStatus(next ? "Thinking…" : "");
  }

  async function sendMessage(text) {
    const message = text.trim();
    if (!message || busy) return;

    if (!apiUrl) {
      addMessage(
        "assistant",
        "Chat is not connected yet. Email hello@eltonwebdesignuk.com or use the contact form below for a quote."
      );
      return;
    }

    addMessage("user", message);
    input.value = "";
    setBusy(true);

    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: history.slice(0, -1),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const err =
          data.error === "rate limit exceeded—try again later"
            ? "Too many messages—please wait a bit or email hello@eltonwebdesignuk.com."
            : "Something went wrong. Try again or email hello@eltonwebdesignuk.com.";
        addMessage("assistant", err);
        return;
      }

      addMessage("assistant", data.reply || "No reply received.");
    } catch {
      addMessage(
        "assistant",
        "Could not reach the chat service. Email hello@eltonwebdesignuk.com and we will reply within one business day."
      );
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  launcher.addEventListener("click", () => setOpen(!open));
  closeBtn.addEventListener("click", () => setOpen(false));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) setOpen(false);
  });
})();
