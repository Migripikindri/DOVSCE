import MessageHandler from './messageHandler';
import FolderFileManagement from './folderFileManagement';
import Compose from './compose';

import {ICommand} from './interface';
import { downloadAndUnzipVSCode } from 'vscode-test';










export default class Build {

    public async buildAction( command: ICommand ): Promise<boolean> {

        const folderPathInfos = FolderFileManagement.getFolderPathInfos();
        if( folderPathInfos === undefined ){ return Promise.resolve( false ); }

        if( !FolderFileManagement.folderExist( folderPathInfos.folderPath ) )
            { MessageHandler.showError( 'Root folder not found' ); return Promise.resolve( false ); }

        if( command.ofWhat === 'scrud' ) {

            const composeMain = await Compose.composeContent( 
                <ICommand>{
                    action:     'compose',
                    ofWhat:     'page',
                    withWhat:   'filter', 
                    andWhat:    'grid'
                }
            );

            if( !composeMain ) { return Promise.resolve( false ); }

            FolderFileManagement.createFolder( folderPathInfos.folderPath, composeMain.pageName! );
            FolderFileManagement.writeFile( `${folderPathInfos.folderPath}\\${composeMain.pageName}`, composeMain.pageName!, composeMain.content, 'component.json', true );
            FolderFileManagement.writeFile( `${folderPathInfos.folderPath}\\${composeMain.pageName}`, composeMain.pageName!, composeMain.contentDatasource, 'grid.datasource.json', true );

            const composeNew = await Compose.composeContent( 
                <ICommand>{
                    action:     'compose',
                    ofWhat:     'page',
                    withWhat:   'crud'
                },
                {
                    pageName: composeMain.pageName,
                    tableName: composeMain.tableName,
                    fieldsList: composeMain.fieldsList
                }
            );

            if( !composeNew ) { return Promise.resolve( false ); }

            FolderFileManagement.createFolder( `${folderPathInfos.folderPath}\\${composeNew.pageName}`, 'new' );
            FolderFileManagement.writeFile( `${folderPathInfos.folderPath}\\${composeNew.pageName}\\new`, composeNew.pageName!, composeNew.content, 'new.component.json', true );
            FolderFileManagement.writeFile( `${folderPathInfos.folderPath}\\${composeNew.pageName}`, composeNew.pageName!, composeNew.contentDatasource, 'table.datasource.json', true );
            
            const composeId = await Compose.composeContent( 
                <ICommand>{
                    action:     'compose',
                    ofWhat:     'page',
                    withWhat:   'crud'
                },
                {
                    pageName: composeMain.pageName,
                    tableName: composeMain.tableName,
                    fieldsList: composeMain.fieldsList
                }
            );

            if( !composeId ) { return Promise.resolve( false ); }

            FolderFileManagement.createFolder( `${folderPathInfos.folderPath}\\${composeId.pageName}`, 'id' );
            FolderFileManagement.writeFile( `${folderPathInfos.folderPath}\\${composeId.pageName}\\id`, composeId.pageName!, composeId.content, 'id.component.json', true );

        }
        else if( command.ofWhat === 'foreign' ) {

            command.ofWhat = 'page';
            const composeMain = await Compose.composeContent( command );

            if( !composeMain ) { return Promise.resolve( false ); }

            composeMain.content += `\n//Use your new foreign with\n//{\n//\t"Type": "foreign",\n//\t"ForeignLink": {\n//\t\t"Target": "${composeMain.pageName}",\n//\t\t"Mode": "Popin"\n//\t},\n//\t"SelectionComponent": "${composeMain.pageName}Grid",\n//\t"SelectionField": "fieldName",\n//\t"SelectionId": "${composeMain.tableName}_ID_primaryKey"\n//}`;

            FolderFileManagement.createFolder( folderPathInfos.folderPath, composeMain.pageName! );
            FolderFileManagement.writeFile( `${folderPathInfos.folderPath}\\${composeMain.pageName}`, composeMain.pageName!, composeMain.content, 'component.json', true );
            FolderFileManagement.writeFile( `${folderPathInfos.folderPath}\\${composeMain.pageName}`, composeMain.pageName!, composeMain.contentDatasource, 'grid.datasource.json', true );

        }

        return Promise.resolve( true );

    }

    public buildContent( command: ICommand, name?: string ): string | undefined {

        return undefined;

    }

}