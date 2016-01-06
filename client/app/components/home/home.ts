import {Component, CORE_DIRECTIVES, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/angular2';

// WebRTC core directives
import {StreamController} from '../../services/rtc_api/StreamController'
import {ControllerConfiguration} from '../../services/rtc_api/ControllerConfiguration'
import {RoomOptions} from '../../services/rtc_api/RoomOptions'
import {StreamFactory} from '../../services/rtc_api/StreamFactory'
import {StreamRoom} from '../../services/rtc_api/StreamRoom'

@Component({
  selector: 'home',
  templateUrl: './components/home/home.html',
  styleUrls: ['./components/home/home.css'],
  directives: [CORE_DIRECTIVES]
})
export class HomeCmp {

  private chatBuffer: Array<String> = [];
  private availableRooms: Array<RoomOptions> = [];
  private localStreams = [];
  private activeStream : MediaStream;
  private activeRoom: StreamRoom;
  
  // Poor man's state machine; 
  private state: number = 0;
  

  
  // We need a stream controller to bootstrap the process. The context key is a unique session key that isolates the process from other users.
  // If you are just experimenting, using the default context key is fine.
  private _streamController: StreamController = new StreamController(new ControllerConfiguration("http://hopper.wlu.ca:1239/", "WLU-HOPPER"));

  constructor(public ref: ChangeDetectorRef) {
    // NOTE: AngularJS change detector; allows us to take over the UI. It's injected via ref; no related to the WebRTC
    this.refreshRooms();  // initial refresh
  }
  
  /**
   * Fetch streams we want to use here; ask user about which to use
   */
  private askWebcam() {
    var self = this;
    StreamFactory.createWebcamStream(true, true, (stream: MediaStream) => {
      if (stream != null) {
        self.localStreams.push(URL.createObjectURL(stream));
        self.activeStream = stream;
        self.moveToChoice();
      }
    })
  }

  private askScreen() {
    var self = this;
    StreamFactory.createScreenStream((stream: MediaStream) => {
      if (stream != null) {
        self.localStreams.push(URL.createObjectURL(stream));
        self.activeStream = stream;
        self.moveToChoice();
      }
    })
  }
  
  /**
   * Helper method for moving onto join room / create room state
   */
  private moveToChoice() {
    this.state = 1;
    this.ref.detectChanges();
  }
  
  
  /**
   * Selection of what to do, moving along now
   */

  private refreshRooms() {
    var self = this;
    this._streamController.getRoomService().findRooms("", (roomsFound: Array<RoomOptions>) => {
      self.availableRooms = roomsFound;
      this.ref.detectChanges(); // Force display update    
    });
  }

  private createRoom() {
    var roomName: string = prompt("Name of the room to create; ");
    var options: RoomOptions = new RoomOptions(roomName, false);
    this._streamController.getRoomService().createRoom(options, (success) => {
      if (success) {
        alert("Room created!");
      }
      else {
        alert("Failed to create room. Duplicate?");
      }

      // Refresh anyway; show duplicates
      this.refreshRooms();
    });
  }

  private joinRoom() {
    var roomName: string = prompt("Name of the room to join?");
    var options: RoomOptions = new RoomOptions(roomName, false);
    var self = this;
    this._streamController.getRoomService().joinRoom(options, [self.activeStream], (success: boolean, roomContext: StreamRoom) => {
      if (success) {
        self.activeRoom = roomContext;
        self.state = 2;
        self.ref.detectChanges();
        self.moveToPeers();
        setTimeout(this.beginPlayback.bind(this), 500); // move to the next state and begin playback shortly
      } else {
        alert("Failed to join room!");
      }
    });
  }
  
  /**
   * We're inside a room! Let's do something...
   */

  private moveToPeers() {
    this.activeRoom.on('newstream', this.setupRemoteStream.bind(this));
    // this.activeRoom.on('data', this.dataReceived.bind(this));
  }

  /**
   * Push up a new remote stream into the application stream.
   */
  private setupRemoteStream(event: any) {
    this.localStreams.push(URL.createObjectURL(event.stream));
    this.ref.detectChanges(); 
    setTimeout(this.beginPlayback.bind(this), 500);
  }

  /**
   * Begins playback of all video on the screen, used to ensure the browser does it's job.
   * Not specific to WebRTC.
   */
  private beginPlayback() {
    var nodes = document.getElementsByTagName('video');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].play();
    }
  }



}
