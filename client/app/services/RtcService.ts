import {VideoStream} from './VideoStream';

/**
 * Provides a service wrapper for WebRTC.
 */
export class RtcService {
	private _stream : VideoStream;
	
	constructor(videoStream : VideoStream) {
		this._stream = videoStream;
	}
	
}