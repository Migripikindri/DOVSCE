import * as vscode from 'vscode';
import * as https from 'https';

import App from './app';










export function activate(context: vscode.ExtensionContext) {
	
	// Test polling database API.
	// const data = JSON.stringify({
	// 	"CompanyCode":"ORTD",
	// 	"Username":"BELE BO",
	// 	"Password":"Aa000000",
	// 	"RememberMe":false
	// });
	// const data = JSON.stringify({
	// 	"scope": "API",
	// 	"projectCode": "ORTD",
	// 	"userName": "BELE BO",
	// 	"password": "Aa111111"
	// });
	
	// const options = {
	// 	hostname: 'database-api.swingmobility.com',
	// 	port: 443,
	// 	path: '/v1/Authenticate',
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'Content-Length': data.length
	// 	}
	// };
	
	// const options = {
	// 	hostname: 'database-api.swingmobility.com',
	// 	path: '/v1/Status',
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// };
	
	// const req = https.get(options, res => {

	// 	console.log(`statusCode: ${res.statusCode}`);
	
	// 	res.on('data', d => {
	// 		console.log( d );
	// 	});

	// });

	// const req = https.request( options, res => {

	// 	console.log(`statusCode: ${res.statusCode}`);
	
	// 	res.on( 'data', d => {
	// 		console.log( JSON.parse(d) );
	// 		req.end();
	// 	});

	// });
	
	// req.on( 'error', err => {
	// 	console.error( err );
	// });

	// req.write(data, (err) => {
	// 	if( err ) { console.error( err ); }
	// });
	

	 

	let doCompose = vscode.commands.registerCommand( 'do.compose', async () => {

		const quickPickItems: vscode.QuickPickItem[] = 
		[
			{label: 'compose.page', 							detail: 'Compose page'}, 
			{label: 'compose.page.with.crud', 					detail: 'Compose page with crud'},
			{label: 'compose.page.with.grid',					detail: 'Compose page with grid'},
			{label: 'compose.page.with.filter.and.grid',		detail: 'Compose page with filter and grid'},
			// {label: 'compose.page.with.tabs', 					detail: 'Compose page with tabs'},
			// {label: 'compose.datasource.generictype', 			detail: 'Compose datasource to list generictype values'}
		];

		const showQuickPickResult = await vscode.window.showQuickPick( quickPickItems );
		
		if( showQuickPickResult ){ new App().parseAndExecuteCommand( showQuickPickResult.label ); }
	
	});
	context.subscriptions.push( doCompose );

	let doBuild = vscode.commands.registerCommand( 'do.build', async () => {

		const quickPickItems: vscode.QuickPickItem[] = 
		[
			{label: 'build.scrud', 								detail: 'Build SCRUD'},
			{label: 'build.foreign.with.grid',					detail: 'Build foreign with grid'},
			{label: 'build.foreign.with.filter.and.grid',		detail: 'Build foreign with filter and grid'}
		];

		const showQuickPickResult = await vscode.window.showQuickPick( quickPickItems );
		
		if( showQuickPickResult ){ new App().parseAndExecuteCommand( showQuickPickResult.label ); }
	
	});
	context.subscriptions.push( doBuild );
}

// this method is called when your extension is deactivated
export function deactivate() {}
