chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  window.location.href = request.url;
});
