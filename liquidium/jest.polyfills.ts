// jest.polyfills.ts
import { TextDecoder, TextEncoder } from 'util';

// Set up TextEncoder/TextDecoder
(global as any).TextEncoder = TextEncoder; 
(global as any).TextDecoder = TextDecoder;

// Mock fetch if needed
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    headers: new Map(),
    text: () => Promise.resolve(""),
  }) as any
);

// Mock other required browser APIs
global.Request = jest.fn() as any;
global.Response = jest.fn(() => ({
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(""),
})) as any;
global.Headers = jest.fn(() => new Map()) as any;