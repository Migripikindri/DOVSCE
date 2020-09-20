import * as fs from 'fs';
import * as path from 'path';










export enum componentEnum {
    page, crud, filter, grid
}

export type ComponentType = keyof typeof componentEnum;

export class Component {

    public static getComponent( componentName: ComponentType ): string {

        return fs.readFileSync( path.join( __dirname, `../src/static/${componentName}.json` ), 'utf8' );

    }

    public static capitalizedFirstLetter( componentName: string ): string {

        return `${componentName!.charAt(0).toUpperCase()}${componentName!.slice(1)}`;

    }

}