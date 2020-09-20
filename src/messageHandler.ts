import {window} from 'vscode';

export default class MessageHandler {

    static showError( message: string ): void {

        window.showErrorMessage( message );

    }

}