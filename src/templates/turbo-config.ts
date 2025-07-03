import { ProjectConfig } from '../types';

export function getTurboConfig(config: ProjectConfig) {
  return {
    "$schema": "https://turbo.build/schema.json",
    "ui": "tui",
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