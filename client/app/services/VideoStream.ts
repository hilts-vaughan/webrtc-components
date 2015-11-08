export class VideoStream {
	private _stream : any = null;
	
	getStream(needVideo : boolean, needAudio : boolean, c : Function) : void {
		if(this._stream == null) {
			var nav : any = navigator;
			nav.getUserMedia({
				video: needVideo,
				audio: needAudio
			}, function(s) {
				this._stream = s;
				c(s);				
			}, function() {console.log('stream fetch failed.')});
		} else {
			c(this._stream);
		}	
	}
	
}