(() => {
  const form = document.getElementById("lead-form");
  if (!form) return;

  const cfg = window.SB_CONFIG || {};
  const status = form.querySelector(".form__status");
  const btn = form.querySelector("button[type=submit]");
  const done = document.getElementById("lead-done");
  const setStatus = (text, isError) => {
    status.textContent = text;
    status.classList.toggle("is-error", !!isError);
  };
  const msg = (k) => form.dataset["msg" + k[0].toUpperCase() + k.slice(1)] || "";

  // Each rule returns true when the field is valid. Messages come from data-msg-* on the form.
  const rules = {
    company: () => form.company.value.trim() !== "",
    sphere: () => form.sphere.value !== "",
    phone: () => /^\+380\d{9}$/.test(form.phone.value.replace(/[\s()-]/g, "")),
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim()),
    area: () => !!form.querySelector("input[name=area]:checked"),
    consent: () => form.consent.checked,
  };

  const check = (name) => {
    const ok = rules[name]();
    const wrap = form.querySelector(`[data-field="${name}"]`);
    wrap.classList.toggle("is-invalid", !ok);
    form.querySelector(`#e-${name}`).textContent = ok ? "" : msg(name);
    const control = form.elements[name];
    if (control && control.nodeType === 1) control.setAttribute("aria-invalid", String(!ok));
    return ok;
  };

  let tried = false;
  const onEdit = (e) => {
    const name = e.target.name;
    if (tried && rules[name]) check(name);
  };
  form.addEventListener("input", onEdit);
  form.addEventListener("change", onEdit);

  const showDone = () => {
    setStatus("");
    form.hidden = true;
    done.hidden = false;
    done.focus();
  };

  const trackLead = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead_sent", form_id: form.id });
    if (typeof window.fbq === "function") window.fbq("track", "Lead");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    tried = true;
    setStatus("");

    const invalid = Object.keys(rules).filter((n) => !check(n));
    if (invalid.length) {
      const first = form.querySelector(`[data-field="${invalid[0]}"]`);
      (first.querySelector("input, select, textarea") || first).focus();
      return;
    }

    if (form.website.value) return showDone(); // honeypot tripped: pretend success, send nothing

    if (!cfg.formEndpoint) {
      setStatus(msg("unconfigured"), true);
      return;
    }

    const data = new FormData(form);
    data.delete("website");
    Object.entries(cfg.formExtra || {}).forEach(([k, v]) => data.append(k, v));
    data.append("lang", document.documentElement.lang);
    data.append("page", location.href);

    btn.disabled = true;
    setStatus(msg("sending"));
    try {
      const res = await fetch(cfg.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(res.status);
      trackLead();
      showDone();
    } catch {
      setStatus(msg("error"), true);
    } finally {
      btn.disabled = false;
    }
  });
})();
