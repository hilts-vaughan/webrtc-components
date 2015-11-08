import {Component, CORE_DIRECTIVES, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/angular2';

import {NameList} from '../../services/name_list';
import {StreamList} from '../../services/StreamList';

import {VideoStream} from '../../services/VideoStream';
import {RtcRoom} from '../../services/RtcRoom';

@Component({
  selector: 'about',
  templateUrl: './components/rooms/rooms.html',
  directives: [CORE_DIRECTIVES]
})

export class RoomCmp {

  private textMessage = "Anonymous Llama";
  private _myStream: VideoStream;
  private _currentRoom: RtcRoom;
  private _mediaStream: MediaStream;
  public activeStreams = [];
  
  // Stores a buffer of chat messages to log out
  public chatBuffer = [];
  
  constructor(public list: NameList, public streams: StreamList, public ref: ChangeDetectorRef) {
    this._myStream = new VideoStream();
    this._myStream.getStream(true, false, function(s) {
      this._mediaStream = s;
    }.bind(this))
  }

  private createRoom() {
    RtcRoom.createRoom("x", (roomName, userId) => {
      alert("Success! Call taken; server has generated room name of " + roomName);
      console.log(roomName);
      console.log(userId);
    });
  }

  private joinRoom() {
    var roomName = window.prompt("Enter room name", "");
    this._currentRoom = new RtcRoom(this._mediaStream, roomName);
    this._currentRoom.join(() => {
      this._currentRoom.on('newstream', this.setupRemoteStream.bind(this));
      this._currentRoom.on('data', this.dataReceived.bind(this));
      this.setupLocalStream(); // setup our local stream
    });
  }
  
  private sendMessage($event) {
    if(this._currentRoom != null) {
      var box  = <HTMLInputElement><any>(document.getElementById("message-box"));
      var text : string = box.value;
      this._currentRoom.sendMessage(text);
      box.value = "";
    }
  }
  
  private dataReceived(data : string) {
    this.chatBuffer.push(data);
    this.ref.markForCheck();
    this.ref.detectChanges(); // async hax    
  }
  setupRemoteStream(event: any) {
    console.log(event);
    this.activeStreams.push(URL.createObjectURL(event.stream));
    this.ref.markForCheck();
    this.ref.detectChanges(); // async hax
    setTimeout(this.beginPlayback.bind(this), 1000);    
  }

  private setupLocalStream() {
    this.activeStreams.push(URL.createObjectURL(this._mediaStream));
    this.ref.markForCheck();
    this.ref.detectChanges(); // async hax
    setTimeout(this.beginPlayback.bind(this), 1000);
  }
  
  private beginPlayback() {
      var nodes = document.getElementsByTagName('video');
      for(var i = 0; i < nodes.length; i++) {
          nodes[i].play();
      }
  }
  
  /*
  * @param newname  any text as input.
  * @returns return false to prevent default form submit behavior to refresh the page.
  */
  addName(newname): boolean {
    this.list.add(newname.value);
    newname.value = '';
    return false;
  }
}
