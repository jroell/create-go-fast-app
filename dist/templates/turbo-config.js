"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTurboConfig = getTurboConfig;
function getTurboConfig(config) {
    return {
        "$schema": "https://turbo.build/schema.json",
        "tasks": {
            "build": {
                "dependsOn": ["^build"],
                "outputs": [".next/**", "!.next/cache/**", "dist/**"]
            },
            "lint": {
                "dependsOn": ["^lint"]
            },
            "dev": {
                "cache": false,
                "persistent": true
            },
            "clean": {
                "cache": false
            },
            "type-check": {
                "dependsOn": ["^type-check"]
            },
            ...(config.includeDatabase && {
                "db:generate": {
                    "cache": false
                },
                "db:migrate": {
                    "cache": false
                },
                "db:studio": {
                    "cache": false,
                    "persistent": true
                }
            })
        }
    };
}
//# sourceMappingURL=turbo-config.js.map