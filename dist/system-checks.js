"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.performSystemChecks = performSystemChecks;
exports.displaySystemChecks = displaySystemChecks;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
async function performSystemChecks(config) {
    const checks = [];
    // Node.js version check
    checks.push(checkNodeVersion());
    // Package manager availability
    checks.push(checkPackageManager(config.packageManager));
    // Git availability
    checks.push(checkGit());
    // Network connectivity
    checks.push(await checkNetworkConnectivity());
    // Disk space
    checks.push(checkDiskSpace(config.projectName));
    // Directory permissions
    checks.push(checkDirectoryPermissions(config.projectName));
    // Path length check
    checks.push(checkWindowsPathLength(config.projectName));
    // Memory availability
    checks.push(checkMemory());
    // Build tools (for native dependencies)
    checks.push(checkBuildTools());
    // Registry access
    checks.push(await checkRegistryAccess(config.packageManager));
    const errors = checks.filter(c => c.severity === 'error' && !c.passed);
    const warnings = checks.filter(c => c.severity === 'warning' && !c.passed);
    return {
        allPassed: errors.length === 0,
        checks,
        canProceed: errors.length === 0
    };
}
function checkNodeVersion() {
    try {
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
        if (majorVersion < 18) {
            return {
                name: 'Node.js Version',
                passed: false,
                message: `Node.js ${nodeVersion} is not supported. Minimum required: 18.0.0`,
                fixInstructions: 'Please update Node.js to version 18 or higher. Visit https://nodejs.org/ to download the latest version.',
                severity: 'error'
            };
        }
        if (majorVersion >= 22) {
            return {
                name: 'Node.js Version',
                passed: true,
                message: `Node.js ${nodeVersion} (latest)`,
                severity: 'info'
            };
        }
        return {
            name: 'Node.js Version',
            passed: true,
            message: `Node.js ${nodeVersion}`,
            severity: 'info'
        };
    }
    catch (error) {
        return {
            name: 'Node.js Version',
            passed: false,
            message: 'Unable to detect Node.js version',
            fixInstructions: 'Please ensure Node.js is properly installed and available in PATH.',
            severity: 'error'
        };
    }
}
function checkPackageManager(packageManager) {
    try {
        let version;
        switch (packageManager) {
            case 'npm':
                version = (0, child_process_1.execSync)('npm --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
                break;
            case 'yarn':
                version = (0, child_process_1.execSync)('yarn --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
                break;
            case 'pnpm':
                version = (0, child_process_1.execSync)('pnpm --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
                break;
            case 'bun':
                version = (0, child_process_1.execSync)('bun --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
                break;
            default:
                throw new Error(`Unknown package manager: ${packageManager}`);
        }
        return {
            name: `${packageManager.charAt(0).toUpperCase() + packageManager.slice(1)} Package Manager`,
            passed: true,
            message: `${packageManager} v${version}`,
            severity: 'info'
        };
    }
    catch (error) {
        const installInstructions = {
            npm: 'npm is included with Node.js. Please reinstall Node.js.',
            yarn: 'Install with: npm install -g yarn',
            pnpm: 'Install with: npm install -g pnpm',
            bun: 'Install from: https://bun.sh/'
        };
        return {
            name: `${packageManager.charAt(0).toUpperCase() + packageManager.slice(1)} Package Manager`,
            passed: false,
            message: `${packageManager} is not installed or not available in PATH`,
            fixInstructions: installInstructions[packageManager],
            severity: 'error'
        };
    }
}
function checkGit() {
    try {
        const version = (0, child_process_1.execSync)('git --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
        return {
            name: 'Git',
            passed: true,
            message: version,
            severity: 'info'
        };
    }
    catch (error) {
        return {
            name: 'Git',
            passed: false,
            message: 'Git is not installed or not available in PATH',
            fixInstructions: 'Install Git from https://git-scm.com/ and ensure it\'s added to your PATH.',
            severity: 'warning'
        };
    }
}
async function checkNetworkConnectivity() {
    try {
        // Try to resolve a common DNS name
        const { lookup } = await Promise.resolve().then(() => __importStar(require('dns')));
        const { promisify } = await Promise.resolve().then(() => __importStar(require('util')));
        const lookupAsync = promisify(lookup);
        await lookupAsync('registry.npmjs.org');
        return {
            name: 'Network Connectivity',
            passed: true,
            message: 'Internet connection available',
            severity: 'info'
        };
    }
    catch (error) {
        return {
            name: 'Network Connectivity',
            passed: false,
            message: 'Unable to reach npm registry',
            fixInstructions: 'Check your internet connection and proxy settings. Corporate networks may require additional configuration.',
            severity: 'error'
        };
    }
}
function checkDiskSpace(projectName) {
    try {
        const targetPath = (0, path_1.resolve)(process.cwd(), projectName);
        const stats = (0, fs_1.statSync)(process.cwd());
        const free = (0, os_1.freemem)();
        const minRequiredMB = 100; // 100MB minimum
        const freeMB = Math.floor(free / 1024 / 1024);
        if (freeMB < minRequiredMB) {
            return {
                name: 'Disk Space',
                passed: false,
                message: `Insufficient disk space: ${freeMB}MB available, ${minRequiredMB}MB required`,
                fixInstructions: 'Free up disk space and try again.',
                severity: 'error'
            };
        }
        return {
            name: 'Disk Space',
            passed: true,
            message: `${freeMB}MB available`,
            severity: 'info'
        };
    }
    catch (error) {
        return {
            name: 'Disk Space',
            passed: false,
            message: 'Unable to check disk space',
            severity: 'warning'
        };
    }
}
function checkDirectoryPermissions(projectName) {
    try {
        const targetPath = (0, path_1.resolve)(process.cwd(), projectName);
        // Check if directory already exists
        if ((0, fs_1.existsSync)(targetPath)) {
            return {
                name: 'Directory Permissions',
                passed: false,
                message: `Directory "${projectName}" already exists`,
                fixInstructions: 'Choose a different project name or remove the existing directory.',
                severity: 'error'
            };
        }
        // Check if we can write to the parent directory
        try {
            (0, fs_1.accessSync)(process.cwd(), fs_1.constants.W_OK);
            return {
                name: 'Directory Permissions',
                passed: true,
                message: 'Write permissions available',
                severity: 'info'
            };
        }
        catch (permError) {
            return {
                name: 'Directory Permissions',
                passed: false,
                message: 'No write permission in current directory',
                fixInstructions: (0, os_1.platform)() === 'win32'
                    ? 'Run the command as administrator or choose a different directory.'
                    : 'Run with sudo or choose a directory you have write access to.',
                severity: 'error'
            };
        }
    }
    catch (error) {
        return {
            name: 'Directory Permissions',
            passed: false,
            message: 'Unable to check directory permissions',
            severity: 'warning'
        };
    }
}
function checkWindowsPathLength(projectName) {
    if ((0, os_1.platform)() !== 'win32') {
        return {
            name: 'Path Length',
            passed: true,
            message: 'Not applicable (non-Windows)',
            severity: 'info'
        };
    }
    const currentPath = process.cwd();
    const projectPath = (0, path_1.join)(currentPath, projectName);
    const maxPath = 260; // Windows MAX_PATH limitation
    if (projectPath.length > maxPath - 50) { // Leave buffer for nested files
        return {
            name: 'Windows Path Length',
            passed: false,
            message: `Path too long: ${projectPath.length} characters (max recommended: ${maxPath - 50})`,
            fixInstructions: 'Choose a shorter project name or create the project in a directory with a shorter path.',
            severity: 'error'
        };
    }
    return {
        name: 'Windows Path Length',
        passed: true,
        message: `Path length OK (${projectPath.length} chars)`,
        severity: 'info'
    };
}
function checkMemory() {
    const totalMB = Math.floor((0, os_1.totalmem)() / 1024 / 1024);
    const freeMB = Math.floor((0, os_1.freemem)() / 1024 / 1024);
    const minRequiredMB = 512; // 512MB minimum
    if (freeMB < minRequiredMB) {
        return {
            name: 'Available Memory',
            passed: false,
            message: `Low memory: ${freeMB}MB available, ${minRequiredMB}MB recommended`,
            fixInstructions: 'Close other applications to free up memory.',
            severity: 'warning'
        };
    }
    return {
        name: 'Available Memory',
        passed: true,
        message: `${freeMB}MB available`,
        severity: 'info'
    };
}
function checkBuildTools() {
    try {
        // Check for Python (required for node-gyp)
        let pythonCheck = false;
        let pythonVersion = '';
        try {
            pythonVersion = (0, child_process_1.execSync)('python --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
            pythonCheck = true;
        }
        catch {
            try {
                pythonVersion = (0, child_process_1.execSync)('python3 --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
                pythonCheck = true;
            }
            catch {
                // Python not found
            }
        }
        // Check for build tools based on platform
        let buildToolsCheck = false;
        let buildToolsMessage = '';
        if ((0, os_1.platform)() === 'win32') {
            // Check for Visual Studio Build Tools
            try {
                (0, child_process_1.execSync)('where cl', { stdio: 'pipe' });
                buildToolsCheck = true;
                buildToolsMessage = 'Visual Studio Build Tools available';
            }
            catch {
                buildToolsMessage = 'Visual Studio Build Tools not found';
            }
        }
        else {
            // Check for make and gcc/clang
            try {
                (0, child_process_1.execSync)('which make', { stdio: 'pipe' });
                (0, child_process_1.execSync)('which gcc', { stdio: 'pipe' });
                buildToolsCheck = true;
                buildToolsMessage = 'Build tools (make, gcc) available';
            }
            catch {
                try {
                    (0, child_process_1.execSync)('which clang', { stdio: 'pipe' });
                    buildToolsCheck = true;
                    buildToolsMessage = 'Build tools (make, clang) available';
                }
                catch {
                    buildToolsMessage = 'Build tools (make, gcc/clang) not found';
                }
            }
        }
        if (!pythonCheck || !buildToolsCheck) {
            const instructions = (0, os_1.platform)() === 'win32'
                ? 'Install Visual Studio Build Tools and Python from the Microsoft Store or python.org'
                : (0, os_1.platform)() === 'darwin'
                    ? 'Install Xcode Command Line Tools: xcode-select --install'
                    : 'Install build-essential and python3: sudo apt-get install build-essential python3';
            return {
                name: 'Build Tools',
                passed: false,
                message: `Missing: ${!pythonCheck ? 'Python' : ''} ${!buildToolsCheck ? buildToolsMessage : ''}`,
                fixInstructions: `${instructions}. Note: Build tools are only required for native dependencies.`,
                severity: 'warning'
            };
        }
        return {
            name: 'Build Tools',
            passed: true,
            message: `${pythonVersion}, ${buildToolsMessage}`,
            severity: 'info'
        };
    }
    catch (error) {
        return {
            name: 'Build Tools',
            passed: false,
            message: 'Unable to check build tools',
            severity: 'warning'
        };
    }
}
async function checkRegistryAccess(packageManager) {
    try {
        const registryUrl = packageManager === 'yarn' ? 'https://registry.yarnpkg.com' : 'https://registry.npmjs.org';
        // Try to fetch registry info
        const https = await Promise.resolve().then(() => __importStar(require('https')));
        const url = await Promise.resolve().then(() => __importStar(require('url')));
        return new Promise((resolve) => {
            const parsedUrl = url.parse(registryUrl);
            const req = https.request({
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || 443,
                path: '/',
                method: 'HEAD',
                timeout: 5000
            }, (res) => {
                resolve({
                    name: 'Registry Access',
                    passed: res.statusCode === 200,
                    message: res.statusCode === 200 ? 'Registry accessible' : `Registry returned ${res.statusCode}`,
                    severity: res.statusCode === 200 ? 'info' : 'error'
                });
            });
            req.on('error', () => {
                resolve({
                    name: 'Registry Access',
                    passed: false,
                    message: `Cannot access ${registryUrl}`,
                    fixInstructions: 'Check your internet connection and proxy settings.',
                    severity: 'error'
                });
            });
            req.on('timeout', () => {
                resolve({
                    name: 'Registry Access',
                    passed: false,
                    message: 'Registry request timed out',
                    fixInstructions: 'Check your internet connection and proxy settings.',
                    severity: 'error'
                });
            });
            req.end();
        });
    }
    catch (error) {
        return {
            name: 'Registry Access',
            passed: false,
            message: 'Unable to check registry access',
            severity: 'warning'
        };
    }
}
function displaySystemChecks(result) {
    console.log('\n🔍 System Check Results:\n');
    result.checks.forEach(check => {
        const icon = check.passed ? '✅' :
            check.severity === 'error' ? '❌' :
                check.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${icon} ${check.name}: ${check.message}`);
        if (!check.passed && check.fixInstructions) {
            console.log(`   → ${check.fixInstructions}\n`);
        }
    });
    const errors = result.checks.filter(c => c.severity === 'error' && !c.passed);
    const warnings = result.checks.filter(c => c.severity === 'warning' && !c.passed);
    if (errors.length > 0) {
        console.log(`\n❌ ${errors.length} critical issue(s) found. Please fix these before proceeding.\n`);
    }
    else if (warnings.length > 0) {
        console.log(`\n⚠️ ${warnings.length} warning(s) found. The project may still work, but some features might be limited.\n`);
    }
    else {
        console.log('\n✅ All system checks passed!\n');
    }
}
//# sourceMappingURL=system-checks.js.map