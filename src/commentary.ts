import {IAskCommentary} from './interface';










export default class Commentary {

    public static clearContentCommentary( askCommentary: IAskCommentary, content: string ): string {

        if( askCommentary.headerCommentary ){ 
            content =   content
                        .replace( /(?<=HEADERSTART)(.*)(?=HEADEREND)/s, ' ' )
                        .replace( /\s*\/\/\s*(HEADERSTART HEADEREND).*/g, '' ); 
        }
        if( askCommentary.helperCommentary ){ 
            content =   content
                        .replace( /(?<=HELPERSTART)(.*?)(?=HELPEREND)/sg, ' ' )
                        .replace( /\s*\/\/\s*(HELPERSTART HELPEREND).*?/sg, '' );
        }
        if( askCommentary.documentationCommentary ){ 
            content =   content
                        .replace( /(?<=DOCUMENTATIONSTART)(.*?)(?=DOCUMENTATIONEND)/sg, ' ' )
                        .replace( /\s*\/\/\s*(DOCUMENTATIONSTART DOCUMENTATIONEND).*?/sg, '' );
        }
        
        if ( !askCommentary.headerCommentary && !askCommentary.helperCommentary && !askCommentary.documentationCommentary ) {
            // Clear useless key for user if commentary was kept
            content =   content
                        .replace( /\s*\/\/\s*(HEADERSTART|HELPERSTART|DOCUMENTATIONSTART).*/g, '' )
                        .replace( /\s*\/\/\s*(HEADEREND|HELPEREND|DOCUMENTATIONEND).*/g, '' );
        }
        
        return content;

    }

    public static clearContentSubKeyCommentary( content: string ): string {

        return  content
                .replace( /\s*\/\/(\_crud,|\_crudChildren,|\_filter,|\_filters,|\_filtersChildren,|\_grid,|\_gridChildren,)/g, '' )
                .replace( /^\s+/s, '' );

    }

}