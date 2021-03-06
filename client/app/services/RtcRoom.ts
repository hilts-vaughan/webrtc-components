import {VideoStream} from './VideoStream';

/**
 * Provides an encapsulated view of a room in WebRTC.
 * Allows users to get up and running with a room.
 */
export class RtcRoom {

	private static ICE_CONFIG: Object = {
		'iceServers': [{
			'url': 'stun:stun.l.google.com:19302'
		}]
	}

	private static SIGNALING_URL = "http://192.168.1.160:1239/"; 
	
	private _roomId: string;
	private _currentId: string;
	private _channel : RTCDataChannel;

	private _socket: Socket;
	
	private _peerMap: Object = {};
	private _channelMap : Object = {};

	private _localStream: MediaStream;


	constructor(stream: MediaStream, roomName : string) {
		this._socket = io.connect(RtcRoom.SIGNALING_URL);
		this._localStream = stream;
		this._roomId = roomName;

		var self = this;
		
		// Register handlers as needed
		this._socket.on('msg', (data) => {
			self.handleMessages(data);
		});

		this._socket.on('peer.connected', (data) => {
			self.makeOfferFor(data.id);
		});

		this._socket.on('peer.disconnected', (data) => {
			// Remove them properly from the UI>?
			console.log("peer aborted");
		})
	}

	private getPeerConnection(id: string): RTCPeerConnection {
		      if (this._peerMap[id]) {
			return this._peerMap[id];
		}

		var pc: RTCPeerConnection = new RTCPeerConnection(RtcRoom.ICE_CONFIG);

		this._peerMap[id] = pc;

		var self = this;
		pc.addStream(this._localStream);

		pc.onicecandidate = function(evnt) {
			console.log("ICE candidate recieved... broadcasting request");
			self._socket.emit('msg', { by: self._currentId, to: id, ice: evnt.candidate, type: 'ice' });
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
		
		var _channel : RTCDataChannel = pc.createDataChannel("data", options);
		
		_channel.onopen = () => {
			console.log("Attempted to send data down the pipe.");
		};
		
		// Maps to the channel
		this._channelMap[id] = _channel;
		
		pc.ondatachannel = (event : any) => {
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
			this._socket.emit('msg', { by: this._currentId, to: id, sdp: description, type: 'sdp-offer' });
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
						self._socket.emit('msg', { by: self._currentId, to: messageData.by, sdp: sdp, type: 'sdp-answer' });
					});
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
	
	/**
 	* Attempts to create the current room.
 	*/
	static createRoom(roomName : string, callback: Function): void {
		var socket : Socket = io.connect(RtcRoom.SIGNALING_URL);
		
		socket.emit('init', null, (room, userId) => {
			callback(room, userId);
			socket.disconnect(); // close off the temporary connection
		});
	}

	join(callback: Function): void {
		this._socket.emit('init', { room: this._roomId }, (room, userId) => {
			this._currentId = userId;
			callback(userId);
		});
	}

	sendMessage(message : string) : void {
		Object.keys(this._channelMap).forEach((key) => {
			let channel : RTCDataChannel = this._channelMap[key];
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
		this._eventMap[eventType].forEach(listener => {
			listener(data);
		});
	}

}