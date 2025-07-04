#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { existsSync } from 'fs';
import { join } from 'path';
import { platform } from 'os';
import { createProject } from './create-project';
import { ProjectConfig } from './types';
import { performSystemChecks, displaySystemChecks } from './system-checks';
import { validatePackageManager, checkPackageManagerVersion } from './install-strategies';

const program = new Command();

// ASCII Art Title
const title = figlet.textSync('GO FAST', {
  font: 'Big Money-nw',
  horizontalLayout: 'default',
  verticalLayout: 'default',
});

const subtitle = '🔥 The AI-First Tech Stack for 2025';

console.log(gradient.pastel.multiline(title));
console.log(chalk.cyan.bold(`\n${subtitle}\n`));

program
  .name('create-go-fast-app')
  .description('Create a new project with the GO FAST 🔥 STACK')
  .version('1.0.8')
  .argument('[project-name]', 'name of the project to create')
  .option('-t, --template <template>', 'template to use', 'full')
  .option('-y, --yes', 'use default configuration')
  .option('--skip-install', 'skip installing dependencies')
  .option('--skip-checks', 'skip system compatibility checks')
  .option('--force', 'proceed even if system checks fail (not recommended)')
  .action(async (projectName, options) => {
    try {
      let config: ProjectConfig;

      // Validate project name early
      if (projectName && !/^[a-zA-Z0-9-_]+$/.test(projectName)) {
        console.error(chalk.red('\n❌ Invalid project name. Use only letters, numbers, hyphens, and underscores.'));
        process.exit(1);
      }

      if (options.yes) {
        config = {
          projectName: projectName || 'my-go-fast-app',
          template: 'full',
          includeAuth: true,
          includeDatabase: true,
          includeAI: true,
          includeElectron: false,
          includeObservability: true,
          packageManager: 'npm',
          skipInstall: options.skipInstall || false,
        };
      } else {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'What is your project name?',
            default: projectName || 'my-go-fast-app',
            validate: (input: string) => {
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
            },
          },
          {
            type: 'list',
            name: 'template',
            message: 'Which template would you like to use?',
            choices: [
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
            ],
            default: 'full',
          },
          {
            type: 'confirm',
            name: 'includeAuth',
            message: 'Include authentication (Auth.js)?',
            default: true,
            when: (answers: any) => answers.template === 'full',
          },
          {
            type: 'confirm',
            name: 'includeDatabase',
            message: 'Include database setup (Supabase + Drizzle)?',
            default: true,
            when: (answers: any) => answers.template === 'full',
          },
          {
            type: 'confirm',
            name: 'includeAI',
            message: 'Include AI features (Vercel AI SDK + LangChain)?',
            default: true,
            when: (answers: any) => answers.template !== 'minimal',
          },
          {
            type: 'confirm',
            name: 'includeElectron',
            message: 'Include Electron setup for desktop apps?',
            default: false,
          },
          {
            type: 'confirm',
            name: 'includeObservability',
            message: 'Include observability (Sentry + OpenTelemetry)?',
            default: true,
            when: (answers: any) => answers.template === 'full',
          },
          {
            type: 'list',
            name: 'packageManager',
            message: 'Which package manager would you like to use?',
            choices: [
              { name: 'npm (recommended)', value: 'npm' },
              { name: 'yarn', value: 'yarn' },
              { name: 'pnpm', value: 'pnpm' },
              { name: 'bun (experimental)', value: 'bun' },
            ],
            default: 'npm',
            validate: (input: string) => {
              if (!validatePackageManager(input)) {
                return 'Please select a valid package manager';
              }
              return true;
            },
          },
        ] as any);

        config = {
          ...answers,
          includeAuth: answers.includeAuth || false,
          includeDatabase: answers.includeDatabase || false,
          includeAI: answers.includeAI || false,
          includeElectron: answers.includeElectron || false,
          includeObservability: answers.includeObservability || false,
          skipInstall: options.skipInstall || false,
        } as ProjectConfig;
      }

      // Validate package manager
      if (!validatePackageManager(config.packageManager)) {
        console.error(chalk.red(`\n❌ Invalid package manager: ${config.packageManager}`));
        console.error(chalk.white('Supported package managers: npm, yarn, pnpm, bun'));
        process.exit(1);
      }

      // Check if directory already exists
      const projectPath = join(process.cwd(), config.projectName);
      if (existsSync(projectPath)) {
        console.error(chalk.red(`\n❌ Directory "${config.projectName}" already exists!`));
        console.error(chalk.white('Please choose a different name or remove the existing directory.'));
        process.exit(1);
      }

      // Perform system checks unless skipped
      if (!options.skipChecks) {
        console.log(chalk.cyan('\n🔍 Running system compatibility checks...\n'));
        
        const systemCheckSpinner = ora('Checking system requirements...').start();
        
        try {
          const systemCheckResult = await performSystemChecks(config);
          systemCheckSpinner.stop();
          
          displaySystemChecks(systemCheckResult);
          
          if (!systemCheckResult.canProceed && !options.force) {
            console.error(chalk.red('\n❌ System check failed. Cannot proceed with project creation.'));
            console.error(chalk.white('Fix the issues above and try again, or use --force to bypass (not recommended).'));
            console.error(chalk.white('You can also use --skip-checks to skip all checks.'));
            process.exit(1);
          }
          
          if (!systemCheckResult.allPassed && !options.force) {
            const warnings = systemCheckResult.checks.filter(c => c.severity === 'warning' && !c.passed);
            if (warnings.length > 0) {
              const shouldContinue = await inquirer.prompt([{
                type: 'confirm',
                name: 'continue',
                message: `${warnings.length} warning(s) found. Continue anyway?`,
                default: true
              }]);
              
              if (!shouldContinue.continue) {
                console.log(chalk.yellow('\n⚠️ Project creation cancelled. Fix the warnings and try again.'));
                process.exit(0);
              }
            }
          }
          
          // Check package manager version
          const pmVersionCheck = await checkPackageManagerVersion(config.packageManager);
          if (!pmVersionCheck.compatible) {
            console.log(chalk.yellow(`\n⚠️ ${config.packageManager} version incompatibility detected:`));
            console.log(chalk.white(`   Version: ${pmVersionCheck.version}`));
            if (pmVersionCheck.recommendation) {
              console.log(chalk.white(`   Recommendation: ${pmVersionCheck.recommendation}`));
            }
            
            if (!options.force) {
              const shouldContinue = await inquirer.prompt([{
                type: 'confirm',
                name: 'continue',
                message: 'Continue with potentially incompatible package manager?',
                default: false
              }]);
              
              if (!shouldContinue.continue) {
                console.log(chalk.yellow('\n⚠️ Project creation cancelled. Update your package manager and try again.'));
                process.exit(0);
              }
            }
          } else if (pmVersionCheck.recommendation) {
            console.log(chalk.blue(`\nℹ️ ${config.packageManager} ${pmVersionCheck.version} - ${pmVersionCheck.recommendation}`));
          }
          
        } catch (error) {
          systemCheckSpinner.fail('System check failed');
          console.error(chalk.red('\n❌ Error during system checks:'), error instanceof Error ? error.message : 'Unknown error');
          
          if (!options.force) {
            console.error(chalk.white('Use --force to bypass this error (not recommended) or --skip-checks to skip all checks.'));
            process.exit(1);
          }
          
          console.log(chalk.yellow('\n⚠️ Continuing due to --force flag...'));
        }
      } else {
        console.log(chalk.yellow('\n⚠️ System checks skipped. Project creation may fail on unsupported systems.'));
      }

      // Platform-specific warnings
      if (platform() === 'win32' && config.packageManager !== 'npm') {
        console.log(chalk.yellow(`\n⚠️ Windows users: ${config.packageManager} may have compatibility issues. npm is recommended.`));
      }

      // Create the project
      const spinner = ora('Creating your GO FAST app...').start();
      
      try {
        await createProject(config);
        spinner.succeed(chalk.green('Project created successfully!'));
        
        console.log(chalk.cyan('\n🚀 Your GO FAST app is ready!'));
        
        // Show next steps
        console.log(chalk.yellow(`\nNext steps:`));
        console.log(chalk.white(`  cd ${config.projectName}`));
        
        if (config.skipInstall) {
          console.log(chalk.white(`  ${config.packageManager} install`));
        }
        
        console.log(chalk.white(`  ${config.packageManager} run dev`));
        
        console.log(chalk.blue(`\nDeployment:`));
        console.log(chalk.white(`  ${config.packageManager} run deploy         # Deploy to production`));
        console.log(chalk.white(`  ${config.packageManager} run deploy-preview  # Deploy preview`));
        
        // Show additional setup information
        if (config.includeDatabase) {
          console.log(chalk.blue(`\nDatabase setup:`));
          console.log(chalk.white(`  1. Set up Supabase project at https://supabase.com`));
          console.log(chalk.white(`  2. Add database credentials to .env.local`));
          console.log(chalk.white(`  3. Run: ${config.packageManager} run db:generate`));
          console.log(chalk.white(`  4. Run: ${config.packageManager} run db:migrate`));
        }
        
        if (config.includeAuth) {
          console.log(chalk.blue(`\nAuthentication setup:`));
          console.log(chalk.white(`  1. Configure OAuth providers in .env.local`));
          console.log(chalk.white(`  2. Set NEXTAUTH_SECRET to a random string`));
        }
        
        if (config.includeAI) {
          console.log(chalk.blue(`\nAI setup:`));
          console.log(chalk.white(`  1. Add AI provider API keys to .env.local`));
          console.log(chalk.white(`  2. Configure LangSmith for observability (optional)`));
        }
        
        console.log(chalk.cyan('\nHappy coding! 🔥'));
        
        // Show platform-specific tips
        if (platform() === 'win32') {
          console.log(chalk.blue(`\nWindows tips:`));
          console.log(chalk.white(`  • Use Windows Terminal for better experience`));
          console.log(chalk.white(`  • Enable Developer Mode for symlink support`));
          console.log(chalk.white(`  • Consider using WSL2 for better compatibility`));
        }
        
        // Exit cleanly
        process.exit(0);
        
      } catch (error) {
        spinner.fail(chalk.red('Failed to create project'));
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(chalk.red('\n❌ Error details:'), errorMessage);
        
        // Provide specific error guidance
        if (errorMessage.includes('EACCES') || errorMessage.includes('permission')) {
          const isWindows = platform() === 'win32';
          console.error(chalk.white('\n💡 Permission error detected:'));
          console.error(chalk.white(isWindows 
            ? '   • Try running as administrator'
            : '   • Check directory permissions or try a different location'
          ));
        }
        
        if (errorMessage.includes('ENOSPC') || errorMessage.includes('space')) {
          console.error(chalk.white('\n💡 Disk space error detected:'));
          console.error(chalk.white('   • Free up disk space and try again'));
        }
        
        if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
          console.error(chalk.white('\n💡 Network error detected:'));
          console.error(chalk.white('   • Check your internet connection'));
          console.error(chalk.white('   • If behind a corporate firewall, configure proxy settings'));
        }
        
        console.error(chalk.white('\n📝 For more help:'));
        console.error(chalk.white('   • Check the system requirements'));
        console.error(chalk.white('   • Try with --skip-checks if system checks are blocking'));
        console.error(chalk.white('   • Report issues at: https://github.com/jroell/create-go-fast-app/issues'));
        
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red('\n❌ Unexpected error:'), error instanceof Error ? error.message : 'Unknown error');
      
      console.error(chalk.white('\n🐛 This appears to be a bug. Please report it at:'));
      console.error(chalk.white('   https://github.com/jroell/create-go-fast-app/issues'));
      console.error(chalk.white('\nInclude the following information:'));
      console.error(chalk.white(`   • OS: ${platform()}`));
      console.error(chalk.white(`   • Node.js: ${process.version}`));
      console.error(chalk.white(`   • CLI version: 1.0.8`));
      console.error(chalk.white(`   • Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      
      process.exit(1);
    }
  });

// Add help examples
program.addHelpText('after', `
Examples:
  $ npx create-go-fast-app my-app
  $ npx create-go-fast-app my-app --template minimal
  $ npx create-go-fast-app my-app --yes --skip-install
  $ npx create-go-fast-app my-app --skip-checks --force

Flags:
  --yes                Skip interactive prompts (use defaults)
  --skip-install       Skip dependency installation
  --skip-checks        Skip system compatibility checks
  --force              Proceed despite warnings/errors (not recommended)

Documentation:
  GitHub: https://github.com/jroell/create-go-fast-app
  Issues: https://github.com/jroell/create-go-fast-app/issues
`);

program.parse();