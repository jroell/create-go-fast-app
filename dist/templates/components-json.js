"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponentsJson = getComponentsJson;
function getComponentsJson() {
    return {
        "$schema": "https://ui.shadcn.com/schema.json",
        "style": "default",
        "rsc": true,
        "tsx": true,
        "tailwind": {
            "config": "tailwind.config.js",
            "css": "src/app/globals.css",
            "baseColor": "slate",
            "cssVariables": true,
            "prefix": ""
        },
        "aliases": {
            "components": "@/components",
            "utils": "@/lib/utils"
        }
    };
}
//# sourceMappingURL=components-json.js.map