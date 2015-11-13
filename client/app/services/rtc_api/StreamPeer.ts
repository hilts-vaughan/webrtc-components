/**
 * Represents a remote peer 
 */
export class StreamPeer {
	private _token : string;
	private _connection : RTCPeerConnection;
	private _streams : Array<MediaStream> = [];
	
	constructor(peerConnection : RTCPeerConnection, token : string) {
		this._token = token;
		this._connection = peerConnection;
	}
	
	public addStream(stream : MediaStream) {		
		this._streams.push(stream);
		this._connection.addStream(stream);
	}
	
	public removeStream(stream : MediaStream) {
		var index : number = this._streams.indexOf(stream);
		if(index > -1) {
			this._streams.splice(index, 1);
		}
		this._connection.removeStream(stream);
	}
	
	/**
	 * Fetches all active streams by this peer. This is often useful when cleaning up after a peer that has disconnected.
	 * All streams fetched from this are valid at the time of collection,  however, it is possible for the streams to become
	 * invalid if the stream list is cached.
	 */
	public getStreams() : Array<MediaStream> {
		return this._streams;
	}
	
}