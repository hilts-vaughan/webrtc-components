import {ControllerConfiguration} from './ControllerConfiguration'
import {RoomService} from './RoomService'

/**
 * Creates an instance of RTC services. If you are looking to just embed RTC services in your application, this is the class you want to bootstrap
 * everything.
 */
export class StreamController {
	
	private _config : ControllerConfiguration;
	private _roomService : RoomService;
	
	constructor(config : ControllerConfiguration) {
		this._config = config;
	}
	
	/**
	 * Fetches the single instance of the room service provided by this stream controller. Only one instance should be created, per stream controller.
	 * As long as you fetch through this method, this is enforced. 
	 */
	public getRoomService() : RoomService {
		if(this._roomService == null) {
			this._roomService = new RoomService(this._config);
		}
		return this._roomService;
	}
	
	
}