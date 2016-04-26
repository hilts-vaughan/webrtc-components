import {RoomOptions} from './RoomOptions'
import {ControllerConfiguration} from './ControllerConfiguration'
import {StreamRoom} from './StreamRoom'

/**
 * Provides services in relation to room management, as provided by a RtcController. Do not create an instance of this directly.
 * You should be able to get single instance through your RtcController.
 */
export class RoomService {

	private config: ControllerConfiguration;
	private socket: Socket;

	/**
	 * @param	SIGNALING_URL_OPTION	The URL of the signalling server to be connected to.
	 */
	constructor(config: ControllerConfiguration) {
		this.config = config;
		this.socket = this.getSocket();
	}

	public sendExternalMessage(key : string, message : Object, callback : Function)  {
		this.socket.emit(key, message, (response : Object) => {
			callback(response);
		});
	}

	/**
	 * Provides a filtering affordance for rooms. If you want to find all rooms, supply a blank string as the filtering parameter.
	 * If you are interesting in getting notifications, use a different mechanism for this. This is a one time query.
	 *
	 * A callback with a listing of {RoomOptions} will be provided as the first parameter. If no rooms were found, the list
	 * will be empty.
	 */
	public findRooms(filter: string, callback: RoomFilterResultCallback): void {
		if (filter == null) {
			console.warn("[RoomService] If you wanted all results, pass in an empty string. Fixing this for you this time...");
			filter = '';
		}

		this.socket.emit('findRooms', { filter: filter }, (results: Array<string>) => {
			var optionizedResults: Array<RoomOptions> = [];
			results.forEach((room) => {
				// TODO: The private spec is not supported by most signalling server cores as is.
				var roomOption: RoomOptions = new RoomOptions(room, false);
				optionizedResults.push(roomOption);
			});

			callback(optionizedResults);
		});
	}

	/**
	 * Creates a room with the given options. If it was a success, a callback will be invoke with true. Otherwise, the callback
	 * will be invoked with the parameter false.
	 */
	public createRoom(options: RoomOptions, callback: Function) {
		if (options == null || callback == null) {
			throw Error("Options or callback cannot be null.");
		}

		this.socket.emit('createRoom', options, (success) => {
			callback(success);
		});
	}

	/**
	 * Attempts to join a room with the given room options with the streams provided. The result of the operation is
	 * async, so it will be provided through the callback. If the streams are invalid, the room is unavailable, or any other
	 * error occurs, the callback will be invoke with one parameter, false. Otherwise, it will be invoked with true, and a second
	 * parameter will follow with the room context that has been created.
	 *
	 */
	public joinRoom(options: RoomOptions, streams: Array<MediaStream>, callback: Function) {
		if (options == null || streams == null) {
			callback(false);
		}

		// Note: A new socket is created here, as all communications for that session will be created with this newly acquired socket
		// This helps prevent the situation where a session is tied to a single socket
		var roomSocket: Socket = this.getSocket();

		roomSocket.emit('joinRoom', options, (success, token) => {
			if (success) {
				var context: StreamRoom = new StreamRoom(streams, options, roomSocket, token);
				callback(success, context);
			}
			else {
				callback(false, null);
			}
		});
	}

	private getSocket(): Socket {
		var socket: Socket = io.connect(this.config.url, {resource: 'A/socket.io', 'force new connection': true});
		return socket;
	}
}

interface RoomFilterResultCallback {
    (message: Array<RoomOptions>): void;
}
