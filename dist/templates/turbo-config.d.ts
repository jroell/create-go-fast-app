import { ProjectConfig } from '../types';
export declare function getTurboConfig(config: ProjectConfig): {
    $schema: string;
    tasks: {
        "db:generate"?: {
            cache: boolean;
        } | undefined;
        "db:migrate"?: {
            cache: boolean;
        } | undefined;
        "db:studio"?: {
            cache: boolean;
            persistent: boolean;
        } | undefined;
        build: {
            dependsOn: string[];
            outputs: string[];
        };
        lint: {
            dependsOn: string[];
        };
        dev: {
            cache: boolean;
            persistent: boolean;
        };
        clean: {
            cache: boolean;
        };
        "type-check": {
            dependsOn: string[];
        };
    };
};
//# sourceMappingURL=turbo-config.d.ts.map