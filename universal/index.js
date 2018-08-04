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
const tasks_1 = require("@angular-devkit/schematics/tasks");
const ts = require("typescript");
const ast_utils_1 = require("../utility/ast-utils");
const change_1 = require("../utility/change");
const config_1 = require("../utility/config");
const dependencies_1 = require("../utility/dependencies");
const ng_ast_utils_1 = require("../utility/ng-ast-utils");
const project_targets_1 = require("../utility/project-targets");
function getWorkspacePath(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    return possibleFiles.filter(path => host.exists(path))[0];
}
function getClientProject(host, options) {
    const workspace = config_1.getWorkspace(host);
    const clientProject = workspace.projects[options.clientProject];
    if (!clientProject) {
        throw new schematics_1.SchematicsException(`Client app ${options.clientProject} not found.`);
    }
    return clientProject;
}
function getClientTargets(host, options) {
    const clientProject = getClientProject(host, options);
    const projectTargets = project_targets_1.getProjectTargets(clientProject);
    return projectTargets;
}
function updateConfigFile(options, tsConfigDirectory) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        if (!workspace.projects[options.clientProject]) {
            throw new schematics_1.SchematicsException(`Client app ${options.clientProject} not found.`);
        }
        const clientProject = workspace.projects[options.clientProject];
        const projectTargets = project_targets_1.getProjectTargets(clientProject);
        const builderOptions = {
            outputPath: `dist/${options.clientProject}-server`,
            main: `${clientProject.root}src/main.server.ts`,
            tsConfig: core_1.join(tsConfigDirectory, `${options.tsconfigFileName}.json`),
        };
        const serverTarget = {
            builder: '@angular-devkit/build-angular:server',
            options: builderOptions,
        };
        projectTargets.server = serverTarget;
        const workspacePath = getWorkspacePath(host);
        host.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
        return host;
    };
}
function findBrowserModuleImport(host, modulePath) {
    const moduleBuffer = host.read(modulePath);
    if (!moduleBuffer) {
        throw new schematics_1.SchematicsException(`Module file (${modulePath}) not found`);
    }
    const moduleFileText = moduleBuffer.toString('utf-8');
    const source = ts.createSourceFile(modulePath, moduleFileText, ts.ScriptTarget.Latest, true);
    const decoratorMetadata = ast_utils_1.getDecoratorMetadata(source, 'NgModule', '@angular/core')[0];
    const browserModuleNode = ast_utils_1.findNode(decoratorMetadata, ts.SyntaxKind.Identifier, 'BrowserModule');
    if (browserModuleNode === null) {
        throw new schematics_1.SchematicsException(`Cannot find BrowserModule import in ${modulePath}`);
    }
    return browserModuleNode;
}
function wrapBootstrapCall(options) {
    return (host) => {
        const clientTargets = getClientTargets(host, options);
        const mainPath = core_1.normalize('/' + clientTargets.build.options.main);
        let bootstrapCall = ng_ast_utils_1.findBootstrapModuleCall(host, mainPath);
        if (bootstrapCall === null) {
            throw new schematics_1.SchematicsException('Bootstrap module not found.');
        }
        let bootstrapCallExpression = null;
        let currentCall = bootstrapCall;
        while (bootstrapCallExpression === null && currentCall.parent) {
            currentCall = currentCall.parent;
            if (currentCall.kind === ts.SyntaxKind.ExpressionStatement) {
                bootstrapCallExpression = currentCall;
            }
        }
        bootstrapCall = currentCall;
        const recorder = host.beginUpdate(mainPath);
        const beforeText = `document.addEventListener('DOMContentLoaded', () => {\n  `;
        const afterText = `\n});`;
        recorder.insertLeft(bootstrapCall.getStart(), beforeText);
        recorder.insertRight(bootstrapCall.getEnd(), afterText);
        host.commitUpdate(recorder);
    };
}
function addServerTransition(options) {
    return (host) => {
        const clientProject = getClientProject(host, options);
        const clientTargets = getClientTargets(host, options);
        const mainPath = core_1.normalize('/' + clientTargets.build.options.main);
        const bootstrapModuleRelativePath = ng_ast_utils_1.findBootstrapModulePath(host, mainPath);
        const bootstrapModulePath = core_1.normalize(`/${clientProject.root}/src/${bootstrapModuleRelativePath}.ts`);
        const browserModuleImport = findBrowserModuleImport(host, bootstrapModulePath);
        const appId = options.appId;
        const transitionCall = `.withServerTransition({ appId: '${appId}' })`;
        const position = browserModuleImport.pos + browserModuleImport.getFullText().length;
        const transitionCallChange = new change_1.InsertChange(bootstrapModulePath, position, transitionCall);
        const transitionCallRecorder = host.beginUpdate(bootstrapModulePath);
        transitionCallRecorder.insertLeft(transitionCallChange.pos, transitionCallChange.toAdd);
        host.commitUpdate(transitionCallRecorder);
    };
}
function addDependencies() {
    return (host) => {
        const coreDep = dependencies_1.getPackageJsonDependency(host, '@angular/core');
        if (coreDep === null) {
            throw new schematics_1.SchematicsException('Could not find version.');
        }
        const platformServerDep = Object.assign({}, coreDep, { name: '@angular/platform-server' });
        dependencies_1.addPackageJsonDependency(host, platformServerDep);
        return host;
    };
}
function getTsConfigOutDir(host, targets) {
    const tsConfigPath = targets.build.options.tsConfig;
    const tsConfigBuffer = host.read(tsConfigPath);
    if (!tsConfigBuffer) {
        throw new schematics_1.SchematicsException(`Could not read ${tsConfigPath}`);
    }
    const tsConfigContent = tsConfigBuffer.toString();
    const tsConfig = core_1.parseJson(tsConfigContent);
    if (tsConfig === null || typeof tsConfig !== 'object' || Array.isArray(tsConfig) ||
        tsConfig.compilerOptions === null || typeof tsConfig.compilerOptions !== 'object' ||
        Array.isArray(tsConfig.compilerOptions)) {
        throw new schematics_1.SchematicsException(`Invalid tsconfig - ${tsConfigPath}`);
    }
    const outDir = tsConfig.compilerOptions.outDir;
    return outDir;
}
function default_1(options) {
    return (host, context) => {
        const clientProject = getClientProject(host, options);
        if (clientProject.projectType !== 'application') {
            throw new schematics_1.SchematicsException(`Universal requires a project type of "application".`);
        }
        const clientTargets = getClientTargets(host, options);
        const outDir = getTsConfigOutDir(host, clientTargets);
        const tsConfigExtends = core_1.basename(clientTargets.build.options.tsConfig);
        const rootInSrc = clientProject.root === '';
        const tsConfigDirectory = core_1.join(core_1.normalize(clientProject.root), rootInSrc ? 'src' : '');
        if (!options.skipInstall) {
            context.addTask(new tasks_1.NodePackageInstallTask());
        }
        const templateSource = schematics_1.apply(schematics_1.url('./files/src'), [
            schematics_1.template(Object.assign({}, core_1.strings, options, { stripTsExtension: (s) => { return s.replace(/\.ts$/, ''); } })),
            schematics_1.move(core_1.join(core_1.normalize(clientProject.root), 'src')),
        ]);
        const rootSource = schematics_1.apply(schematics_1.url('./files/root'), [
            schematics_1.template(Object.assign({}, core_1.strings, options, { stripTsExtension: (s) => { return s.replace(/\.ts$/, ''); }, outDir,
                tsConfigExtends,
                rootInSrc })),
            schematics_1.move(tsConfigDirectory),
        ]);
        return schematics_1.chain([
            schematics_1.mergeWith(templateSource),
            schematics_1.mergeWith(rootSource),
            addDependencies(),
            updateConfigFile(options, tsConfigDirectory),
            wrapBootstrapCall(options),
            addServerTransition(options),
        ]);
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NjaGVtYXRpY3MvYW5ndWxhci91bml2ZXJzYWwvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FTOEI7QUFDOUIsMkRBV29DO0FBQ3BDLDREQUUwQztBQUMxQyxpQ0FBaUM7QUFDakMsb0RBQXNFO0FBQ3RFLDhDQUFpRDtBQUNqRCw4Q0FBaUQ7QUFDakQsMERBQTZGO0FBQzdGLDBEQUEyRjtBQUMzRixnRUFBK0Q7QUFJL0QsMEJBQTBCLElBQVU7SUFDbEMsTUFBTSxhQUFhLEdBQUcsQ0FBRSxlQUFlLEVBQUUsZ0JBQWdCLENBQUUsQ0FBQztJQUU1RCxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUVELDBCQUNFLElBQVUsRUFBRSxPQUF5QjtJQUVyQyxNQUFNLFNBQVMsR0FBRyxxQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2hFLElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDbEIsTUFBTSxJQUFJLGdDQUFtQixDQUFDLGNBQWMsT0FBTyxDQUFDLGFBQWEsYUFBYSxDQUFDLENBQUM7S0FDakY7SUFFRCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBRUQsMEJBQ0UsSUFBVSxFQUNWLE9BQXlCO0lBRXpCLE1BQU0sYUFBYSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RCxNQUFNLGNBQWMsR0FBRyxtQ0FBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUV4RCxPQUFPLGNBQWMsQ0FBQztBQUN4QixDQUFDO0FB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LEdBQUcsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDbkUsTUFBTTtnQkFDTixlQUFlO2dCQUNmLFNBQVMsSUFDVDtZQUNGLGlCQUFJLENBQUMsaUJBQWlCLENBQUM7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxrQkFBSyxDQUFDO1lBQ1gsc0JBQVMsQ0FBQyxjQUFjLENBQUM7WUFDekIsc0JBQVMsQ0FBQyxVQUFVLENBQUM7WUFDckIsZUFBZSxFQUFFO1lBQ2pCLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQztZQUM1QyxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7WUFDMUIsbUJBQW1CLENBQUMsT0FBTyxDQUFDO1NBQzdCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUNKLENBQUM7QUE5Q0QsNEJBOENDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgSnNvbk9iamVjdCxcbiAgUGF0aCxcbiAgYmFzZW5hbWUsXG4gIGV4cGVyaW1lbnRhbCxcbiAgam9pbixcbiAgbm9ybWFsaXplLFxuICBwYXJzZUpzb24sXG4gIHN0cmluZ3MsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG4gIGFwcGx5LFxuICBjaGFpbixcbiAgbWVyZ2VXaXRoLFxuICBtb3ZlLFxuICB0ZW1wbGF0ZSxcbiAgdXJsLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBOb2RlUGFja2FnZUluc3RhbGxUYXNrLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90YXNrcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7IGZpbmROb2RlLCBnZXREZWNvcmF0b3JNZXRhZGF0YSB9IGZyb20gJy4uL3V0aWxpdHkvYXN0LXV0aWxzJztcbmltcG9ydCB7IEluc2VydENoYW5nZSB9IGZyb20gJy4uL3V0aWxpdHkvY2hhbmdlJztcbmltcG9ydCB7IGdldFdvcmtzcGFjZSB9IGZyb20gJy4uL3V0aWxpdHkvY29uZmlnJztcbmltcG9ydCB7IGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeSwgZ2V0UGFja2FnZUpzb25EZXBlbmRlbmN5IH0gZnJvbSAnLi4vdXRpbGl0eS9kZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHsgZmluZEJvb3RzdHJhcE1vZHVsZUNhbGwsIGZpbmRCb290c3RyYXBNb2R1bGVQYXRoIH0gZnJvbSAnLi4vdXRpbGl0eS9uZy1hc3QtdXRpbHMnO1xuaW1wb3J0IHsgZ2V0UHJvamVjdFRhcmdldHMgfSBmcm9tICcuLi91dGlsaXR5L3Byb2plY3QtdGFyZ2V0cyc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgVW5pdmVyc2FsT3B0aW9ucyB9IGZyb20gJy4vc2NoZW1hJztcblxuXG5mdW5jdGlvbiBnZXRXb3Jrc3BhY2VQYXRoKGhvc3Q6IFRyZWUpOiBzdHJpbmcge1xuICBjb25zdCBwb3NzaWJsZUZpbGVzID0gWyAnL2FuZ3VsYXIuanNvbicsICcvLmFuZ3VsYXIuanNvbicgXTtcblxuICByZXR1cm4gcG9zc2libGVGaWxlcy5maWx0ZXIocGF0aCA9PiBob3N0LmV4aXN0cyhwYXRoKSlbMF07XG59XG5cbmZ1bmN0aW9uIGdldENsaWVudFByb2plY3QoXG4gIGhvc3Q6IFRyZWUsIG9wdGlvbnM6IFVuaXZlcnNhbE9wdGlvbnMsXG4pOiBleHBlcmltZW50YWwud29ya3NwYWNlLldvcmtzcGFjZVByb2plY3Qge1xuICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gIGNvbnN0IGNsaWVudFByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdHNbb3B0aW9ucy5jbGllbnRQcm9qZWN0XTtcbiAgaWYgKCFjbGllbnRQcm9qZWN0KSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENsaWVudCBhcHAgJHtvcHRpb25zLmNsaWVudFByb2plY3R9IG5vdCBmb3VuZC5gKTtcbiAgfVxuXG4gIHJldHVybiBjbGllbnRQcm9qZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRDbGllbnRUYXJnZXRzKFxuICBob3N0OiBUcmVlLFxuICBvcHRpb25zOiBVbml2ZXJzYWxPcHRpb25zLFxuKTogZXhwZXJpbWVudGFsLndvcmtzcGFjZS5Xb3Jrc3BhY2VUb29sIHtcbiAgY29uc3QgY2xpZW50UHJvamVjdCA9IGdldENsaWVudFByb2plY3QoaG9zdCwgb3B0aW9ucyk7XG4gIGNvbnN0IHByb2plY3RUYXJnZXRzID0gZ2V0UHJvamVjdFRhcmdldHMoY2xpZW50UHJvamVjdCk7XG5cbiAgcmV0dXJuIHByb2plY3RUYXJnZXRzO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDb25maWdGaWxlKG9wdGlvbnM6IFVuaXZlcnNhbE9wdGlvbnMsIHRzQ29uZmlnRGlyZWN0b3J5OiBQYXRoKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBpZiAoIXdvcmtzcGFjZS5wcm9qZWN0c1tvcHRpb25zLmNsaWVudFByb2plY3RdKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgQ2xpZW50IGFwcCAke29wdGlvbnMuY2xpZW50UHJvamVjdH0gbm90IGZvdW5kLmApO1xuICAgIH1cblxuICAgIGNvbnN0IGNsaWVudFByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdHNbb3B0aW9ucy5jbGllbnRQcm9qZWN0XTtcbiAgICBjb25zdCBwcm9qZWN0VGFyZ2V0cyA9IGdldFByb2plY3RUYXJnZXRzKGNsaWVudFByb2plY3QpO1xuXG4gICAgY29uc3QgYnVpbGRlck9wdGlvbnM6IEpzb25PYmplY3QgPSB7XG4gICAgICBvdXRwdXRQYXRoOiBgZGlzdC8ke29wdGlvbnMuY2xpZW50UHJvamVjdH0tc2VydmVyYCxcbiAgICAgIG1haW46IGAke2NsaWVudFByb2plY3Qucm9vdH1zcmMvbWFpbi5zZXJ2ZXIudHNgLFxuICAgICAgdHNDb25maWc6IGpvaW4odHNDb25maWdEaXJlY3RvcnksIGAke29wdGlvbnMudHNjb25maWdGaWxlTmFtZX0uanNvbmApLFxuICAgIH07XG4gICAgY29uc3Qgc2VydmVyVGFyZ2V0OiBKc29uT2JqZWN0ID0ge1xuICAgICAgYnVpbGRlcjogJ0Bhbmd1bGFyLWRldmtpdC9idWlsZC1hbmd1bGFyOnNlcnZlcicsXG4gICAgICBvcHRpb25zOiBidWlsZGVyT3B0aW9ucyxcbiAgICB9O1xuICAgIHByb2plY3RUYXJnZXRzLnNlcnZlciA9IHNlcnZlclRhcmdldDtcblxuICAgIGNvbnN0IHdvcmtzcGFjZVBhdGggPSBnZXRXb3Jrc3BhY2VQYXRoKGhvc3QpO1xuXG4gICAgaG9zdC5vdmVyd3JpdGUod29ya3NwYWNlUGF0aCwgSlNPTi5zdHJpbmdpZnkod29ya3NwYWNlLCBudWxsLCAyKSk7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZmluZEJyb3dzZXJNb2R1bGVJbXBvcnQoaG9zdDogVHJlZSwgbW9kdWxlUGF0aDogc3RyaW5nKTogdHMuTm9kZSB7XG4gIGNvbnN0IG1vZHVsZUJ1ZmZlciA9IGhvc3QucmVhZChtb2R1bGVQYXRoKTtcbiAgaWYgKCFtb2R1bGVCdWZmZXIpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgTW9kdWxlIGZpbGUgKCR7bW9kdWxlUGF0aH0pIG5vdCBmb3VuZGApO1xuICB9XG4gIGNvbnN0IG1vZHVsZUZpbGVUZXh0ID0gbW9kdWxlQnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcpO1xuXG4gIGNvbnN0IHNvdXJjZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUobW9kdWxlUGF0aCwgbW9kdWxlRmlsZVRleHQsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIHRydWUpO1xuXG4gIGNvbnN0IGRlY29yYXRvck1ldGFkYXRhID0gZ2V0RGVjb3JhdG9yTWV0YWRhdGEoc291cmNlLCAnTmdNb2R1bGUnLCAnQGFuZ3VsYXIvY29yZScpWzBdO1xuICBjb25zdCBicm93c2VyTW9kdWxlTm9kZSA9IGZpbmROb2RlKGRlY29yYXRvck1ldGFkYXRhLCB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIsICdCcm93c2VyTW9kdWxlJyk7XG5cbiAgaWYgKGJyb3dzZXJNb2R1bGVOb2RlID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENhbm5vdCBmaW5kIEJyb3dzZXJNb2R1bGUgaW1wb3J0IGluICR7bW9kdWxlUGF0aH1gKTtcbiAgfVxuXG4gIHJldHVybiBicm93c2VyTW9kdWxlTm9kZTtcbn1cblxuZnVuY3Rpb24gd3JhcEJvb3RzdHJhcENhbGwob3B0aW9uczogVW5pdmVyc2FsT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBjbGllbnRUYXJnZXRzID0gZ2V0Q2xpZW50VGFyZ2V0cyhob3N0LCBvcHRpb25zKTtcbiAgICBjb25zdCBtYWluUGF0aCA9IG5vcm1hbGl6ZSgnLycgKyBjbGllbnRUYXJnZXRzLmJ1aWxkLm9wdGlvbnMubWFpbik7XG4gICAgbGV0IGJvb3RzdHJhcENhbGw6IHRzLk5vZGUgfCBudWxsID0gZmluZEJvb3RzdHJhcE1vZHVsZUNhbGwoaG9zdCwgbWFpblBhdGgpO1xuICAgIGlmIChib290c3RyYXBDYWxsID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignQm9vdHN0cmFwIG1vZHVsZSBub3QgZm91bmQuJyk7XG4gICAgfVxuXG4gICAgbGV0IGJvb3RzdHJhcENhbGxFeHByZXNzaW9uOiB0cy5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGN1cnJlbnRDYWxsID0gYm9vdHN0cmFwQ2FsbDtcbiAgICB3aGlsZSAoYm9vdHN0cmFwQ2FsbEV4cHJlc3Npb24gPT09IG51bGwgJiYgY3VycmVudENhbGwucGFyZW50KSB7XG4gICAgICBjdXJyZW50Q2FsbCA9IGN1cnJlbnRDYWxsLnBhcmVudDtcbiAgICAgIGlmIChjdXJyZW50Q2FsbC5raW5kID09PSB0cy5TeW50YXhLaW5kLkV4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICAgICAgYm9vdHN0cmFwQ2FsbEV4cHJlc3Npb24gPSBjdXJyZW50Q2FsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgYm9vdHN0cmFwQ2FsbCA9IGN1cnJlbnRDYWxsO1xuXG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKG1haW5QYXRoKTtcbiAgICBjb25zdCBiZWZvcmVUZXh0ID0gYGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XFxuICBgO1xuICAgIGNvbnN0IGFmdGVyVGV4dCA9IGBcXG59KTtgO1xuICAgIHJlY29yZGVyLmluc2VydExlZnQoYm9vdHN0cmFwQ2FsbC5nZXRTdGFydCgpLCBiZWZvcmVUZXh0KTtcbiAgICByZWNvcmRlci5pbnNlcnRSaWdodChib290c3RyYXBDYWxsLmdldEVuZCgpLCBhZnRlclRleHQpO1xuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkU2VydmVyVHJhbnNpdGlvbihvcHRpb25zOiBVbml2ZXJzYWxPcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IGNsaWVudFByb2plY3QgPSBnZXRDbGllbnRQcm9qZWN0KGhvc3QsIG9wdGlvbnMpO1xuICAgIGNvbnN0IGNsaWVudFRhcmdldHMgPSBnZXRDbGllbnRUYXJnZXRzKGhvc3QsIG9wdGlvbnMpO1xuICAgIGNvbnN0IG1haW5QYXRoID0gbm9ybWFsaXplKCcvJyArIGNsaWVudFRhcmdldHMuYnVpbGQub3B0aW9ucy5tYWluKTtcblxuICAgIGNvbnN0IGJvb3RzdHJhcE1vZHVsZVJlbGF0aXZlUGF0aCA9IGZpbmRCb290c3RyYXBNb2R1bGVQYXRoKGhvc3QsIG1haW5QYXRoKTtcbiAgICBjb25zdCBib290c3RyYXBNb2R1bGVQYXRoID0gbm9ybWFsaXplKFxuICAgICAgYC8ke2NsaWVudFByb2plY3Qucm9vdH0vc3JjLyR7Ym9vdHN0cmFwTW9kdWxlUmVsYXRpdmVQYXRofS50c2ApO1xuXG4gICAgY29uc3QgYnJvd3Nlck1vZHVsZUltcG9ydCA9IGZpbmRCcm93c2VyTW9kdWxlSW1wb3J0KGhvc3QsIGJvb3RzdHJhcE1vZHVsZVBhdGgpO1xuICAgIGNvbnN0IGFwcElkID0gb3B0aW9ucy5hcHBJZDtcbiAgICBjb25zdCB0cmFuc2l0aW9uQ2FsbCA9IGAud2l0aFNlcnZlclRyYW5zaXRpb24oeyBhcHBJZDogJyR7YXBwSWR9JyB9KWA7XG4gICAgY29uc3QgcG9zaXRpb24gPSBicm93c2VyTW9kdWxlSW1wb3J0LnBvcyArIGJyb3dzZXJNb2R1bGVJbXBvcnQuZ2V0RnVsbFRleHQoKS5sZW5ndGg7XG4gICAgY29uc3QgdHJhbnNpdGlvbkNhbGxDaGFuZ2UgPSBuZXcgSW5zZXJ0Q2hhbmdlKFxuICAgICAgYm9vdHN0cmFwTW9kdWxlUGF0aCwgcG9zaXRpb24sIHRyYW5zaXRpb25DYWxsKTtcblxuICAgIGNvbnN0IHRyYW5zaXRpb25DYWxsUmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKGJvb3RzdHJhcE1vZHVsZVBhdGgpO1xuICAgIHRyYW5zaXRpb25DYWxsUmVjb3JkZXIuaW5zZXJ0TGVmdCh0cmFuc2l0aW9uQ2FsbENoYW5nZS5wb3MsIHRyYW5zaXRpb25DYWxsQ2hhbmdlLnRvQWRkKTtcbiAgICBob3N0LmNvbW1pdFVwZGF0ZSh0cmFuc2l0aW9uQ2FsbFJlY29yZGVyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkRGVwZW5kZW5jaWVzKCk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBjb3JlRGVwID0gZ2V0UGFja2FnZUpzb25EZXBlbmRlbmN5KGhvc3QsICdAYW5ndWxhci9jb3JlJyk7XG4gICAgaWYgKGNvcmVEZXAgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKCdDb3VsZCBub3QgZmluZCB2ZXJzaW9uLicpO1xuICAgIH1cbiAgICBjb25zdCBwbGF0Zm9ybVNlcnZlckRlcCA9IHtcbiAgICAgIC4uLmNvcmVEZXAsXG4gICAgICBuYW1lOiAnQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyJyxcbiAgICB9O1xuICAgIGFkZFBhY2thZ2VKc29uRGVwZW5kZW5jeShob3N0LCBwbGF0Zm9ybVNlcnZlckRlcCk7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0VHNDb25maWdPdXREaXIoaG9zdDogVHJlZSwgdGFyZ2V0czogZXhwZXJpbWVudGFsLndvcmtzcGFjZS5Xb3Jrc3BhY2VUb29sKTogc3RyaW5nIHtcbiAgY29uc3QgdHNDb25maWdQYXRoID0gdGFyZ2V0cy5idWlsZC5vcHRpb25zLnRzQ29uZmlnO1xuICBjb25zdCB0c0NvbmZpZ0J1ZmZlciA9IGhvc3QucmVhZCh0c0NvbmZpZ1BhdGgpO1xuICBpZiAoIXRzQ29uZmlnQnVmZmVyKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENvdWxkIG5vdCByZWFkICR7dHNDb25maWdQYXRofWApO1xuICB9XG4gIGNvbnN0IHRzQ29uZmlnQ29udGVudCA9IHRzQ29uZmlnQnVmZmVyLnRvU3RyaW5nKCk7XG4gIGNvbnN0IHRzQ29uZmlnID0gcGFyc2VKc29uKHRzQ29uZmlnQ29udGVudCk7XG4gIGlmICh0c0NvbmZpZyA9PT0gbnVsbCB8fCB0eXBlb2YgdHNDb25maWcgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkodHNDb25maWcpIHx8XG4gICAgICB0c0NvbmZpZy5jb21waWxlck9wdGlvbnMgPT09IG51bGwgfHwgdHlwZW9mIHRzQ29uZmlnLmNvbXBpbGVyT3B0aW9ucyAhPT0gJ29iamVjdCcgfHxcbiAgICAgIEFycmF5LmlzQXJyYXkodHNDb25maWcuY29tcGlsZXJPcHRpb25zKSkge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBJbnZhbGlkIHRzY29uZmlnIC0gJHt0c0NvbmZpZ1BhdGh9YCk7XG4gIH1cbiAgY29uc3Qgb3V0RGlyID0gdHNDb25maWcuY29tcGlsZXJPcHRpb25zLm91dERpcjtcblxuICByZXR1cm4gb3V0RGlyIGFzIHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFVuaXZlcnNhbE9wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgY2xpZW50UHJvamVjdCA9IGdldENsaWVudFByb2plY3QoaG9zdCwgb3B0aW9ucyk7XG4gICAgaWYgKGNsaWVudFByb2plY3QucHJvamVjdFR5cGUgIT09ICdhcHBsaWNhdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBVbml2ZXJzYWwgcmVxdWlyZXMgYSBwcm9qZWN0IHR5cGUgb2YgXCJhcHBsaWNhdGlvblwiLmApO1xuICAgIH1cbiAgICBjb25zdCBjbGllbnRUYXJnZXRzID0gZ2V0Q2xpZW50VGFyZ2V0cyhob3N0LCBvcHRpb25zKTtcbiAgICBjb25zdCBvdXREaXIgPSBnZXRUc0NvbmZpZ091dERpcihob3N0LCBjbGllbnRUYXJnZXRzKTtcbiAgICBjb25zdCB0c0NvbmZpZ0V4dGVuZHMgPSBiYXNlbmFtZShjbGllbnRUYXJnZXRzLmJ1aWxkLm9wdGlvbnMudHNDb25maWcpO1xuICAgIGNvbnN0IHJvb3RJblNyYyA9IGNsaWVudFByb2plY3Qucm9vdCA9PT0gJyc7XG4gICAgY29uc3QgdHNDb25maWdEaXJlY3RvcnkgPSBqb2luKG5vcm1hbGl6ZShjbGllbnRQcm9qZWN0LnJvb3QpLCByb290SW5TcmMgPyAnc3JjJyA6ICcnKTtcblxuICAgIGlmICghb3B0aW9ucy5za2lwSW5zdGFsbCkge1xuICAgICAgY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKCkpO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXBsYXRlU291cmNlID0gYXBwbHkodXJsKCcuL2ZpbGVzL3NyYycpLCBbXG4gICAgICB0ZW1wbGF0ZSh7XG4gICAgICAgIC4uLnN0cmluZ3MsXG4gICAgICAgIC4uLm9wdGlvbnMgYXMgb2JqZWN0LFxuICAgICAgICBzdHJpcFRzRXh0ZW5zaW9uOiAoczogc3RyaW5nKSA9PiB7IHJldHVybiBzLnJlcGxhY2UoL1xcLnRzJC8sICcnKTsgfSxcbiAgICAgIH0pLFxuICAgICAgbW92ZShqb2luKG5vcm1hbGl6ZShjbGllbnRQcm9qZWN0LnJvb3QpLCAnc3JjJykpLFxuICAgIF0pO1xuXG4gICAgY29uc3Qgcm9vdFNvdXJjZSA9IGFwcGx5KHVybCgnLi9maWxlcy9yb290JyksIFtcbiAgICAgIHRlbXBsYXRlKHtcbiAgICAgICAgLi4uc3RyaW5ncyxcbiAgICAgICAgLi4ub3B0aW9ucyBhcyBvYmplY3QsXG4gICAgICAgIHN0cmlwVHNFeHRlbnNpb246IChzOiBzdHJpbmcpID0+IHsgcmV0dXJuIHMucmVwbGFjZSgvXFwudHMkLywgJycpOyB9LFxuICAgICAgICBvdXREaXIsXG4gICAgICAgIHRzQ29uZmlnRXh0ZW5kcyxcbiAgICAgICAgcm9vdEluU3JjLFxuICAgICAgfSksXG4gICAgICBtb3ZlKHRzQ29uZmlnRGlyZWN0b3J5KSxcbiAgICBdKTtcblxuICAgIHJldHVybiBjaGFpbihbXG4gICAgICBtZXJnZVdpdGgodGVtcGxhdGVTb3VyY2UpLFxuICAgICAgbWVyZ2VXaXRoKHJvb3RTb3VyY2UpLFxuICAgICAgYWRkRGVwZW5kZW5jaWVzKCksXG4gICAgICB1cGRhdGVDb25maWdGaWxlKG9wdGlvbnMsIHRzQ29uZmlnRGlyZWN0b3J5KSxcbiAgICAgIHdyYXBCb290c3RyYXBDYWxsKG9wdGlvbnMpLFxuICAgICAgYWRkU2VydmVyVHJhbnNpdGlvbihvcHRpb25zKSxcbiAgICBdKTtcbiAgfTtcbn1cbiJdfQ==