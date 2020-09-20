import {WorkspaceFolder} from 'vscode';










export interface IFolder {
    currentWorkspaceFolder: WorkspaceFolder;
	uri:                    string;
	folderPath:             string;
}

export interface ICommand {
    action:     string | undefined;
    ofWhat:     string | undefined;
    withWhat?:  string | undefined;
    andWhat?:   string | undefined;
}

export interface IAskCommentary {
    helperCommentary: boolean, 
    headerCommentary: boolean, 
    documentationCommentary: boolean
}