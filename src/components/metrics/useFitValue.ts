import { type RefObject, useEffect } from 'react';

// Width of the text of the element in em. It does not depend on the element size,
// so the CSS can scale the font to any card width (see MetricCard.module.css).
export function getTextWidthInEm(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  // jsdom has no layout: Range.getBoundingClientRect does not exist there.
  const width = range.getBoundingClientRect?.().width ?? 0;
  const size = parseFloat(getComputedStyle(el).fontSize);

  return width > 0 && size > 0 ? width / size : 0;
}

export function useFitValue(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const measure = () => {
      const em = getTextWidthInEm(el);

      if (em > 0) {
        el.style.setProperty('--fit-em', String(em));
      } else {
        el.style.removeProperty('--fit-em');
      }
    };

    measure();

    // The value is rewritten by the spring animation and by any later change of the text.
    const observer = new MutationObserver(measure);
    observer.observe(el, { childList: true, characterData: true, subtree: true });
    document.fonts?.ready.then(measure);

    return () => observer.disconnect();
  }, [ref]);
}
