"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Build a default project path for generating.
 * @param project The project to build the path for.
 */
function buildDefaultPath(project) {
    const root = project.sourceRoot
        ? `/${project.sourceRoot}/`
        : `/${project.root}/src/`;
    const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
    return `${root}${projectDirName}`;
}
exports.buildDefaultPath = buildDefaultPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvcHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVVBOzs7R0FHRztBQUNILDBCQUFpQyxPQUF5QjtJQUN4RCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsVUFBVTtRQUM3QixDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxHQUFHO1FBQzNCLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQztJQUU1QixNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFFN0UsT0FBTyxHQUFHLElBQUksR0FBRyxjQUFjLEVBQUUsQ0FBQztBQUNwQyxDQUFDO0FBUkQsNENBUUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBXb3Jrc3BhY2VQcm9qZWN0IH0gZnJvbSAnLi4vdXRpbGl0eS9jb25maWcnO1xuXG5cbi8qKlxuICogQnVpbGQgYSBkZWZhdWx0IHByb2plY3QgcGF0aCBmb3IgZ2VuZXJhdGluZy5cbiAqIEBwYXJhbSBwcm9qZWN0IFRoZSBwcm9qZWN0IHRvIGJ1aWxkIHRoZSBwYXRoIGZvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRGVmYXVsdFBhdGgocHJvamVjdDogV29ya3NwYWNlUHJvamVjdCk6IHN0cmluZyB7XG4gIGNvbnN0IHJvb3QgPSBwcm9qZWN0LnNvdXJjZVJvb3RcbiAgICA/IGAvJHtwcm9qZWN0LnNvdXJjZVJvb3R9L2BcbiAgICA6IGAvJHtwcm9qZWN0LnJvb3R9L3NyYy9gO1xuXG4gIGNvbnN0IHByb2plY3REaXJOYW1lID0gcHJvamVjdC5wcm9qZWN0VHlwZSA9PT0gJ2FwcGxpY2F0aW9uJyA/ICdhcHAnIDogJ2xpYic7XG5cbiAgcmV0dXJuIGAke3Jvb3R9JHtwcm9qZWN0RGlyTmFtZX1gO1xufVxuIl19