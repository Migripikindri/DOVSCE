
import MessageHandler from './messageHandler';
import FolderFileManagement from './folderFileManagement';
import Ask from './ask';
import Commentary from './commentary';
import {Component, componentEnum, ComponentType} from './component';

import {InputBoxOptions} from 'vscode';
import {IAskCommentary, ICommand} from './interface';










export default class Compose {

    public async composeAction( command: ICommand ): Promise<boolean> {
        
        const folderPathInfos = FolderFileManagement.getFolderPathInfos( );
        if( folderPathInfos === undefined ){ return Promise.resolve( false ); }

        if( !FolderFileManagement.folderExist( folderPathInfos.folderPath ) )
            { MessageHandler.showError( 'Root folder not found' ); return Promise.resolve( false ); }

        const composedContent = await Compose.composeContent( command );
        if( !composedContent ) { return Promise.resolve( false ); }

        FolderFileManagement.createFolder( folderPathInfos.folderPath, composedContent.pageName! );
        FolderFileManagement.writeFile( `${folderPathInfos.folderPath}\\${composedContent.pageName}`, composedContent.pageName!, composedContent.content, 'component.json', true );

        return Promise.resolve( true );

    }

    public static async composeContent( command: ICommand, answer?: { pageName: string | undefined, tableName: string | undefined, fieldsList: string | undefined } ): Promise<{ content: string, contentDatasource: string, pageName: string | undefined, tableName: string | undefined, fieldsList: string | undefined } | undefined> {

        let ofWhatContent:      string | undefined,
            withWhatContent:    string | undefined,
            andWhatContent:     string | undefined,
            regex:              RegExp,
            pageName:           string | undefined,    
            tableName:          string | undefined,
            fieldsList:         string | undefined,
            contentDatasource:  string = '',
            askValues:          { askName: string, value: string|undefined, optional?: boolean }[] = [];

        // Of what
        if( !(command.ofWhat! in componentEnum) ) {

            MessageHandler.showError( `No component snippet found for ${command.ofWhat}` ); 
            return undefined;
            
        }


        // Ask user
        if( !answer ) {

            const askToCompose: { askName: string, options: InputBoxOptions, optional?: boolean }[] = [ { askName: 'pageName', options: { placeHolder: '(R) Page name ?' } } ];
                
            if( 
                ( command.withWhat && ( [ 'grid', 'filter' ].indexOf( command.withWhat ) > -1 ) ) ||
                ( command.andWhat && command.andWhat === 'grid' ) 
            )
            {
                askToCompose.push( { askName: 'tableName', options: { placeHolder: '(O) Table name without sw_data_ ? Page name will be use instead.' }, optional: true } );
                askToCompose.push( { askName: 'fieldsList',options: { placeHolder: '(R) Fields list ? name:type,name:type => ex: stringField:string,boolField:boolean' } } );
                
            }

            askValues = await Ask.askForValue( askToCompose );
            if( askValues.filter( v => ( !v.optional && v.value === undefined ) ).length > 0 ) { 
                MessageHandler.showError( 'All answers are required.' );
                return undefined;
            }

        }

        pageName    = ( answer ) ? answer.pageName : askValues[0].value;
        tableName   = ( answer ) ? answer.tableName : askValues[1].value;
        fieldsList  = ( answer ) ? answer.fieldsList : askValues[2].value;

        if( !tableName ) { tableName = pageName; };

        // Ask commentary
        const askCommentary: IAskCommentary =   ( answer ) ? {
                                                    helperCommentary: true, 
                                                    headerCommentary: true, 
                                                    documentationCommentary: true 
                                                } : await Ask.askForCommentary();
        ofWhatContent = Commentary.clearContentCommentary( askCommentary, Component.getComponent( <ComponentType>command.ofWhat ) );

        
        // With what
        if( command.withWhat! in componentEnum ) {

            withWhatContent                     = Commentary.clearContentCommentary( askCommentary, Component.getComponent( <ComponentType>command.withWhat ) );
            regex                               = new RegExp( `\/\/\_${command.withWhat}`, 'g' );
            ofWhatContent                       = ofWhatContent!.replace( regex, `\t\t"${pageName}${Component.capitalizedFirstLetter( command.withWhat! )}": ${withWhatContent}` );

        }

        // And what
        if( command.andWhat! in componentEnum ) {
            
            andWhatContent                      = Commentary.clearContentCommentary( askCommentary, Component.getComponent( <ComponentType>command.andWhat ) );
            regex                               = new RegExp( `\/\/\_${command.andWhat}`, 'g' );
            ofWhatContent                       = ofWhatContent!.replace( regex, `\t\t"${pageName}${Component.capitalizedFirstLetter( command.andWhat! )}": ${andWhatContent}` );
            
        }

        ofWhatContent = FolderFileManagement.replacePageWord( ofWhatContent, 'pageName', pageName! );
        if( tableName )
            { ofWhatContent = FolderFileManagement.replacePageWord( ofWhatContent, 'tableName', tableName! ); }


        if( fieldsList && [ command.withWhat ].indexOf( 'crud' ) > -1 ) {

            // if( 
            //     await window.showQuickPick([
            //         { label: 'Yes', detail: 'Create datasource', picked: true },
            //         { label: 'No',  detail: 'No, thanks' }
            //     ]).then( v => ( v!.label === 'Yes' ) ? true : false )
            // ) { 

            // }
            let crudChildren: string    = '',
                firstPass: number       = 0;

            for( const fieldSplitted of fieldsList.split( ',' ) ) {

                const crudChildrenName = fieldSplitted.split( ':' )[ 0 ];

                if( firstPass !== 0 ) { crudChildren += ',\n'; }
                crudChildren += `\t\t\t\t"${crudChildrenName}": {}`;
                firstPass++;

            }

            ofWhatContent = ofWhatContent.replace( '//_crudChildren,', `${crudChildren}` );
        }

        if( fieldsList && [ command.withWhat ].indexOf( 'filter' ) > -1 ) {

            let filters: string = '', filtersChildren: string = '', firstPass: number = 0;

            for( const fieldSplitted of fieldsList.split( ',' ) ) {

                const filter = fieldSplitted.split( ':' )[ 0 ];
                
                let filterType = fieldSplitted.split( ':' )[ 1 ];

                switch( filterType ) {
                    case 'foreign': filterType = 'combobox'; break;
                    case 'string': filterType = 'textbox'; break;
                    case 'number': filterType = 'numberbox'; break;
                    case 'boolean': filterType = 'checkbox'; break;
                    case 'date': filterType = 'datepicker'; break;
                }
                
                if( firstPass !== 0 ) { filters += ',\n'; filtersChildren += ',\n'; }
                filters         += `\t\t\t\t\t"${filter}": {\n\t\t\t\t\t\t"defaultFilter": true,\n\t\t\t\t\t\t"Operator": "Equal",\n\t\t\t\t\t\t"FieldName": "${filter}"\n\t\t\t\t\t}`;
                filtersChildren += `\t\t\t\t"${filter}": {\n\t\t\t\t\t"Type": "${filterType}",\n\t\t\t\t\t"Label": "sw_data_${tableName}_${filter}"\n\t\t\t\t}`;
                firstPass++;

            }

            ofWhatContent = ofWhatContent.replace( '//_filters,', `${filters}` );
            ofWhatContent = ofWhatContent.replace( '//_filtersChildren,', `${filtersChildren}` );
        }

        if( fieldsList && [ command.withWhat, command.andWhat ].indexOf( 'grid' ) > -1 ) {

            let gridChildren: string    = '',
                firstPass: number       = 0;

            for( const fieldSplitted of fieldsList.split( ',' ) ) {

                const   gridChildrenName    = fieldSplitted.split( ':' )[ 0 ],
                        gridChildrenType    = fieldSplitted.split( ':' )[ 1 ];

                if( firstPass !== 0 ) { gridChildren += ',\n'; }
                gridChildren += `\t\t\t\t"${gridChildrenName}": {\n\t\t\t\t\t"title": "sw_data_${tableName}_${gridChildrenName}",\n\t\t\t\t\t"Type": "${gridChildrenType}"\n\t\t\t\t}`;
                firstPass++;

            }

            ofWhatContent = ofWhatContent.replace( '//_gridChildren,', `${gridChildren}` );
            
        }

        // Datasources
        if( 
            ( command.withWhat && ( [ 'grid', 'filter' ].indexOf( command.withWhat ) > -1 ) ) ||
            ( command.andWhat && command.andWhat === 'grid' ) 
        )
        {
            contentDatasource += `{\n\t"Type": "sql",\n\t"PrimaryKey": "${tableName}_ID",\n\t"Aliases": {\n\t\t"${tableName}_ID_primaryKey": "${tableName}.${tableName}_ID"\n\t},\n\t"SelectSql": "\n\t\tSELECT\n\t\t\t{{${tableName}_ID_primaryKey}},`;

            for( const fieldSplitted of fieldsList!.split( ',' ) ) {

                const selectName = fieldSplitted.split( ':' )[ 0 ];

                contentDatasource += `\n\t\t\t${tableName}.${selectName} AS ${selectName},`;

            }

            contentDatasource = contentDatasource.slice(0, -1);
            contentDatasource += `\n\n\t\tFROM sw_data_${tableName} AS ${tableName}\n\n\t\tWHERE {{FILTERS}}\n\t"\n}`;
            
        }
        else if( command.withWhat && command.withWhat === 'crud') {
            contentDatasource += `{\n\t"Type": "table",\n\t"TableName": "${tableName}"\n}`;
        }

        return {
            content: Commentary.clearContentSubKeyCommentary( ofWhatContent ), 
            contentDatasource: contentDatasource,
            pageName: pageName, 
            tableName: tableName, 
            fieldsList: fieldsList
        };

    }

}