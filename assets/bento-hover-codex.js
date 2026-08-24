/* CODEX_BENTO_CURSOR_HOVER_V1 — delegated so SPA route changes are covered. */
(() => {
  const selector = ".parallaxe";
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let activeBento = null;
  let pendingFrame = 0;
  let pendingPointer = null;

  const motionAllowed = () => finePointer.matches && !reducedMotion.matches;

  const decorate = (root = document) => {
    const candidates = [];
    if (root instanceof Element && root.matches(selector)) candidates.push(root);
    if (root.querySelectorAll) candidates.push(...root.querySelectorAll(selector));

    candidates.forEach((bento) => {
      if (!bento.hasAttribute("data-bento-hover")) {
        bento.setAttribute("data-bento-hover", "codex-v1");
      }
    });
  };

  const reset = (bento) => {
    if (!bento) return;
    bento.classList.remove("bento-hover-active", "bento-hover-pressed");
    bento.style.removeProperty("--bento-cursor-x");
    bento.style.removeProperty("--bento-cursor-y");
    bento.style.removeProperty("--bento-shift-x");
    bento.style.removeProperty("--bento-shift-y");
  };

  const paintPointer = () => {
    pendingFrame = 0;
    if (!pendingPointer || !motionAllowed()) return;

    const { bento, clientX, clientY } = pendingPointer;
    const rect = bento.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));

    bento.style.setProperty("--bento-cursor-x", `${(x * 100).toFixed(2)}%`);
    bento.style.setProperty("--bento-cursor-y", `${(y * 100).toFixed(2)}%`);
    bento.style.setProperty("--bento-shift-x", `${((x - 0.5) * 4).toFixed(2)}px`);
    bento.style.setProperty("--bento-shift-y", `${(-4 + (y - 0.5) * 2).toFixed(2)}px`);
  };

  const schedulePointer = (bento, event) => {
    pendingPointer = { bento, clientX: event.clientX, clientY: event.clientY };
    if (!pendingFrame) pendingFrame = window.requestAnimationFrame(paintPointer);
  };

  document.addEventListener("pointerover", (event) => {
    if (!motionAllowed()) return;
    const bento = event.target.closest?.(selector);
    if (!bento || (event.relatedTarget && bento.contains(event.relatedTarget))) return;

    if (activeBento && activeBento !== bento) reset(activeBento);
    activeBento = bento;
    bento.classList.add("bento-hover-active");
    schedulePointer(bento, event);
  });

  document.addEventListener("pointermove", (event) => {
    if (!motionAllowed()) return;
    const bento = event.target.closest?.(selector);
    if (bento && bento === activeBento) schedulePointer(bento, event);
  });

  document.addEventListener("pointerout", (event) => {
    const bento = event.target.closest?.(selector);
    if (!bento || (event.relatedTarget && bento.contains(event.relatedTarget))) return;

    reset(bento);
    if (activeBento === bento) activeBento = null;
  });

  document.addEventListener("pointerdown", (event) => {
    const bento = event.target.closest?.(selector);
    if (bento && motionAllowed()) bento.classList.add("bento-hover-pressed");
  });

  document.addEventListener("pointerup", (event) => {
    event.target.closest?.(selector)?.classList.remove("bento-hover-pressed");
  });

  document.addEventListener("pointercancel", () => {
    reset(activeBento);
    activeBento = null;
  });

  const resetForPreference = () => {
    if (!motionAllowed()) {
      reset(activeBento);
      activeBento = null;
    }
  };

  finePointer.addEventListener?.("change", resetForPreference);
  reducedMotion.addEventListener?.("change", resetForPreference);

  decorate();
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) decorate(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
