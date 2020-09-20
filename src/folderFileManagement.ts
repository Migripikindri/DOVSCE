import {window,workspace,Uri} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import MessageHandler from './messageHandler';
import {Component} from './component';

import {IFolder} from './interface';










export default class FolderFileManagement {

    public static folderExist( folderPath: IFolder[ 'folderPath' ] ): boolean {

        return fs.existsSync( folderPath );

    }

    public static createFolder( folderPath: IFolder[ 'folderPath' ], name:string ): boolean {

        fs.mkdirSync( `${folderPath}\\${name}` );

        return true;

    }

    public static getFolderPathInfos( folderName: string|undefined = workspace.getConfiguration().get( 'global.rootFolderName' ), depth: number = 1 ): IFolder | undefined {

        const workspaceDatas = workspace.workspaceFolders;

        if( workspaceDatas === undefined ) {
            MessageHandler.showError( 'No folder open' );
            return undefined;
		}

        return 	{
            currentWorkspaceFolder: workspaceDatas[0],
			uri:                    workspaceDatas[0].uri.fsPath,
            folderPath:             ( workspaceDatas[0].name !== folderName ) ? `${workspaceDatas[0].uri.fsPath}\\${folderName}` : workspaceDatas[0].uri.fsPath
        };
    }

    public static writeFile( folderPath: string, name:string, fileContent: string, ext: string, openNewFile: boolean ): void {

        fs.writeFile( path.join( folderPath, `${name}.${ext}` ), fileContent, async ( err, ) => {

            if( err )   { throw new Error( err.message ); }
            else        { 
                            if( openNewFile ) { 
                                await workspace.openTextDocument( Uri.file( path.join( folderPath, `${name}.${ext}` ) ) ).then( v => {
                                    
                                    window.showTextDocument( v );
                                    //workspace.onDidOpenTextDocument( e => window.showInformationMessage( `Your new document ${name} is now open` ) );

                                });
                            } 
                        }
            
        });

    }

    public static replacePageWord( content: string, withWord: string, replaceWith: string ): string {

        const   capitalizeWithWord      = Component.capitalizedFirstLetter( withWord ),
                capitalizeReplaceWith   = Component.capitalizedFirstLetter( replaceWith ),
                regex                   = new RegExp( `${withWord}`, 'g' ),
                regexCapitalized        = new RegExp( `${capitalizeWithWord}`, 'g' );
        

        return  content
                .replace( regexCapitalized, capitalizeReplaceWith )
                .replace( regex, replaceWith );

    }

}