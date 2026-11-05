import "@testing-library/jest-dom/vitest";

// jsdom does not implement matchMedia; theme handling needs it.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: () => {},
});

Object.defineProperty(HTMLElement.prototype, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(Element.prototype, "hasPointerCapture", {
  writable: true,
  value: () => false,
});

Object.defineProperty(Element.prototype, "setPointerCapture", {
  writable: true,
  value: () => {},
});

Object.defineProperty(Element.prototype, "releasePointerCapture", {
  writable: true,
  value: () => {},
});
