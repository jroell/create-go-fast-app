"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Jest setup file
const globals_1 = require("@jest/globals");
// Increase timeout for system checks that might involve network calls
globals_1.jest.setTimeout(30000);
// Suppress console logs during tests unless DEBUG is set
if (!process.env.DEBUG) {
    global.console = {
        ...console,
        log: globals_1.jest.fn(),
        debug: globals_1.jest.fn(),
        info: globals_1.jest.fn(),
        warn: globals_1.jest.fn(),
        error: globals_1.jest.fn(),
    };
}
// Mock process.exit to prevent tests from actually exiting
const originalExit = process.exit;
const mockExit = globals_1.jest.fn();
process.exit = mockExit;
// Reset mocks after each test
afterEach(() => {
    globals_1.jest.clearAllMocks();
    mockExit.mockClear();
});
// Restore original process.exit after all tests
afterAll(() => {
    process.exit = originalExit;
});
//# sourceMappingURL=setup.js.map