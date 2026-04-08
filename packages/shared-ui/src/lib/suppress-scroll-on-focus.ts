export const suppressScrollOnFocus = (): void => {
  const originalFocus = HTMLElement.prototype.focus;
  const originalScrollIntoView = Element.prototype.scrollIntoView;

  HTMLElement.prototype.focus = function (options?: FocusOptions) {
    originalFocus.call(this, { ...options, preventScroll: true });
  };

  Element.prototype.scrollIntoView = () => {
    return;
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      HTMLElement.prototype.focus = originalFocus;
      Element.prototype.scrollIntoView = originalScrollIntoView;
    });
  });
};
