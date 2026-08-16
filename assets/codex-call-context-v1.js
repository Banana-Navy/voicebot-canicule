/**
 * CODEX_PLATFORM_CALL_CONTEXT_V1
 *
 * Le bundle historique transmettait le prénom mais oubliait la civilité
 * pourtant choisie dans le formulaire. Ce petit adaptateur ajoute uniquement
 * la valeur fermée `madame` ou `monsieur` à l'appel Supabase. Le serveur relit
 * ensuite le prénom depuis sa propre base avant de construire le message TTS.
 */
(() => {
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url ?? "";
    const isCallRequest = url.includes("/functions/v1/trigger_app_call");

    if (isCallRequest && String(init.method ?? "GET").toUpperCase() === "POST") {
      try {
        const payload = JSON.parse(String(init.body ?? ""));
        const selected = document.querySelector('input[name="Civilité"]:checked');
        const civility = selected instanceof HTMLInputElement ? selected.value : "";

        if (
          payload?.source === "voicebot_site" &&
          (civility === "madame" || civility === "monsieur")
        ) {
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
