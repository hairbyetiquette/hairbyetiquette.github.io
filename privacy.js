"use strict";

(() => {
  const storageKey = "hbe-privacy-choices-v1";
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const sources = {
    booking:
      "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1D1hdHNbgFKJj6Yw5eEboqQ2pGeCfIiYANhGd4BVss_op9CQSTA5GtYRbF1hhFPZlJKNP-w5iJ?gv=true",
    maps: "https://maps.google.com/maps?q=Hair%20By%20Etiquette%2C%2026%20Old%20Street%2C%20Upton%20upon%20Severn%2C%20WR8%200HW&z=17&output=embed",
  };
  let preferences = readPreferences();
  let settingsReturnFocus;

  function readPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (
        saved?.version === 1 &&
        typeof saved.maps === "boolean" &&
        typeof saved.booking === "boolean" &&
        Number.isFinite(saved.savedAt) &&
        saved.savedAt <= Date.now() &&
        Date.now() - saved.savedAt < lifetime
      )
        return saved;
      localStorage.removeItem(storageKey);
    } catch {
      /* Blocked or corrupt storage leaves optional services disabled. */
    }
    return null;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <dialog class="cookie-banner" aria-labelledby="cookie-welcome-title">
      <div class="cookie-welcome-card"><img src="assets/olive-mark.svg" width="42" height="56" alt=""><p class="eyebrow">WELCOME TO HAIR BY ETIQUETTE</p><h2 id="cookie-welcome-title">A little choice,<br><em>before you settle in.</em></h2><p>We use essential storage to remember your preferences. Optional Google Maps and Calendar features stay off unless you allow them.</p><p>Accept optional features to see our salon map and use the booking calendar. Or reject them and enjoy the salon website without Google embeds.</p>
      <div class="cookie-actions"><button class="consent-button" type="button" data-consent-action="accept">Accept optional</button><button class="consent-button" type="button" data-consent-action="reject">Reject optional</button><button class="consent-button" type="button" data-cookie-settings>Choose settings</button></div>
      <p class="cookie-welcome-links"><a href="cookies.html">Cookie policy</a> · <a href="privacy.html">Privacy policy</a></p></div>
    </dialog>
    <dialog id="cookie-dialog" class="cookie-dialog" aria-labelledby="cookie-dialog-title"><button class="dialog-close" type="button" aria-label="Close cookie settings">×</button><p class="eyebrow">COMFORTABLE WITH YOUR CHOICES</p><h2 id="cookie-dialog-title">Your privacy.<br><em>Your choice.</em></h2><p class="cookie-intro">Choose which Google features may load here. Both are optional, and you can change your mind at any time.</p><form id="cookie-form"><div class="consent-choice"><div><strong>Essential preferences</strong><p>Remembers your choice for up to 180 days. Always on when you save a choice.</p></div><span class="essential-label">Required</span></div><label class="consent-choice" for="consent-maps"><div><strong>Google Maps</strong><p>Displays the interactive salon map inline on the page. Google receives technical information such as your IP address and may use cookies or similar storage.</p></div><input id="consent-maps" name="maps" type="checkbox"></label><label class="consent-choice" for="consent-booking"><div><strong>Google Calendar</strong><p>Loads appointment scheduling inside this page. Google receives technical information and may use cookies or similar storage. Booking details you submit go to Google and the appointment organiser.</p></div><input id="consent-booking" name="booking" type="checkbox"></label><p class="consent-policy-links"><a href="cookies.html">Cookie policy</a> · <a href="privacy.html">Privacy policy</a> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy notice</a></p><div class="cookie-actions"><button class="consent-button" type="submit">Save my choices</button><button class="consent-button" type="button" data-consent-action="reject">Reject optional</button><button class="consent-button" type="button" data-consent-action="accept">Accept optional</button></div></form></dialog>
    <p class="sr-only" id="privacy-status" role="status" aria-live="polite"></p>
  `,
  );

  const banner = document.querySelector(".cookie-banner");
  const dialog = document.querySelector("#cookie-dialog");
  const mapsInput = document.querySelector("#consent-maps");
  const bookingInput = document.querySelector("#consent-booking");
  const policyPage = /\/(?:privacy|cookies)\.html$/.test(location.pathname);
  function syncWelcome() {
    if (!preferences && !policyPage && !dialog.open) {
      if (!banner.open) banner.showModal();
    } else if (banner.open) banner.close();
  }
  // Escape dismisses the notice without granting any permission.
  banner.addEventListener("cancel", () => {});

  function syncEmbeds() {
    document.querySelectorAll("[data-embed-service]").forEach((gate) => {
      const service = gate.dataset.embedService;
      const allowed = preferences?.[service] === true;
      const mount = gate.querySelector("[data-embed-mount]");
      const placeholder = gate.querySelector("[data-embed-placeholder]");
      if (placeholder) placeholder.hidden = allowed;
      if (service === "maps") gate.hidden = !allowed;
      mount.hidden = !allowed;
      if (!allowed) {
        // Removing the browsing context stops its embedded service from running.
        mount.replaceChildren();
        return;
      }
      if (!mount.querySelector("iframe")) {
        const frame = document.createElement("iframe");
        frame.className =
          service === "maps" ? "salon-map-frame" : "booking-calendar";
        frame.title =
          service === "maps"
            ? "Google Maps: Hair by Etiquette, 26 Old Street, Upton upon Severn"
            : "Book an appointment at Hair by Etiquette with Google Calendar";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.src = sources[service];
        frame.width = "100%";
        frame.height = service === "maps" ? "480" : "650";
        frame.loading = "lazy";
        mount.append(frame);
      }
    });
  }

  function savePreferences(next, source = "settings") {
    const newlyAllowedMaps = next.maps === true && preferences?.maps !== true;
    preferences = {
      version: 1,
      maps: next.maps === true,
      booking: next.booking === true,
      savedAt: Date.now(),
    };
    let remembered = true;
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    } catch {
      remembered = false;
    }
    if (banner.open) banner.close();
    syncEmbeds();
    document.querySelector("#privacy-status").textContent = remembered
      ? "Your privacy choices have been saved. You can change them in Cookie settings."
      : "Your choice applies to this page. Your browser could not save it for a later visit.";
    document.dispatchEvent(
      new CustomEvent("hbe:consentchange", {
        detail: {
          maps: preferences.maps,
          booking: preferences.booking,
          newlyAllowedMaps,
          source,
        },
      }),
    );
  }

  function openSettings(button) {
    settingsReturnFocus = button;
    if (banner.open) banner.close();
    mapsInput.checked = preferences?.maps === true;
    bookingInput.checked = preferences?.booking === true;
    if (!dialog.open) dialog.showModal();
  }

  document.addEventListener("click", (event) => {
    const settings = event.target.closest("[data-cookie-settings]");
    if (settings) {
      openSettings(settings);
      return;
    }
    const action = event.target.closest("[data-consent-action]");
    if (action) {
      const allow = action.dataset.consentAction === "accept";
      savePreferences(
        { maps: allow, booking: allow },
        allow ? "accept" : "reject",
      );
      if (dialog.open) dialog.close();
      return;
    }
    const allow = event.target.closest("[data-allow-service]");
    if (allow) {
      const service = allow.dataset.allowService;
      if (!(service in sources)) return;
      const gate = allow.closest("[data-embed-service]");
      savePreferences({
        maps: preferences?.maps === true,
        booking: preferences?.booking === true,
        [service]: true,
      });
      gate.querySelector("iframe")?.focus();
    }
  });
  document.querySelector("#cookie-form").addEventListener("submit", (event) => {
    event.preventDefault();
    savePreferences({ maps: mapsInput.checked, booking: bookingInput.checked });
    dialog.close();
  });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    settingsReturnFocus?.focus();
    syncWelcome();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preferences = readPreferences();
    syncWelcome();
    syncEmbeds();
  });
  // Recheck expiry when returning to a long-lived tab.
  document.addEventListener("visibilitychange", () => {
    if (
      !document.hidden &&
      preferences &&
      Date.now() - preferences.savedAt >= lifetime
    ) {
      preferences = null;
      try {
        localStorage.removeItem(storageKey);
      } catch {
        /* Session-only choice. */
      }
      syncWelcome();
      syncEmbeds();
    }
  });
  syncWelcome();
  syncEmbeds();
  window.SalonPrivacy = { syncEmbeds, openSettings };
})();
