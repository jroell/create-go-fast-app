import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mockFs from 'mock-fs';
import { createProject } from '../create-project';
import { ProjectConfig } from '../types';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Mock install dependencies to avoid actual installation
import { vi } from 'vitest';
vi.mock('../install-strategies', () => ({
  installDependencies: vi.fn().mockResolvedValue({ success: true, command: 'npm install --force' })
}));

describe('Template Variations and Feature Combinations', () => {
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
  });

  afterEach(() => {
    mockFs.restore();
    vi.restoreAllMocks();
    process.chdir(originalCwd);
  });

  describe('Minimal Template Variations', () => {
    it('should create minimal template with no additional features', async () => {
      const config: ProjectConfig = {
        projectName: 'minimal-basic',
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

      const projectPath = join(mockCwd, 'minimal-basic');
      expect(existsSync(projectPath)).toBe(true);

      // Check package.json has minimal dependencies
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.dependencies['next-auth']).toBeUndefined();
      expect(packageJson.dependencies['drizzle-orm']).toBeUndefined();
      expect(packageJson.dependencies['ai']).toBeUndefined();
      expect(packageJson.dependencies['@sentry/nextjs']).toBeUndefined();
      expect(packageJson.devDependencies['electron']).toBeUndefined();
    });

    it('should create minimal template with auth only', async () => {
      const config: ProjectConfig = {
        projectName: 'minimal-auth',
        template: 'minimal',
        includeAuth: true,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'minimal-auth');
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.dependencies['next-auth']).toBeDefined();
      expect(packageJson.dependencies['drizzle-orm']).toBeUndefined();
      expect(packageJson.dependencies['ai']).toBeUndefined();
    });

    it('should create minimal template with AI only', async () => {
      const config: ProjectConfig = {
        projectName: 'minimal-ai',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: true,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'minimal-ai');
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.dependencies['ai']).toBeDefined();
      expect(packageJson.dependencies['langchain']).toBeDefined();
      expect(packageJson.dependencies['next-auth']).toBeUndefined();
      expect(packageJson.dependencies['drizzle-orm']).toBeUndefined();
    });
  });

  describe('Frontend Template Variations', () => {
    it('should create frontend template with auth and AI', async () => {
      const config: ProjectConfig = {
        projectName: 'frontend-auth-ai',
        template: 'frontend',
        includeAuth: true,
        includeDatabase: false,
        includeAI: true,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'frontend-auth-ai');
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.dependencies['next-auth']).toBeDefined();
      expect(packageJson.dependencies['ai']).toBeDefined();
      expect(packageJson.dependencies['cmdk']).toBeDefined();
      expect(packageJson.dependencies['drizzle-orm']).toBeUndefined();
    });

    it('should create frontend template with observability', async () => {
      const config: ProjectConfig = {
        projectName: 'frontend-observability',
        template: 'frontend',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'frontend-observability');
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.dependencies['@sentry/nextjs']).toBeDefined();
      expect(packageJson.dependencies['@vercel/analytics']).toBeDefined();
    });

    it('should create frontend template with Electron', async () => {
      const config: ProjectConfig = {
        projectName: 'frontend-electron',
        template: 'frontend',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: true,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'frontend-electron');
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.devDependencies['electron']).toBeDefined();
      expect(packageJson.dependencies['electron-is-dev']).toBeDefined();
      expect(packageJson.scripts['electron']).toBeDefined();
      expect(packageJson.scripts['electron-dev']).toBeDefined();
    });
  });

  describe('Full Template Variations', () => {
    it('should create full template with all features enabled', async () => {
      const config: ProjectConfig = {
        projectName: 'full-everything',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: true,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'full-everything');
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      // Auth dependencies
      expect(packageJson.dependencies['next-auth']).toBeDefined();
      expect(packageJson.dependencies['@auth/drizzle-adapter']).toBeDefined();
      
      // Database dependencies
      expect(packageJson.dependencies['drizzle-orm']).toBeDefined();
      expect(packageJson.dependencies['@supabase/supabase-js']).toBeDefined();
      expect(packageJson.devDependencies['drizzle-kit']).toBeDefined();
      
      // AI dependencies
      expect(packageJson.dependencies['ai']).toBeDefined();
      expect(packageJson.dependencies['langchain']).toBeDefined();
      
      // Electron dependencies
      expect(packageJson.devDependencies['electron']).toBeDefined();
      
      // Observability dependencies
      expect(packageJson.dependencies['@sentry/nextjs']).toBeDefined();
      expect(packageJson.dependencies['@vercel/analytics']).toBeDefined();
      
      // tRPC dependencies
      expect(packageJson.dependencies['@trpc/client']).toBeDefined();
      expect(packageJson.dependencies['@trpc/server']).toBeDefined();
      
      // Turborepo
      expect(packageJson.devDependencies['turbo']).toBeDefined();
    });

    it('should create full template with selective features', async () => {
      const config: ProjectConfig = {
        projectName: 'full-selective',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: false,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'full-selective');
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      expect(packageJson.dependencies['next-auth']).toBeDefined();
      expect(packageJson.dependencies['drizzle-orm']).toBeDefined();
      expect(packageJson.dependencies['@sentry/nextjs']).toBeDefined();
      expect(packageJson.dependencies['ai']).toBeUndefined();
      expect(packageJson.devDependencies['electron']).toBeUndefined();
    });
  });

  describe('Package Manager Variations', () => {
    it('should work with yarn package manager', async () => {
      const config: ProjectConfig = {
        projectName: 'yarn-project',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'yarn',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'yarn-project');
      expect(existsSync(projectPath)).toBe(true);
      
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      expect(packageJson.name).toBe('yarn-project');
    });

    it('should work with pnpm package manager', async () => {
      const config: ProjectConfig = {
        projectName: 'pnpm-project',
        template: 'frontend',
        includeAuth: false,
        includeDatabase: false,
        includeAI: true,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'pnpm',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'pnpm-project');
      expect(existsSync(projectPath)).toBe(true);
      
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      expect(packageJson.dependencies['ai']).toBeDefined();
    });

    it('should work with bun package manager', async () => {
      const config: ProjectConfig = {
        projectName: 'bun-project',
        template: 'full',
        includeAuth: true,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'bun',
        skipInstall: true
      };

      await createProject(config);

      const projectPath = join(mockCwd, 'bun-project');
      expect(existsSync(projectPath)).toBe(true);
      
      const packageJsonPath = join(projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      expect(packageJson.dependencies['next-auth']).toBeDefined();
    });
  });

  describe('Directory Structure Variations', () => {
    it('should create minimal directory structure', async () => {
      const config: ProjectConfig = {
        projectName: 'minimal-dirs',
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

      const projectPath = join(mockCwd, 'minimal-dirs');
      
      // Basic directories should exist
      expect(existsSync(join(projectPath, 'src'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/app'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/components'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/lib'))).toBe(true);
      expect(existsSync(join(projectPath, 'public'))).toBe(true);
      
      // Auth-specific directories should not exist
      expect(existsSync(join(projectPath, 'src/lib/auth'))).toBe(false);
      expect(existsSync(join(projectPath, 'src/app/api/auth'))).toBe(false);
    });

    it('should create full directory structure with all features', async () => {
      const config: ProjectConfig = {
        projectName: 'full-dirs',
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

      const projectPath = join(mockCwd, 'full-dirs');
      
      // All feature directories should exist
      expect(existsSync(join(projectPath, 'src/lib/auth'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/lib/db'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/lib/ai'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/lib/trpc'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/app/api/auth'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/app/api/trpc'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/app/api/ai'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/server'))).toBe(true);
      expect(existsSync(join(projectPath, 'drizzle'))).toBe(true);
    });
  });

  describe('Configuration File Variations', () => {
    it('should generate different configs based on features', async () => {
      const config: ProjectConfig = {
        projectName: 'config-test',
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

      const projectPath = join(mockCwd, 'config-test');
      
      // Check that configuration files exist
      expect(existsSync(join(projectPath, 'drizzle.config.ts'))).toBe(true);
      expect(existsSync(join(projectPath, '.env.example'))).toBe(true);
      expect(existsSync(join(projectPath, 'turbo.json'))).toBe(true);
      
      // Check environment variables include all features
      const envExample = readFileSync(join(projectPath, '.env.example'), 'utf8');
      expect(envExample).toContain('NEXTAUTH_SECRET');
      expect(envExample).toContain('DATABASE_URL');
      expect(envExample).toContain('OPENAI_API_KEY');
      expect(envExample).toContain('SENTRY_DSN');
    });

    it('should not generate feature-specific configs when features disabled', async () => {
      const config: ProjectConfig = {
        projectName: 'minimal-config',
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

      const projectPath = join(mockCwd, 'minimal-config');
      
      // Feature-specific configs should not exist
      expect(existsSync(join(projectPath, 'drizzle.config.ts'))).toBe(false);
      
      // Environment should not include feature variables
      const envExample = readFileSync(join(projectPath, '.env.example'), 'utf8');
      expect(envExample).not.toContain('NEXTAUTH_SECRET');
      expect(envExample).not.toContain('DATABASE_URL');
      expect(envExample).not.toContain('OPENAI_API_KEY');
    });
  });

  describe('Component Generation Variations', () => {
    it('should generate UI components for non-minimal templates', async () => {
      const config: ProjectConfig = {
        projectName: 'ui-components',
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

      const projectPath = join(mockCwd, 'ui-components');
      
      // UI components should be generated
      expect(existsSync(join(projectPath, 'src/components/ui'))).toBe(true);
      expect(existsSync(join(projectPath, 'components.json'))).toBe(true);
    });

    it('should generate AI chat component when AI is enabled', async () => {
      const config: ProjectConfig = {
        projectName: 'ai-chat',
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

      const projectPath = join(mockCwd, 'ai-chat');
      
      // AI chat component should exist
      expect(existsSync(join(projectPath, 'src/components/chat.tsx'))).toBe(true);
      
      // Check API route for AI
      expect(existsSync(join(projectPath, 'src/app/api/ai'))).toBe(true);
      expect(existsSync(join(projectPath, 'src/app/api/ai/chat'))).toBe(true);
    });
  });
});