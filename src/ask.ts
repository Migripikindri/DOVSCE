import {window, InputBoxOptions} from 'vscode';

import {IAskCommentary} from './interface';










export default class Ask {

    public static async askForCommentary( ): Promise<IAskCommentary> {

        const clearHelperCommentary = await window.showQuickPick([
            { label: 'Yes', detail: 'Yes, clear HELPER commentary', picked: true },
            { label: 'No',  detail: 'No, clear HELPER commentary' }
        ]).then( v => ( v!.label === 'Yes' ) ? true : false );

        const clearHeaderCommentary = await window.showQuickPick([
            { label: 'Yes', detail: 'Yes, clear HEADER commentary', picked: true },
            { label: 'No',  detail: 'No, clear HEADER commentary' }
        ]).then( v => ( v!.label === 'Yes' ) ? true : false );

        const clearDocumentationCommentary = await window.showQuickPick([
            { label: 'Yes', detail: 'Yes, clear DOCUMENTATION commentary', picked: true },
            { label: 'No',  detail: 'No, clear DOCUMENTATION commentary' }
        ]).then( v => ( v!.label === 'Yes' ) ? true : false );

        return Promise.resolve({
            helperCommentary: clearHelperCommentary, 
            headerCommentary: clearHeaderCommentary, 
            documentationCommentary: clearDocumentationCommentary 
        });

    }

    public static async askForValue( ask: { askName: string, options: InputBoxOptions, optional?: boolean }[] ): Promise<{ askName: string, value: string|undefined, optional?: boolean }[]> {

        let results:{ askName: string, value: string|undefined, optional?: boolean }[] = [];

        for( const item of ask ) {
            
            const value = await window.showInputBox( { placeHolder: item.options.placeHolder } );
            results.push( { askName: item.askName, value: value, optional: item.optional } );

        }
        return Promise.resolve( results );

    }

}