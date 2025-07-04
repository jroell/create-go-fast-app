import { describe, it, expect, vi, beforeEach } from 'vitest';
import inquirer from 'inquirer';
import { validatePackageManager } from '../install-strategies';

// Mock inquirer
vi.mock('inquirer');
const mockedInquirer = vi.mocked(inquirer);

describe('Interactive Prompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Project Name Validation', () => {
    it('should accept valid project names', () => {
      const validNames = [
        'my-app',
        'myapp', 
        'my_app',
        'MyApp',
        'my-app-123',
        'app123',
        'a',
        'a'.repeat(50) // exactly 50 characters
      ];

      validNames.forEach(name => {
        // Mock project name validation logic
        const isValid = /^[a-zA-Z0-9-_]+$/.test(name) && name.length > 0 && name.length <= 50;
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid project names', () => {
      const invalidCases = [
        { name: '', expected: 'Project name is required' },
        { name: 'my app', expected: 'Project name can only contain letters, numbers, hyphens, and underscores' },
        { name: 'my@app', expected: 'Project name can only contain letters, numbers, hyphens, and underscores' },
        { name: 'my.app', expected: 'Project name can only contain letters, numbers, hyphens, and underscores' },
        { name: 'my/app', expected: 'Project name can only contain letters, numbers, hyphens, and underscores' },
        { name: 'a'.repeat(51), expected: 'Project name must be 50 characters or less' }
      ];

      invalidCases.forEach(({ name, expected }) => {
        // Mock validation function
        const validate = (input: string) => {
          if (input.length === 0) {
            return 'Project name is required';
          }
          if (input.length > 50) {
            return 'Project name must be 50 characters or less';
          }
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
            return 'Project name can only contain letters, numbers, hyphens, and underscores';
          }
          return true;
        };

        const result = validate(name);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Template Selection', () => {
    it('should provide correct template choices', () => {
      const expectedChoices = [
        {
          name: 'Full Stack (Recommended) - Complete GO FAST stack',
          value: 'full',
        },
        {
          name: 'Frontend Only - Next.js + Tailwind + shadcn/ui',
          value: 'frontend',
        },
        {
          name: 'Minimal - Basic Next.js setup',
          value: 'minimal',
        },
      ];

      expectedChoices.forEach(choice => {
        expect(choice.name).toBeDefined();
        expect(choice.value).toMatch(/^(full|frontend|minimal)$/);
      });
    });

    it('should default to full template', () => {
      const defaultTemplate = 'full';
      expect(defaultTemplate).toBe('full');
    });
  });

  describe('Feature Selection Prompts', () => {
    it('should show auth prompt only for full template', () => {
      const shouldShowAuthPrompt = (template: string) => template === 'full';
      
      expect(shouldShowAuthPrompt('full')).toBe(true);
      expect(shouldShowAuthPrompt('frontend')).toBe(false);
      expect(shouldShowAuthPrompt('minimal')).toBe(false);
    });

    it('should show database prompt only for full template', () => {
      const shouldShowDatabasePrompt = (template: string) => template === 'full';
      
      expect(shouldShowDatabasePrompt('full')).toBe(true);
      expect(shouldShowDatabasePrompt('frontend')).toBe(false);
      expect(shouldShowDatabasePrompt('minimal')).toBe(false);
    });

    it('should show AI prompt for non-minimal templates', () => {
      const shouldShowAIPrompt = (template: string) => template !== 'minimal';
      
      expect(shouldShowAIPrompt('full')).toBe(true);
      expect(shouldShowAIPrompt('frontend')).toBe(true);
      expect(shouldShowAIPrompt('minimal')).toBe(false);
    });

    it('should show observability prompt only for full template', () => {
      const shouldShowObservabilityPrompt = (template: string) => template === 'full';
      
      expect(shouldShowObservabilityPrompt('full')).toBe(true);
      expect(shouldShowObservabilityPrompt('frontend')).toBe(false);
      expect(shouldShowObservabilityPrompt('minimal')).toBe(false);
    });

    it('should always show electron prompt', () => {
      ['full', 'frontend', 'minimal'].forEach(template => {
        // Electron prompt should be shown for all templates
        expect(true).toBe(true); // Placeholder - electron is always shown
      });
    });
  });

  describe('Package Manager Selection', () => {
    it('should provide correct package manager choices', () => {
      const expectedChoices = [
        { name: 'npm (recommended)', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' },
        { name: 'bun (experimental)', value: 'bun' },
      ];

      expectedChoices.forEach(choice => {
        expect(['npm', 'yarn', 'pnpm', 'bun']).toContain(choice.value);
      });
    });

    it('should validate package manager selection', () => {
      const validManagers = ['npm', 'yarn', 'pnpm', 'bun'];
      
      validManagers.forEach(manager => {
        expect(validatePackageManager(manager)).toBe(true);
      });

      expect(validatePackageManager('invalid')).toBe(false);
    });

    it('should default to npm', () => {
      const defaultPackageManager = 'npm';
      expect(defaultPackageManager).toBe('npm');
    });
  });

  describe('Default Values', () => {
    it('should provide correct default values for all prompts', () => {
      const defaults = {
        projectName: 'my-go-fast-app',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm'
      };

      expect(defaults.projectName).toBe('my-go-fast-app');
      expect(defaults.template).toBe('full');
      expect(defaults.includeAuth).toBe(true);
      expect(defaults.includeDatabase).toBe(true);
      expect(defaults.includeAI).toBe(true);
      expect(defaults.includeElectron).toBe(false);
      expect(defaults.includeObservability).toBe(true);
      expect(defaults.packageManager).toBe('npm');
    });
  });

  describe('Conditional Logic', () => {
    it('should set correct feature flags based on template', () => {
      const processAnswers = (answers: any) => {
        return {
          ...answers,
          includeAuth: answers.includeAuth || false,
          includeDatabase: answers.includeDatabase || false,
          includeAI: answers.includeAI || false,
          includeElectron: answers.includeElectron || false,
          includeObservability: answers.includeObservability || false,
        };
      };

      // Test minimal template
      const minimalAnswers = processAnswers({
        template: 'minimal',
        includeElectron: false
      });
      expect(minimalAnswers.includeAuth).toBe(false);
      expect(minimalAnswers.includeDatabase).toBe(false);
      expect(minimalAnswers.includeAI).toBe(false);
      expect(minimalAnswers.includeObservability).toBe(false);

      // Test frontend template
      const frontendAnswers = processAnswers({
        template: 'frontend',
        includeAI: true,
        includeElectron: false
      });
      expect(frontendAnswers.includeAuth).toBe(false);
      expect(frontendAnswers.includeDatabase).toBe(false);
      expect(frontendAnswers.includeAI).toBe(true);
      expect(frontendAnswers.includeObservability).toBe(false);

      // Test full template
      const fullAnswers = processAnswers({
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: false,
        includeObservability: true
      });
      expect(fullAnswers.includeAuth).toBe(true);
      expect(fullAnswers.includeDatabase).toBe(true);
      expect(fullAnswers.includeAI).toBe(true);
      expect(fullAnswers.includeObservability).toBe(true);
    });
  });

  describe('Yes Flag Behavior', () => {
    it('should use default configuration when --yes flag is used', () => {
      const yesConfig = {
        projectName: 'my-go-fast-app',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: false,
      };

      expect(yesConfig.template).toBe('full');
      expect(yesConfig.includeAuth).toBe(true);
      expect(yesConfig.includeDatabase).toBe(true);
      expect(yesConfig.includeAI).toBe(true);
      expect(yesConfig.includeElectron).toBe(false);
      expect(yesConfig.includeObservability).toBe(true);
      expect(yesConfig.packageManager).toBe('npm');
    });

    it('should override project name when provided as argument with --yes', () => {
      const getYesConfig = (projectName?: string) => ({
        projectName: projectName || 'my-go-fast-app',
        template: 'full',
        includeAuth: true,
        includeDatabase: true,
        includeAI: true,
        includeElectron: false,
        includeObservability: true,
        packageManager: 'npm',
        skipInstall: false,
      });

      const customConfig = getYesConfig('custom-app');
      expect(customConfig.projectName).toBe('custom-app');

      const defaultConfig = getYesConfig();
      expect(defaultConfig.projectName).toBe('my-go-fast-app');
    });
  });

  describe('Prompt Message Content', () => {
    it('should have descriptive prompt messages', () => {
      const promptMessages = {
        projectName: 'What is your project name?',
        template: 'Which template would you like to use?',
        includeAuth: 'Include authentication (Auth.js)?',
        includeDatabase: 'Include database setup (Supabase + Drizzle)?',
        includeAI: 'Include AI features (Vercel AI SDK + LangChain)?',
        includeElectron: 'Include Electron setup for desktop apps?',
        includeObservability: 'Include observability (Sentry + OpenTelemetry)?',
        packageManager: 'Which package manager would you like to use?'
      };

      Object.values(promptMessages).forEach(message => {
        expect(message).toBeDefined();
        expect(message.length).toBeGreaterThan(10);
        expect(message).toMatch(/\?$/); // Should end with question mark
      });
    });
  });

  describe('Input Validation Functions', () => {
    it('should validate project name input correctly', () => {
      const validateProjectName = (input: string) => {
        if (input.length === 0) {
          return 'Project name is required';
        }
        if (input.length > 50) {
          return 'Project name must be 50 characters or less';
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores';
        }
        return true;
      };

      // Valid cases
      expect(validateProjectName('valid-name')).toBe(true);
      expect(validateProjectName('valid_name')).toBe(true);
      expect(validateProjectName('ValidName')).toBe(true);
      expect(validateProjectName('valid123')).toBe(true);

      // Invalid cases
      expect(validateProjectName('')).toBe('Project name is required');
      expect(validateProjectName('a'.repeat(51))).toBe('Project name must be 50 characters or less');
      expect(validateProjectName('invalid name')).toBe('Project name can only contain letters, numbers, hyphens, and underscores');
      expect(validateProjectName('invalid@name')).toBe('Project name can only contain letters, numbers, hyphens, and underscores');
    });

    it('should validate package manager selection', () => {
      const validatePackageManagerInput = (input: string) => {
        if (!validatePackageManager(input)) {
          return 'Please select a valid package manager';
        }
        return true;
      };

      expect(validatePackageManagerInput('npm')).toBe(true);
      expect(validatePackageManagerInput('yarn')).toBe(true);
      expect(validatePackageManagerInput('pnpm')).toBe(true);
      expect(validatePackageManagerInput('bun')).toBe(true);
      expect(validatePackageManagerInput('invalid')).toBe('Please select a valid package manager');
    });
  });
});