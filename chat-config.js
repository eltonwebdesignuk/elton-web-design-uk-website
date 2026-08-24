/**
 * Chat API URL — auto-detects local vs production.
 * After deploy: set productionApiUrl to your Cloud Run URL from chat/scripts/deploy.sh
 */
const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

window.ELTON_CHAT_CONFIG = {
  apiUrl: isLocal ? "http://localhost:8080" : "",
  productionApiUrl: "https://elton-chat-3kd6lsxb4a-nw.a.run.app",
};

// Use production URL when not on localhost (once deployed)
if (!isLocal && window.ELTON_CHAT_CONFIG.productionApiUrl) {
  window.ELTON_CHAT_CONFIG.apiUrl = window.ELTON_CHAT_CONFIG.productionApiUrl;
}
