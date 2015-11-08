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

  name = "Harley";
  private _myStream: VideoStream;
  private _currentRoom: RtcRoom;
  public activeStreams = [];

  constructor(public list: NameList, public streams: StreamList, public ref: ChangeDetectorRef) {
    this._myStream = new VideoStream();
    this._myStream.getStream(true, true, function(s) {
      this._mediaStream = s;
      this._currentRoom = new RtcRoom(s);
      this._currentRoom.join();

      this._currentRoom.on('newstream', this.setupRemoteStream.bind(this));

    }.bind(this))
  }

  setupRemoteStream(event: any) {
    console.log(event);
    this.activeStreams.push(URL.createObjectURL(event.stream));
    console.log(this.streams); 
    this.name = "Vaugan";
    this.ref.markForCheck();
    this.ref.detectChanges(); // async hax
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
