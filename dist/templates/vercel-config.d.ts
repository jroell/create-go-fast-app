import { ProjectConfig } from '../types';
export declare function getVercelConfig(config: ProjectConfig): {
    framework: string;
    buildCommand: string;
    devCommand: string;
    installCommand: string;
    functions: {
        "src/app/api/**": {
            maxDuration: number;
        };
    };
    headers: {
        source: string;
        headers: {
            key: string;
            value: string;
        }[];
    }[];
};
//# sourceMappingURL=vercel-config.d.ts.map