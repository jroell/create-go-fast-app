import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import mockFs from 'mock-fs';
import { createProject } from '../create-project';
import { ProjectConfig } from '../types';

// Mock external dependencies
vi.mock('../install-strategies', () => ({
  installDependencies: vi.fn().mockResolvedValue({ success: true, command: 'npm install --force' })
}));

describe('Project Creation Process', () => {
  const mockCwd = '/tmp/test-workspace';
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    vi.clearAllMocks();
    
    // Mock process.cwd() to return our test workspace
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    
    // Setup mock file system
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

  describe('Directory Structure Creation', () => {
    it('should create all required directories for minimal template', async () => {
      const config: ProjectConfig = {
        projectName: 'test-minimal',
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

      const projectPath = join(mockCwd, 'test-minimal');
      const expectedDirs = [
        'src',
        'src/app',
        'src/components',
        'src/lib',
        'public'
      ];

      expectedDirs.forEach(dir => {
        const fullPath = join(projectPath, dir);
        expect(existsSync(fullPath)).toBe(true);
        expect(statSync(fullPath).isDirectory()).toBe(true);
      });
    });

    it('should create all required directories for full template', async () => {
      const config: ProjectConfig = {
        projectName: 'test-full',
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

      const projectPath = join(mockCwd, 'test-full');
      const expectedDirs = [
        'src',
        'src/app',
        'src/app/api',
        'src/app/api/auth',
        'src/app/api/auth/[...nextauth]',
        'src/app/api/trpc',
        'src/app/api/trpc/[trpc]',
        'src/app/api/ai',
        'src/app/api/ai/chat',
        'src/components',
        'src/components/ui',
        'src/lib',
        'src/lib/auth',
        'src/lib/db',
        'src/lib/trpc',
        'src/lib/ai',
        'src/server',
        'src/server/api',
        'src/server/api/routers',
        'public',
        'drizzle',
        'prisma'
      ];

      expectedDirs.forEach(dir => {
        const fullPath = join(projectPath, dir);
        expect(existsSync(fullPath)).toBe(true);
        expect(statSync(fullPath).isDirectory()).toBe(true);
      });
    });

    it('should create project directory with correct name', async () => {
      const config: ProjectConfig = {
        projectName: 'my-custom-app',
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

      const projectPath = join(mockCwd, 'my-custom-app');
      expect(existsSync(projectPath)).toBe(true);
      expect(statSync(projectPath).isDirectory()).toBe(true);
    });
  });

  describe('Core File Generation', () => {
    it('should generate package.json with correct content', async () => {
      const config: ProjectConfig = {
        projectName: 'test-package',
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

      const packageJsonPath = join(mockCwd, 'test-package', 'package.json');
      expect(existsSync(packageJsonPath)).toBe(true);

      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      expect(packageJson.name).toBe('test-package');
      expect(packageJson.version).toBe('0.1.0');
      expect(packageJson.private).toBe(true);
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.dev).toBe('next dev');
      expect(packageJson.scripts.build).toBe('next build');
      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.devDependencies).toBeDefined();
    });

    it('should generate tsconfig.json with correct configuration', async () => {
      const config: ProjectConfig = {
        projectName: 'test-ts',
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

      const tsconfigPath = join(mockCwd, 'test-ts', 'tsconfig.json');
      expect(existsSync(tsconfigPath)).toBe(true);

      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.target).toBe('ES2017');
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.jsx).toBe('preserve');
      expect(tsconfig.compilerOptions.paths).toBeDefined();
      expect(tsconfig.compilerOptions.paths['~/*']).toEqual(['./src/*']);
      expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['./src/*']);
    });

    it('should generate Next.js configuration file', async () => {
      const config: ProjectConfig = {
        projectName: 'test-next',
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

      const nextConfigPath = join(mockCwd, 'test-next', 'next.config.js');
      expect(existsSync(nextConfigPath)).toBe(true);

      const nextConfig = readFileSync(nextConfigPath, 'utf8');
      expect(nextConfig).toContain('/** @type {import(\'next\').NextConfig} */');
      expect(nextConfig).toContain('module.exports = nextConfig');
    });

    it('should generate Tailwind configuration', async () => {
      const config: ProjectConfig = {
        projectName: 'test-tailwind',
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

      const tailwindConfigPath = join(mockCwd, 'test-tailwind', 'tailwind.config.js');
      expect(existsSync(tailwindConfigPath)).toBe(true);

      const tailwindConfig = readFileSync(tailwindConfigPath, 'utf8');
      expect(tailwindConfig).toContain('module.exports');
      expect(tailwindConfig).toContain('content:');
      expect(tailwindConfig).toContain('./src/**/*.{ts,tsx}');
    });

    it('should generate PostCSS configuration', async () => {
      const config: ProjectConfig = {
        projectName: 'test-postcss',
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

      const postcssConfigPath = join(mockCwd, 'test-postcss', 'postcss.config.js');
      expect(existsSync(postcssConfigPath)).toBe(true);

      const postcssConfig = readFileSync(postcssConfigPath, 'utf8');
      expect(postcssConfig).toContain('tailwindcss');
      expect(postcssConfig).toContain('autoprefixer');
    });
  });

  describe('App Router Files', () => {
    it('should generate main layout file', async () => {
      const config: ProjectConfig = {
        projectName: 'test-layout',
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

      const layoutPath = join(mockCwd, 'test-layout', 'src/app/layout.tsx');
      expect(existsSync(layoutPath)).toBe(true);

      const layout = readFileSync(layoutPath, 'utf8');
      expect(layout).toContain('export default function RootLayout');
      expect(layout).toContain('html');
      expect(layout).toContain('body');
    });

    it('should generate home page', async () => {
      const config: ProjectConfig = {
        projectName: 'test-page',
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

      const pagePath = join(mockCwd, 'test-page', 'src/app/page.tsx');
      expect(existsSync(pagePath)).toBe(true);

      const page = readFileSync(pagePath, 'utf8');
      expect(page).toContain('export default function');
    });

    it('should generate globals.css', async () => {
      const config: ProjectConfig = {
        projectName: 'test-css',
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

      const cssPath = join(mockCwd, 'test-css', 'src/app/globals.css');
      expect(existsSync(cssPath)).toBe(true);

      const css = readFileSync(cssPath, 'utf8');
      expect(css).toContain('@tailwind base');
      expect(css).toContain('@tailwind components');
      expect(css).toContain('@tailwind utilities');
    });

    it('should generate loading and error pages', async () => {
      const config: ProjectConfig = {
        projectName: 'test-special-pages',
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

      const projectPath = join(mockCwd, 'test-special-pages');
      
      // Check loading page
      const loadingPath = join(projectPath, 'src/app/loading.tsx');
      expect(existsSync(loadingPath)).toBe(true);
      const loading = readFileSync(loadingPath, 'utf8');
      expect(loading).toContain('export default function Loading');
      expect(loading).toContain('Loading...');

      // Check error page
      const errorPath = join(projectPath, 'src/app/error.tsx');
      expect(existsSync(errorPath)).toBe(true);
      const error = readFileSync(errorPath, 'utf8');
      expect(error).toContain('export default function Error');
      expect(error).toContain('Something went wrong');
    });
  });

  describe('Utility Files', () => {
    it('should generate utils.ts with cn function', async () => {
      const config: ProjectConfig = {
        projectName: 'test-utils',
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

      const utilsPath = join(mockCwd, 'test-utils', 'src/lib/utils.ts');
      expect(existsSync(utilsPath)).toBe(true);

      const utils = readFileSync(utilsPath, 'utf8');
      expect(utils).toContain('export function cn');
      expect(utils).toContain('clsx');
      expect(utils).toContain('twMerge');
    });

    it('should generate components.json for shadcn/ui', async () => {
      const config: ProjectConfig = {
        projectName: 'test-components-json',
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

      const componentsJsonPath = join(mockCwd, 'test-components-json', 'components.json');
      expect(existsSync(componentsJsonPath)).toBe(true);

      const componentsJson = JSON.parse(readFileSync(componentsJsonPath, 'utf8'));
      expect(componentsJson.style).toBeDefined();
      expect(componentsJson.rsc).toBeDefined();
      expect(componentsJson.tsx).toBeDefined();
      expect(componentsJson.tailwind).toBeDefined();
      expect(componentsJson.aliases).toBeDefined();
    });
  });

  describe('Environment Files', () => {
    it('should generate .env.example and .env.local files', async () => {
      const config: ProjectConfig = {
        projectName: 'test-env',
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

      const projectPath = join(mockCwd, 'test-env');
      
      // Check .env.example
      const envExamplePath = join(projectPath, '.env.example');
      expect(existsSync(envExamplePath)).toBe(true);
      const envExample = readFileSync(envExamplePath, 'utf8');
      expect(envExample).toContain('# Next.js');
      expect(envExample).toContain('NEXT_PUBLIC_APP_URL');

      // Check .env.local
      const envLocalPath = join(projectPath, '.env.local');
      expect(existsSync(envLocalPath)).toBe(true);
      const envLocal = readFileSync(envLocalPath, 'utf8');
      expect(envLocal).toContain('# Next.js');
      expect(envLocal).toContain('NEXT_PUBLIC_APP_URL');
    });
  });

  describe('Git Configuration', () => {
    it('should generate .gitignore file', async () => {
      const config: ProjectConfig = {
        projectName: 'test-git',
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

      const gitignorePath = join(mockCwd, 'test-git', '.gitignore');
      expect(existsSync(gitignorePath)).toBe(true);

      const gitignore = readFileSync(gitignorePath, 'utf8');
      expect(gitignore).toContain('node_modules/');
      expect(gitignore).toContain('.next/');
      expect(gitignore).toContain('.env.local');
      expect(gitignore).toContain('dist/');
      expect(gitignore).toContain('.turbo/');
    });
  });

  describe('README Generation', () => {
    it('should generate README.md file', async () => {
      const config: ProjectConfig = {
        projectName: 'test-readme',
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

      const readmePath = join(mockCwd, 'test-readme', 'README.md');
      expect(existsSync(readmePath)).toBe(true);

      const readme = readFileSync(readmePath, 'utf8');
      expect(readme).toContain('# test-readme');
      expect(readme).toContain('GO FAST');
    });
  });

  describe('Vercel Configuration', () => {
    it('should generate vercel.json for all templates', async () => {
      const config: ProjectConfig = {
        projectName: 'test-vercel',
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

      const vercelConfigPath = join(mockCwd, 'test-vercel', 'vercel.json');
      expect(existsSync(vercelConfigPath)).toBe(true);

      const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf8'));
      expect(vercelConfig).toBeDefined();
    });
  });

  describe('Permission Handling', () => {
    it('should handle directory creation permissions gracefully', async () => {
      const config: ProjectConfig = {
        projectName: 'test-permissions',
        template: 'minimal',
        includeAuth: false,
        includeDatabase: false,
        includeAI: false,
        includeElectron: false,
        includeObservability: false,
        packageManager: 'npm',
        skipInstall: true
      };

      // This should not throw an error
      await expect(createProject(config)).resolves.not.toThrow();
    });
  });
});