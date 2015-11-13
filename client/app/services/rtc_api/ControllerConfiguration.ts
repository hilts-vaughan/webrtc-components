/**
 * Provides a configuration for {RtcController} to use. Provides information like contexts.
 */
export class ControllerConfiguration {
	
	private _serverUrl : string;
	private _context : string;
	
	constructor(url : string, context : string) {
		this._serverUrl = url;
		this._context = context;
	}
	
	get context() : string {
		return this._context;
	}
		
	get url() : string {
		return this.url;
	}
	
}