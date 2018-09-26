export interface Schema {
    /**
     * Initial repository commit information.
     */
    commit?: CommitUnion;
    /**
     * The directory name to create the workspace in.
     */
    directory?: string;
    /**
     * EXPERIMENTAL: Specifies whether to create a new application which uses the Ivy rendering
     * engine.
     */
    experimentalIvy?: boolean;
    /**
     * Specifies if the style will be in the ts file.
     */
    inlineStyle?: boolean;
    /**
     * Specifies if the template will be in the ts file.
     */
    inlineTemplate?: boolean;
    /**
     * Link CLI to global version (internal development only).
     */
    linkCli?: boolean;
    /**
     * The name of the workspace.
     */
    name: string;
    /**
     * The path where new projects will be created.
     */
    newProjectRoot?: string;
    /**
     * The prefix to apply to generated selectors.
     */
    prefix?: string;
    /**
     * Generates a routing module.
     */
    routing?: boolean;
    /**
     * Skip initializing a git repository.
     */
    skipGit?: boolean;
    /**
     * Skip installing dependency packages.
     */
    skipInstall?: boolean;
    /**
     * Skip creating spec files.
     */
    skipTests?: boolean;
    /**
     * The file extension to be used for style files.
     */
    style?: string;
    /**
     * The version of the Angular CLI to use.
     */
    version: string;
    /**
     * Specifies the view encapsulation strategy.
     */
    viewEncapsulation?: ViewEncapsulation;
}
/**
 * Initial repository commit information.
 */
export declare type CommitUnion = boolean | CommitObject;
export interface CommitObject {
    email: string;
    message?: string;
    name: string;
}
/**
 * Specifies the view encapsulation strategy.
 */
export declare enum ViewEncapsulation {
    Emulated = "Emulated",
    Native = "Native",
    None = "None",
    ShadowDOM = "ShadowDom"
}
