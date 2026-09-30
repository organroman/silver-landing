// Public settings. Never put secrets here — this file is served to the browser.
window.SB_CONFIG = {
  // Form backend endpoint (Web3Forms / Formspree / own worker). Fill in when chosen.
  formEndpoint: "https://api.web3forms.com/submit",
  // Extra fields sent with every submission, e.g. { access_key: "..." } for Web3Forms
  // (its access key is designed to be public) or { _subject: "New lead" } for Formspree.
  formExtra: { access_key: "598932fc-209b-4075-8471-ee2bb1d099e2", subject: "Нова заявка — Silver Breeze" },
};
document.documentElement.classList.add("js");
