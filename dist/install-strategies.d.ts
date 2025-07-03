import { ProjectConfig } from './types';
export interface InstallStrategy {
    command: string;
    fallbackCommands: string[];
    timeout: number;
    env?: Record<string, string>;
}
export interface InstallResult {
    success: boolean;
    command: string;
    error?: string;
    output?: string;
    fixInstructions?: string;
}
export declare function getInstallStrategy(packageManager: string, config: ProjectConfig): InstallStrategy;
export declare function installDependencies(projectPath: string, packageManager: string, config: ProjectConfig): Promise<InstallResult>;
export declare function validatePackageManager(packageManager: string): boolean;
export declare function checkPackageManagerVersion(packageManager: string): Promise<{
    version: string;
    compatible: boolean;
    recommendation?: string;
}>;
//# sourceMappingURL=install-strategies.d.ts.map