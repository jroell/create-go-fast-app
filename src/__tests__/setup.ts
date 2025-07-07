// Vitest setup file
import { vi, beforeEach, afterEach, afterAll } from 'vitest';
import mockFs from 'mock-fs';

// Suppress console logs during tests unless DEBUG is set
if (!process.env.DEBUG) {
  global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

// Mock process.exit to prevent tests from actually exiting
const originalExit = process.exit;
const mockExit = vi.fn();
process.exit = mockExit as any;

// Store original environment
const originalEnv = { ...process.env };

// Mock file system operations for testing
beforeEach(() => {
  // Reset environment variables
  process.env = { ...originalEnv };
  
  // Reset all mocks
  vi.clearAllMocks();
  mockExit.mockClear();
  
  // Setup basic file system structure for tests
  mockFs({
    '/tmp': {},
    '/var/tmp': {},
    '/Users': {},
    '/home': {},
    'node_modules': mockFs.load('node_modules'),
    'package.json': mockFs.load('package.json'),
    'tsconfig.json': mockFs.load('tsconfig.json'),
  });
});

// Clean up after each test
afterEach(() => {
  mockFs.restore();
  vi.restoreAllMocks();
});

// Restore original process.exit after all tests
afterAll(() => {
  process.exit = originalExit;
  process.env = originalEnv;
});

// Global test utilities
declare global {
  var mockExit: ReturnType<typeof vi.fn>;
}

globalThis.mockExit = mockExit;