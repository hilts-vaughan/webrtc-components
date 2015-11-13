/**
 * Provides a simple container to specify options about a room. If you want to add additional options for joining rooms, you should
 * extend this class and override methods to specify the additional meta-data you wish to provide.
 */
export class RoomOptions {
	private name : string;
	private isPrivate : boolean;
	
	// Used for internal book keeping
	private timestamp : Date;
	
	constructor(name : string, isPrivate : boolean) {
		this.name = name;
		this.isPrivate = isPrivate;
		this.timestamp = new Date();
	}

	/**
	 * Obtains the name of this room.
	 * @returns	The name of the room for this option set
	 */
	get roomName() : string {
		return this.name;		
	}
	
	/**
	 * Obtains whether or not the room is private or not.
	 * @returns	True, if the room is private. Otherwise, false will be returned.
	 */
	get getIsPrivate() : boolean {
		return this.isPrivate;
	}
	
}