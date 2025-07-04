import { ProjectConfig } from '../types';
export declare function getTurboConfig(config: ProjectConfig): {
    $schema: string;
    tasks: {
        "db:generate"?: {
            cache: boolean;
            command: string;
        } | undefined;
        "db:migrate"?: {
            cache: boolean;
            command: string;
        } | undefined;
        "db:studio"?: {
            cache: boolean;
            persistent: boolean;
            command: string;
        } | undefined;
        build: {
            dependsOn: string[];
            outputs: string[];
            command: string;
        };
        lint: {
            dependsOn: string[];
            command: string;
        };
        dev: {
            cache: boolean;
            persistent: boolean;
            command: string;
        };
        clean: {
            cache: boolean;
            command: string;
        };
        "type-check": {
            dependsOn: string[];
            command: string;
        };
    };
};
//# sourceMappingURL=turbo-config.d.ts.map