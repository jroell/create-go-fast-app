#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const figlet_1 = __importDefault(require("figlet"));
const gradient_string_1 = __importDefault(require("gradient-string"));
const fs_1 = require("fs");
const path_1 = require("path");
const create_project_1 = require("./create-project");
const program = new commander_1.Command();
// ASCII Art Title
const title = figlet_1.default.textSync('GO FAST', {
    font: 'Big Money-nw',
    horizontalLayout: 'default',
    verticalLayout: 'default',
});
const subtitle = '🔥 The AI-First Tech Stack for 2025';
console.log(gradient_string_1.default.pastel.multiline(title));
console.log(chalk_1.default.cyan.bold(`\n${subtitle}\n`));
program
    .name('create-go-fast-app')
    .description('Create a new project with the GO FAST 🔥 STACK')
    .version('1.0.0')
    .argument('[project-name]', 'name of the project to create')
    .option('-t, --template <template>', 'template to use', 'full')
    .option('-y, --yes', 'use default configuration')
    .option('--skip-install', 'skip installing dependencies')
    .action(async (projectName, options) => {
    try {
        let config;
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
        }
        else {
            const answers = await inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'What is your project name?',
                    default: projectName || 'my-go-fast-app',
                    validate: (input) => {
                        if (input.length === 0) {
                            return 'Project name is required';
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
                    when: (answers) => answers.template === 'full',
                },
                {
                    type: 'confirm',
                    name: 'includeDatabase',
                    message: 'Include database setup (Supabase + Drizzle)?',
                    default: true,
                    when: (answers) => answers.template === 'full',
                },
                {
                    type: 'confirm',
                    name: 'includeAI',
                    message: 'Include AI features (Vercel AI SDK + LangChain)?',
                    default: true,
                    when: (answers) => answers.template !== 'minimal',
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
                    when: (answers) => answers.template === 'full',
                },
                {
                    type: 'list',
                    name: 'packageManager',
                    message: 'Which package manager would you like to use?',
                    choices: [
                        { name: 'npm', value: 'npm' },
                        { name: 'yarn', value: 'yarn' },
                        { name: 'pnpm', value: 'pnpm' },
                        { name: 'bun', value: 'bun' },
                    ],
                    default: 'npm',
                },
            ]);
            config = {
                ...answers,
                includeAuth: answers.includeAuth || false,
                includeDatabase: answers.includeDatabase || false,
                includeAI: answers.includeAI || false,
                includeElectron: answers.includeElectron || false,
                includeObservability: answers.includeObservability || false,
                skipInstall: options.skipInstall || false,
            };
        }
        // Check if directory already exists
        const projectPath = (0, path_1.join)(process.cwd(), config.projectName);
        if ((0, fs_1.existsSync)(projectPath)) {
            console.log(chalk_1.default.red(`\nDirectory "${config.projectName}" already exists!`));
            process.exit(1);
        }
        // Create the project
        const spinner = (0, ora_1.default)('Creating your GO FAST app...').start();
        try {
            await (0, create_project_1.createProject)(config);
            spinner.succeed(chalk_1.default.green('Project created successfully!'));
            console.log(chalk_1.default.cyan('\n🚀 Your GO FAST app is ready!'));
            console.log(chalk_1.default.yellow(`\nNext steps:`));
            console.log(chalk_1.default.white(`  cd ${config.projectName}`));
            if (config.skipInstall) {
                console.log(chalk_1.default.white(`  ${config.packageManager} install`));
            }
            console.log(chalk_1.default.white(`  ${config.packageManager} run dev`));
            console.log(chalk_1.default.cyan('\nHappy coding! 🔥'));
        }
        catch (error) {
            spinner.fail(chalk_1.default.red('Failed to create project'));
            console.error(chalk_1.default.red(error instanceof Error ? error.message : 'Unknown error'));
            process.exit(1);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=index.js.map