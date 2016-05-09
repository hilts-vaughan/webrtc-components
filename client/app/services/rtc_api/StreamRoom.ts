import {RoomOptions} from './RoomOptions'
import {StreamPeer} from './StreamPeer'

export class StreamRoom {
	// TODO: This should not be hard-coded ideally... but it won't hurt for now
	private static ICE_CONFIG: Object = {
		'iceServers': [{
			'url': 'stun:stun.l.google.com:19302'
		}]
	}

	private _roomOptions: RoomOptions;
	private _localStreams: Array<MediaStream>;
	private _socket: Socket;
	private _sessionToken: string;

	private _peerMap: Object = {};
	private _channelMap: Object = {};

	constructor(localStreams: Array<MediaStream>, options: RoomOptions, socket: Socket, sessionToken: string) {
		this._localStreams = localStreams;
		this._roomOptions = options;
		this._socket = socket;
		this._sessionToken = sessionToken;

		var self = this;

		alert('reg')
		// Register handlers as needed
		this._socket.on('msg', (data) => {
			console.log("Handling payload...");
			self.handleMessages(data);
		});

		this._socket.on('peer.connected', (data) => {
			self.makeOfferFor(data.id);
		});

		this._socket.on('peer.disconnected', (data) => {
			self.trigger('peer.removed', { id: data.id });
		})

	}

	private getPeerConnection(id: string): RTCPeerConnection {
		if (this._peerMap[id]) {
			return this._peerMap[id];
		}

		var pc: RTCPeerConnection = new RTCPeerConnection(StreamRoom.ICE_CONFIG);

		// TODO: Implement a stack that uses the {StreamPeer}
		// Right now, we rely on the bare metal implementation.

		var streamPeer : StreamPeer = new StreamPeer(pc, id);


		this._peerMap[id] = pc;

		var self = this;

		// Add all streams
		this._localStreams.forEach((stream) => {
			pc.addStream(stream);
		})

		pc.onicecandidate = function(evnt) {
			console.log("ICE candidate recieved... broadcasting request");
			console.log(self._sessionToken);
			self._socket.emit('msg', { by: self._sessionToken, to: id, ice: evnt.candidate, type: 'ice' });
		};

		pc.onaddstream = function(event) {
			console.log("Got new stream.. inform UI?");
			self.trigger('newstream', event);
		};

		pc.onremovestream = function(event) {
			console.log("Stream lost");
		}


		// Callbacks for text streams
		var options = {
			ordered: false
		}

		var _channel: RTCDataChannel = pc.createDataChannel("data", options);

		_channel.onopen = () => {
			console.log("Attempted to send data down the pipe.");
		};

		// Maps to the channel
		this._channelMap[id] = _channel;

		pc.ondatachannel = (event: any) => {
			console.log(event);
			console.log("Channel was created");
			event.channel.onmessage = (payload) => {
				self.trigger('data', payload.data);
			}
		}

		return pc;
	}

	private makeOfferFor(id: string) {
		var peer: RTCPeerConnection = this.getPeerConnection(id);

		peer.createOffer((description: RTCSessionDescription) => {
			peer.setLocalDescription(description);
			console.log("Creating offer for Peer... ID: " + id);
			this._socket.emit('msg', { by: this._sessionToken, to: id, sdp: description, type: 'sdp-offer' });
		}, () => {
			alert('failed');
		})
	}

	private handleMessages(messageData: any) {
		var peer: RTCPeerConnection = this.getPeerConnection(messageData.by);
		var self = this;

		switch (messageData.type) {
			case 'sdp-offer':
				peer.setRemoteDescription(new RTCSessionDescription(messageData.sdp), function() {
					console.log('Setting remote description by offer');
					peer.createAnswer(function(sdp) {
						peer.setLocalDescription(sdp);
						self._socket.emit('msg', { by: self._sessionToken, to: messageData.by, sdp: sdp, type: 'sdp-answer' });
					});
				}, function() {

				});
				break;

			case 'sdp-answer':
				peer.setRemoteDescription(new RTCSessionDescription(messageData.sdp), function() {
					console.log('Setting remote description by answer');
				}, function(e) {
					console.error(e);
				});
				break;

			case 'ice':
				if (messageData.ice) {
					console.log('Adding ice candidates... OK!');
					console.log(messageData);
					var cand: RTCIceCandidate = new RTCIceCandidate(messageData.ice);
					peer.addIceCandidate(cand, () => { }, () => { });
				}
				break;
		}
	}

	sendMessage(message: string): void {
		Object.keys(this._channelMap).forEach((key) => {
			let channel: RTCDataChannel = this._channelMap[key];
			channel.send(message);
		});
	}

	private _eventMap: Object = {};

	/**
	 * Allows listening for a particular set of listeners for a certain event
	 */
	on(eventType: string, listener: Function) {
		if (!this._eventMap[eventType])
			this._eventMap[eventType] = [];

		this._eventMap[eventType].push(listener);
	}

	private trigger(eventType: string, data: any) {
		console.log("Dispatching event; " + eventType + " to all listeners.");
		this._eventMap[eventType].forEach(listener => {
			listener(data);
		});
	}

	get roomName(): string {
		return this._roomOptions.roomName;
	}

}
