import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import mockFs from 'mock-fs';
import { createProject } from '../create-project';
import { performSystemChecks } from '../system-checks';
import { installDependencies } from '../install-strategies';
import { ProjectConfig } from '../types';
import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

// Mock external dependencies
vi.mock('child_process');
vi.mock('../install-strategies');

const mockExecSync = vi.mocked(execSync);
const mockInstallDependencies = vi.mocked(installDependencies);

describe('Integration Tests - End-to-End Project Creation', () => {
  const mockCwd = '/tmp/test-workspace';
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    vi.clearAllMocks();
    
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    
    mockFs({
      [mockCwd]: {},
      '/tmp': {},
      '/var/tmp': {}
    });

    // Mock successful system environment
    Object.defineProperty(process, 'version', { value: 'v18.15.0', configurable: true });
    mockExecSync.mockImplementation((command) => {
      if (command === 'npm --version') return '9.5.0';
      if (command === 'git --version') return 'git version 2.34.1';
      if (command === 'python --version') return 'Python 3.9.0';
      if (command === 'which make') return '/usr/bin/make';
      if (command === 'which gcc') return '/usr/bin/gcc';
      return 'success';
    });

    mockInstallDependencies.mockResolvedValue({ 
      success: true, 
      command: 'npm install --force',
      output: 'Installation successful'
    });
  });

  afterEach(() => {
    mockFs.restore();
    vi.restoreAllMocks();
    process.chdir(originalCwd);
  });

  describe('Complete Project Creation Flow', () => {
    it('should create a complete minimal project from start to finish', async () => {
      const config: ProjectConfig = {
        projectName: 'my-minimal-app',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: false
      };

      // Step 1: Perform system checks
      const systemChecks = await performSystemChecks(config);
      expect(systemChecks.canProceed).toBe(true);
      expect(systemChecks.allPassed).toBe(true);

      // Step 2: Create project
      await createProject(config);

      // Step 3: Verify project structure
      const projectPath = join(mockCwd, 'my-minimal-app');
      expect(existsSync(projectPath)).toBe(true);

      // Verify core files
      const coreFiles = [
        'package.json',
        'tsconfig.json',
        'next.config.js',
        'tailwind.config.js',
        'postcss.config.js',
        '.gitignore',
        '.env.example',
        '.env.local',
        'README.md',
        'vercel.json'
      ];

      coreFiles.forEach(file => {
        expect(existsSync(join(projectPath, file))).toBe(true);
      });

      // Verify directory structure
      const coreDirs = [
        'src',
        'src/app',
        'src/components',
        'src/lib',
        'public'
      ];

      coreDirs.forEach(dir => {
        expect(existsSync(join(projectPath, dir))).toBe(true);
        expect(statSync(join(projectPath, dir)).isDirectory()).toBe(true);
      });

      // Verify app files
      const appFiles = [
        'src/app/layout.tsx',
        'src/app/page.tsx',
        'src/app/loading.tsx',
        'src/app/error.tsx',
        'src/app/globals.css',
        'src/lib/utils.ts'
      ];

      appFiles.forEach(file => {
        expect(existsSync(join(projectPath, file))).toBe(true);
      });

      // Step 4: Verify installation was attempted
      expect(mockInstallDependencies).toHaveBeenCalledWith(
        projectPath,
        'npm',
        config
      );
    });

    it('should create a complete full-stack project with all features', async () => {
      const config: ProjectConfig = {
        projectName: 'my-fullstack-app',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: false
      };

      // Create project
      await createProject(config);

      const projectPath = join(mockCwd, 'my-fullstack-app');
      
      // Verify enhanced directory structure
      const fullStackDirs = [
        'src/lib/auth',
        'src/lib/db',
        'src/lib/ai',
        'src/lib/trpc',
        'src/app/api/auth/[...nextauth]',
        'src/app/api/trpc/[trpc]',
        'src/app/api/ai/chat',
        'src/server/api/routers',
        'src/components/ui',
        'drizzle',
        'prisma'
      ];

      fullStackDirs.forEach(dir => {
        expect(existsSync(join(projectPath, dir))).toBe(true);
      });

      // Verify feature-specific files
      const featureFiles = [
        'drizzle.config.ts',
        'turbo.json',
        'src/components/chat.tsx',
        'src/lib/auth/config.ts',
        'src/lib/db/index.ts',
        'src/lib/ai/config.ts',
        'src/lib/trpc/client.tsx'
      ];

      featureFiles.forEach(file => {
        expect(existsSync(join(projectPath, file))).toBe(true);
      });

      // Verify package.json includes all dependencies
      const packageJson = JSON.parse(readFileSync(join(projectPath, 'package.json'), 'utf8'));
      
      const expectedDeps = [
        'next',
        'react',
        'next-auth',
        'drizzle-orm',
        '@supabase/supabase-js',
        'ai',
        'langchain',
        '@trpc/client',
        '@trpc/server',
        '@sentry/nextjs',
        '@vercel/analytics'
      ];

      expectedDeps.forEach(dep => {
        expect(packageJson.dependencies[dep]).toBeDefined();
      });

      const expectedDevDeps = [
        'drizzle-kit',
        'turbo',
        'typescript',
        'tailwindcss'
      ];

      expectedDevDeps.forEach(dep => {
        expect(packageJson.devDependencies[dep]).toBeDefined();
      });
    });

    it('should handle frontend template with selective features', async () => {
      const config: ProjectConfig = {
        projectName: 'my-frontend-app',
        template: 'frontend',
        includeAuth: true,
        includeDatabase: false,
        includeAI: true,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'yarn',
        skipInstall: false
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'my-frontend-app');
      
      // Should have auth and AI but not database or observability
      expect(existsSync(join(projectPath, 'src/lib/auth'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/lib/ai'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/components/chat.tsx'))).toBe(true);
      
      // Should not have database-specific files
      expect(existsSync(join(projectPath, 'drizzle.config.ts'))).toBe(false);
      expect(existsSync(join(projectPath, 'src/lib/db'))).toBe(false);

      // Verify yarn was used for installation
      expect(mockInstallDependencies).toHaveBeenCalledWith(
        projectPath,
        'yarn',
        config
      );
    });
  });

  describe('Project Validation and Integrity', () => {
    it('should generate valid TypeScript configuration', async () => {
      const config: ProjectConfig = {
        projectName: 'typescript-validation',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'typescript-validation');
      const tsconfigPath = join(projectPath, 'tsconfig.json');
      
      expect(existsSync(tsconfigPath)).toBe(true);
      
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
      
      // Verify essential TypeScript settings
      expect(tsconfig.compilerOptions.target).toBeDefined();
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.jsx).toBe('preserve');
      expect(tsconfig.compilerOptions.paths).toBeDefined();
      expect(tsconfig.compilerOptions.paths['~/*']).toEqual(['./src/*']);
      expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['./src/*']);
      
      // Verify Next.js specific settings
      expect(tsconfig.compilerOptions.allowJs).toBe(true);
      expect(tsconfig.compilerOptions.skipLibCheck).toBe(true);
      expect(tsconfig.compilerOptions.forceConsistentCasingInFileNames).toBe(true);
      expect(tsconfig.compilerOptions.noEmit).toBe(true);
      expect(tsconfig.compilerOptions.esModuleInterop).toBe(true);
      expect(tsconfig.compilerOptions.moduleResolution).toBe('node');
      expect(tsconfig.compilerOptions.resolveJsonModule).toBe(true);
      expect(tsconfig.compilerOptions.isolatedModules).toBe(true);
      expect(tsconfig.compilerOptions.incremental).toBe(true);
    });

    it('should generate valid Next.js configuration', async () => {
      const config: ProjectConfig = {
        projectName: 'nextjs-validation',
        template: 'full',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'nextjs-validation');
      const nextConfigPath = join(projectPath, 'next.config.js');
      
      expect(existsSync(nextConfigPath)).toBe(true);
      
      const nextConfig = readFileSync(nextConfigPath, 'utf8');
      
      // Should be valid JavaScript/CommonJS
      expect(nextConfig).toContain('/** @type {import(\'next\').NextConfig} */');
      expect(nextConfig).toContain('module.exports');
      
      // Should include Sentry configuration for observability
      expect(nextConfig).toContain('withSentryConfig');
      expect(nextConfig).toContain('sentryWebpackPluginOptions');
    });

    it('should generate valid Tailwind configuration', async () => {
      const config: ProjectConfig = {
        projectName: 'tailwind-validation',
        template: 'frontend',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'tailwind-validation');
      const tailwindConfigPath = join(projectPath, 'tailwind.config.js');
      
      expect(existsSync(tailwindConfigPath)).toBe(true);
      
      const tailwindConfig = readFileSync(tailwindConfigPath, 'utf8');
      
      // Should have proper content paths
      expect(tailwindConfig).toContain('./src/**/*.{ts,tsx}');
      expect(tailwindConfig).toContain('./components/**/*.{ts,tsx}');
      
      // Should include design system tokens
      expect(tailwindConfig).toContain('colors');
      expect(tailwindConfig).toContain('primary');
      expect(tailwindConfig).toContain('secondary');
      
      // Should include required plugins
      expect(tailwindConfig).toContain('tailwindcss-animate');
    });

    it('should generate valid environment configuration', async () => {
      const config: ProjectConfig = {
        projectName: 'env-validation',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'env-validation');
      
      // Check .env.example
      const envExamplePath = join(projectPath, '.env.example');
      expect(existsSync(envExamplePath)).toBe(true);
      
      const envExample = readFileSync(envExamplePath, 'utf8');
      
      // Should include all feature environment variables
      expect(envExample).toContain('NEXTAUTH_SECRET');
      expect(envExample).toContain('DATABASE_URL');
      expect(envExample).toContain('OPENAI_API_KEY');
      expect(envExample).toContain('SENTRY_DSN');
      expect(envExample).toContain('NEXT_PUBLIC_APP_URL');
      
      // Check .env.local
      const envLocalPath = join(projectPath, '.env.local');
      expect(existsSync(envLocalPath)).toBe(true);
      
      const envLocal = readFileSync(envLocalPath, 'utf8');
      expect(envLocal).toContain('NEXT_PUBLIC_APP_URL=http://localhost:3000');
    });

    it('should generate buildable React components', async () => {
      const config: ProjectConfig = {
        projectName: 'components-validation',
        template: 'frontend',
        includeAuth: false,
        includeDatabase: false,
        includeAI: true,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'components-validation');
      
      // Check main layout
      const layoutPath = join(projectPath, 'src/app/layout.tsx');
      const layout = readFileSync(layoutPath, 'utf8');
      
      expect(layout).toContain('export default function RootLayout');
      expect(layout).toContain('children: React.ReactNode');
      expect(layout).toContain('<html lang="en">');
      
      // Check home page
      const pagePath = join(projectPath, 'src/app/page.tsx');
      const page = readFileSync(pagePath, 'utf8');
      
      expect(page).toContain('export default function');
      expect(page).toContain('GO FAST');
      
      // Check AI chat component
      const chatPath = join(projectPath, 'src/components/chat.tsx');
      const chat = readFileSync(chatPath, 'utf8');
      
      expect(chat).toContain('export function Chat');
      expect(chat).toContain('useChat');
      expect(chat).toContain('ai/react');
    });
  });

  describe('Cross-Platform Compatibility', () => {
    it('should work correctly on Windows', async () => {
      const { platform } = await import('os');
      const mockPlatform = vi.mocked(platform);
      mockPlatform.mockReturnValue('win32');

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

      // System checks should pass
      const systemChecks = await performSystemChecks(config);
      const pathCheck = systemChecks.checks.find(c => c.name === 'Windows Path Length');
      expect(pathCheck?.passed).toBe(true);

      // Project creation should succeed
      await createProject(config);

      const projectPath = join(mockCwd, 'windows-test');
      expect(existsSync(projectPath)).toBe(true);
    });

    it('should work correctly on macOS', async () => {
      const { platform } = await import('os');
      const mockPlatform = vi.mocked(platform);
      mockPlatform.mockReturnValue('darwin');

      // Mock macOS-specific tools
      mockExecSync.mockImplementation((command) => {
        if (command === 'python3 --version') return 'Python 3.11.0';
        if (command === 'which clang') return '/usr/bin/clang';
        if (command === 'which make') return '/usr/bin/make';
        return 'success';
      });

      const config: ProjectConfig = {
        projectName: 'macos-test',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      const systemChecks = await performSystemChecks(config);
      const buildCheck = systemChecks.checks.find(c => c.name === 'Build Tools');
      expect(buildCheck?.passed).toBe(true);

      await createProject(config);

      const projectPath = join(mockCwd, 'macos-test');
      expect(existsSync(projectPath)).toBe(true);
    });

    it('should work correctly on Linux', async () => {
      const { platform } = await import('os');
      const mockPlatform = vi.mocked(platform);
      mockPlatform.mockReturnValue('linux');

      const config: ProjectConfig = {
        projectName: 'linux-test',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      const systemChecks = await performSystemChecks(config);
      expect(systemChecks.canProceed).toBe(true);

      await createProject(config);

      const projectPath = join(mockCwd, 'linux-test');
      expect(existsSync(projectPath)).toBe(true);
    });
  });

  describe('Installation Strategy Integration', () => {
    it('should handle installation failures gracefully', async () => {
      mockInstallDependencies.mockResolvedValue({
        success: false,
        error: 'ERESOLVE unable to resolve dependency tree',
        fixInstructions: 'Try using --legacy-peer-deps'
      });

      const config: ProjectConfig = {
        projectName: 'install-failure-test',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: false
      };

      // Should not throw even if installation fails
      await createProject(config);

      const projectPath = join(mockCwd, 'install-failure-test');
      expect(existsSync(projectPath)).toBe(true);
      
      // Project files should still be created
      expect(existsSync(join(projectPath, 'package.json'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/app/page.tsx'))).toBe(true);
    });

    it('should work with different package managers', async () => {
      const packageManagers: Array<'npm' | 'yarn' | 'pnpm' | 'bun'> = ['npm', 'yarn', 'pnpm', 'bun'];
      
      for (const pm of packageManagers) {
        const config: ProjectConfig = {
          projectName: `${pm}-test`,
          template: 'minimal',
          includeAuth: false,
          includeDatabase: false,
          includeAI: false,
          includeElectron: false,
          includeObservability: false,
          packageManager: pm,
          skipInstall: false
        };

        await createProject(config);

        expect(mockInstallDependencies).toHaveBeenCalledWith(
          join(mockCwd, `${pm}-test`),
          pm,
          config
        );
      }
    });
  });

  describe('Performance and Resource Usage', () => {
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

      // Should complete within 10 seconds (generous for full project)
      expect(duration).toBeLessThan(10000);

      const projectPath = join(mockCwd, 'performance-test');
      expect(existsSync(projectPath)).toBe(true);
    });

    it('should handle multiple concurrent project creations', async () => {
      const configs = Array.from({ length: 3 }, (_, i) => ({
        projectName: `concurrent-${i}`,
        template: 'minimal' as const,
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm' as const,
        skipInstall: true
      }));

      const promises = configs.map(config => createProject(config));
      const results = await Promise.allSettled(promises);

      // All should succeed
      results.forEach(result => {
        expect(result.status).toBe('fulfilled');
      });

      // All projects should exist
      configs.forEach(config => {
        const projectPath = join(mockCwd, config.projectName);
        expect(existsSync(projectPath)).toBe(true);
      });
    });
  });
});