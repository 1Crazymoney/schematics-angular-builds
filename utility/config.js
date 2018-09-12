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
const schematics_1 = require("@angular-devkit/schematics");
function getWorkspacePath(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(path => host.exists(path))[0];
    return path;
}
exports.getWorkspacePath = getWorkspacePath;
function getWorkspace(host) {
    const path = getWorkspacePath(host);
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException(`Could not find (${path})`);
    }
    const content = configBuffer.toString();
    return core_1.parseJson(content, core_1.JsonParseMode.Loose);
}
exports.getWorkspace = getWorkspace;
function addProjectToWorkspace(workspace, name, project) {
    return (host, context) => {
        if (workspace.projects[name]) {
            throw new Error(`Project '${name}' already exists in workspace.`);
        }
        // Add project to workspace.
        workspace.projects[name] = project;
        if (!workspace.defaultProject && Object.keys(workspace.projects).length === 1) {
            // Make the new project the default one.
            workspace.defaultProject = name;
        }
        return updateWorkspace(workspace);
    };
}
exports.addProjectToWorkspace = addProjectToWorkspace;
function updateWorkspace(workspace) {
    return (host, context) => {
        host.overwrite(getWorkspacePath(host), JSON.stringify(workspace, null, 2));
    };
}
exports.updateWorkspace = updateWorkspace;
exports.configPath = '/.angular-cli.json';
function getConfig(host) {
    const configBuffer = host.read(exports.configPath);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException('Could not find .angular-cli.json');
    }
    const config = core_1.parseJson(configBuffer.toString(), core_1.JsonParseMode.Loose);
    return config;
}
exports.getConfig = getConfig;
function getAppFromConfig(config, appIndexOrName) {
    if (!config.apps) {
        return null;
    }
    if (parseInt(appIndexOrName) >= 0) {
        return config.apps[parseInt(appIndexOrName)];
    }
    return config.apps.filter((app) => app.name === appIndexOrName)[0];
}
exports.getAppFromConfig = getAppFromConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9zY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBZ0U7QUFDaEUsMkRBQStGO0FBd2QvRixTQUFnQixnQkFBZ0IsQ0FBQyxJQUFVO0lBQ3pDLE1BQU0sYUFBYSxHQUFHLENBQUUsZUFBZSxFQUFFLGdCQUFnQixDQUFFLENBQUM7SUFDNUQsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFMRCw0Q0FLQztBQUVELFNBQWdCLFlBQVksQ0FBQyxJQUFVO0lBQ3JDLE1BQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsSUFBSSxZQUFZLEtBQUssSUFBSSxFQUFFO1FBQ3pCLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyxtQkFBbUIsSUFBSSxHQUFHLENBQUMsQ0FBQztLQUMzRDtJQUNELE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUV4QyxPQUFPLGdCQUFTLENBQUMsT0FBTyxFQUFFLG9CQUFhLENBQUMsS0FBSyxDQUEwQixDQUFDO0FBQzFFLENBQUM7QUFURCxvQ0FTQztBQUVELFNBQWdCLHFCQUFxQixDQUNuQyxTQUEwQixFQUMxQixJQUFZLEVBQ1osT0FBdUM7SUFFdkMsT0FBTyxDQUFDLElBQVUsRUFBRSxPQUF5QixFQUFFLEVBQUU7UUFFL0MsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxJQUFJLGdDQUFnQyxDQUFDLENBQUM7U0FDbkU7UUFFRCw0QkFBNEI7UUFDNUIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7UUFFbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3RSx3Q0FBd0M7WUFDeEMsU0FBUyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDakM7UUFFRCxPQUFPLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBckJELHNEQXFCQztBQUVELFNBQWdCLGVBQWUsQ0FBQyxTQUEwQjtJQUN0RCxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQztBQUNOLENBQUM7QUFKRCwwQ0FJQztBQUVZLFFBQUEsVUFBVSxHQUFHLG9CQUFvQixDQUFDO0FBRS9DLFNBQWdCLFNBQVMsQ0FBQyxJQUFVO0lBQ2xDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxDQUFDO0lBQzNDLElBQUksWUFBWSxLQUFLLElBQUksRUFBRTtRQUN6QixNQUFNLElBQUksZ0NBQW1CLENBQUMsa0NBQWtDLENBQUMsQ0FBQztLQUNuRTtJQUVELE1BQU0sTUFBTSxHQUFHLGdCQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLG9CQUFhLENBQUMsS0FBSyxDQUFvQixDQUFDO0lBRTFGLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFURCw4QkFTQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLE1BQWlCLEVBQUUsY0FBc0I7SUFDeEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDaEIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNqQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7S0FDOUM7SUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFWRCw0Q0FVQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IEpzb25QYXJzZU1vZGUsIHBhcnNlSnNvbiB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IFJ1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFNjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBQcm9qZWN0VHlwZSwgV29ya3NwYWNlUHJvamVjdCwgV29ya3NwYWNlU2NoZW1hIH0gZnJvbSAnLi93b3Jrc3BhY2UtbW9kZWxzJztcblxuLy8gVGhlIGludGVyZmFjZXMgYmVsb3cgYXJlIGdlbmVyYXRlZCBmcm9tIHRoZSBBbmd1bGFyIENMSSBjb25maWd1cmF0aW9uIHNjaGVtYVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci1jbGkvYmxvYi9tYXN0ZXIvcGFja2FnZXMvQGFuZ3VsYXIvY2xpL2xpYi9jb25maWcvc2NoZW1hLmpzb25cbmV4cG9ydCBpbnRlcmZhY2UgQXBwQ29uZmlnIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIGFwcC5cbiAgICovXG4gIG5hbWU/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBEaXJlY3Rvcnkgd2hlcmUgYXBwIGZpbGVzIGFyZSBwbGFjZWQuXG4gICAqL1xuICBhcHBSb290Pzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoZSBhcHAuXG4gICAqL1xuICByb290Pzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIG91dHB1dCBkaXJlY3RvcnkgZm9yIGJ1aWxkIHJlc3VsdHMuXG4gICAqL1xuICBvdXREaXI/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBMaXN0IG9mIGFwcGxpY2F0aW9uIGFzc2V0cy5cbiAgICovXG4gIGFzc2V0cz86IChzdHJpbmcgfCB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBwYXR0ZXJuIHRvIG1hdGNoLlxuICAgICAgICovXG4gICAgICBnbG9iPzogc3RyaW5nO1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGlyIHRvIHNlYXJjaCB3aXRoaW4uXG4gICAgICAgKi9cbiAgICAgIGlucHV0Pzogc3RyaW5nO1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgb3V0cHV0IHBhdGggKHJlbGF0aXZlIHRvIHRoZSBvdXREaXIpLlxuICAgICAgICovXG4gICAgICBvdXRwdXQ/OiBzdHJpbmc7XG4gIH0pW107XG4gIC8qKlxuICAgKiBVUkwgd2hlcmUgZmlsZXMgd2lsbCBiZSBkZXBsb3llZC5cbiAgICovXG4gIGRlcGxveVVybD86IHN0cmluZztcbiAgLyoqXG4gICAqIEJhc2UgdXJsIGZvciB0aGUgYXBwbGljYXRpb24gYmVpbmcgYnVpbHQuXG4gICAqL1xuICBiYXNlSHJlZj86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBydW50aW1lIHBsYXRmb3JtIG9mIHRoZSBhcHAuXG4gICAqL1xuICBwbGF0Zm9ybT86ICgnYnJvd3NlcicgfCAnc2VydmVyJyk7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc3RhcnQgSFRNTCBmaWxlLlxuICAgKi9cbiAgaW5kZXg/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgbWFpbiBlbnRyeS1wb2ludCBmaWxlLlxuICAgKi9cbiAgbWFpbj86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwb2x5ZmlsbHMgZmlsZS5cbiAgICovXG4gIHBvbHlmaWxscz86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSB0ZXN0IGVudHJ5LXBvaW50IGZpbGUuXG4gICAqL1xuICB0ZXN0Pzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIFR5cGVTY3JpcHQgY29uZmlndXJhdGlvbiBmaWxlLlxuICAgKi9cbiAgdHNjb25maWc/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgVHlwZVNjcmlwdCBjb25maWd1cmF0aW9uIGZpbGUgZm9yIHVuaXQgdGVzdHMuXG4gICAqL1xuICB0ZXN0VHNjb25maWc/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgcHJlZml4IHRvIGFwcGx5IHRvIGdlbmVyYXRlZCBzZWxlY3RvcnMuXG4gICAqL1xuICBwcmVmaXg/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBFeHBlcmltZW50YWwgc3VwcG9ydCBmb3IgYSBzZXJ2aWNlIHdvcmtlciBmcm9tIEBhbmd1bGFyL3NlcnZpY2Utd29ya2VyLlxuICAgKi9cbiAgc2VydmljZVdvcmtlcj86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBHbG9iYWwgc3R5bGVzIHRvIGJlIGluY2x1ZGVkIGluIHRoZSBidWlsZC5cbiAgICovXG4gIHN0eWxlcz86IChzdHJpbmcgfCB7XG4gICAgICBpbnB1dD86IHN0cmluZztcbiAgICAgIFtuYW1lOiBzdHJpbmddOiBhbnk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bm8tYW55XG4gIH0pW107XG4gIC8qKlxuICAgKiBPcHRpb25zIHRvIHBhc3MgdG8gc3R5bGUgcHJlcHJvY2Vzc29yc1xuICAgKi9cbiAgc3R5bGVQcmVwcm9jZXNzb3JPcHRpb25zPzoge1xuICAgICAgLyoqXG4gICAgICAgKiBQYXRocyB0byBpbmNsdWRlLiBQYXRocyB3aWxsIGJlIHJlc29sdmVkIHRvIHByb2plY3Qgcm9vdC5cbiAgICAgICAqL1xuICAgICAgaW5jbHVkZVBhdGhzPzogc3RyaW5nW107XG4gIH07XG4gIC8qKlxuICAgKiBHbG9iYWwgc2NyaXB0cyB0byBiZSBpbmNsdWRlZCBpbiB0aGUgYnVpbGQuXG4gICAqL1xuICBzY3JpcHRzPzogKHN0cmluZyB8IHtcbiAgICAgIGlucHV0OiBzdHJpbmc7XG4gICAgICBbbmFtZTogc3RyaW5nXTogYW55OyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWFueVxuICB9KVtdO1xuICAvKipcbiAgICogU291cmNlIGZpbGUgZm9yIGVudmlyb25tZW50IGNvbmZpZy5cbiAgICovXG4gIGVudmlyb25tZW50U291cmNlPzogc3RyaW5nO1xuICAvKipcbiAgICogTmFtZSBhbmQgY29ycmVzcG9uZGluZyBmaWxlIGZvciBlbnZpcm9ubWVudCBjb25maWcuXG4gICAqL1xuICBlbnZpcm9ubWVudHM/OiB7XG4gICAgICBbbmFtZTogc3RyaW5nXTogYW55OyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWFueVxuICB9O1xuICBhcHBTaGVsbD86IHtcbiAgICBhcHA6IHN0cmluZztcbiAgICByb3V0ZTogc3RyaW5nO1xuICB9O1xuICBidWRnZXRzPzoge1xuICAgIC8qKlxuICAgICAqIFRoZSB0eXBlIG9mIGJ1ZGdldFxuICAgICAqL1xuICAgIHR5cGU/OiAoJ2J1bmRsZScgfCAnaW5pdGlhbCcgfCAnYWxsU2NyaXB0JyB8ICdhbGwnIHwgJ2FueVNjcmlwdCcgfCAnYW55Jyk7XG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGJ1bmRsZVxuICAgICAqL1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVGhlIGJhc2VsaW5lIHNpemUgZm9yIGNvbXBhcmlzb24uXG4gICAgICovXG4gICAgYmFzZWxpbmU/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVGhlIG1heGltdW0gdGhyZXNob2xkIGZvciB3YXJuaW5nIHJlbGF0aXZlIHRvIHRoZSBiYXNlbGluZS5cbiAgICAgKi9cbiAgICBtYXhpbXVtV2FybmluZz86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW11bSB0aHJlc2hvbGQgZm9yIGVycm9yIHJlbGF0aXZlIHRvIHRoZSBiYXNlbGluZS5cbiAgICAgKi9cbiAgICBtYXhpbXVtRXJyb3I/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVGhlIG1pbmltdW0gdGhyZXNob2xkIGZvciB3YXJuaW5nIHJlbGF0aXZlIHRvIHRoZSBiYXNlbGluZS5cbiAgICAgKi9cbiAgICBtaW5pbXVtV2FybmluZz86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBUaGUgbWluaW11bSB0aHJlc2hvbGQgZm9yIGVycm9yIHJlbGF0aXZlIHRvIHRoZSBiYXNlbGluZS5cbiAgICAgKi9cbiAgICBtaW5pbXVtRXJyb3I/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVGhlIHRocmVzaG9sZCBmb3Igd2FybmluZyByZWxhdGl2ZSB0byB0aGUgYmFzZWxpbmUgKG1pbiAmIG1heCkuXG4gICAgICovXG4gICAgd2FybmluZz86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBUaGUgdGhyZXNob2xkIGZvciBlcnJvciByZWxhdGl2ZSB0byB0aGUgYmFzZWxpbmUgKG1pbiAmIG1heCkuXG4gICAgICovXG4gICAgZXJyb3I/OiBzdHJpbmc7XG4gIH1bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbGlDb25maWcge1xuICAkc2NoZW1hPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGdsb2JhbCBjb25maWd1cmF0aW9uIG9mIHRoZSBwcm9qZWN0LlxuICAgKi9cbiAgcHJvamVjdD86IHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIG5hbWUgb2YgdGhlIHByb2plY3QuXG4gICAgICAgKi9cbiAgICAgIG5hbWU/OiBzdHJpbmc7XG4gICAgICAvKipcbiAgICAgICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgcHJvamVjdCB3YXMgZWplY3RlZC5cbiAgICAgICAqL1xuICAgICAgZWplY3RlZD86IGJvb2xlYW47XG4gIH07XG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIG9mIHRoZSBkaWZmZXJlbnQgYXBwbGljYXRpb25zIGluIHRoaXMgcHJvamVjdC5cbiAgICovXG4gIGFwcHM/OiBBcHBDb25maWdbXTtcbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gZm9yIGVuZC10by1lbmQgdGVzdHMuXG4gICAqL1xuICBlMmU/OiB7XG4gICAgICBwcm90cmFjdG9yPzoge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFBhdGggdG8gdGhlIGNvbmZpZyBmaWxlLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGNvbmZpZz86IHN0cmluZztcbiAgICAgIH07XG4gIH07XG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIHRvIGJlIHBhc3NlZCB0byBUU0xpbnQuXG4gICAqL1xuICBsaW50Pzoge1xuICAgICAgLyoqXG4gICAgICAgKiBGaWxlIGdsb2IocykgdG8gbGludC5cbiAgICAgICAqL1xuICAgICAgZmlsZXM/OiAoc3RyaW5nIHwgc3RyaW5nW10pO1xuICAgICAgLyoqXG4gICAgICAgKiBMb2NhdGlvbiBvZiB0aGUgdHNjb25maWcuanNvbiBwcm9qZWN0IGZpbGUuXG4gICAgICAgKiBXaWxsIGFsc28gdXNlIGFzIGZpbGVzIHRvIGxpbnQgaWYgJ2ZpbGVzJyBwcm9wZXJ0eSBub3QgcHJlc2VudC5cbiAgICAgICAqL1xuICAgICAgcHJvamVjdDogc3RyaW5nO1xuICAgICAgLyoqXG4gICAgICAgKiBMb2NhdGlvbiBvZiB0aGUgdHNsaW50Lmpzb24gY29uZmlndXJhdGlvbi5cbiAgICAgICAqL1xuICAgICAgdHNsaW50Q29uZmlnPzogc3RyaW5nO1xuICAgICAgLyoqXG4gICAgICAgKiBGaWxlIGdsb2IocykgdG8gaWdub3JlLlxuICAgICAgICovXG4gICAgICBleGNsdWRlPzogKHN0cmluZyB8IHN0cmluZ1tdKTtcbiAgfVtdO1xuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBmb3IgdW5pdCB0ZXN0cy5cbiAgICovXG4gIHRlc3Q/OiB7XG4gICAgICBrYXJtYT86IHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBQYXRoIHRvIHRoZSBrYXJtYSBjb25maWcgZmlsZS5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBjb25maWc/OiBzdHJpbmc7XG4gICAgICB9O1xuICAgICAgY29kZUNvdmVyYWdlPzoge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEdsb2JzIHRvIGV4Y2x1ZGUgZnJvbSBjb2RlIGNvdmVyYWdlLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGV4Y2x1ZGU/OiBzdHJpbmdbXTtcbiAgICAgIH07XG4gIH07XG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSBkZWZhdWx0IHZhbHVlcyBmb3IgZ2VuZXJhdGluZy5cbiAgICovXG4gIGRlZmF1bHRzPzoge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZmlsZSBleHRlbnNpb24gdG8gYmUgdXNlZCBmb3Igc3R5bGUgZmlsZXMuXG4gICAgICAgKi9cbiAgICAgIHN0eWxlRXh0Pzogc3RyaW5nO1xuICAgICAgLyoqXG4gICAgICAgKiBIb3cgb2Z0ZW4gdG8gY2hlY2sgZm9yIGZpbGUgdXBkYXRlcy5cbiAgICAgICAqL1xuICAgICAgcG9sbD86IG51bWJlcjtcbiAgICAgIC8qKlxuICAgICAgICogVXNlIGxpbnQgdG8gZml4IGZpbGVzIGFmdGVyIGdlbmVyYXRpb25cbiAgICAgICAqL1xuICAgICAgbGludEZpeD86IGJvb2xlYW47XG4gICAgICAvKipcbiAgICAgICAqIE9wdGlvbnMgZm9yIGdlbmVyYXRpbmcgYSBjbGFzcy5cbiAgICAgICAqL1xuICAgICAgY2xhc3M/OiB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogU3BlY2lmaWVzIGlmIGEgc3BlYyBmaWxlIGlzIGdlbmVyYXRlZC5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBzcGVjPzogYm9vbGVhbjtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIE9wdGlvbnMgZm9yIGdlbmVyYXRpbmcgYSBjb21wb25lbnQuXG4gICAgICAgKi9cbiAgICAgIGNvbXBvbmVudD86IHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBGbGFnIHRvIGluZGljYXRlIGlmIGEgZGlyIGlzIGNyZWF0ZWQuXG4gICAgICAgICAgICovXG4gICAgICAgICAgZmxhdD86IGJvb2xlYW47XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogU3BlY2lmaWVzIGlmIGEgc3BlYyBmaWxlIGlzIGdlbmVyYXRlZC5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBzcGVjPzogYm9vbGVhbjtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBTcGVjaWZpZXMgaWYgdGhlIHN0eWxlIHdpbGwgYmUgaW4gdGhlIHRzIGZpbGUuXG4gICAgICAgICAgICovXG4gICAgICAgICAgaW5saW5lU3R5bGU/OiBib29sZWFuO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFNwZWNpZmllcyBpZiB0aGUgdGVtcGxhdGUgd2lsbCBiZSBpbiB0aGUgdHMgZmlsZS5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBpbmxpbmVUZW1wbGF0ZT86IGJvb2xlYW47XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogU3BlY2lmaWVzIHRoZSB2aWV3IGVuY2Fwc3VsYXRpb24gc3RyYXRlZ3kuXG4gICAgICAgICAgICovXG4gICAgICAgICAgdmlld0VuY2Fwc3VsYXRpb24/OiAoJ0VtdWxhdGVkJyB8ICdOYXRpdmUnIHwgJ05vbmUnKTtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBTcGVjaWZpZXMgdGhlIGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gICAgICAgICAgICovXG4gICAgICAgICAgY2hhbmdlRGV0ZWN0aW9uPzogKCdEZWZhdWx0JyB8ICdPblB1c2gnKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIE9wdGlvbnMgZm9yIGdlbmVyYXRpbmcgYSBkaXJlY3RpdmUuXG4gICAgICAgKi9cbiAgICAgIGRpcmVjdGl2ZT86IHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBGbGFnIHRvIGluZGljYXRlIGlmIGEgZGlyIGlzIGNyZWF0ZWQuXG4gICAgICAgICAgICovXG4gICAgICAgICAgZmxhdD86IGJvb2xlYW47XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogU3BlY2lmaWVzIGlmIGEgc3BlYyBmaWxlIGlzIGdlbmVyYXRlZC5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBzcGVjPzogYm9vbGVhbjtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIE9wdGlvbnMgZm9yIGdlbmVyYXRpbmcgYSBndWFyZC5cbiAgICAgICAqL1xuICAgICAgZ3VhcmQ/OiB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogRmxhZyB0byBpbmRpY2F0ZSBpZiBhIGRpciBpcyBjcmVhdGVkLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGZsYXQ/OiBib29sZWFuO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFNwZWNpZmllcyBpZiBhIHNwZWMgZmlsZSBpcyBnZW5lcmF0ZWQuXG4gICAgICAgICAgICovXG4gICAgICAgICAgc3BlYz86IGJvb2xlYW47XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBPcHRpb25zIGZvciBnZW5lcmF0aW5nIGFuIGludGVyZmFjZS5cbiAgICAgICAqL1xuICAgICAgaW50ZXJmYWNlPzoge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFByZWZpeCB0byBhcHBseSB0byBpbnRlcmZhY2UgbmFtZXMuIChpLmUuIEkpXG4gICAgICAgICAgICovXG4gICAgICAgICAgcHJlZml4Pzogc3RyaW5nO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogT3B0aW9ucyBmb3IgZ2VuZXJhdGluZyBhIG1vZHVsZS5cbiAgICAgICAqL1xuICAgICAgbW9kdWxlPzoge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEZsYWcgdG8gaW5kaWNhdGUgaWYgYSBkaXIgaXMgY3JlYXRlZC5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBmbGF0PzogYm9vbGVhbjtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBTcGVjaWZpZXMgaWYgYSBzcGVjIGZpbGUgaXMgZ2VuZXJhdGVkLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHNwZWM/OiBib29sZWFuO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogT3B0aW9ucyBmb3IgZ2VuZXJhdGluZyBhIHBpcGUuXG4gICAgICAgKi9cbiAgICAgIHBpcGU/OiB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogRmxhZyB0byBpbmRpY2F0ZSBpZiBhIGRpciBpcyBjcmVhdGVkLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGZsYXQ/OiBib29sZWFuO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFNwZWNpZmllcyBpZiBhIHNwZWMgZmlsZSBpcyBnZW5lcmF0ZWQuXG4gICAgICAgICAgICovXG4gICAgICAgICAgc3BlYz86IGJvb2xlYW47XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBPcHRpb25zIGZvciBnZW5lcmF0aW5nIGEgc2VydmljZS5cbiAgICAgICAqL1xuICAgICAgc2VydmljZT86IHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBGbGFnIHRvIGluZGljYXRlIGlmIGEgZGlyIGlzIGNyZWF0ZWQuXG4gICAgICAgICAgICovXG4gICAgICAgICAgZmxhdD86IGJvb2xlYW47XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogU3BlY2lmaWVzIGlmIGEgc3BlYyBmaWxlIGlzIGdlbmVyYXRlZC5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBzcGVjPzogYm9vbGVhbjtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFByb3BlcnRpZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSBidWlsZCBjb21tYW5kLlxuICAgICAgICovXG4gICAgICBidWlsZD86IHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBPdXRwdXQgc291cmNlbWFwcy5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBzb3VyY2VtYXBzPzogYm9vbGVhbjtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBCYXNlIHVybCBmb3IgdGhlIGFwcGxpY2F0aW9uIGJlaW5nIGJ1aWx0LlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGJhc2VIcmVmPzogc3RyaW5nO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFRoZSBzc2wga2V5IHVzZWQgYnkgdGhlIHNlcnZlci5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBwcm9ncmVzcz86IGJvb2xlYW47XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogRW5hYmxlIGFuZCBkZWZpbmUgdGhlIGZpbGUgd2F0Y2hpbmcgcG9sbCB0aW1lIHBlcmlvZCAobWlsbGlzZWNvbmRzKS5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBwb2xsPzogbnVtYmVyO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIERlbGV0ZSBvdXRwdXQgcGF0aCBiZWZvcmUgYnVpbGQuXG4gICAgICAgICAgICovXG4gICAgICAgICAgZGVsZXRlT3V0cHV0UGF0aD86IGJvb2xlYW47XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogRG8gbm90IHVzZSB0aGUgcmVhbCBwYXRoIHdoZW4gcmVzb2x2aW5nIG1vZHVsZXMuXG4gICAgICAgICAgICovXG4gICAgICAgICAgcHJlc2VydmVTeW1saW5rcz86IGJvb2xlYW47XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogU2hvdyBjaXJjdWxhciBkZXBlbmRlbmN5IHdhcm5pbmdzIG9uIGJ1aWxkcy5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBzaG93Q2lyY3VsYXJEZXBlbmRlbmNpZXM/OiBib29sZWFuO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFVzZSBhIHNlcGFyYXRlIGJ1bmRsZSBjb250YWluaW5nIGNvZGUgdXNlZCBhY3Jvc3MgbXVsdGlwbGUgYnVuZGxlcy5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBjb21tb25DaHVuaz86IGJvb2xlYW47XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogVXNlIGZpbGUgbmFtZSBmb3IgbGF6eSBsb2FkZWQgY2h1bmtzLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIG5hbWVkQ2h1bmtzPzogYm9vbGVhbjtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFByb3BlcnRpZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSBzZXJ2ZSBjb21tYW5kLlxuICAgICAgICovXG4gICAgICBzZXJ2ZT86IHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBUaGUgcG9ydCB0aGUgYXBwbGljYXRpb24gd2lsbCBiZSBzZXJ2ZWQgb24uXG4gICAgICAgICAgICovXG4gICAgICAgICAgcG9ydD86IG51bWJlcjtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBUaGUgaG9zdCB0aGUgYXBwbGljYXRpb24gd2lsbCBiZSBzZXJ2ZWQgb24uXG4gICAgICAgICAgICovXG4gICAgICAgICAgaG9zdD86IHN0cmluZztcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBFbmFibGVzIHNzbCBmb3IgdGhlIGFwcGxpY2F0aW9uLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHNzbD86IGJvb2xlYW47XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogVGhlIHNzbCBrZXkgdXNlZCBieSB0aGUgc2VydmVyLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHNzbEtleT86IHN0cmluZztcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBUaGUgc3NsIGNlcnRpZmljYXRlIHVzZWQgYnkgdGhlIHNlcnZlci5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBzc2xDZXJ0Pzogc3RyaW5nO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFByb3h5IGNvbmZpZ3VyYXRpb24gZmlsZS5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBwcm94eUNvbmZpZz86IHN0cmluZztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFByb3BlcnRpZXMgYWJvdXQgc2NoZW1hdGljcy5cbiAgICAgICAqL1xuICAgICAgc2NoZW1hdGljcz86IHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBUaGUgc2NoZW1hdGljcyBjb2xsZWN0aW9uIHRvIHVzZS5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBjb2xsZWN0aW9uPzogc3RyaW5nO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFRoZSBuZXcgYXBwIHNjaGVtYXRpYy5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBuZXdBcHA/OiBzdHJpbmc7XG4gICAgICB9O1xuICB9O1xuICAvKipcbiAgICogU3BlY2lmeSB3aGljaCBwYWNrYWdlIG1hbmFnZXIgdG9vbCB0byB1c2UuXG4gICAqL1xuICBwYWNrYWdlTWFuYWdlcj86ICgnbnBtJyB8ICdjbnBtJyB8ICd5YXJuJyB8ICdkZWZhdWx0Jyk7XG4gIC8qKlxuICAgKiBBbGxvdyBwZW9wbGUgdG8gZGlzYWJsZSBjb25zb2xlIHdhcm5pbmdzLlxuICAgKi9cbiAgd2FybmluZ3M/OiB7XG4gICAgICAvKipcbiAgICAgICAqIFNob3cgYSB3YXJuaW5nIHdoZW4gdGhlIHVzZXIgZW5hYmxlZCB0aGUgLS1obXIgb3B0aW9uLlxuICAgICAgICovXG4gICAgICBobXJXYXJuaW5nPzogYm9vbGVhbjtcbiAgICAgIC8qKlxuICAgICAgICogU2hvdyBhIHdhcm5pbmcgd2hlbiB0aGUgbm9kZSB2ZXJzaW9uIGlzIGluY29tcGF0aWJsZS5cbiAgICAgICAqL1xuICAgICAgbm9kZURlcHJlY2F0aW9uPzogYm9vbGVhbjtcbiAgICAgIC8qKlxuICAgICAgICogU2hvdyBhIHdhcm5pbmcgd2hlbiB0aGUgdXNlciBpbnN0YWxsZWQgYW5ndWxhci1jbGkuXG4gICAgICAgKi9cbiAgICAgIHBhY2thZ2VEZXByZWNhdGlvbj86IGJvb2xlYW47XG4gICAgICAvKipcbiAgICAgICAqIFNob3cgYSB3YXJuaW5nIHdoZW4gdGhlIGdsb2JhbCB2ZXJzaW9uIGlzIG5ld2VyIHRoYW4gdGhlIGxvY2FsIG9uZS5cbiAgICAgICAqL1xuICAgICAgdmVyc2lvbk1pc21hdGNoPzogYm9vbGVhbjtcbiAgICAgIC8qKlxuICAgICAgICogU2hvdyBhIHdhcm5pbmcgd2hlbiB0aGUgVHlwZVNjcmlwdCB2ZXJzaW9uIGlzIGluY29tcGF0aWJsZVxuICAgICAgICovXG4gICAgICB0eXBlc2NyaXB0TWlzbWF0Y2g/OiBib29sZWFuO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V29ya3NwYWNlUGF0aChob3N0OiBUcmVlKTogc3RyaW5nIHtcbiAgY29uc3QgcG9zc2libGVGaWxlcyA9IFsgJy9hbmd1bGFyLmpzb24nLCAnLy5hbmd1bGFyLmpzb24nIF07XG4gIGNvbnN0IHBhdGggPSBwb3NzaWJsZUZpbGVzLmZpbHRlcihwYXRoID0+IGhvc3QuZXhpc3RzKHBhdGgpKVswXTtcblxuICByZXR1cm4gcGF0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdvcmtzcGFjZShob3N0OiBUcmVlKTogV29ya3NwYWNlU2NoZW1hIHtcbiAgY29uc3QgcGF0aCA9IGdldFdvcmtzcGFjZVBhdGgoaG9zdCk7XG4gIGNvbnN0IGNvbmZpZ0J1ZmZlciA9IGhvc3QucmVhZChwYXRoKTtcbiAgaWYgKGNvbmZpZ0J1ZmZlciA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBDb3VsZCBub3QgZmluZCAoJHtwYXRofSlgKTtcbiAgfVxuICBjb25zdCBjb250ZW50ID0gY29uZmlnQnVmZmVyLnRvU3RyaW5nKCk7XG5cbiAgcmV0dXJuIHBhcnNlSnNvbihjb250ZW50LCBKc29uUGFyc2VNb2RlLkxvb3NlKSBhcyB7fSBhcyBXb3Jrc3BhY2VTY2hlbWE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRQcm9qZWN0VG9Xb3Jrc3BhY2U8VFByb2plY3RUeXBlIGV4dGVuZHMgUHJvamVjdFR5cGUgPSBQcm9qZWN0VHlwZS5BcHBsaWNhdGlvbj4oXG4gIHdvcmtzcGFjZTogV29ya3NwYWNlU2NoZW1hLFxuICBuYW1lOiBzdHJpbmcsXG4gIHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3Q8VFByb2plY3RUeXBlPixcbik6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcblxuICAgIGlmICh3b3Jrc3BhY2UucHJvamVjdHNbbmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUHJvamVjdCAnJHtuYW1lfScgYWxyZWFkeSBleGlzdHMgaW4gd29ya3NwYWNlLmApO1xuICAgIH1cblxuICAgIC8vIEFkZCBwcm9qZWN0IHRvIHdvcmtzcGFjZS5cbiAgICB3b3Jrc3BhY2UucHJvamVjdHNbbmFtZV0gPSBwcm9qZWN0O1xuXG4gICAgaWYgKCF3b3Jrc3BhY2UuZGVmYXVsdFByb2plY3QgJiYgT2JqZWN0LmtleXMod29ya3NwYWNlLnByb2plY3RzKS5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIE1ha2UgdGhlIG5ldyBwcm9qZWN0IHRoZSBkZWZhdWx0IG9uZS5cbiAgICAgIHdvcmtzcGFjZS5kZWZhdWx0UHJvamVjdCA9IG5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVwZGF0ZVdvcmtzcGFjZSh3b3Jrc3BhY2UpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlV29ya3NwYWNlKHdvcmtzcGFjZTogV29ya3NwYWNlU2NoZW1hKTogUnVsZSB7XG4gICAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgICAgIGhvc3Qub3ZlcndyaXRlKGdldFdvcmtzcGFjZVBhdGgoaG9zdCksIEpTT04uc3RyaW5naWZ5KHdvcmtzcGFjZSwgbnVsbCwgMikpO1xuICAgIH07XG59XG5cbmV4cG9ydCBjb25zdCBjb25maWdQYXRoID0gJy8uYW5ndWxhci1jbGkuanNvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoaG9zdDogVHJlZSk6IENsaUNvbmZpZyB7XG4gIGNvbnN0IGNvbmZpZ0J1ZmZlciA9IGhvc3QucmVhZChjb25maWdQYXRoKTtcbiAgaWYgKGNvbmZpZ0J1ZmZlciA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKCdDb3VsZCBub3QgZmluZCAuYW5ndWxhci1jbGkuanNvbicpO1xuICB9XG5cbiAgY29uc3QgY29uZmlnID0gcGFyc2VKc29uKGNvbmZpZ0J1ZmZlci50b1N0cmluZygpLCBKc29uUGFyc2VNb2RlLkxvb3NlKSBhcyB7fSBhcyBDbGlDb25maWc7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcEZyb21Db25maWcoY29uZmlnOiBDbGlDb25maWcsIGFwcEluZGV4T3JOYW1lOiBzdHJpbmcpOiBBcHBDb25maWcgfCBudWxsIHtcbiAgaWYgKCFjb25maWcuYXBwcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHBhcnNlSW50KGFwcEluZGV4T3JOYW1lKSA+PSAwKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5hcHBzW3BhcnNlSW50KGFwcEluZGV4T3JOYW1lKV07XG4gIH1cblxuICByZXR1cm4gY29uZmlnLmFwcHMuZmlsdGVyKChhcHApID0+IGFwcC5uYW1lID09PSBhcHBJbmRleE9yTmFtZSlbMF07XG59XG4iXX0=