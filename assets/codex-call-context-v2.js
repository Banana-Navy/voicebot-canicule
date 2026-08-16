/**
 * CODEX_PLATFORM_CALL_CONTEXT_V2
 *
 * Le bundle affiche la civilité et la conserve dans son état React, mais son
 * ancien contrat HTTP omet encore ce champ. V1 tentait de retrouver le radio
 * par son attribut `name`, ce qui n'a pas résisté au DOM de production.
 *
 * V2 mémorise le choix au moment du changement et le confirme, au départ de
 * l'appel, par la valeur fermée du radio coché. Le serveur refuse toute autre
 * valeur avant de construire `recipient_greeting` pour ElevenLabs.
 */
(() => {
  const nativeFetch = window.fetch.bind(window);
  let selectedCivility = "madame";

  const closedCivility = (value) =>
    value === "madame" || value === "monsieur" ? value : null;

  document.addEventListener(
    "change",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.type !== "radio") return;

      const next = closedCivility(target.value);
      if (target.checked && next) selectedCivility = next;
    },
    true,
  );

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url ?? "";
    const isCallRequest = url.includes("/functions/v1/trigger_app_call");

    if (isCallRequest && String(init.method ?? "GET").toUpperCase() === "POST") {
      try {
        const payload = JSON.parse(String(init.body ?? ""));
        const checked = document.querySelector(
          'input[type="radio"][value="madame"]:checked, ' +
            'input[type="radio"][value="monsieur"]:checked',
        );
        const civility = closedCivility(
          checked instanceof HTMLInputElement ? checked.value : selectedCivility,
        );

        if (payload?.source === "voicebot_site" && civility) {
          init = {
            ...init,
            body: JSON.stringify({ ...payload, civility }),
          };
        }
      } catch {
        // La validation serveur reste l'autorité. Une charge non JSON est
        // transmise telle quelle afin de conserver le comportement existant.
      }
    }

    return nativeFetch(input, init);
  };
})();
