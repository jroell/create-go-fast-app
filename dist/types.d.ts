export interface ProjectConfig {
    projectName: string;
    template: 'full' | 'frontend' | 'minimal';
    includeAuth: boolean;
    includeDatabase: boolean;
    includeAI: boolean;
    includeElectron: boolean;
    includeObservability: boolean;
    packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
    skipInstall: boolean;
}
export interface TemplateFile {
    path: string;
    content: string;
}
export interface PackageJson {
    name: string;
    version: string;
    private: boolean;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    [key: string]: any;
}
//# sourceMappingURL=types.d.ts.map