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
const path = require("path");
function forwardSlashes(value) {
    return value.replace(/\\/g, '/');
}
function updateJsonFile(host, path, callback) {
    const source = host.read(path);
    if (source) {
        const sourceText = source.toString('utf-8');
        const json = JSON.parse(sourceText);
        callback(json);
        host.overwrite(path, JSON.stringify(json, null, 2));
    }
    return host;
}
function updateTsConfig(npmPackageName, entryFilePath) {
    return (host) => {
        if (!host.exists('tsconfig.json')) {
            return host;
        }
        return updateJsonFile(host, 'tsconfig.json', (tsconfig) => {
            tsconfig.compilerOptions.baseUrl = '.';
            if (!tsconfig.compilerOptions.paths) {
                tsconfig.compilerOptions.paths = {};
            }
            if (!tsconfig.compilerOptions.paths[npmPackageName]) {
                tsconfig.compilerOptions.paths[npmPackageName] = [];
            }
            tsconfig.compilerOptions.paths[npmPackageName].push(entryFilePath);
        });
    };
}
function addDependenciesAndScriptsToPackageJson() {
    return (host) => {
        if (!host.exists('package.json')) {
            return host;
        }
        return updateJsonFile(host, 'package.json', (json) => {
            if (!json['devDependencies']) {
                json['devDependencies'] = {};
            }
            json.devDependencies = Object.assign({ '@angular/compiler': '^5.0.0', '@angular/compiler-cli': '^5.0.0', 'ng-packagr': '^2.2.0', 'tsickle': '>=0.25.5', 'tslib': '^1.7.1', 'typescript': '>=2.4.2' }, json.devDependencies);
        });
    };
}
function default_1(options) {
    if (!options.name) {
        throw new schematics_1.SchematicsException(`name option is required.`);
    }
    const name = options.name;
    let entryFile = options.entryFile ? options.entryFile : 'public_api';
    if (entryFile.endsWith('.ts')) {
        entryFile = entryFile.substring(0, entryFile.length - 3);
    }
    const sourceDir = path.join(options.baseDir, options.name);
    const entryFilePath = path.join(sourceDir, entryFile) + '.ts';
    return (host, context) => {
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, core_1.strings, options, {
                entryFile,
                name,
            })),
            schematics_1.move(sourceDir),
        ]);
        return schematics_1.chain([
            schematics_1.branchAndMerge(schematics_1.chain([
                schematics_1.mergeWith(templateSource),
            ])),
            options.skipPackageJson ? schematics_1.noop() : addDependenciesAndScriptsToPackageJson(),
            options.skipTsConfig ? schematics_1.noop() : updateTsConfig(name, forwardSlashes(entryFilePath)),
        ])(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NjaGVtYXRpY3MvYW5ndWxhci9saWJyYXJ5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQStDO0FBQy9DLDJEQWFvQztBQUNwQyw2QkFBNkI7QUFHN0Isd0JBQXdCLEtBQWE7SUFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUF3QkQsd0JBQTJCLElBQVUsRUFBRSxJQUFZLEVBQUUsUUFBeUI7SUFDNUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELHdCQUF3QixjQUFzQixFQUFFLGFBQXFCO0lBRW5FLE1BQU0sQ0FBQyxDQUFDLElBQVUsRUFBRSxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQUMsQ0FBQztRQUVuRCxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFB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SSxDQUFDLFNBQVMsQ0FBQztTQUNoQixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsa0JBQUssQ0FBQztZQUNYLDJCQUFjLENBQUMsa0JBQUssQ0FBQztnQkFDbkIsc0JBQVMsQ0FBQyxjQUFjLENBQUM7YUFDMUIsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxzQ0FBc0MsRUFBRTtZQUMzRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxpQkFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3BGLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWpDRCw0QkFpQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBzdHJpbmdzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtcbiAgUnVsZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbiAgU2NoZW1hdGljc0V4Y2VwdGlvbixcbiAgVHJlZSxcbiAgYXBwbHksXG4gIGJyYW5jaEFuZE1lcmdlLFxuICBjaGFpbixcbiAgbWVyZ2VXaXRoLFxuICBtb3ZlLFxuICBub29wLFxuICB0ZW1wbGF0ZSxcbiAgdXJsLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIEdlbmVyYXRlTGlicmFyeU9wdGlvbnMgfSBmcm9tICcuL3NjaGVtYSc7XG5cbmZ1bmN0aW9uIGZvcndhcmRTbGFzaGVzKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xufVxuXG50eXBlIFBhY2thZ2VKc29uUGFydGlhbFR5cGUgPSB7XG4gIHNjcmlwdHM6IHtcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XG4gIH0sXG4gIGRldkRlcGVuZGVuY2llczoge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZztcbiAgfSxcbn07XG5cbnR5cGUgVHNDb25maWdQYXJ0aWFsVHlwZSA9IHtcbiAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgYmFzZVVybDogc3RyaW5nLFxuICAgIHBhdGhzOiB7XG4gICAgICBba2V5OiBzdHJpbmddOiBzdHJpbmdbXTtcbiAgICB9LFxuICB9LFxufTtcblxuaW50ZXJmYWNlIFVwZGF0ZUpzb25GbjxUPiB7XG4gIChvYmo6IFQpOiBUIHwgdm9pZDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSnNvbkZpbGU8VD4oaG9zdDogVHJlZSwgcGF0aDogc3RyaW5nLCBjYWxsYmFjazogVXBkYXRlSnNvbkZuPFQ+KTogVHJlZSB7XG4gIGNvbnN0IHNvdXJjZSA9IGhvc3QucmVhZChwYXRoKTtcbiAgaWYgKHNvdXJjZSkge1xuICAgIGNvbnN0IHNvdXJjZVRleHQgPSBzb3VyY2UudG9TdHJpbmcoJ3V0Zi04Jyk7XG4gICAgY29uc3QganNvbiA9IEpTT04ucGFyc2Uoc291cmNlVGV4dCk7XG4gICAgY2FsbGJhY2soanNvbik7XG4gICAgaG9zdC5vdmVyd3JpdGUocGF0aCwgSlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMikpO1xuICB9XG5cbiAgcmV0dXJuIGhvc3Q7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRzQ29uZmlnKG5wbVBhY2thZ2VOYW1lOiBzdHJpbmcsIGVudHJ5RmlsZVBhdGg6IHN0cmluZykge1xuXG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGlmICghaG9zdC5leGlzdHMoJ3RzY29uZmlnLmpzb24nKSkgeyByZXR1cm4gaG9zdDsgfVxuXG4gICAgcmV0dXJuIHVwZGF0ZUpzb25GaWxlKGhvc3QsICd0c2NvbmZpZy5qc29uJywgKHRzY29uZmlnOiBUc0NvbmZpZ1BhcnRpYWxUeXBlKSA9PiB7XG4gICAgICB0c2NvbmZpZy5jb21waWxlck9wdGlvbnMuYmFzZVVybCA9ICcuJztcbiAgICAgIGlmICghdHNjb25maWcuY29tcGlsZXJPcHRpb25zLnBhdGhzKSB7XG4gICAgICAgIHRzY29uZmlnLmNvbXBpbGVyT3B0aW9ucy5wYXRocyA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKCF0c2NvbmZpZy5jb21waWxlck9wdGlvbnMucGF0aHNbbnBtUGFja2FnZU5hbWVdKSB7XG4gICAgICAgIHRzY29uZmlnLmNvbXBpbGVyT3B0aW9ucy5wYXRoc1tucG1QYWNrYWdlTmFtZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHRzY29uZmlnLmNvbXBpbGVyT3B0aW9ucy5wYXRoc1tucG1QYWNrYWdlTmFtZV0ucHVzaChlbnRyeUZpbGVQYXRoKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkRGVwZW5kZW5jaWVzQW5kU2NyaXB0c1RvUGFja2FnZUpzb24oKSB7XG5cbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgaWYgKCFob3N0LmV4aXN0cygncGFja2FnZS5qc29uJykpIHsgcmV0dXJuIGhvc3Q7IH1cblxuICAgIHJldHVybiB1cGRhdGVKc29uRmlsZShob3N0LCAncGFja2FnZS5qc29uJywgKGpzb246IFBhY2thZ2VKc29uUGFydGlhbFR5cGUpID0+IHtcbiAgICAgIGlmICghanNvblsnZGV2RGVwZW5kZW5jaWVzJ10pIHtcbiAgICAgICAganNvblsnZGV2RGVwZW5kZW5jaWVzJ10gPSB7fTtcbiAgICAgIH1cblxuICAgICAganNvbi5kZXZEZXBlbmRlbmNpZXMgPSB7XG4gICAgICAgICdAYW5ndWxhci9jb21waWxlcic6ICdeNS4wLjAnLFxuICAgICAgICAnQGFuZ3VsYXIvY29tcGlsZXItY2xpJzogJ141LjAuMCcsXG4gICAgICAgICduZy1wYWNrYWdyJzogJ14yLjIuMCcsXG4gICAgICAgICd0c2lja2xlJzogJz49MC4yNS41JyxcbiAgICAgICAgJ3RzbGliJzogJ14xLjcuMScsXG4gICAgICAgICd0eXBlc2NyaXB0JzogJz49Mi40LjInLFxuICAgICAgICAvLyBkZS1zdHJ1Y3R1cmUgbGFzdCBrZWVwcyBleGlzdGluZyB1c2VyIGRlcGVuZGVuY2llc1xuICAgICAgICAuLi5qc29uLmRldkRlcGVuZGVuY2llcyxcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBHZW5lcmF0ZUxpYnJhcnlPcHRpb25zKTogUnVsZSB7XG4gIGlmICghb3B0aW9ucy5uYW1lKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYG5hbWUgb3B0aW9uIGlzIHJlcXVpcmVkLmApO1xuICB9XG4gIGNvbnN0IG5hbWUgPSBvcHRpb25zLm5hbWU7XG4gIGxldCBlbnRyeUZpbGUgPSBvcHRpb25zLmVudHJ5RmlsZSA/IG9wdGlvbnMuZW50cnlGaWxlIDogJ3B1YmxpY19hcGknO1xuICBpZiAoZW50cnlGaWxlLmVuZHNXaXRoKCcudHMnKSkge1xuICAgIGVudHJ5RmlsZSA9IGVudHJ5RmlsZS5zdWJzdHJpbmcoMCwgZW50cnlGaWxlLmxlbmd0aCAtIDMpO1xuICB9XG4gIGNvbnN0IHNvdXJjZURpciA9IHBhdGguam9pbihvcHRpb25zLmJhc2VEaXIsIG9wdGlvbnMubmFtZSk7XG4gIGNvbnN0IGVudHJ5RmlsZVBhdGggPSBwYXRoLmpvaW4oc291cmNlRGlyLCBlbnRyeUZpbGUpICsgJy50cyc7XG5cbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGVTb3VyY2UgPSBhcHBseSh1cmwoJy4vZmlsZXMnKSwgW1xuICAgICAgdGVtcGxhdGUoe1xuICAgICAgICAuLi5zdHJpbmdzLFxuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAuLi57XG4gICAgICAgICAgZW50cnlGaWxlLFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIG1vdmUoc291cmNlRGlyKSxcbiAgICBdKTtcblxuICAgIHJldHVybiBjaGFpbihbXG4gICAgICBicmFuY2hBbmRNZXJnZShjaGFpbihbXG4gICAgICAgIG1lcmdlV2l0aCh0ZW1wbGF0ZVNvdXJjZSksXG4gICAgICBdKSksXG4gICAgICBvcHRpb25zLnNraXBQYWNrYWdlSnNvbiA/IG5vb3AoKSA6IGFkZERlcGVuZGVuY2llc0FuZFNjcmlwdHNUb1BhY2thZ2VKc29uKCksXG4gICAgICBvcHRpb25zLnNraXBUc0NvbmZpZyA/IG5vb3AoKSA6IHVwZGF0ZVRzQ29uZmlnKG5hbWUsIGZvcndhcmRTbGFzaGVzKGVudHJ5RmlsZVBhdGgpKSxcbiAgICBdKShob3N0LCBjb250ZXh0KTtcbiAgfTtcbn1cbiJdfQ==