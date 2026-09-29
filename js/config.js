// Public settings. Never put secrets here — this file is served to the browser.
window.SB_CONFIG = {
  // Form backend endpoint (Web3Forms / Formspree / own worker). Fill in when chosen.
  formEndpoint: "",
  // Extra fields sent with every submission, e.g. { access_key: "..." } for Web3Forms
  // (its access key is designed to be public) or { _subject: "New lead" } for Formspree.
  formExtra: {},
};
document.documentElement.classList.add("js");
