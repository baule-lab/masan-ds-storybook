import { vi } from 'vitest';
import '@testing-library/jest-dom';

/**
 * ResizeObserver polyfill for jsdom
 * Required by Recharts for proper rendering in tests
 */
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

/**
 * URL.createObjectURL polyfill for jsdom
 * Required by MapLibre GL for web worker initialization
 */
if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
}
if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = vi.fn();
}

/**
 * Mock MapLibre GL to prevent worker initialization errors in tests
 */
vi.mock('maplibre-gl', () => ({
  default: {
    setWorkerUrl: vi.fn(),
    Map: vi.fn(),
    Marker: vi.fn(() => ({
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
    })),
    Popup: vi.fn(() => ({
      setLngLat: vi.fn().mockReturnThis(),
      setHTML: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
    })),
  },
}));
