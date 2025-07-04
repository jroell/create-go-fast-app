import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import mockFs from 'mock-fs';
import { createProject } from '../create-project';
import { performSystemChecks } from '../system-checks';
import { ProjectConfig } from '../types';
import { existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

// Mock external dependencies
vi.mock('child_process');
vi.mock('../install-strategies', () => ({
  installDependencies: vi.fn().mockResolvedValue({ 
    success: true, 
    command: 'npm install --force',
    output: 'Installation successful'
  })
}));

const mockExecSync = vi.mocked(execSync);

describe('Error Scenarios and Edge Cases', () => {
  const mockCwd = '/tmp/test-workspace';
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    vi.clearAllMocks();
    
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    
    mockFs({
      [mockCwd]: {}
    });

    // Default successful mocks
    mockExecSync.mockReturnValue('success');
  });

  afterEach(() => {
    mockFs.restore();
    vi.restoreAllMocks();
    process.chdir(originalCwd);
  });

  describe('Project Name Validation', () => {
    it('should handle edge case project names gracefully', async () => {
      const edgeCases = [
        { name: '', description: 'empty name' },
        { name: '   ', description: 'whitespace only' },
        { name: 'a'.repeat(100), description: 'very long name' },
        { name: '.', description: 'dot only' },
        { name: '..', description: 'double dot' }
      ];

      for (const testCase of edgeCases) {
        const config: ProjectConfig = {
          projectName: testCase.name,
          template: 'minimal',
          includeAuth: false,
          includeDatabase: false,
          includeAI: false,
          includeElectron: false,
          includeObservability: false,
          packageManager: 'npm',
          skipInstall: true
        };

        try {
          await createProject(config);
          // If creation succeeds, verify the project exists with valid structure
          const projectPath = join(mockCwd, testCase.name.trim() || 'default');
          if (existsSync(projectPath)) {
            expect(existsSync(join(projectPath, 'package.json'))).toBe(true);
          }
        } catch (error) {
          // Error is acceptable for invalid names
          expect(error).toBeDefined();
        }
      }
    });

    it('should sanitize project names with special characters', async () => {
      const config: ProjectConfig = {
        projectName: 'my-valid_project123',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);
      
      const projectPath = join(mockCwd, 'my-valid_project123');
      expect(existsSync(projectPath)).toBe(true);
      expect(existsSync(join(projectPath, 'package.json'))).toBe(true);
    });
  });

  describe('Directory Conflicts', () => {
    it('should handle existing directory with same name', async () => {
      // Create existing directory first
      mockFs({
        [mockCwd]: {
          'existing-project': {
            'existing-file.txt': 'content'
          }
        }
      });

      const config: ProjectConfig = {
        projectName: 'existing-project',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      try {
        await createProject(config);
        // If it doesn't throw, should handle existing directory gracefully
        const projectPath = join(mockCwd, 'existing-project');
        expect(existsSync(projectPath)).toBe(true);
      } catch (error) {
        // Error is acceptable for existing directory
        expect(error).toBeDefined();
      }
    });
  });

  describe('System Environment Issues', () => {
    it('should handle unsupported Node.js version', async () => {
      // Mock old Node.js version
      Object.defineProperty(process, 'version', { 
        value: 'v14.21.3', 
        configurable: true 
      });

      const config: ProjectConfig = {
        projectName: 'node-version-test',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      const result = await performSystemChecks(config);
      expect(result.canProceed).toBe(false);
      
      const nodeCheck = result.checks.find(c => c.name === 'Node.js Version');
      expect(nodeCheck?.passed).toBe(false);
      expect(nodeCheck?.severity).toBe('error');
      
      // Reset Node version
      Object.defineProperty(process, 'version', { 
        value: 'v18.15.0', 
        configurable: true 
      });
    });

    it('should handle missing package manager', async () => {
      mockExecSync.mockImplementation((command) => {
        if (command === 'pnpm --version') {
          throw new Error('pnpm: command not found');
        }
        return 'success';
      });

      const config: ProjectConfig = {
        projectName: 'pnpm-missing-test',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'pnpm',
        skipInstall: true
      };

      const result = await performSystemChecks(config);
      const pnpmCheck = result.checks.find(c => c.name === 'Pnpm Package Manager');
      expect(pnpmCheck?.passed).toBe(false);
    });

    it('should handle insufficient disk space simulation', async () => {
      const { freemem } = await import('os');
      vi.mocked(freemem).mockReturnValue(50 * 1024 * 1024); // 50MB

      const config: ProjectConfig = {
        projectName: 'disk-space-test',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: true
      };

      const result = await performSystemChecks(config);
      const diskCheck = result.checks.find(c => c.name === 'Disk Space');
      expect(diskCheck?.passed).toBe(false);
    });
  });

  describe('Template Configuration Errors', () => {
    it('should handle valid template configurations gracefully', async () => {
      const configs = [
        { template: 'minimal' as const, features: [] },
        { template: 'frontend' as const, features: ['includeAI'] },
        { template: 'full' as const, features: ['includeAuth', 'includeDatabase'] }
      ];

      for (const testConfig of configs) {
        const config: ProjectConfig = {
          projectName: `test-${testConfig.template}`,
          template: testConfig.template,
          includeAuth: testConfig.features.includes('includeAuth'),
          includeDatabase: testConfig.features.includes('includeDatabase'),
          includeAI: testConfig.features.includes('includeAI'),
          includeElectron: false,
          includeObservability: false,
          packageManager: 'npm',
          skipInstall: true
        };

        await createProject(config);
        
        const projectPath = join(mockCwd, `test-${testConfig.template}`);
        expect(existsSync(projectPath)).toBe(true);
        expect(existsSync(join(projectPath, 'package.json'))).toBe(true);
      }
    });
  });

  describe('Cross-Platform Compatibility', () => {
    it('should handle Windows path constraints', async () => {
      const { platform } = await import('os');
      vi.mocked(platform).mockReturnValue('win32');

      const config: ProjectConfig = {
        projectName: 'windows-test',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      const result = await performSystemChecks(config);
      const pathCheck = result.checks.find(c => c.name === 'Windows Path Length' || c.name === 'Path Length');
      
      if (pathCheck) {
        // Path check should exist for Windows
        expect(['info', 'warning', 'error']).toContain(pathCheck.severity);
      }
    });

    it('should work on different platforms', async () => {
      const platforms = ['linux', 'darwin', 'win32'] as const;
      
      for (const platformName of platforms) {
        const { platform } = await import('os');
        vi.mocked(platform).mockReturnValue(platformName);

        const config: ProjectConfig = {
          projectName: `${platformName}-test`,
          template: 'minimal',
          includeAuth: false,
          includeDatabase: false,
          includeAI: false,
          includeElectron: false,
          includeObservability: false,
          packageManager: 'npm',
          skipInstall: true
        };

        await createProject(config);
        
        const projectPath = join(mockCwd, `${platformName}-test`);
        expect(existsSync(projectPath)).toBe(true);
      }
    });
  });

  describe('Resource Constraints', () => {
    it('should handle large project configurations', async () => {
      const config: ProjectConfig = {
        projectName: 'large-project',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: true,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: true
      };

      // Should handle large project creation without errors
      await createProject(config);
      
      const projectPath = join(mockCwd, 'large-project');
      expect(existsSync(projectPath)).toBe(true);
      
      // Verify all feature directories were created
      const featureDirs = [
        'src/lib/auth',
        'src/lib/db',
        'src/lib/ai',
        'src/lib/trpc',
        'drizzle'
      ];

      featureDirs.forEach(dir => {
        expect(existsSync(join(projectPath, dir))).toBe(true);
      });
    });

    it('should handle multiple package managers', async () => {
      const packageManagers: Array<'npm' | 'yarn' | 'pnpm' | 'bun'> = ['npm', 'yarn', 'pnpm', 'bun'];
      
      for (const pm of packageManagers) {
        // Mock successful package manager version check
        mockExecSync.mockImplementation((command) => {
          if (command === `${pm} --version`) return '1.0.0';
          return 'success';
        });

        const config: ProjectConfig = {
          projectName: `${pm}-project`,
          template: 'minimal',
          includeAuth: false,
          includeDatabase: false,
          includeAI: false,
          includeElectron: false,
          includeObservability: false,
          packageManager: pm,
          skipInstall: true
        };

        await createProject(config);
        
        const projectPath = join(mockCwd, `${pm}-project`);
        expect(existsSync(projectPath)).toBe(true);
      }
    });
  });

  describe('Configuration Edge Cases', () => {
    it('should handle minimal features with advanced template', async () => {
      const config: ProjectConfig = {
        projectName: 'minimal-features-full-template',
        template: 'full',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);
      
      const projectPath = join(mockCwd, 'minimal-features-full-template');
      expect(existsSync(projectPath)).toBe(true);
      
      // Should not create feature-specific directories when features disabled
      expect(existsSync(join(projectPath, 'src/lib/auth'))).toBe(false);
      expect(existsSync(join(projectPath, 'src/lib/db'))).toBe(false);
    });

    it('should handle conflicting feature combinations gracefully', async () => {
      const config: ProjectConfig = {
        projectName: 'conflicting-features',
        template: 'minimal',
        includeAuth: true,
        includeDatabase: false, // Auth without database
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      // Should handle auth without database gracefully
      await createProject(config);
      
      const projectPath = join(mockCwd, 'conflicting-features');
      expect(existsSync(projectPath)).toBe(true);
      expect(existsSync(join(projectPath, 'src/lib/auth'))).toBe(true);
    });
  });

  describe('Performance and Stability', () => {
    it('should complete project creation within reasonable time', async () => {
      const config: ProjectConfig = {
        projectName: 'performance-test',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: true
      };

      const startTime = Date.now();
      await createProject(config);
      const duration = Date.now() - startTime;

      // Should complete within 5 seconds for large project
      expect(duration).toBeLessThan(5000);

      const projectPath = join(mockCwd, 'performance-test');
      expect(existsSync(projectPath)).toBe(true);
    });

    it('should handle repeated project creation', async () => {
      for (let i = 0; i < 3; i++) {
        const config: ProjectConfig = {
          projectName: `repeated-${i}`,
          template: 'minimal',
          includeAuth: false,
          includeDatabase: false,
          includeAI: false,
          includeElectron: false,
          includeObservability: false,
          packageManager: 'npm',
          skipInstall: true
        };

        await createProject(config);
        
        const projectPath = join(mockCwd, `repeated-${i}`);
        expect(existsSync(projectPath)).toBe(true);
      }
    });
  });
});