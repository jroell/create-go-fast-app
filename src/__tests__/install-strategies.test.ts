import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { execSync } from 'child_process';
import { platform } from 'os';
import {
  getInstallStrategy,
  installDependencies,
  validatePackageManager,
  checkPackageManagerVersion
} from '../install-strategies';
import { ProjectConfig } from '../types';

// Mock Node.js modules
jest.mock('child_process');
jest.mock('os');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockPlatform = platform as jest.MockedFunction<typeof platform>;

const mockConfig: ProjectConfig = {
  projectName: 'test-project',
  template: 'full',
  includeAuth: true,
  includeDatabase: true,
  includeAI: true,
  includeElectron: false,
  includeObservability: true,
  packageManager: 'npm',
  skipInstall: false,
};

describe('Install Strategies', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockPlatform.mockReturnValue('linux');
  });

  describe('getInstallStrategy', () => {
    it('should return npm strategy', () => {
      const strategy = getInstallStrategy('npm', mockConfig);
      
      expect(strategy.command).toBe('npm install');
      expect(strategy.fallbackCommands).toContain('npm install --legacy-peer-deps');
      expect(strategy.fallbackCommands).toContain('npm install --force');
      expect(strategy.fallbackCommands).toContain('npm install --no-optional --legacy-peer-deps');
      expect(strategy.timeout).toBe(300000);
      expect(strategy.env).toHaveProperty('NODE_ENV', 'development');
    });

    it('should return yarn strategy', () => {
      const strategy = getInstallStrategy('yarn', mockConfig);
      
      expect(strategy.command).toBe('yarn install');
      expect(strategy.fallbackCommands).toContain('yarn install --ignore-engines');
      expect(strategy.fallbackCommands).toContain('yarn install --no-optional');
      expect(strategy.timeout).toBe(300000);
    });

    it('should return pnpm strategy', () => {
      const strategy = getInstallStrategy('pnpm', mockConfig);
      
      expect(strategy.command).toBe('pnpm install');
      expect(strategy.fallbackCommands).toContain('pnpm install --strict-peer-dependencies=false');
      expect(strategy.fallbackCommands).toContain('pnpm install --no-optional');
      expect(strategy.timeout).toBe(300000);
    });

    it('should return bun strategy', () => {
      const strategy = getInstallStrategy('bun', mockConfig);
      
      expect(strategy.command).toBe('bun install');
      expect(strategy.fallbackCommands).toContain('bun install --ignore-scripts');
      expect(strategy.fallbackCommands).toContain('bun install --no-optional');
      expect(strategy.timeout).toBe(300000);
    });

    it('should throw error for unknown package manager', () => {
      expect(() => getInstallStrategy('unknown', mockConfig)).toThrow('Unknown package manager: unknown');
    });
  });

  describe('installDependencies', () => {
    const projectPath = '/test/project';

    it('should succeed on first attempt', async () => {
      mockExecSync.mockReturnValue('Installation successful');

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(true);
      expect(result.command).toBe('npm install');
      expect(result.output).toBe('Installation successful');
      expect(mockExecSync).toHaveBeenCalledTimes(1);
    });

    it('should try fallback commands on failure', async () => {
      mockExecSync
        .mockImplementationOnce(() => {
          throw new Error('ERESOLVE unable to resolve dependency tree');
        })
        .mockReturnValueOnce('Installation successful with legacy peer deps');

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(true);
      expect(result.command).toBe('npm install --legacy-peer-deps');
      expect(mockExecSync).toHaveBeenCalledTimes(2);
    });

    it('should fail after all attempts exhausted', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Network error');
      });

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
      expect(result.fixInstructions).toBeDefined();
      expect(mockExecSync).toHaveBeenCalledTimes(4); // 1 main + 3 fallbacks
    });

    it('should provide network-specific fix instructions', async () => {
      mockExecSync.mockImplementation(() => {
        const error = new Error('ECONNRESET');
        (error as any).stderr = 'ECONNRESET connection reset by peer';
        throw error;
      });

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(false);
      expect(result.fixInstructions).toContain('Network connection issue');
      expect(result.fixInstructions).toContain('proxy settings');
    });

    it('should provide disk space fix instructions', async () => {
      mockExecSync.mockImplementation(() => {
        const error = new Error('ENOSPC');
        (error as any).stderr = 'ENOSPC: no space left on device';
        throw error;
      });

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(false);
      expect(result.fixInstructions).toContain('Insufficient disk space');
      expect(result.fixInstructions).toContain('Clear package manager cache');
    });

    it('should provide permission fix instructions', async () => {
      mockExecSync.mockImplementation(() => {
        const error = new Error('EACCES');
        (error as any).stderr = 'EACCES: permission denied';
        throw error;
      });

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(false);
      expect(result.fixInstructions).toContain('Permission error');
    });

    it('should provide Windows-specific permission instructions', async () => {
      mockPlatform.mockReturnValue('win32');
      mockExecSync.mockImplementation(() => {
        const error = new Error('EPERM');
        (error as any).stderr = 'EPERM: operation not permitted';
        throw error;
      });

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(false);
      expect(result.fixInstructions).toContain('Run command prompt as administrator');
    });

    it('should provide build tools fix instructions', async () => {
      mockExecSync.mockImplementation(() => {
        const error = new Error('Python not found');
        (error as any).stderr = 'gyp ERR! find Python Python is not set from command line';
        throw error;
      });

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(false);
      expect(result.fixInstructions).toContain('Build tools error');
      expect(result.fixInstructions).toContain('build-essential python3');
    });

    it('should provide macOS-specific build tools instructions', async () => {
      mockPlatform.mockReturnValue('darwin');
      mockExecSync.mockImplementation(() => {
        const error = new Error('No Xcode');
        (error as any).stderr = 'gyp: No Xcode or CLT version detected!';
        throw error;
      });

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(false);
      expect(result.fixInstructions).toContain('xcode-select --install');
    });

    it('should provide Windows-specific build tools instructions', async () => {
      mockPlatform.mockReturnValue('win32');
      mockExecSync.mockImplementation(() => {
        const error = new Error('MSBuild not found');
        (error as any).stderr = 'MSBUILD : error MSB1009: Project file does not exist';
        throw error;
      });

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(false);
      expect(result.fixInstructions).toContain('Visual Studio Build Tools');
    });

    it('should handle yarn-specific installation', async () => {
      mockExecSync.mockReturnValue('yarn install v1.22.19');

      const result = await installDependencies(projectPath, 'yarn', mockConfig);
      
      expect(result.success).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith(
        'yarn install',
        expect.objectContaining({
          cwd: projectPath,
          env: expect.objectContaining({ NODE_ENV: 'development' })
        })
      );
    });

    it('should handle pnpm-specific installation', async () => {
      mockExecSync.mockReturnValue('Packages installed successfully');

      const result = await installDependencies(projectPath, 'pnpm', mockConfig);
      
      expect(result.success).toBe(true);
      expect(result.command).toBe('pnpm install');
    });

    it('should handle bun-specific installation', async () => {
      mockExecSync.mockReturnValue('bun install v1.0.15');

      const result = await installDependencies(projectPath, 'bun', mockConfig);
      
      expect(result.success).toBe(true);
      expect(result.command).toBe('bun install');
    });

    it('should add delay for network timeouts', async () => {
      const originalSetTimeout = global.setTimeout;
      (global as any).setTimeout = jest.fn().mockImplementation((cb: any) => cb()) as any;

      mockExecSync
        .mockImplementationOnce(() => {
          const error = new Error('timeout');
          (error as any).stderr = 'Request timeout';
          throw error;
        })
        .mockReturnValueOnce('Success on retry');

      const result = await installDependencies(projectPath, 'npm', mockConfig);
      
      expect(result.success).toBe(true);
      expect(global.setTimeout).toHaveBeenCalled();
      
      global.setTimeout = originalSetTimeout;
    });
  });

  describe('validatePackageManager', () => {
    it('should validate known package managers', () => {
      expect(validatePackageManager('npm')).toBe(true);
      expect(validatePackageManager('yarn')).toBe(true);
      expect(validatePackageManager('pnpm')).toBe(true);
      expect(validatePackageManager('bun')).toBe(true);
    });

    it('should reject unknown package managers', () => {
      expect(validatePackageManager('pip')).toBe(false);
      expect(validatePackageManager('apt')).toBe(false);
      expect(validatePackageManager('')).toBe(false);
    });
  });

  describe('checkPackageManagerVersion', () => {
    it('should check npm version compatibility', async () => {
      mockExecSync.mockReturnValue('9.5.0');

      const result = await checkPackageManagerVersion('npm');
      
      expect(result.version).toBe('9.5.0');
      expect(result.compatible).toBe(true);
      expect(result.recommendation).toBeUndefined();
    });

    it('should recommend npm update for old versions', async () => {
      mockExecSync.mockReturnValue('6.14.18');

      const result = await checkPackageManagerVersion('npm');
      
      expect(result.version).toBe('6.14.18');
      expect(result.compatible).toBe(false);
      expect(result.recommendation).toContain('Update to npm 7+');
    });

    it('should check yarn version compatibility', async () => {
      mockExecSync.mockReturnValue('3.6.4');

      const result = await checkPackageManagerVersion('yarn');
      
      expect(result.version).toBe('3.6.4');
      expect(result.compatible).toBe(true);
    });

    it('should recommend yarn update for old versions', async () => {
      mockExecSync.mockReturnValue('1.22.19');

      const result = await checkPackageManagerVersion('yarn');
      
      expect(result.version).toBe('1.22.19');
      expect(result.compatible).toBe(true);
      expect(result.recommendation).toContain('Consider upgrading to Yarn 3+');
    });

    it('should check pnpm version compatibility', async () => {
      mockExecSync.mockReturnValue('8.10.0');

      const result = await checkPackageManagerVersion('pnpm');
      
      expect(result.version).toBe('8.10.0');
      expect(result.compatible).toBe(true);
    });

    it('should recommend pnpm update for old versions', async () => {
      mockExecSync.mockReturnValue('5.18.10');

      const result = await checkPackageManagerVersion('pnpm');
      
      expect(result.version).toBe('5.18.10');
      expect(result.compatible).toBe(false);
      expect(result.recommendation).toContain('Update to pnpm 8+');
    });

    it('should check bun with experimental warning', async () => {
      mockExecSync.mockReturnValue('1.0.15');

      const result = await checkPackageManagerVersion('bun');
      
      expect(result.version).toBe('1.0.15');
      expect(result.compatible).toBe(true);
      expect(result.recommendation).toContain('experimental');
    });

    it('should handle missing package manager', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Command not found');
      });

      const result = await checkPackageManagerVersion('npm');
      
      expect(result.version).toBe('not found');
      expect(result.compatible).toBe(false);
      expect(result.recommendation).toContain('Install npm first');
    });

    it('should handle unknown package manager', async () => {
      const result = await checkPackageManagerVersion('unknown');
      
      expect(result.version).toBe('not found');
      expect(result.compatible).toBe(false);
      expect(result.recommendation).toContain('Install unknown first');
    });
  });
});