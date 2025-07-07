"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Vitest setup file
const vitest_1 = require("vitest");
const mock_fs_1 = __importDefault(require("mock-fs"));
// Suppress console logs during tests unless DEBUG is set
if (!process.env.DEBUG) {
    global.console = {
        ...console,
        log: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
        info: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
    };
}
// Mock process.exit to prevent tests from actually exiting
const originalExit = process.exit;
const mockExit = vitest_1.vi.fn();
process.exit = mockExit;
// Store original environment
const originalEnv = { ...process.env };
// Mock file system operations for testing
(0, vitest_1.beforeEach)(() => {
    // Reset environment variables
    process.env = { ...originalEnv };
    // Reset all mocks
    vitest_1.vi.clearAllMocks();
    mockExit.mockClear();
    // Setup basic file system structure for tests
    (0, mock_fs_1.default)({
        '/tmp': {},
        '/var/tmp': {},
        '/Users': {},
        '/home': {},
        'node_modules': mock_fs_1.default.load('node_modules'),
        'package.json': mock_fs_1.default.load('package.json'),
        'tsconfig.json': mock_fs_1.default.load('tsconfig.json'),
    });
});
// Clean up after each test
(0, vitest_1.afterEach)(() => {
    mock_fs_1.default.restore();
    vitest_1.vi.restoreAllMocks();
});
// Restore original process.exit after all tests
(0, vitest_1.afterAll)(() => {
    process.exit = originalExit;
    process.env = originalEnv;
});
globalThis.mockExit = mockExit;
//# sourceMappingURL=setup.js.map