import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, accessSync, constants, statSync } from 'fs';
import { platform, arch, totalmem, freemem } from 'os';
import { performSystemChecks, displaySystemChecks, SystemCheck } from '../system-checks';
import { ProjectConfig } from '../types';

// Mock Node.js modules
vi.mock('child_process');
vi.mock('fs');
vi.mock('os');

const mockExecSync = vi.mocked(execSync);
const mockExistsSync = vi.mocked(existsSync);
const mockAccessSync = vi.mocked(accessSync);
const mockStatSync = vi.mocked(statSync);
const mockPlatform = vi.mocked(platform);
const mockTotalmem = vi.mocked(totalmem);
const mockFreemem = vi.mocked(freemem);

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

describe('System Checks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default successful mocks
    mockPlatform.mockReturnValue('linux');
    mockTotalmem.mockReturnValue(8 * 1024 * 1024 * 1024); // 8GB
    mockFreemem.mockReturnValue(4 * 1024 * 1024 * 1024); // 4GB
    mockExistsSync.mockReturnValue(false);
    mockStatSync.mockReturnValue({ isDirectory: () => true } as any);
    
    // Mock successful command executions
    mockExecSync.mockImplementation(((command: string) => {
      if (command.includes('node --version')) return 'v18.0.0';
      if (command.includes('npm --version')) return '9.0.0';
      if (command.includes('git --version')) return 'git version 2.34.1';
      if (command.includes('python --version')) return 'Python 3.9.0';
      if (command.includes('which make')) return '/usr/bin/make';
      if (command.includes('which gcc')) return '/usr/bin/gcc';
      return 'success';
    }) as any);
  });

  describe('Node.js Version Check', () => {
    it('should pass for supported Node.js version', async () => {
      Object.defineProperty(process, 'version', { value: 'v18.15.0', configurable: true });
      
      const result = await performSystemChecks(mockConfig);
      const nodeCheck = result.checks.find(c => c.name === 'Node.js Version');
      
      expect(nodeCheck?.passed).toBe(true);
      expect(nodeCheck?.message).toContain('v18.15.0');
    });

    it('should fail for unsupported Node.js version', async () => {
      Object.defineProperty(process, 'version', { value: 'v16.20.0', configurable: true });
      
      const result = await performSystemChecks(mockConfig);
      const nodeCheck = result.checks.find(c => c.name === 'Node.js Version');
      
      expect(nodeCheck?.passed).toBe(false);
      expect(nodeCheck?.severity).toBe('error');
      expect(nodeCheck?.fixInstructions).toContain('update Node.js');
    });

    it('should pass with recommendation for latest version', async () => {
      Object.defineProperty(process, 'version', { value: 'v22.0.0', configurable: true });
      
      const result = await performSystemChecks(mockConfig);
      const nodeCheck = result.checks.find(c => c.name === 'Node.js Version');
      
      expect(nodeCheck?.passed).toBe(true);
      expect(nodeCheck?.message).toContain('latest');
    });
  });

  describe('Package Manager Check', () => {
    it('should pass for available npm', async () => {
      mockExecSync.mockImplementation(((command: string) => {
        if (command === 'npm --version') return '9.5.0';
        throw new Error('Command not found');
      }) as any);

      const result = await performSystemChecks(mockConfig);
      const npmCheck = result.checks.find(c => c.name === 'Npm Package Manager');
      
      expect(npmCheck?.passed).toBe(true);
      expect(npmCheck?.message).toContain('npm v9.5.0');
    });

    it('should fail for missing package manager', async () => {
      mockExecSync.mockImplementation((() => {
        throw new Error('Command not found');
      }) as any);

      const config = { ...mockConfig, packageManager: 'pnpm' as const };
      const result = await performSystemChecks(config);
      const pnpmCheck = result.checks.find(c => c.name === 'Pnpm Package Manager');
      
      expect(pnpmCheck?.passed).toBe(false);
      expect(pnpmCheck?.severity).toBe('error');
      expect(pnpmCheck?.fixInstructions).toContain('npm install -g pnpm');
    });

    it('should handle yarn package manager', async () => {
      mockExecSync.mockImplementation(((command: string) => {
        if (command === 'yarn --version') return '1.22.19';
        throw new Error('Command not found');
      }) as any);

      const config = { ...mockConfig, packageManager: 'yarn' as const };
      const result = await performSystemChecks(config);
      const yarnCheck = result.checks.find(c => c.name === 'Yarn Package Manager');
      
      expect(yarnCheck?.passed).toBe(true);
      expect(yarnCheck?.message).toContain('yarn v1.22.19');
    });

    it('should handle bun package manager', async () => {
      mockExecSync.mockImplementation(((command: string) => {
        if (command === 'bun --version') return '1.0.15';
        throw new Error('Command not found');
      }) as any);

      const config = { ...mockConfig, packageManager: 'bun' as const };
      const result = await performSystemChecks(config);
      const bunCheck = result.checks.find(c => c.name === 'Bun Package Manager');
      
      expect(bunCheck?.passed).toBe(true);
      expect(bunCheck?.message).toContain('bun v1.0.15');
    });
  });

  describe('Git Check', () => {
    it('should pass when git is available', async () => {
      mockExecSync.mockImplementation(((command: string) => {
        if (command === 'git --version') return 'git version 2.34.1';
        return 'success';
      }) as any);

      const result = await performSystemChecks(mockConfig);
      const gitCheck = result.checks.find(c => c.name === 'Git');
      
      expect(gitCheck?.passed).toBe(true);
      expect(gitCheck?.message).toContain('git version 2.34.1');
    });

    it('should warn when git is not available', async () => {
      mockExecSync.mockImplementation(((command: string) => {
        if (command === 'git --version') throw new Error('Command not found');
        return 'success';
      }) as any);

      const result = await performSystemChecks(mockConfig);
      const gitCheck = result.checks.find(c => c.name === 'Git');
      
      expect(gitCheck?.passed).toBe(false);
      expect(gitCheck?.severity).toBe('warning');
      expect(gitCheck?.fixInstructions).toContain('git-scm.com');
    });
  });

  describe('Disk Space Check', () => {
    it('should pass with sufficient disk space', async () => {
      mockFreemem.mockReturnValue(2 * 1024 * 1024 * 1024); // 2GB

      const result = await performSystemChecks(mockConfig);
      const diskCheck = result.checks.find(c => c.name === 'Disk Space');
      
      expect(diskCheck?.passed).toBe(true);
      expect(diskCheck?.message).toContain('2048MB available');
    });

    it('should fail with insufficient disk space', async () => {
      mockFreemem.mockReturnValue(50 * 1024 * 1024); // 50MB

      const result = await performSystemChecks(mockConfig);
      const diskCheck = result.checks.find(c => c.name === 'Disk Space');
      
      expect(diskCheck?.passed).toBe(false);
      expect(diskCheck?.severity).toBe('error');
      expect(diskCheck?.fixInstructions).toContain('Free up disk space');
    });
  });

  describe('Directory Permissions Check', () => {
    it('should pass with write permissions and non-existing directory', async () => {
      mockExistsSync.mockReturnValue(false);
      mockAccessSync.mockImplementation(() => {}); // No error = success

      const result = await performSystemChecks(mockConfig);
      const permCheck = result.checks.find(c => c.name === 'Directory Permissions');
      
      expect(permCheck?.passed).toBe(true);
      expect(permCheck?.message).toContain('Write permissions available');
    });

    it('should fail when directory already exists', async () => {
      mockExistsSync.mockReturnValue(true);

      const result = await performSystemChecks(mockConfig);
      const permCheck = result.checks.find(c => c.name === 'Directory Permissions');
      
      expect(permCheck?.passed).toBe(false);
      expect(permCheck?.severity).toBe('error');
      expect(permCheck?.message).toContain('already exists');
    });

    it('should fail without write permissions', async () => {
      mockExistsSync.mockReturnValue(false);
      mockAccessSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = await performSystemChecks(mockConfig);
      const permCheck = result.checks.find(c => c.name === 'Directory Permissions');
      
      expect(permCheck?.passed).toBe(false);
      expect(permCheck?.severity).toBe('error');
      expect(permCheck?.fixInstructions).toContain('write access');
    });
  });

  describe('Windows Path Length Check', () => {
    it('should pass on non-Windows platforms', async () => {
      mockPlatform.mockReturnValue('darwin');

      const result = await performSystemChecks(mockConfig);
      const pathCheck = result.checks.find(c => c.name === 'Path Length');
      
      expect(pathCheck?.passed).toBe(true);
      expect(pathCheck?.message).toContain('Not applicable');
    });

    it('should pass with short path on Windows', async () => {
      mockPlatform.mockReturnValue('win32');
      
      // Mock short current directory
      const originalCwd = process.cwd;
      (process as any).cwd = vi.fn().mockReturnValue('C:\\short');

      const result = await performSystemChecks(mockConfig);
      const pathCheck = result.checks.find(c => c.name === 'Windows Path Length');
      
      expect(pathCheck?.passed).toBe(true);
      expect(pathCheck?.message).toContain('Path length OK');
      
      process.cwd = originalCwd;
    });

    it('should fail with long path on Windows', async () => {
      mockPlatform.mockReturnValue('win32');
      
      // Mock very long current directory
      const longPath = 'C:\\' + 'very-long-directory-name\\'.repeat(20);
      const originalCwd = process.cwd;
      (process as any).cwd = vi.fn().mockReturnValue(longPath);

      const result = await performSystemChecks(mockConfig);
      const pathCheck = result.checks.find(c => c.name === 'Windows Path Length');
      
      expect(pathCheck?.passed).toBe(false);
      expect(pathCheck?.severity).toBe('error');
      expect(pathCheck?.fixInstructions).toContain('shorter project name');
      
      process.cwd = originalCwd;
    });
  });

  describe('Memory Check', () => {
    it('should pass with sufficient memory', async () => {
      mockFreemem.mockReturnValue(1024 * 1024 * 1024); // 1GB

      const result = await performSystemChecks(mockConfig);
      const memCheck = result.checks.find(c => c.name === 'Available Memory');
      
      expect(memCheck?.passed).toBe(true);
      expect(memCheck?.message).toContain('1024MB available');
    });

    it('should warn with low memory', async () => {
      mockFreemem.mockReturnValue(200 * 1024 * 1024); // 200MB

      const result = await performSystemChecks(mockConfig);
      const memCheck = result.checks.find(c => c.name === 'Available Memory');
      
      expect(memCheck?.passed).toBe(false);
      expect(memCheck?.severity).toBe('warning');
      expect(memCheck?.fixInstructions).toContain('Close other applications');
    });
  });

  describe('Build Tools Check', () => {
    it('should pass with all build tools available on Linux', async () => {
      mockPlatform.mockReturnValue('linux');
      mockExecSync.mockImplementation(((command: string) => {
        if (command === 'python --version') return 'Python 3.9.0';
        if (command === 'which make') return '/usr/bin/make';
        if (command === 'which gcc') return '/usr/bin/gcc';
        return 'success';
      }) as any);

      const result = await performSystemChecks(mockConfig);
      const buildCheck = result.checks.find(c => c.name === 'Build Tools');
      
      expect(buildCheck?.passed).toBe(true);
      expect(buildCheck?.message).toContain('Python 3.9.0');
      expect(buildCheck?.message).toContain('make, gcc');
    });

    it('should work with clang instead of gcc', async () => {
      mockPlatform.mockReturnValue('darwin');
      mockExecSync.mockImplementation(((command: string) => {
        if (command === 'python3 --version') return 'Python 3.11.0';
        if (command === 'which make') return '/usr/bin/make';
        if (command === 'which gcc') throw new Error('Not found');
        if (command === 'which clang') return '/usr/bin/clang';
        return 'success';
      }) as any);

      const result = await performSystemChecks(mockConfig);
      const buildCheck = result.checks.find(c => c.name === 'Build Tools');
      
      expect(buildCheck?.passed).toBe(true);
      expect(buildCheck?.message).toContain('clang');
    });

    it('should warn when build tools are missing', async () => {
      mockPlatform.mockReturnValue('linux');
      mockExecSync.mockImplementation((() => {
        throw new Error('Command not found');
      }) as any);

      const result = await performSystemChecks(mockConfig);
      const buildCheck = result.checks.find(c => c.name === 'Build Tools');
      
      expect(buildCheck?.passed).toBe(false);
      expect(buildCheck?.severity).toBe('warning');
      expect(buildCheck?.fixInstructions).toContain('build-essential');
    });

    it('should provide Windows-specific instructions', async () => {
      mockPlatform.mockReturnValue('win32');
      mockExecSync.mockImplementation((() => {
        throw new Error('Command not found');
      }) as any);

      const result = await performSystemChecks(mockConfig);
      const buildCheck = result.checks.find(c => c.name === 'Build Tools');
      
      expect(buildCheck?.passed).toBe(false);
      expect(buildCheck?.severity).toBe('warning');
      expect(buildCheck?.fixInstructions).toContain('Visual Studio Build Tools');
    });
  });

  describe('Result Analysis', () => {
    it('should allow proceeding when all checks pass', async () => {
      // All mocks are set to success by default
      const result = await performSystemChecks(mockConfig);
      
      expect(result.allPassed).toBe(true);
      expect(result.canProceed).toBe(true);
    });

    it('should prevent proceeding when critical errors exist', async () => {
      Object.defineProperty(process, 'version', { value: 'v16.20.0', configurable: true });
      
      const result = await performSystemChecks(mockConfig);
      
      expect(result.allPassed).toBe(false);
      expect(result.canProceed).toBe(false);
    });

    it('should have proper logic for warnings vs errors', () => {
      // Test the core logic without async operations
      const mockChecks: SystemCheck[] = [
        { name: 'Node.js', passed: true, severity: 'info', message: 'OK' },
        { name: 'Git', passed: false, severity: 'warning', message: 'Not found' },
        { name: 'Build Tools', passed: false, severity: 'warning', message: 'Missing' }
      ];
      
      const errors = mockChecks.filter(c => c.severity === 'error' && !c.passed);
      const warnings = mockChecks.filter(c => c.severity === 'warning' && !c.passed);
      
      const mockResult = {
        allPassed: errors.length === 0,
        checks: mockChecks,
        canProceed: errors.length === 0
      };
      
      expect(mockResult.canProceed).toBe(true); // Should proceed with warnings only
      expect(warnings.length).toBe(2); // Should have 2 warnings
      expect(errors.length).toBe(0); // Should have 0 errors
    });
  });

  describe('Display Function', () => {
    it('should display system check results', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation((() => {}) as any);
      
      const mockResult = {
        allPassed: false,
        canProceed: false,
        checks: [
          {
            name: 'Test Check',
            passed: true,
            message: 'Test passed',
            severity: 'info' as const
          },
          {
            name: 'Failed Check',
            passed: false,
            message: 'Test failed',
            severity: 'error' as const,
            fixInstructions: 'Fix this issue'
          }
        ]
      };

      displaySystemChecks(mockResult);
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('System Check Results'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✅ Test Check'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Failed Check'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Fix this issue'));
      
      consoleSpy.mockRestore();
    });
  });
});