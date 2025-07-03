// Jest setup file
import { jest } from '@jest/globals';

// Increase timeout for system checks that might involve network calls
jest.setTimeout(30000);

// Suppress console logs during tests unless DEBUG is set
if (!process.env.DEBUG) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

// Mock process.exit to prevent tests from actually exiting
const originalExit = process.exit;
const mockExit = jest.fn();
process.exit = mockExit as any;

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  mockExit.mockClear();
});

// Restore original process.exit after all tests
afterAll(() => {
  process.exit = originalExit;
});