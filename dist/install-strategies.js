"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstallStrategy = getInstallStrategy;
exports.installDependencies = installDependencies;
exports.validatePackageManager = validatePackageManager;
exports.checkPackageManagerVersion = checkPackageManagerVersion;
const child_process_1 = require("child_process");
const os_1 = require("os");
function getInstallStrategy(packageManager, config) {
    const baseEnv = {
        ...process.env,
        NODE_ENV: 'development',
        FORCE_COLOR: '1'
    };
    switch (packageManager) {
        case 'npm':
            return {
                command: 'npm install --force',
                fallbackCommands: [
                    'npm install --legacy-peer-deps',
                    'npm install',
                    'npm install --no-optional --legacy-peer-deps'
                ],
                timeout: 300000, // 5 minutes
                env: baseEnv
            };
        case 'yarn':
            return {
                command: 'yarn install',
                fallbackCommands: [
                    'yarn install --ignore-engines',
                    'yarn install --no-optional',
                    'yarn install --ignore-engines --no-optional'
                ],
                timeout: 300000,
                env: baseEnv
            };
        case 'pnpm':
            return {
                command: 'pnpm install',
                fallbackCommands: [
                    'pnpm install --strict-peer-dependencies=false',
                    'pnpm install --no-optional',
                    'pnpm install --strict-peer-dependencies=false --no-optional'
                ],
                timeout: 300000,
                env: baseEnv
            };
        case 'bun':
            return {
                command: 'bun install',
                fallbackCommands: [
                    'bun install --ignore-scripts',
                    'bun install --no-optional',
                    'bun install --ignore-scripts --no-optional'
                ],
                timeout: 300000,
                env: baseEnv
            };
        default:
            throw new Error(`Unknown package manager: ${packageManager}`);
    }
}
async function installDependencies(projectPath, packageManager, config) {
    const strategy = getInstallStrategy(packageManager, config);
    const commands = [strategy.command, ...strategy.fallbackCommands];
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        const isLastAttempt = i === commands.length - 1;
        try {
            console.log(`\n📦 Installing dependencies with: ${command}`);
            const output = (0, child_process_1.execSync)(command, {
                cwd: projectPath,
                stdio: 'pipe',
                encoding: 'utf8',
                timeout: strategy.timeout,
                env: strategy.env
            });
            return {
                success: true,
                command,
                output
            };
        }
        catch (error) {
            const errorMessage = error.stderr || error.stdout || error.message || 'Unknown error';
            if (isLastAttempt) {
                return {
                    success: false,
                    command,
                    error: errorMessage,
                    fixInstructions: getInstallFixInstructions(packageManager, errorMessage)
                };
            }
            console.log(`⚠️ Command failed: ${command}`);
            console.log(`   Trying next strategy...`);
            // Add specific delays for certain error types
            if (errorMessage.includes('ECONNRESET') || errorMessage.includes('timeout')) {
                console.log('   Waiting 3 seconds before retry...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }
    return {
        success: false,
        command: strategy.command,
        error: 'All install strategies failed',
        fixInstructions: getGeneralInstallFixInstructions(packageManager)
    };
}
function getInstallFixInstructions(packageManager, errorMessage) {
    const lowerError = errorMessage.toLowerCase();
    // Network related errors
    if (lowerError.includes('econnreset') || lowerError.includes('enotfound') || lowerError.includes('timeout')) {
        return `Network connection issue detected. Try:
    1. Check your internet connection
    2. If behind a corporate firewall, configure proxy settings
    3. Try switching to a different network
    4. Run: ${packageManager} config set registry https://registry.npmjs.org/`;
    }
    // Disk space errors
    if (lowerError.includes('enospc') || lowerError.includes('disk') || lowerError.includes('space')) {
        return `Insufficient disk space. Try:
    1. Free up disk space
    2. Clear package manager cache: ${getClearCacheCommand(packageManager)}
    3. Move to a directory with more space`;
    }
    // Permission errors
    if (lowerError.includes('eacces') || lowerError.includes('permission') || lowerError.includes('eperm')) {
        const isWindows = (0, os_1.platform)() === 'win32';
        return `Permission error detected. Try:
    ${isWindows
            ? '1. Run command prompt as administrator\n    2. Or install in a different directory'
            : '1. Check directory permissions: ls -la\n    2. Or use a directory you own'}
    3. Clear cache: ${getClearCacheCommand(packageManager)}`;
    }
    // Peer dependency errors
    if (lowerError.includes('peer dep') || lowerError.includes('eresolve')) {
        return `Dependency conflict detected. This was attempted automatically, but you can also try:
    1. ${packageManager === 'npm' ? 'npm install --legacy-peer-deps' : 'Use npm instead: npm install --legacy-peer-deps'}
    2. Delete node_modules and package-lock.json, then retry
    3. Check for conflicting global packages`;
    }
    // Python/build tools errors
    if (lowerError.includes('python') || lowerError.includes('gyp') || lowerError.includes('msbuild')) {
        const isWindows = (0, os_1.platform)() === 'win32';
        return `Build tools error detected. Install build dependencies:
    ${isWindows
            ? '1. Install Visual Studio Build Tools\n    2. Install Python from Microsoft Store'
            : (0, os_1.platform)() === 'darwin'
                ? '1. Install Xcode Command Line Tools: xcode-select --install'
                : '1. Install build tools: sudo apt-get install build-essential python3'}
    3. Retry installation
    4. Or skip optional dependencies: ${packageManager} install --no-optional`;
    }
    // Generic error
    return getGeneralInstallFixInstructions(packageManager);
}
function getGeneralInstallFixInstructions(packageManager) {
    return `Installation failed. Try these steps:
  1. Clear cache: ${getClearCacheCommand(packageManager)}
  2. Delete node_modules and lock file, then retry
  3. Check internet connection and proxy settings
  4. Update ${packageManager} to latest version
  5. Try with a different package manager (npm, yarn, pnpm, bun)
  6. Run with verbose output: ${getVerboseCommand(packageManager)}`;
}
function getClearCacheCommand(packageManager) {
    switch (packageManager) {
        case 'npm': return 'npm cache clean --force';
        case 'yarn': return 'yarn cache clean';
        case 'pnpm': return 'pnpm store prune';
        case 'bun': return 'bun pm cache rm';
        default: return 'npm cache clean --force';
    }
}
function getVerboseCommand(packageManager) {
    switch (packageManager) {
        case 'npm': return 'npm install --verbose';
        case 'yarn': return 'yarn install --verbose';
        case 'pnpm': return 'pnpm install --reporter=verbose';
        case 'bun': return 'bun install --verbose';
        default: return 'npm install --verbose';
    }
}
function validatePackageManager(packageManager) {
    const validManagers = ['npm', 'yarn', 'pnpm', 'bun'];
    return validManagers.includes(packageManager);
}
async function checkPackageManagerVersion(packageManager) {
    try {
        const version = (0, child_process_1.execSync)(`${packageManager} --version`, {
            encoding: 'utf8',
            stdio: 'pipe'
        }).trim();
        const majorVersion = parseInt(version.split('.')[0]);
        switch (packageManager) {
            case 'npm':
                return {
                    version,
                    compatible: majorVersion >= 7,
                    recommendation: majorVersion < 7 ? 'Update to npm 7+ for better dependency resolution' : undefined
                };
            case 'yarn':
                return {
                    version,
                    compatible: majorVersion >= 1,
                    recommendation: majorVersion < 3 ? 'Consider upgrading to Yarn 3+ for better performance' : undefined
                };
            case 'pnpm':
                return {
                    version,
                    compatible: majorVersion >= 6,
                    recommendation: majorVersion < 8 ? 'Update to pnpm 8+ for better compatibility' : undefined
                };
            case 'bun':
                return {
                    version,
                    compatible: true,
                    recommendation: 'Bun is experimental, consider npm for production projects'
                };
            default:
                return {
                    version: 'unknown',
                    compatible: false,
                    recommendation: 'Use npm, yarn, pnpm, or bun'
                };
        }
    }
    catch (error) {
        return {
            version: 'not found',
            compatible: false,
            recommendation: `Install ${packageManager} first`
        };
    }
}
//# sourceMappingURL=install-strategies.js.map