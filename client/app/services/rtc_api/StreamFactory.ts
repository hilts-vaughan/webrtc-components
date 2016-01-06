export class StreamFactory {
	
	private static doesSupportUserMedia() : boolean {
		return navigator.getUserMedia != undefined;
	}
	
	/**
	 * Attempts to create and return a live stream from the users webcam. The stream is valid for the lifetime of the session of the webpage.
	 * If the browser does not support this operation, an exception will be thrown. 
	 * 
	 * Otherwise, the {MediaStream} is returned in the provided callback. If it fails, the stream will be null.
	 */
	public static createWebcamStream(captureAudio : boolean, captureVideo : boolean, callback : Function) {
		if(!this.doesSupportUserMedia())	 {
			throw Error("The client does not support capturing webcam streams."); 
		}
				
		navigator.getUserMedia({
			audio: captureAudio,
			video: captureVideo
		}, (stream : MediaStream) =>
			callback(stream)
		, (error : MediaStreamError) =>
			callback(null)
		);
	}
	
	/**
	 * Attempts to create and return a live stream of the current screen the browser is hosted on. The stream is valid for the lifetime
	 * of the desktop session. If the browser does not support this operation, an exception will be thrown.
	 * 
	 * Otherwise, the {MediaStream} is returned in the provided callback. If it fails, the stream will be null.
	 */
	public static createScreenStream(callback : Function) {
		if(!this.doesSupportUserMedia())	 {
			throw Error("The client does not support capturing screen streams."); 
		
		navigator.getUserMedia({
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: 'screen',
					maxWidth: 1920,
					maxHeight: 1080
				}
			}
		}, (stream : MediaStream) =>
			callback(stream)
		, 
		(error : MediaStreamError) =>
			callback(null)
		);
	}
	
	/**
	 * Attempts to create and return a live stream {MediaStream} from the provided canvas object. The stream is valid for the lifetime of 
	 * the canvas in the DOM. If the browser does not support this operation, an exception will be thrown.
	 * 
	 * Otherwise, the MediaStream is returned. If it failed, the stream will be null.
	 * 
	 * @param	framerate	The number of frames per second that the canvas should be captured at
	 */
	public static createCanvasStream(canvas : HTMLCanvasElement, framerate : number) {
		if(canvas['captureStream']) {
			return canvas['captureStream'](framerate);
		}
		else {
			throw Error("The client does not support capturing canvas streams.")
		} 
	}
}