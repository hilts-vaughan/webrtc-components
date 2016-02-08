var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var StreamController_1 = require('../../services/rtc_api/StreamController');
var ControllerConfiguration_1 = require('../../services/rtc_api/ControllerConfiguration');
var RoomOptions_1 = require('../../services/rtc_api/RoomOptions');
var StreamFactory_1 = require('../../services/rtc_api/StreamFactory');
var HomeCmp = (function () {
    function HomeCmp(ref) {
        this.ref = ref;
        this.chatBuffer = [];
        this.availableRooms = [];
        this.localStreams = [];
        this.state = 0;
        this.model = {
            message: "Test"
        };
        this._streamController = new StreamController_1.StreamController(new ControllerConfiguration_1.ControllerConfiguration("http://localhost:1239/", "WLU-HOPPER"));
        this.refreshRooms();
    }
    HomeCmp.prototype.askWebcam = function () {
        var self = this;
        StreamFactory_1.StreamFactory.createWebcamStream(true, true, function (stream) {
            if (stream != null) {
                self.localStreams.push(URL.createObjectURL(stream));
                self.activeStream = stream;
                self.moveToChoice();
            }
        });
    };
    HomeCmp.prototype.askScreen = function () {
        var self = this;
        StreamFactory_1.StreamFactory.createScreenStream(function (stream) {
            if (stream != null) {
                self.localStreams.push(URL.createObjectURL(stream));
                self.activeStream = stream;
                self.moveToChoice();
            }
        });
    };
    HomeCmp.prototype.moveToChoice = function () {
        this.state = 1;
        this.ref.detectChanges();
    };
    HomeCmp.prototype.refreshRooms = function () {
        var _this = this;
        var self = this;
        this._streamController.getRoomService().findRooms("", function (roomsFound) {
            self.availableRooms = roomsFound;
            _this.ref.detectChanges();
        });
    };
    HomeCmp.prototype.createRoom = function () {
        var _this = this;
        var roomName = prompt("Name of the room to create; ");
        var options = new RoomOptions_1.RoomOptions(roomName, false);
        this._streamController.getRoomService().createRoom(options, function (success) {
            if (success) {
                alert("Room created!");
            }
            else {
                alert("Failed to create room. Duplicate?");
            }
            _this.refreshRooms();
        });
    };
    HomeCmp.prototype.joinRoom = function () {
        var _this = this;
        var roomName = prompt("Name of the room to join?");
        var options = new RoomOptions_1.RoomOptions(roomName, false);
        var self = this;
        this._streamController.getRoomService().joinRoom(options, [self.activeStream], function (success, roomContext) {
            if (success) {
                self.activeRoom = roomContext;
                self.state = 2;
                self.ref.detectChanges();
                self.moveToPeers();
                setTimeout(_this.beginPlayback.bind(_this), 500);
                for (var i = 0; i < 100; i++)
                    self.chatBuffer.push("Vaughan: Hello world!");
            }
            else {
                alert("Failed to join room!");
            }
        });
    };
    HomeCmp.prototype.moveToPeers = function () {
        this.activeRoom.on('newstream', this.setupRemoteStream.bind(this));
    };
    HomeCmp.prototype.setupRemoteStream = function (event) {
        this.localStreams.push(URL.createObjectURL(event.stream));
        this.ref.detectChanges();
        setTimeout(this.beginPlayback.bind(this), 500);
    };
    HomeCmp.prototype.beginPlayback = function () {
        var nodes = document.getElementsByTagName('video');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].play();
        }
    };
    HomeCmp.prototype.sendChatMessage = function (msg) {
        alert(msg);
    };
    HomeCmp = __decorate([
        angular2_1.Component({
            selector: 'home',
            template: "\n    <div id=\"start-state\">\n\n      <div *ng-if=\"state < 2\" class=\"centered\">\n        <h1 style=\"text-align: center; margin-bottom: 32px;\">What would you like to do?</h1>\n\n        <div *ng-if=\"state == 1\" class=\"button-wrapper\">\n          <a (click)=\"joinRoom($event)\" class=\"btn\">Join Room</a>\n          <a (click)=\"createRoom($event)\" class=\"btn\">Create Room</a>\n          <a (click)=\"refreshRooms()\" class=\"btn\">Refresh Rooms</a>\n        </div>\n\n        <div *ng-if=\"state == 0\" class=\"stream-wrapper\">\n          <a (click)=\"askWebcam()\" class=\"btn\">Share Video & Audio</a>\n          <a (click)=\"askScreen()\" class=\"btn\">Share Screen</a>\n        </div>\n\n      </div>\n\n      <!--Video displays here-->\n      <div *ng-if=\"state == 2\">\n    \n       <div class=\"room-list\">\n          <h2>Chat View</h1>\n          <form>\n              <input placeholder=\"Please type a message here...\" id=\"message-box\" autocomplete=\"off\">\n              <button (click)=\"sendChatMessage(myMessage.value)\" class=\"btn\">Send Message</button>        \n          </form>\n                \n            <!--Message area-->\n            <div id=\"chat-messages-feed\">\n              <div class=\"chat-message row\" *ng-for=\"#chatMessage of chatBuffer\">\n                <b>{{chatMessage}}</b>\n                </br> \n              </div> \n          </div>             \n       </div>\n       \n        <div class=\"video-hud\" *ng-for=\"#stream of localStreams\">\n          <video class=\"video-display\" src=\"{{stream}}\" autoplay=\"true\"></video>\n        </div>\n      </div>\n\n      <div *ng-if=\"state < 2\" class=\"room-list\">\n        <h2>Available Rooms</h1>\n        <div class=\"name-container\">\n          <div *ng-for=\"#room of availableRooms\" class=\"room-name\"><a href=\"#\">{{room.roomName}}</a></div> \n        </div>\n     </div>  \n \n    </div>\n\n\n    <div id=\"chat-view\">\n      <div class=\"col-md-12\">\n        <div class=\"row\">\n          <div id=\"chat-sidebar\" class=\"col-sm-2\">\n            <ul>\n              <li *ng-for=\"#name of roomNames\">{{name}}</li>\n            </ul>\n            <form>\n              <input id=\"message-box\">\n            </form>\n                \n            <!--Message area-->\n            <div class=\"row\" *ng-for=\"#chatMessage of chatBuffer\">\n              <b>{{chatMessage}}</b>\n              </br> \n            </div>\n        \n          </div>\n          <div id=\"chat-main\" class=\"col-sm-10\">\n            <!--Video displays here-->\n            <div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    </div>\n  ",
            styles: ["\n    #start-state {\n    \tposition: absolute;\n    \theight: 100%;\n    \twidth: 100%;\n    \ttop: 0;\n    \tleft: 0;\n    \tz-index: 500;\n      background-image: url('assets/img/bg.png')  \n    }\n\n    #start-state .centered {\n     \tposition: absolute;\n        top: 50%;\n        left: 50%;\n        width: 600px;\n        height: 300px;\n        margin-top: -150px;\n        margin-left: -300px;\n   \n       background-color: rgba(0, 0, 0, 0.6);\n       border: solid 1px black;\n       border-radius: 20px; \n       border-width: 3px; \n       padding: 30px;  \n       \n    }\n\n    #start-state .room-list {\n      position: absolute;\n      top: 0;\n      left: 0;\n      height: 100%;\n      overflow: hidden;\n      width: 220px;\n      background-color: rgba(221, 160, 221, 0.11);\n      border-right: 2px solid black;\n    }\n\n\n    .name-container:nth-child(odd) {\n      background-color: rgba(0, 0, 0, 0.3);\n    }\n\n    #start-state h2 {\n      font-size: 16px;\n      text-align: center;\n    }\n\n    #start-state .room-name {\n      font-weight: bold;\n      text-align: left;\n      padding-left: 4px;\n      margin-top: 8px;\n      font-size: 14px;\n    }\n\n    #start-state .room-name a {\n      color: white;\n      text-overflow: ellipsis;  \n    }\n\n    #start-state input {\n    \tborder-radius: 3px;\n    \tfont-size: 16px;\n    }\n\n    #start-state video {\n      width: 480px;\n      float: left;\n    }\n\n    .btn {\n    \t-moz-box-shadow:inset 1px -1px 3px 0px #91b8b3;\n    \t-webkit-box-shadow:inset 1px -1px 3px 0px #91b8b3;\n    \tbox-shadow:inset 1px -1px 3px 0px #91b8b3;\n    \tbackground-color:#768d87;\n    \t-moz-border-radius:2px;\n    \t-webkit-border-radius:2px;\n    \tborder-radius:2px;\n    \tborder:1px solid #566963;\n    \tcursor:pointer;\n    \tcolor:#ffffff;\n    \tfont-family:Verdana;\n    \tfont-size:15px;\n    \tfont-weight:bold;\n    \tpadding:8px 17px;\n    \ttext-decoration:none;\n    \ttext-shadow:0px -1px 0px #2b665e;\n      padding-top: 15px;\n      text-align: center;\n      display: block;  \n      margin: 12px;\n    }\n    .btn:hover {\n    \tbackground-color:#6c7c7c;\n    }\n    .btn:active {\n    \tposition:relative;\n    \ttop:1px;\n    }\n\n    .video-hud {\n      position: absolute;\n      right: 0;\n      width: 50%;\n      float: right;\n      overflow-x: hidden;\n    }\n\n    #chat-messages-feed {\n      color: white;  \n    }\n\n    .chat-message {\n      margin: 0;\n      font-weight: bold;\n      margin-top: 10px;\n    }\n  "],
            directives: [angular2_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [angular2_1.ChangeDetectorRef])
    ], HomeCmp);
    return HomeCmp;
})();
exports.HomeCmp = HomeCmp;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaG9tZS9ob21lLnRzIl0sIm5hbWVzIjpbIkhvbWVDbXAiLCJIb21lQ21wLmNvbnN0cnVjdG9yIiwiSG9tZUNtcC5hc2tXZWJjYW0iLCJIb21lQ21wLmFza1NjcmVlbiIsIkhvbWVDbXAubW92ZVRvQ2hvaWNlIiwiSG9tZUNtcC5yZWZyZXNoUm9vbXMiLCJIb21lQ21wLmNyZWF0ZVJvb20iLCJIb21lQ21wLmpvaW5Sb29tIiwiSG9tZUNtcC5tb3ZlVG9QZWVycyIsIkhvbWVDbXAuc2V0dXBSZW1vdGVTdHJlYW0iLCJIb21lQ21wLmJlZ2luUGxheWJhY2siLCJIb21lQ21wLnNlbmRDaGF0TWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx5QkFBcUYsbUJBQW1CLENBQUMsQ0FBQTtBQUd6RyxpQ0FBK0IseUNBQy9CLENBQUMsQ0FEdUU7QUFDeEUsd0NBQXNDLGdEQUN0QyxDQUFDLENBRHFGO0FBQ3RGLDRCQUEwQixvQ0FDMUIsQ0FBQyxDQUQ2RDtBQUM5RCw4QkFBNEIsc0NBQzVCLENBQUMsQ0FEaUU7QUFHbEU7SUFnT0VBLGlCQUFtQkEsR0FBc0JBO1FBQXRCQyxRQUFHQSxHQUFIQSxHQUFHQSxDQUFtQkE7UUFqQmpDQSxlQUFVQSxHQUFrQkEsRUFBRUEsQ0FBQ0E7UUFDL0JBLG1CQUFjQSxHQUF1QkEsRUFBRUEsQ0FBQ0E7UUFDeENBLGlCQUFZQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUtsQkEsVUFBS0EsR0FBV0EsQ0FBQ0EsQ0FBQ0E7UUFFbEJBLFVBQUtBLEdBQUdBO1lBQ2RBLE9BQU9BLEVBQUVBLE1BQU1BO1NBQ2hCQSxDQUFBQTtRQUlPQSxzQkFBaUJBLEdBQXFCQSxJQUFJQSxtQ0FBZ0JBLENBQUNBLElBQUlBLGlEQUF1QkEsQ0FBQ0Esd0JBQXdCQSxFQUFFQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUl0SUEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7SUFDdEJBLENBQUNBO0lBS09ELDJCQUFT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O1NBQzlCQSxDQUFDQTs7Z0JBZ0pEQTtJQUFEQSxjQUFDQTtBQUFEQSxDQTVWQSxBQTRWQ0EsSUFBQTtBQS9JWSxlQUFPLFVBK0luQixDQUFBIiwiZmlsZSI6ImNvbXBvbmVudHMvaG9tZS9ob21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIENPUkVfRElSRUNUSVZFUywgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmfSBmcm9tICdhbmd1bGFyMi9hbmd1bGFyMic7XG5cbi8vIFdlYlJUQyBjb3JlIGRpcmVjdGl2ZXNcbmltcG9ydCB7U3RyZWFtQ29udHJvbGxlcn0gZnJvbSAnLi4vLi4vc2VydmljZXMvcnRjX2FwaS9TdHJlYW1Db250cm9sbGVyJ1xuaW1wb3J0IHtDb250cm9sbGVyQ29uZmlndXJhdGlvbn0gZnJvbSAnLi4vLi4vc2VydmljZXMvcnRjX2FwaS9Db250cm9sbGVyQ29uZmlndXJhdGlvbidcbmltcG9ydCB7Um9vbU9wdGlvbnN9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3J0Y19hcGkvUm9vbU9wdGlvbnMnXG5pbXBvcnQge1N0cmVhbUZhY3Rvcnl9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3J0Y19hcGkvU3RyZWFtRmFjdG9yeSdcbmltcG9ydCB7U3RyZWFtUm9vbX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcnRjX2FwaS9TdHJlYW1Sb29tJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdob21lJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGlkPVwic3RhcnQtc3RhdGVcIj5cblxuICAgICAgPGRpdiAqbmctaWY9XCJzdGF0ZSA8IDJcIiBjbGFzcz1cImNlbnRlcmVkXCI+XG4gICAgICAgIDxoMSBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjsgbWFyZ2luLWJvdHRvbTogMzJweDtcIj5XaGF0IHdvdWxkIHlvdSBsaWtlIHRvIGRvPzwvaDE+XG5cbiAgICAgICAgPGRpdiAqbmctaWY9XCJzdGF0ZSA9PSAxXCIgY2xhc3M9XCJidXR0b24td3JhcHBlclwiPlxuICAgICAgICAgIDxhIChjbGljayk9XCJqb2luUm9vbSgkZXZlbnQpXCIgY2xhc3M9XCJidG5cIj5Kb2luIFJvb208L2E+XG4gICAgICAgICAgPGEgKGNsaWNrKT1cImNyZWF0ZVJvb20oJGV2ZW50KVwiIGNsYXNzPVwiYnRuXCI+Q3JlYXRlIFJvb208L2E+XG4gICAgICAgICAgPGEgKGNsaWNrKT1cInJlZnJlc2hSb29tcygpXCIgY2xhc3M9XCJidG5cIj5SZWZyZXNoIFJvb21zPC9hPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2ICpuZy1pZj1cInN0YXRlID09IDBcIiBjbGFzcz1cInN0cmVhbS13cmFwcGVyXCI+XG4gICAgICAgICAgPGEgKGNsaWNrKT1cImFza1dlYmNhbSgpXCIgY2xhc3M9XCJidG5cIj5TaGFyZSBWaWRlbyAmIEF1ZGlvPC9hPlxuICAgICAgICAgIDxhIChjbGljayk9XCJhc2tTY3JlZW4oKVwiIGNsYXNzPVwiYnRuXCI+U2hhcmUgU2NyZWVuPC9hPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG5cbiAgICAgIDwhLS1WaWRlbyBkaXNwbGF5cyBoZXJlLS0+XG4gICAgICA8ZGl2ICpuZy1pZj1cInN0YXRlID09IDJcIj5cbiAgICBcbiAgICAgICA8ZGl2IGNsYXNzPVwicm9vbS1saXN0XCI+XG4gICAgICAgICAgPGgyPkNoYXQgVmlldzwvaDE+XG4gICAgICAgICAgPGZvcm0+XG4gICAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cIlBsZWFzZSB0eXBlIGEgbWVzc2FnZSBoZXJlLi4uXCIgaWQ9XCJtZXNzYWdlLWJveFwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIChjbGljayk9XCJzZW5kQ2hhdE1lc3NhZ2UobXlNZXNzYWdlLnZhbHVlKVwiIGNsYXNzPVwiYnRuXCI+U2VuZCBNZXNzYWdlPC9idXR0b24+ICAgICAgICBcbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICA8IS0tTWVzc2FnZSBhcmVhLS0+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2hhdC1tZXNzYWdlcy1mZWVkXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0LW1lc3NhZ2Ugcm93XCIgKm5nLWZvcj1cIiNjaGF0TWVzc2FnZSBvZiBjaGF0QnVmZmVyXCI+XG4gICAgICAgICAgICAgICAgPGI+e3tjaGF0TWVzc2FnZX19PC9iPlxuICAgICAgICAgICAgICAgIDwvYnI+IFxuICAgICAgICAgICAgICA8L2Rpdj4gXG4gICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgIFxuICAgICAgIDwvZGl2PlxuICAgICAgIFxuICAgICAgICA8ZGl2IGNsYXNzPVwidmlkZW8taHVkXCIgKm5nLWZvcj1cIiNzdHJlYW0gb2YgbG9jYWxTdHJlYW1zXCI+XG4gICAgICAgICAgPHZpZGVvIGNsYXNzPVwidmlkZW8tZGlzcGxheVwiIHNyYz1cInt7c3RyZWFtfX1cIiBhdXRvcGxheT1cInRydWVcIj48L3ZpZGVvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2ICpuZy1pZj1cInN0YXRlIDwgMlwiIGNsYXNzPVwicm9vbS1saXN0XCI+XG4gICAgICAgIDxoMj5BdmFpbGFibGUgUm9vbXM8L2gxPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmFtZS1jb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2ICpuZy1mb3I9XCIjcm9vbSBvZiBhdmFpbGFibGVSb29tc1wiIGNsYXNzPVwicm9vbS1uYW1lXCI+PGEgaHJlZj1cIiNcIj57e3Jvb20ucm9vbU5hbWV9fTwvYT48L2Rpdj4gXG4gICAgICAgIDwvZGl2PlxuICAgICA8L2Rpdj4gIFxuIFxuICAgIDwvZGl2PlxuXG5cbiAgICA8ZGl2IGlkPVwiY2hhdC12aWV3XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGlkPVwiY2hhdC1zaWRlYmFyXCIgY2xhc3M9XCJjb2wtc20tMlwiPlxuICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICA8bGkgKm5nLWZvcj1cIiNuYW1lIG9mIHJvb21OYW1lc1wiPnt7bmFtZX19PC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgICAgPGlucHV0IGlkPVwibWVzc2FnZS1ib3hcIj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIDwhLS1NZXNzYWdlIGFyZWEtLT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiAqbmctZm9yPVwiI2NoYXRNZXNzYWdlIG9mIGNoYXRCdWZmZXJcIj5cbiAgICAgICAgICAgICAgPGI+e3tjaGF0TWVzc2FnZX19PC9iPlxuICAgICAgICAgICAgICA8L2JyPiBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwiY2hhdC1tYWluXCIgY2xhc3M9XCJjb2wtc20tMTBcIj5cbiAgICAgICAgICAgIDwhLS1WaWRlbyBkaXNwbGF5cyBoZXJlLS0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICAjc3RhcnQtc3RhdGUge1xuICAgIFx0cG9zaXRpb246IGFic29sdXRlO1xuICAgIFx0aGVpZ2h0OiAxMDAlO1xuICAgIFx0d2lkdGg6IDEwMCU7XG4gICAgXHR0b3A6IDA7XG4gICAgXHRsZWZ0OiAwO1xuICAgIFx0ei1pbmRleDogNTAwO1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCdhc3NldHMvaW1nL2JnLnBuZycpICBcbiAgICB9XG5cbiAgICAjc3RhcnQtc3RhdGUgLmNlbnRlcmVkIHtcbiAgICAgXHRwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHRvcDogNTAlO1xuICAgICAgICBsZWZ0OiA1MCU7XG4gICAgICAgIHdpZHRoOiA2MDBweDtcbiAgICAgICAgaGVpZ2h0OiAzMDBweDtcbiAgICAgICAgbWFyZ2luLXRvcDogLTE1MHB4O1xuICAgICAgICBtYXJnaW4tbGVmdDogLTMwMHB4O1xuICAgXG4gICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjYpO1xuICAgICAgIGJvcmRlcjogc29saWQgMXB4IGJsYWNrO1xuICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7IFxuICAgICAgIGJvcmRlci13aWR0aDogM3B4OyBcbiAgICAgICBwYWRkaW5nOiAzMHB4OyAgXG4gICAgICAgXG4gICAgfVxuXG4gICAgI3N0YXJ0LXN0YXRlIC5yb29tLWxpc3Qge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAwO1xuICAgICAgbGVmdDogMDtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICB3aWR0aDogMjIwcHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIyMSwgMTYwLCAyMjEsIDAuMTEpO1xuICAgICAgYm9yZGVyLXJpZ2h0OiAycHggc29saWQgYmxhY2s7XG4gICAgfVxuXG5cbiAgICAubmFtZS1jb250YWluZXI6bnRoLWNoaWxkKG9kZCkge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjMpO1xuICAgIH1cblxuICAgICNzdGFydC1zdGF0ZSBoMiB7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgI3N0YXJ0LXN0YXRlIC5yb29tLW5hbWUge1xuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgcGFkZGluZy1sZWZ0OiA0cHg7XG4gICAgICBtYXJnaW4tdG9wOiA4cHg7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgfVxuXG4gICAgI3N0YXJ0LXN0YXRlIC5yb29tLW5hbWUgYSB7XG4gICAgICBjb2xvcjogd2hpdGU7XG4gICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpczsgIFxuICAgIH1cblxuICAgICNzdGFydC1zdGF0ZSBpbnB1dCB7XG4gICAgXHRib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgXHRmb250LXNpemU6IDE2cHg7XG4gICAgfVxuXG4gICAgI3N0YXJ0LXN0YXRlIHZpZGVvIHtcbiAgICAgIHdpZHRoOiA0ODBweDtcbiAgICAgIGZsb2F0OiBsZWZ0O1xuICAgIH1cblxuICAgIC5idG4ge1xuICAgIFx0LW1vei1ib3gtc2hhZG93Omluc2V0IDFweCAtMXB4IDNweCAwcHggIzkxYjhiMztcbiAgICBcdC13ZWJraXQtYm94LXNoYWRvdzppbnNldCAxcHggLTFweCAzcHggMHB4ICM5MWI4YjM7XG4gICAgXHRib3gtc2hhZG93Omluc2V0IDFweCAtMXB4IDNweCAwcHggIzkxYjhiMztcbiAgICBcdGJhY2tncm91bmQtY29sb3I6Izc2OGQ4NztcbiAgICBcdC1tb3otYm9yZGVyLXJhZGl1czoycHg7XG4gICAgXHQtd2Via2l0LWJvcmRlci1yYWRpdXM6MnB4O1xuICAgIFx0Ym9yZGVyLXJhZGl1czoycHg7XG4gICAgXHRib3JkZXI6MXB4IHNvbGlkICM1NjY5NjM7XG4gICAgXHRjdXJzb3I6cG9pbnRlcjtcbiAgICBcdGNvbG9yOiNmZmZmZmY7XG4gICAgXHRmb250LWZhbWlseTpWZXJkYW5hO1xuICAgIFx0Zm9udC1zaXplOjE1cHg7XG4gICAgXHRmb250LXdlaWdodDpib2xkO1xuICAgIFx0cGFkZGluZzo4cHggMTdweDtcbiAgICBcdHRleHQtZGVjb3JhdGlvbjpub25lO1xuICAgIFx0dGV4dC1zaGFkb3c6MHB4IC0xcHggMHB4ICMyYjY2NWU7XG4gICAgICBwYWRkaW5nLXRvcDogMTVweDtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIGRpc3BsYXk6IGJsb2NrOyAgXG4gICAgICBtYXJnaW46IDEycHg7XG4gICAgfVxuICAgIC5idG46aG92ZXIge1xuICAgIFx0YmFja2dyb3VuZC1jb2xvcjojNmM3YzdjO1xuICAgIH1cbiAgICAuYnRuOmFjdGl2ZSB7XG4gICAgXHRwb3NpdGlvbjpyZWxhdGl2ZTtcbiAgICBcdHRvcDoxcHg7XG4gICAgfVxuXG4gICAgLnZpZGVvLWh1ZCB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICByaWdodDogMDtcbiAgICAgIHdpZHRoOiA1MCU7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gICAgfVxuXG4gICAgI2NoYXQtbWVzc2FnZXMtZmVlZCB7XG4gICAgICBjb2xvcjogd2hpdGU7ICBcbiAgICB9XG5cbiAgICAuY2hhdC1tZXNzYWdlIHtcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICB9XG4gIGBdLFxuICBkaXJlY3RpdmVzOiBbQ09SRV9ESVJFQ1RJVkVTXVxufSlcbmV4cG9ydCBjbGFzcyBIb21lQ21wIHtcblxuICBwcml2YXRlIGNoYXRCdWZmZXI6IEFycmF5PFN0cmluZz4gPSBbXTtcbiAgcHJpdmF0ZSBhdmFpbGFibGVSb29tczogQXJyYXk8Um9vbU9wdGlvbnM+ID0gW107XG4gIHByaXZhdGUgbG9jYWxTdHJlYW1zID0gW107XG4gIHByaXZhdGUgYWN0aXZlU3RyZWFtIDogTWVkaWFTdHJlYW07XG4gIHByaXZhdGUgYWN0aXZlUm9vbTogU3RyZWFtUm9vbTtcbiAgXG4gIC8vIFBvb3IgbWFuJ3Mgc3RhdGUgbWFjaGluZTsgXG4gIHByaXZhdGUgc3RhdGU6IG51bWJlciA9IDA7XG4gXG4gIHByaXZhdGUgbW9kZWwgPSB7XG4gICAgbWVzc2FnZTogXCJUZXN0XCJcbiAgfVxuICBcbiAgLy8gV2UgbmVlZCBhIHN0cmVhbSBjb250cm9sbGVyIHRvIGJvb3RzdHJhcCB0aGUgcHJvY2Vzcy4gVGhlIGNvbnRleHQga2V5IGlzIGEgdW5pcXVlIHNlc3Npb24ga2V5IHRoYXQgaXNvbGF0ZXMgdGhlIHByb2Nlc3MgZnJvbSBvdGhlciB1c2Vycy5cbiAgLy8gSWYgeW91IGFyZSBqdXN0IGV4cGVyaW1lbnRpbmcsIHVzaW5nIHRoZSBkZWZhdWx0IGNvbnRleHQga2V5IGlzIGZpbmUuXG4gIHByaXZhdGUgX3N0cmVhbUNvbnRyb2xsZXI6IFN0cmVhbUNvbnRyb2xsZXIgPSBuZXcgU3RyZWFtQ29udHJvbGxlcihuZXcgQ29udHJvbGxlckNvbmZpZ3VyYXRpb24oXCJodHRwOi8vbG9jYWxob3N0OjEyMzkvXCIsIFwiV0xVLUhPUFBFUlwiKSk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAvLyBOT1RFOiBBbmd1bGFySlMgY2hhbmdlIGRldGVjdG9yOyBhbGxvd3MgdXMgdG8gdGFrZSBvdmVyIHRoZSBVSS4gSXQncyBpbmplY3RlZCB2aWEgcmVmOyBubyByZWxhdGVkIHRvIHRoZSBXZWJSVENcbiAgICB0aGlzLnJlZnJlc2hSb29tcygpOyAgLy8gaW5pdGlhbCByZWZyZXNoXG4gIH1cbiAgXG4gIC8qKlxuICAgKiBGZXRjaCBzdHJlYW1zIHdlIHdhbnQgdG8gdXNlIGhlcmU7IGFzayB1c2VyIGFib3V0IHdoaWNoIHRvIHVzZVxuICAgKi9cbiAgcHJpdmF0ZSBhc2tXZWJjYW0oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFN0cmVhbUZhY3RvcnkuY3JlYXRlV2ViY2FtU3RyZWFtKHRydWUsIHRydWUsIChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB7XG4gICAgICBpZiAoc3RyZWFtICE9IG51bGwpIHtcbiAgICAgICAgc2VsZi5sb2NhbFN0cmVhbXMucHVzaChVUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSkpO1xuICAgICAgICBzZWxmLmFjdGl2ZVN0cmVhbSA9IHN0cmVhbTtcbiAgICAgICAgc2VsZi5tb3ZlVG9DaG9pY2UoKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSBhc2tTY3JlZW4oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFN0cmVhbUZhY3RvcnkuY3JlYXRlU2NyZWVuU3RyZWFtKChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB7XG4gICAgICBpZiAoc3RyZWFtICE9IG51bGwpIHtcbiAgICAgICAgc2VsZi5sb2NhbFN0cmVhbXMucHVzaChVUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSkpO1xuICAgICAgICBzZWxmLmFjdGl2ZVN0cmVhbSA9IHN0cmVhbTtcbiAgICAgICAgc2VsZi5tb3ZlVG9DaG9pY2UoKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIFxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCBmb3IgbW92aW5nIG9udG8gam9pbiByb29tIC8gY3JlYXRlIHJvb20gc3RhdGVcbiAgICovXG4gIHByaXZhdGUgbW92ZVRvQ2hvaWNlKCkge1xuICAgIHRoaXMuc3RhdGUgPSAxO1xuICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuICBcbiAgXG4gIC8qKlxuICAgKiBTZWxlY3Rpb24gb2Ygd2hhdCB0byBkbywgbW92aW5nIGFsb25nIG5vd1xuICAgKi9cblxuICBwcml2YXRlIHJlZnJlc2hSb29tcygpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fc3RyZWFtQ29udHJvbGxlci5nZXRSb29tU2VydmljZSgpLmZpbmRSb29tcyhcIlwiLCAocm9vbXNGb3VuZDogQXJyYXk8Um9vbU9wdGlvbnM+KSA9PiB7XG4gICAgICBzZWxmLmF2YWlsYWJsZVJvb21zID0gcm9vbXNGb3VuZDtcbiAgICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTsgLy8gRm9yY2UgZGlzcGxheSB1cGRhdGUgICAgXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVJvb20oKSB7XG4gICAgdmFyIHJvb21OYW1lOiBzdHJpbmcgPSBwcm9tcHQoXCJOYW1lIG9mIHRoZSByb29tIHRvIGNyZWF0ZTsgXCIpO1xuICAgIHZhciBvcHRpb25zOiBSb29tT3B0aW9ucyA9IG5ldyBSb29tT3B0aW9ucyhyb29tTmFtZSwgZmFsc2UpO1xuICAgIHRoaXMuX3N0cmVhbUNvbnRyb2xsZXIuZ2V0Um9vbVNlcnZpY2UoKS5jcmVhdGVSb29tKG9wdGlvbnMsIChzdWNjZXNzKSA9PiB7XG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBhbGVydChcIlJvb20gY3JlYXRlZCFcIik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJGYWlsZWQgdG8gY3JlYXRlIHJvb20uIER1cGxpY2F0ZT9cIik7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZnJlc2ggYW55d2F5OyBzaG93IGR1cGxpY2F0ZXNcbiAgICAgIHRoaXMucmVmcmVzaFJvb21zKCk7ICBcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgam9pblJvb20oKSB7XG4gICAgdmFyIHJvb21OYW1lOiBzdHJpbmcgPSBwcm9tcHQoXCJOYW1lIG9mIHRoZSByb29tIHRvIGpvaW4/XCIpO1xuICAgIHZhciBvcHRpb25zOiBSb29tT3B0aW9ucyA9IG5ldyBSb29tT3B0aW9ucyhyb29tTmFtZSwgZmFsc2UpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLl9zdHJlYW1Db250cm9sbGVyLmdldFJvb21TZXJ2aWNlKCkuam9pblJvb20ob3B0aW9ucywgW3NlbGYuYWN0aXZlU3RyZWFtXSwgKHN1Y2Nlc3M6IGJvb2xlYW4sIHJvb21Db250ZXh0OiBTdHJlYW1Sb29tKSA9PiB7XG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBzZWxmLmFjdGl2ZVJvb20gPSByb29tQ29udGV4dDtcbiAgICAgICAgc2VsZi5zdGF0ZSA9IDI7XG4gICAgICAgIHNlbGYucmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgc2VsZi5tb3ZlVG9QZWVycygpO1xuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYmVnaW5QbGF5YmFjay5iaW5kKHRoaXMpLCA1MDApOyAvLyBtb3ZlIHRvIHRoZSBuZXh0IHN0YXRlIGFuZCBiZWdpbiBwbGF5YmFjayBzaG9ydGx5XG4gICAgICAgIFxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgMTAwOyBpKyspXG4gICAgICAgICAgc2VsZi5jaGF0QnVmZmVyLnB1c2goXCJWYXVnaGFuOiBIZWxsbyB3b3JsZCFcIik7XG4gICAgICAgIFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJGYWlsZWQgdG8gam9pbiByb29tIVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIFdlJ3JlIGluc2lkZSBhIHJvb20hIExldCdzIGRvIHNvbWV0aGluZy4uLlxuICAgKi9cblxuICBwcml2YXRlIG1vdmVUb1BlZXJzKCkge1xuICAgIHRoaXMuYWN0aXZlUm9vbS5vbignbmV3c3RyZWFtJywgdGhpcy5zZXR1cFJlbW90ZVN0cmVhbS5iaW5kKHRoaXMpKTtcbiAgICAvLyB0aGlzLmFjdGl2ZVJvb20ub24oJ2RhdGEnLCB0aGlzLmRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXNoIHVwIGEgbmV3IHJlbW90ZSBzdHJlYW0gaW50byB0aGUgYXBwbGljYXRpb24gc3RyZWFtLlxuICAgKi9cbiAgcHJpdmF0ZSBzZXR1cFJlbW90ZVN0cmVhbShldmVudDogYW55KSB7XG4gICAgdGhpcy5sb2NhbFN0cmVhbXMucHVzaChVUkwuY3JlYXRlT2JqZWN0VVJMKGV2ZW50LnN0cmVhbSkpO1xuICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTsgXG4gICAgc2V0VGltZW91dCh0aGlzLmJlZ2luUGxheWJhY2suYmluZCh0aGlzKSwgNTAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCZWdpbnMgcGxheWJhY2sgb2YgYWxsIHZpZGVvIG9uIHRoZSBzY3JlZW4sIHVzZWQgdG8gZW5zdXJlIHRoZSBicm93c2VyIGRvZXMgaXQncyBqb2IuXG4gICAqIE5vdCBzcGVjaWZpYyB0byBXZWJSVEMuXG4gICAqL1xuICBwcml2YXRlIGJlZ2luUGxheWJhY2soKSB7XG4gICAgdmFyIG5vZGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3ZpZGVvJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbm9kZXNbaV0ucGxheSgpO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gQ2hhdCBzdHVmZlxuICBwcml2YXRlIHNlbmRDaGF0TWVzc2FnZShtc2cgOiBzdHJpbmcpIHtcbiAgICBhbGVydChtc2cpO1xuICB9XG5cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9