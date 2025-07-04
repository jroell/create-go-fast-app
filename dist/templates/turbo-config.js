"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTurboConfig = getTurboConfig;
function getTurboConfig(config) {
    return {
        "$schema": "https://turbo.build/schema.json",
        "tasks": {
            "build": {
                "dependsOn": ["^build"],
                "outputs": [".next/**", "!.next/cache/**", "dist/**"],
                "command": "next build"
            },
            "lint": {
                "dependsOn": ["^lint"],
                "command": "next lint"
            },
            "dev": {
                "cache": false,
                "persistent": true,
                "command": "next dev"
            },
            "clean": {
                "cache": false,
                "command": "rm -rf .next .turbo dist node_modules/.cache"
            },
            "type-check": {
                "dependsOn": ["^type-check"],
                "command": "tsc --noEmit"
            },
            ...(config.includeDatabase && {
                "db:generate": {
                    "cache": false,
                    "command": "drizzle-kit generate"
                },
                "db:migrate": {
                    "cache": false,
                    "command": "drizzle-kit migrate"
                },
                "db:studio": {
                    "cache": false,
                    "persistent": true,
                    "command": "drizzle-kit studio"
                }
            })
        }
    };
}
//# sourceMappingURL=turbo-config.js.map