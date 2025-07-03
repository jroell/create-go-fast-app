"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVercelConfig = getVercelConfig;
function getVercelConfig(config) {
    const baseConfig = {
        framework: "nextjs",
        buildCommand: config.packageManager === 'bun' ? 'bun run build' :
            config.packageManager === 'pnpm' ? 'pnpm build' :
                config.packageManager === 'yarn' ? 'yarn build' : 'npm run build',
        devCommand: config.packageManager === 'bun' ? 'bun run dev' :
            config.packageManager === 'pnpm' ? 'pnpm dev' :
                config.packageManager === 'yarn' ? 'yarn dev' : 'npm run dev',
        installCommand: config.packageManager === 'bun' ? 'bun install' :
            config.packageManager === 'pnpm' ? 'pnpm install' :
                config.packageManager === 'yarn' ? 'yarn install' : 'npm install',
        functions: {
            "src/app/api/**": {
                maxDuration: 30
            }
        },
        headers: [
            {
                source: "/api/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*"
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS"
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization"
                    }
                ]
            }
        ]
    };
    return baseConfig;
}
//# sourceMappingURL=vercel-config.js.map