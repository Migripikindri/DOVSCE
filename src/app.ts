import MessageHandler from './messageHandler';
import Compose from './compose';
import Build from './build';

import {ICommand} from './interface';










export default class App {

    constructor() {}

    public async parseAndExecuteCommand( command: string|undefined ): Promise<boolean> {

        if( !command ) {
            MessageHandler.showError( 'Command not found' );
            return Promise.resolve( false );
        }
        
        const commandSplitted: ICommand = {
            action:     command.split( '.' )[0],
            ofWhat:     command.split( '.' )[1],
            withWhat:   ( command.split( '.and.' )[1] ) ? command.split( '.with.' )[1].split( '.and.' )[0] : command.split( '.with.' )[1],
            andWhat:    command.split( '.and.' )[1]
        };

        let returnStatement: Promise<boolean>;
        
        const compose = new Compose();
        const build = new Build();
        
        switch( commandSplitted.action ) {
            case'compose':  returnStatement = Promise.resolve( await compose.composeAction( commandSplitted ) ); break;
            case'build':    returnStatement = Promise.resolve( await build.buildAction( commandSplitted ) ); break;
            default: returnStatement = Promise.resolve( false );
        }

        return returnStatement;
        
    }



}