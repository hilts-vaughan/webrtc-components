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
var RoomOptions_1 = require('../../services/rtc_api/RoomOptions');
var StreamFactory_1 = require('../../services/rtc_api/StreamFactory');
var HomeCmp = (function () {
    function HomeCmp(ref) {
        var _this = this;
        this.ref = ref;
        this.chatBuffer = [];
        this.availableRooms = [];
        this.availableUsers = [];
        this.localStreams = [];
        this.state = 0;
        this.model = {
            message: "Test"
        };
        this._streamController = window['instanceStream'];
        this.refreshRooms();
        this._streamController.getRoomService().socket.on('availableUsers', function (data) {
            _this.availableUsers = data;
            _this.ref.detectChanges();
        });
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
                setTimeout(_this.beginPlayback.bind(_this), 1500);
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
        setTimeout(this.beginPlayback.bind(this), 1500);
    };
    HomeCmp.prototype.beginPlayback = function () {
        var nodes = document.getElementsByTagName('video');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].play();
        }
    };
    HomeCmp.prototype.sendChatMessage = function (msg) {
        this.chatBuffer.push(msg);
        this.ref.detectChanges();
    };
    HomeCmp = __decorate([
        angular2_1.Component({
            selector: 'home',
            template: "\n    <div *ng-if=\"state < 2\" class=\"centered\">\n        <h1 style=\"text-align: center; margin-bottom: 32px;\">What would you like to do?</h1>\n\n        <div *ng-if=\"state == 1\" class=\"button-wrapper\">\n          <a (click)=\"joinRoom($event)\" class=\"btn\">Join Room</a>\n          <a (click)=\"createRoom($event)\" class=\"btn\">Create Room</a>\n          <a (click)=\"refreshRooms()\" class=\"btn\">Refresh Rooms</a>\n        </div>\n\n        <div *ng-if=\"state == 0\" class=\"stream-wrapper\">\n          <a (click)=\"askWebcam()\" class=\"btn\">Share Video & Audio</a>\n          <a (click)=\"askScreen()\" class=\"btn\">Share Screen</a>\n        </div>\n\n      </div>\n\n      <!--Video displays here-->\n      <div *ng-if=\"state == 2\">\n\n       <div class=\"room-list\">\n          <h2>Chat View</h1>\n          <form>\n              <input placeholder=\"Please type a message here...\" id=\"message-box\" autocomplete=\"off\">\n              <button (click)=\"sendChatMessage(myMessage.value)\" class=\"btn\">Send Message</button>\n          </form>\n\n            <!--Message area-->\n            <div id=\"chat-messages-feed\">\n              <div class=\"chat-message row\" *ng-for=\"#chatMessage of chatBuffer\">\n                <b>{{chatMessage}}</b>\n                </br>\n              </div>\n          </div>\n       </div>\n\n        <div class=\"video-hud\">\n          <div class=\"video-row\" *ng-for=\"#stream of localStreams\">\n           <video class=\"video-display\" src=\"{{stream}}\" autoplay=\"true\"></video>\n          </div>\n        </div>\n      </div>\n\n      <div *ng-if=\"state < 2\" class=\"room-list\">\n        <h2>Available Rooms</h1>\n        <div class=\"name-container\">\n          <div *ng-for=\"#room of availableRooms\" class=\"room-name\"><a href=\"#\">{{room.roomName}}</a></div>\n        </div>\n\n        <h2>Online Users</h1>\n        <div class=\"name-container\">\n          <div *ng-for=\"#user of availableUsers\" class=\"room-name\">\n            <img class=\"avatar left\" src=\"https://api.adorable.io/avatars/280/{{user.name}}%40adorable.io\" alt=\"{{user.name}}\">\n          </div>\n        </div>\n\n     </div>\n\n    </div>\n  ",
            styles: ["\n\n  "],
            directives: [angular2_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [angular2_1.ChangeDetectorRef])
    ], HomeCmp);
    return HomeCmp;
})();
exports.HomeCmp = HomeCmp;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaG9tZS9ob21lLnRzIl0sIm5hbWVzIjpbIkhvbWVDbXAiLCJIb21lQ21wLmNvbnN0cnVjdG9yIiwiSG9tZUNtcC5hc2tXZWJjYW0iLCJIb21lQ21wLmFza1NjcmVlbiIsIkhvbWVDbXAubW92ZVRvQ2hvaWNlIiwiSG9tZUNtcC5yZWZyZXNoUm9vbXMiLCJIb21lQ21wLmNyZWF0ZVJvb20iLCJIb21lQ21wLmpvaW5Sb29tIiwiSG9tZUNtcC5tb3ZlVG9QZWVycyIsIkhvbWVDbXAuc2V0dXBSZW1vdGVTdHJlYW0iLCJIb21lQ21wLmJlZ2luUGxheWJhY2siLCJIb21lQ21wLnNlbmRDaGF0TWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx5QkFBcUYsbUJBQW1CLENBQUMsQ0FBQTtBQUt6Ryw0QkFBMEIsb0NBQzFCLENBQUMsQ0FENkQ7QUFDOUQsOEJBQTRCLHNDQUM1QixDQUFDLENBRGlFO0FBR2xFO0lBd0ZFQSxpQkFBbUJBLEdBQXNCQTtRQXhGM0NDLGlCQTJOQ0E7UUFuSW9CQSxRQUFHQSxHQUFIQSxHQUFHQSxDQUFtQkE7UUFuQmpDQSxlQUFVQSxHQUFrQkEsRUFBRUEsQ0FBQ0E7UUFDL0JBLG1CQUFjQSxHQUF1QkEsRUFBRUEsQ0FBQ0E7UUFDeENBLG1CQUFjQSxHQUFnQkEsRUFBRUEsQ0FBQ0E7UUFFakNBLGlCQUFZQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUtsQkEsVUFBS0EsR0FBV0EsQ0FBQ0EsQ0FBQ0E7UUFFbEJBLFVBQUtBLEdBQUdBO1lBQ2RBLE9BQU9BLEVBQUVBLE1BQU1BO1NBQ2hCQSxDQUFBQTtRQUlPQSxzQkFBaUJBLEdBQXFCQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO1FBSXJFQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUVwQkEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxnQkFBZ0JB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TUFBTUEsRUFBRUEsQ0FBQ0EsUUFFUkEsQ0FBQ0E7WUFDRkEsVUFBVUEsRUFBRUEsQ0FBQ0EsMEJBQWVBLENBQUNBO1NBQzlCQSxDQUFDQTs7Z0JBeUpEQTtJQUFEQSxjQUFDQTtBQUFEQSxDQTNOQSxBQTJOQ0EsSUFBQTtBQXhKWSxlQUFPLFVBd0puQixDQUFBIiwiZmlsZSI6ImNvbXBvbmVudHMvaG9tZS9ob21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIENPUkVfRElSRUNUSVZFUywgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmfSBmcm9tICdhbmd1bGFyMi9hbmd1bGFyMic7XG5cbi8vIFdlYlJUQyBjb3JlIGRpcmVjdGl2ZXNcbmltcG9ydCB7U3RyZWFtQ29udHJvbGxlcn0gZnJvbSAnLi4vLi4vc2VydmljZXMvcnRjX2FwaS9TdHJlYW1Db250cm9sbGVyJ1xuaW1wb3J0IHtDb250cm9sbGVyQ29uZmlndXJhdGlvbn0gZnJvbSAnLi4vLi4vc2VydmljZXMvcnRjX2FwaS9Db250cm9sbGVyQ29uZmlndXJhdGlvbidcbmltcG9ydCB7Um9vbU9wdGlvbnN9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3J0Y19hcGkvUm9vbU9wdGlvbnMnXG5pbXBvcnQge1N0cmVhbUZhY3Rvcnl9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3J0Y19hcGkvU3RyZWFtRmFjdG9yeSdcbmltcG9ydCB7U3RyZWFtUm9vbX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcnRjX2FwaS9TdHJlYW1Sb29tJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdob21lJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZy1pZj1cInN0YXRlIDwgMlwiIGNsYXNzPVwiY2VudGVyZWRcIj5cbiAgICAgICAgPGgxIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyOyBtYXJnaW4tYm90dG9tOiAzMnB4O1wiPldoYXQgd291bGQgeW91IGxpa2UgdG8gZG8/PC9oMT5cblxuICAgICAgICA8ZGl2ICpuZy1pZj1cInN0YXRlID09IDFcIiBjbGFzcz1cImJ1dHRvbi13cmFwcGVyXCI+XG4gICAgICAgICAgPGEgKGNsaWNrKT1cImpvaW5Sb29tKCRldmVudClcIiBjbGFzcz1cImJ0blwiPkpvaW4gUm9vbTwvYT5cbiAgICAgICAgICA8YSAoY2xpY2spPVwiY3JlYXRlUm9vbSgkZXZlbnQpXCIgY2xhc3M9XCJidG5cIj5DcmVhdGUgUm9vbTwvYT5cbiAgICAgICAgICA8YSAoY2xpY2spPVwicmVmcmVzaFJvb21zKClcIiBjbGFzcz1cImJ0blwiPlJlZnJlc2ggUm9vbXM8L2E+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgKm5nLWlmPVwic3RhdGUgPT0gMFwiIGNsYXNzPVwic3RyZWFtLXdyYXBwZXJcIj5cbiAgICAgICAgICA8YSAoY2xpY2spPVwiYXNrV2ViY2FtKClcIiBjbGFzcz1cImJ0blwiPlNoYXJlIFZpZGVvICYgQXVkaW88L2E+XG4gICAgICAgICAgPGEgKGNsaWNrKT1cImFza1NjcmVlbigpXCIgY2xhc3M9XCJidG5cIj5TaGFyZSBTY3JlZW48L2E+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLVZpZGVvIGRpc3BsYXlzIGhlcmUtLT5cbiAgICAgIDxkaXYgKm5nLWlmPVwic3RhdGUgPT0gMlwiPlxuXG4gICAgICAgPGRpdiBjbGFzcz1cInJvb20tbGlzdFwiPlxuICAgICAgICAgIDxoMj5DaGF0IFZpZXc8L2gxPlxuICAgICAgICAgIDxmb3JtPlxuICAgICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJQbGVhc2UgdHlwZSBhIG1lc3NhZ2UgaGVyZS4uLlwiIGlkPVwibWVzc2FnZS1ib3hcIiBhdXRvY29tcGxldGU9XCJvZmZcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiAoY2xpY2spPVwic2VuZENoYXRNZXNzYWdlKG15TWVzc2FnZS52YWx1ZSlcIiBjbGFzcz1cImJ0blwiPlNlbmQgTWVzc2FnZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZm9ybT5cblxuICAgICAgICAgICAgPCEtLU1lc3NhZ2UgYXJlYS0tPlxuICAgICAgICAgICAgPGRpdiBpZD1cImNoYXQtbWVzc2FnZXMtZmVlZFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdC1tZXNzYWdlIHJvd1wiICpuZy1mb3I9XCIjY2hhdE1lc3NhZ2Ugb2YgY2hhdEJ1ZmZlclwiPlxuICAgICAgICAgICAgICAgIDxiPnt7Y2hhdE1lc3NhZ2V9fTwvYj5cbiAgICAgICAgICAgICAgICA8L2JyPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwidmlkZW8taHVkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZpZGVvLXJvd1wiICpuZy1mb3I9XCIjc3RyZWFtIG9mIGxvY2FsU3RyZWFtc1wiPlxuICAgICAgICAgICA8dmlkZW8gY2xhc3M9XCJ2aWRlby1kaXNwbGF5XCIgc3JjPVwie3tzdHJlYW19fVwiIGF1dG9wbGF5PVwidHJ1ZVwiPjwvdmlkZW8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgKm5nLWlmPVwic3RhdGUgPCAyXCIgY2xhc3M9XCJyb29tLWxpc3RcIj5cbiAgICAgICAgPGgyPkF2YWlsYWJsZSBSb29tczwvaDE+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuYW1lLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgKm5nLWZvcj1cIiNyb29tIG9mIGF2YWlsYWJsZVJvb21zXCIgY2xhc3M9XCJyb29tLW5hbWVcIj48YSBocmVmPVwiI1wiPnt7cm9vbS5yb29tTmFtZX19PC9hPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8aDI+T25saW5lIFVzZXJzPC9oMT5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hbWUtY29udGFpbmVyXCI+XG4gICAgICAgICAgPGRpdiAqbmctZm9yPVwiI3VzZXIgb2YgYXZhaWxhYmxlVXNlcnNcIiBjbGFzcz1cInJvb20tbmFtZVwiPlxuICAgICAgICAgICAgPGltZyBjbGFzcz1cImF2YXRhciBsZWZ0XCIgc3JjPVwiaHR0cHM6Ly9hcGkuYWRvcmFibGUuaW8vYXZhdGFycy8yODAve3t1c2VyLm5hbWV9fSU0MGFkb3JhYmxlLmlvXCIgYWx0PVwie3t1c2VyLm5hbWV9fVwiPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICA8L2Rpdj5cblxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtgXG5cbiAgYF0sXG4gIGRpcmVjdGl2ZXM6IFtDT1JFX0RJUkVDVElWRVNdXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVDbXAge1xuXG4gIHByaXZhdGUgY2hhdEJ1ZmZlcjogQXJyYXk8U3RyaW5nPiA9IFtdO1xuICBwcml2YXRlIGF2YWlsYWJsZVJvb21zOiBBcnJheTxSb29tT3B0aW9ucz4gPSBbXTtcbiAgcHJpdmF0ZSBhdmFpbGFibGVVc2VycyA6IEFycmF5PGFueT4gPSBbXTtcblxuICBwcml2YXRlIGxvY2FsU3RyZWFtcyA9IFtdO1xuICBwcml2YXRlIGFjdGl2ZVN0cmVhbSA6IE1lZGlhU3RyZWFtO1xuICBwcml2YXRlIGFjdGl2ZVJvb206IFN0cmVhbVJvb207XG5cbiAgLy8gUG9vciBtYW4ncyBzdGF0ZSBtYWNoaW5lO1xuICBwcml2YXRlIHN0YXRlOiBudW1iZXIgPSAwO1xuXG4gIHByaXZhdGUgbW9kZWwgPSB7XG4gICAgbWVzc2FnZTogXCJUZXN0XCJcbiAgfVxuXG4gIC8vIFdlIG5lZWQgYSBzdHJlYW0gY29udHJvbGxlciB0byBib290c3RyYXAgdGhlIHByb2Nlc3MuIFRoZSBjb250ZXh0IGtleSBpcyBhIHVuaXF1ZSBzZXNzaW9uIGtleSB0aGF0IGlzb2xhdGVzIHRoZSBwcm9jZXNzIGZyb20gb3RoZXIgdXNlcnMuXG4gIC8vIElmIHlvdSBhcmUganVzdCBleHBlcmltZW50aW5nLCB1c2luZyB0aGUgZGVmYXVsdCBjb250ZXh0IGtleSBpcyBmaW5lLlxuICBwcml2YXRlIF9zdHJlYW1Db250cm9sbGVyOiBTdHJlYW1Db250cm9sbGVyID0gd2luZG93WydpbnN0YW5jZVN0cmVhbSddO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgLy8gTk9URTogQW5ndWxhckpTIGNoYW5nZSBkZXRlY3RvcjsgYWxsb3dzIHVzIHRvIHRha2Ugb3ZlciB0aGUgVUkuIEl0J3MgaW5qZWN0ZWQgdmlhIHJlZjsgbm8gcmVsYXRlZCB0byB0aGUgV2ViUlRDXG4gICAgdGhpcy5yZWZyZXNoUm9vbXMoKTsgIC8vIGluaXRpYWwgcmVmcmVzaFxuXG4gICAgdGhpcy5fc3RyZWFtQ29udHJvbGxlci5nZXRSb29tU2VydmljZSgpLnNvY2tldC5vbignYXZhaWxhYmxlVXNlcnMnLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5hdmFpbGFibGVVc2VycyA9IGRhdGE7XG4gICAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gICAgLy9cbiAgICAvLyBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgLy8gICB0aGlzLnJlZnJlc2hSb29tcygpO1xuICAgIC8vIH0sIDEwMDApO1xuXG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggc3RyZWFtcyB3ZSB3YW50IHRvIHVzZSBoZXJlOyBhc2sgdXNlciBhYm91dCB3aGljaCB0byB1c2VcbiAgICovXG4gIHByaXZhdGUgYXNrV2ViY2FtKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBTdHJlYW1GYWN0b3J5LmNyZWF0ZVdlYmNhbVN0cmVhbSh0cnVlLCB0cnVlLCAoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4ge1xuICAgICAgaWYgKHN0cmVhbSAhPSBudWxsKSB7XG4gICAgICAgIHNlbGYubG9jYWxTdHJlYW1zLnB1c2goVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pKTtcbiAgICAgICAgc2VsZi5hY3RpdmVTdHJlYW0gPSBzdHJlYW07XG4gICAgICAgIHNlbGYubW92ZVRvQ2hvaWNlKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgYXNrU2NyZWVuKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBTdHJlYW1GYWN0b3J5LmNyZWF0ZVNjcmVlblN0cmVhbSgoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4ge1xuICAgICAgaWYgKHN0cmVhbSAhPSBudWxsKSB7XG4gICAgICAgIHNlbGYubG9jYWxTdHJlYW1zLnB1c2goVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pKTtcbiAgICAgICAgc2VsZi5hY3RpdmVTdHJlYW0gPSBzdHJlYW07XG4gICAgICAgIHNlbGYubW92ZVRvQ2hvaWNlKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIGZvciBtb3Zpbmcgb250byBqb2luIHJvb20gLyBjcmVhdGUgcm9vbSBzdGF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBtb3ZlVG9DaG9pY2UoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IDE7XG4gICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cblxuICAvKipcbiAgICogU2VsZWN0aW9uIG9mIHdoYXQgdG8gZG8sIG1vdmluZyBhbG9uZyBub3dcbiAgICovXG5cbiAgcHJpdmF0ZSByZWZyZXNoUm9vbXMoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX3N0cmVhbUNvbnRyb2xsZXIuZ2V0Um9vbVNlcnZpY2UoKS5maW5kUm9vbXMoXCJcIiwgKHJvb21zRm91bmQ6IEFycmF5PFJvb21PcHRpb25zPikgPT4ge1xuICAgICAgc2VsZi5hdmFpbGFibGVSb29tcyA9IHJvb21zRm91bmQ7XG4gICAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7IC8vIEZvcmNlIGRpc3BsYXkgdXBkYXRlXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVJvb20oKSB7XG4gICAgdmFyIHJvb21OYW1lOiBzdHJpbmcgPSBwcm9tcHQoXCJOYW1lIG9mIHRoZSByb29tIHRvIGNyZWF0ZTsgXCIpO1xuICAgIHZhciBvcHRpb25zOiBSb29tT3B0aW9ucyA9IG5ldyBSb29tT3B0aW9ucyhyb29tTmFtZSwgZmFsc2UpO1xuICAgIHRoaXMuX3N0cmVhbUNvbnRyb2xsZXIuZ2V0Um9vbVNlcnZpY2UoKS5jcmVhdGVSb29tKG9wdGlvbnMsIChzdWNjZXNzKSA9PiB7XG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBhbGVydChcIlJvb20gY3JlYXRlZCFcIik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJGYWlsZWQgdG8gY3JlYXRlIHJvb20uIER1cGxpY2F0ZT9cIik7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZnJlc2ggYW55d2F5OyBzaG93IGR1cGxpY2F0ZXNcbiAgICAgIHRoaXMucmVmcmVzaFJvb21zKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGpvaW5Sb29tKCkge1xuICAgIHZhciByb29tTmFtZTogc3RyaW5nID0gcHJvbXB0KFwiTmFtZSBvZiB0aGUgcm9vbSB0byBqb2luP1wiKTtcbiAgICB2YXIgb3B0aW9uczogUm9vbU9wdGlvbnMgPSBuZXcgUm9vbU9wdGlvbnMocm9vbU5hbWUsIGZhbHNlKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fc3RyZWFtQ29udHJvbGxlci5nZXRSb29tU2VydmljZSgpLmpvaW5Sb29tKG9wdGlvbnMsIFtzZWxmLmFjdGl2ZVN0cmVhbV0sIChzdWNjZXNzOiBib29sZWFuLCByb29tQ29udGV4dDogU3RyZWFtUm9vbSkgPT4ge1xuICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgc2VsZi5hY3RpdmVSb29tID0gcm9vbUNvbnRleHQ7XG4gICAgICAgIHNlbGYuc3RhdGUgPSAyO1xuICAgICAgICBzZWxmLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIHNlbGYubW92ZVRvUGVlcnMoKTtcbiAgICAgICAgc2V0VGltZW91dCh0aGlzLmJlZ2luUGxheWJhY2suYmluZCh0aGlzKSwgMTUwMCk7IC8vIG1vdmUgdG8gdGhlIG5leHQgc3RhdGUgYW5kIGJlZ2luIHBsYXliYWNrIHNob3J0bHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiRmFpbGVkIHRvIGpvaW4gcm9vbSFcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV2UncmUgaW5zaWRlIGEgcm9vbSEgTGV0J3MgZG8gc29tZXRoaW5nLi4uXG4gICAqL1xuXG4gIHByaXZhdGUgbW92ZVRvUGVlcnMoKSB7XG4gICAgdGhpcy5hY3RpdmVSb29tLm9uKCduZXdzdHJlYW0nLCB0aGlzLnNldHVwUmVtb3RlU3RyZWFtLmJpbmQodGhpcykpO1xuICAgIC8vIHRoaXMuYWN0aXZlUm9vbS5vbignZGF0YScsIHRoaXMuZGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1c2ggdXAgYSBuZXcgcmVtb3RlIHN0cmVhbSBpbnRvIHRoZSBhcHBsaWNhdGlvbiBzdHJlYW0uXG4gICAqL1xuICBwcml2YXRlIHNldHVwUmVtb3RlU3RyZWFtKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLmxvY2FsU3RyZWFtcy5wdXNoKFVSTC5jcmVhdGVPYmplY3RVUkwoZXZlbnQuc3RyZWFtKSk7XG4gICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHNldFRpbWVvdXQodGhpcy5iZWdpblBsYXliYWNrLmJpbmQodGhpcyksIDE1MDApO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlZ2lucyBwbGF5YmFjayBvZiBhbGwgdmlkZW8gb24gdGhlIHNjcmVlbiwgdXNlZCB0byBlbnN1cmUgdGhlIGJyb3dzZXIgZG9lcyBpdCdzIGpvYi5cbiAgICogTm90IHNwZWNpZmljIHRvIFdlYlJUQy5cbiAgICovXG4gIHByaXZhdGUgYmVnaW5QbGF5YmFjaygpIHtcbiAgICB2YXIgbm9kZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndmlkZW8nKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBub2Rlc1tpXS5wbGF5KCk7XG4gICAgfVxuICB9XG5cblxuICAvLyBDaGF0IHN0dWZmXG4gIHByaXZhdGUgc2VuZENoYXRNZXNzYWdlKG1zZyA6IHN0cmluZykge1xuICAgIHRoaXMuY2hhdEJ1ZmZlci5wdXNoKG1zZyk7XG4gICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9