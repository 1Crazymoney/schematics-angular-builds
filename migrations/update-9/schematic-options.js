"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const workspace_1 = require("../../utility/workspace");
function default_1() {
    return workspace_1.updateWorkspace(workspace => {
        // Update root level schematics options if present
        const rootSchematics = workspace.extensions.schematics;
        if (rootSchematics && core_1.json.isJsonObject(rootSchematics)) {
            updateSchematicsField(rootSchematics);
        }
        // Update project level schematics options if present
        for (const [, project] of workspace.projects) {
            const projectSchematics = project.extensions.schematics;
            if (projectSchematics && core_1.json.isJsonObject(projectSchematics)) {
                updateSchematicsField(projectSchematics);
            }
        }
    });
}
exports.default = default_1;
function updateSchematicsField(schematics) {
    for (const [schematicName, schematicOptions] of Object.entries(schematics)) {
        if (!core_1.json.isJsonObject(schematicOptions)) {
            continue;
        }
        if (!schematicName.startsWith('@schematics/angular:')) {
            continue;
        }
        // Replace `styleext` with `style`
        if (schematicOptions.styleext !== undefined) {
            schematicOptions.style = schematicOptions.styleext;
            delete schematicOptions.styleext;
        }
        // Replace `spec` with `skipTests`
        if (schematicOptions.spec !== undefined) {
            // skipTests value is inverted
            schematicOptions.skipTests = !schematicOptions.spec;
            delete schematicOptions.spec;
        }
    }
}
