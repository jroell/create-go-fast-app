import { ProjectConfig } from './types';
export interface SystemCheck {
    name: string;
    passed: boolean;
    message: string;
    fixInstructions?: string;
    severity: 'error' | 'warning' | 'info';
}
export interface SystemCheckResult {
    allPassed: boolean;
    checks: SystemCheck[];
    canProceed: boolean;
}
export declare function performSystemChecks(config: ProjectConfig): Promise<SystemCheckResult>;
export declare function displaySystemChecks(result: SystemCheckResult): void;
//# sourceMappingURL=system-checks.d.ts.map