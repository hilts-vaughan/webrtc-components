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
var name_list_1 = require('../../services/name_list');
var StreamList_1 = require('../../services/StreamList');
var VideoStream_1 = require('../../services/VideoStream');
var RtcRoom_1 = require('../../services/RtcRoom');
var RoomCmp = (function () {
    function RoomCmp(list, streams, ref) {
        this.list = list;
        this.streams = streams;
        this.ref = ref;
        this.textMessage = "Anonymous Llama";
        this.activeStreams = [];
        this.chatBuffer = [];
        this._myStream = new VideoStream_1.VideoStream();
        this._myStream.getStream(true, false, function (s) {
            this._mediaStream = s;
        }.bind(this));
    }
    RoomCmp.prototype.createRoom = function () {
        RtcRoom_1.RtcRoom.createRoom("x", function (roomName, userId) {
            alert("Success! Call taken; server has generated room name of " + roomName);
            console.log(roomName);
            console.log(userId);
        });
    };
    RoomCmp.prototype.joinRoom = function () {
        var _this = this;
        var roomName = window.prompt("Enter room name", "");
        this._currentRoom = new RtcRoom_1.RtcRoom(this._mediaStream, roomName);
        this._currentRoom.join(function () {
            _this._currentRoom.on('newstream', _this.setupRemoteStream.bind(_this));
            _this._currentRoom.on('data', _this.dataReceived.bind(_this));
            _this.setupLocalStream();
        });
    };
    RoomCmp.prototype.sendMessage = function ($event) {
        if (this._currentRoom != null) {
            var box = (document.getElementById("message-box"));
            var text = box.value;
            this._currentRoom.sendMessage(text);
            box.value = "";
        }
    };
    RoomCmp.prototype.dataReceived = function (data) {
        this.chatBuffer.push(data);
        this.ref.markForCheck();
        this.ref.detectChanges();
    };
    RoomCmp.prototype.setupRemoteStream = function (event) {
        console.log(event);
        this.activeStreams.push(URL.createObjectURL(event.stream));
        this.ref.markForCheck();
        this.ref.detectChanges();
        setTimeout(this.beginPlayback.bind(this), 1000);
    };
    RoomCmp.prototype.setupLocalStream = function () {
        this.activeStreams.push(URL.createObjectURL(this._mediaStream));
        this.ref.markForCheck();
        this.ref.detectChanges();
        setTimeout(this.beginPlayback.bind(this), 1000);
    };
    RoomCmp.prototype.beginPlayback = function () {
        var nodes = document.getElementsByTagName('video');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].play();
        }
    };
    RoomCmp.prototype.addName = function (newname) {
        this.list.add(newname.value);
        newname.value = '';
        return false;
    };
    RoomCmp = __decorate([
        angular2_1.Component({
            selector: 'about',
            template: "\n    {{name}}\n    <div id=\"chat-view\">\n      <div class=\"col-md-12\">\n        <div class=\"row\">\n          <div id=\"chat-sidebar\" class=\"col-sm-2\">\n            <ul>\n              <li *ng-for=\"#name of list.get()\">{{name}}</li>\n            </ul>\n            <form>\n            <input id=\"message-box\">\n            </form>\n            <button (click)=\"sendMessage($event)\">Send Message</button>        \n            <button (click)=\"createRoom($event)\">Create Room</button>\n            <button (click)=\"joinRoom($event)\">Join Room</button>\n        \n            <!--Message area-->\n            <div class=\"row\" *ng-for=\"#chatMessage of chatBuffer\">\n              <b>{{chatMessage}}</b>\n              </br> \n            </div>\n        \n          </div>\n          <div id=\"chat-main\" class=\"col-sm-10\">\n            <!--Video displays here-->\n            <div *ng-for=\"#stream of activeStreams\">\n              <video class=\"video-display\" src=\"{{stream}}\" autoplay=\"true\"></video>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    </div>\n  ",
            directives: [angular2_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [name_list_1.NameList, StreamList_1.StreamList, angular2_1.ChangeDetectorRef])
    ], RoomCmp);
    return RoomCmp;
})();
exports.RoomCmp = RoomCmp;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvcm9vbXMvcm9vbXMudHMiXSwibmFtZXMiOlsiUm9vbUNtcCIsIlJvb21DbXAuY29uc3RydWN0b3IiLCJSb29tQ21wLmNyZWF0ZVJvb20iLCJSb29tQ21wLmpvaW5Sb29tIiwiUm9vbUNtcC5zZW5kTWVzc2FnZSIsIlJvb21DbXAuZGF0YVJlY2VpdmVkIiwiUm9vbUNtcC5zZXR1cFJlbW90ZVN0cmVhbSIsIlJvb21DbXAuc2V0dXBMb2NhbFN0cmVhbSIsIlJvb21DbXAuYmVnaW5QbGF5YmFjayIsIlJvb21DbXAuYWRkTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx5QkFBcUYsbUJBQW1CLENBQUMsQ0FBQTtBQUV6RywwQkFBdUIsMEJBQTBCLENBQUMsQ0FBQTtBQUNsRCwyQkFBeUIsMkJBQTJCLENBQUMsQ0FBQTtBQUVyRCw0QkFBMEIsNEJBQTRCLENBQUMsQ0FBQTtBQUN2RCx3QkFBc0Isd0JBQXdCLENBQUMsQ0FBQTtBQUUvQztJQWtERUEsaUJBQW1CQSxJQUFjQSxFQUFTQSxPQUFtQkEsRUFBU0EsR0FBc0JBO1FBQXpFQyxTQUFJQSxHQUFKQSxJQUFJQSxDQUFVQTtRQUFTQSxZQUFPQSxHQUFQQSxPQUFPQSxDQUFZQTtRQUFTQSxRQUFHQSxHQUFIQSxHQUFHQSxDQUFtQkE7UUFUcEZBLGdCQUFXQSxHQUFHQSxpQkFBaUJBLENBQUNBO1FBSWpDQSxrQkFBYUEsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFHbkJBLGVBQVVBLEdBQUdBLEVBQUVBLENBQUNBO1FBR3JCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSx5QkFBV0EsRUFBRUEsQ0FBQ0E7UUFDbkNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEtBQUtBLEVBQUVBLFVBQVNBLENBQUNBO1lBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FB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VUFBVUEsRUFBRUEsQ0FBQ0EsMEJBQWVBLENBQUNBO1NBQzlCQSxDQUFDQTs7Z0JBbUZEQTtJQUFEQSxjQUFDQTtBQUFEQSxDQXhIQSxBQXdIQ0EsSUFBQTtBQWpGWSxlQUFPLFVBaUZuQixDQUFBIiwiZmlsZSI6ImNvbXBvbmVudHMvcm9vbXMvcm9vbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgQ09SRV9ESVJFQ1RJVkVTLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ2FuZ3VsYXIyL2FuZ3VsYXIyJztcblxuaW1wb3J0IHtOYW1lTGlzdH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmFtZV9saXN0JztcbmltcG9ydCB7U3RyZWFtTGlzdH0gZnJvbSAnLi4vLi4vc2VydmljZXMvU3RyZWFtTGlzdCc7XG5cbmltcG9ydCB7VmlkZW9TdHJlYW19IGZyb20gJy4uLy4uL3NlcnZpY2VzL1ZpZGVvU3RyZWFtJztcbmltcG9ydCB7UnRjUm9vbX0gZnJvbSAnLi4vLi4vc2VydmljZXMvUnRjUm9vbSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Fib3V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICB7e25hbWV9fVxuICAgIDxkaXYgaWQ9XCJjaGF0LXZpZXdcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgaWQ9XCJjaGF0LXNpZGViYXJcIiBjbGFzcz1cImNvbC1zbS0yXCI+XG4gICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgIDxsaSAqbmctZm9yPVwiI25hbWUgb2YgbGlzdC5nZXQoKVwiPnt7bmFtZX19PC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8Zm9ybT5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cIm1lc3NhZ2UtYm94XCI+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8YnV0dG9uIChjbGljayk9XCJzZW5kTWVzc2FnZSgkZXZlbnQpXCI+U2VuZCBNZXNzYWdlPC9idXR0b24+ICAgICAgICBcbiAgICAgICAgICAgIDxidXR0b24gKGNsaWNrKT1cImNyZWF0ZVJvb20oJGV2ZW50KVwiPkNyZWF0ZSBSb29tPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIChjbGljayk9XCJqb2luUm9vbSgkZXZlbnQpXCI+Sm9pbiBSb29tPC9idXR0b24+XG4gICAgICAgIFxuICAgICAgICAgICAgPCEtLU1lc3NhZ2UgYXJlYS0tPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiICpuZy1mb3I9XCIjY2hhdE1lc3NhZ2Ugb2YgY2hhdEJ1ZmZlclwiPlxuICAgICAgICAgICAgICA8Yj57e2NoYXRNZXNzYWdlfX08L2I+XG4gICAgICAgICAgICAgIDwvYnI+IFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJjaGF0LW1haW5cIiBjbGFzcz1cImNvbC1zbS0xMFwiPlxuICAgICAgICAgICAgPCEtLVZpZGVvIGRpc3BsYXlzIGhlcmUtLT5cbiAgICAgICAgICAgIDxkaXYgKm5nLWZvcj1cIiNzdHJlYW0gb2YgYWN0aXZlU3RyZWFtc1wiPlxuICAgICAgICAgICAgICA8dmlkZW8gY2xhc3M9XCJ2aWRlby1kaXNwbGF5XCIgc3JjPVwie3tzdHJlYW19fVwiIGF1dG9wbGF5PVwidHJ1ZVwiPjwvdmlkZW8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgZGlyZWN0aXZlczogW0NPUkVfRElSRUNUSVZFU11cbn0pXG5cbmV4cG9ydCBjbGFzcyBSb29tQ21wIHtcblxuICBwcml2YXRlIHRleHRNZXNzYWdlID0gXCJBbm9ueW1vdXMgTGxhbWFcIjtcbiAgcHJpdmF0ZSBfbXlTdHJlYW06IFZpZGVvU3RyZWFtO1xuICBwcml2YXRlIF9jdXJyZW50Um9vbTogUnRjUm9vbTtcbiAgcHJpdmF0ZSBfbWVkaWFTdHJlYW06IE1lZGlhU3RyZWFtO1xuICBwdWJsaWMgYWN0aXZlU3RyZWFtcyA9IFtdO1xuICBcbiAgLy8gU3RvcmVzIGEgYnVmZmVyIG9mIGNoYXQgbWVzc2FnZXMgdG8gbG9nIG91dFxuICBwdWJsaWMgY2hhdEJ1ZmZlciA9IFtdO1xuICBcbiAgY29uc3RydWN0b3IocHVibGljIGxpc3Q6IE5hbWVMaXN0LCBwdWJsaWMgc3RyZWFtczogU3RyZWFtTGlzdCwgcHVibGljIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLl9teVN0cmVhbSA9IG5ldyBWaWRlb1N0cmVhbSgpO1xuICAgIHRoaXMuX215U3RyZWFtLmdldFN0cmVhbSh0cnVlLCBmYWxzZSwgZnVuY3Rpb24ocykge1xuICAgICAgdGhpcy5fbWVkaWFTdHJlYW0gPSBzO1xuICAgIH0uYmluZCh0aGlzKSlcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlUm9vbSgpIHtcbiAgICBSdGNSb29tLmNyZWF0ZVJvb20oXCJ4XCIsIChyb29tTmFtZSwgdXNlcklkKSA9PiB7XG4gICAgICBhbGVydChcIlN1Y2Nlc3MhIENhbGwgdGFrZW47IHNlcnZlciBoYXMgZ2VuZXJhdGVkIHJvb20gbmFtZSBvZiBcIiArIHJvb21OYW1lKTtcbiAgICAgIGNvbnNvbGUubG9nKHJvb21OYW1lKTtcbiAgICAgIGNvbnNvbGUubG9nKHVzZXJJZCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGpvaW5Sb29tKCkge1xuICAgIHZhciByb29tTmFtZSA9IHdpbmRvdy5wcm9tcHQoXCJFbnRlciByb29tIG5hbWVcIiwgXCJcIik7XG4gICAgdGhpcy5fY3VycmVudFJvb20gPSBuZXcgUnRjUm9vbSh0aGlzLl9tZWRpYVN0cmVhbSwgcm9vbU5hbWUpO1xuICAgIHRoaXMuX2N1cnJlbnRSb29tLmpvaW4oKCkgPT4ge1xuICAgICAgdGhpcy5fY3VycmVudFJvb20ub24oJ25ld3N0cmVhbScsIHRoaXMuc2V0dXBSZW1vdGVTdHJlYW0uYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLl9jdXJyZW50Um9vbS5vbignZGF0YScsIHRoaXMuZGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5zZXR1cExvY2FsU3RyZWFtKCk7IC8vIHNldHVwIG91ciBsb2NhbCBzdHJlYW1cbiAgICB9KTtcbiAgfVxuICBcbiAgcHJpdmF0ZSBzZW5kTWVzc2FnZSgkZXZlbnQpIHtcbiAgICBpZih0aGlzLl9jdXJyZW50Um9vbSAhPSBudWxsKSB7XG4gICAgICB2YXIgYm94ICA9IDxIVE1MSW5wdXRFbGVtZW50Pjxhbnk+KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVzc2FnZS1ib3hcIikpO1xuICAgICAgdmFyIHRleHQgOiBzdHJpbmcgPSBib3gudmFsdWU7XG4gICAgICB0aGlzLl9jdXJyZW50Um9vbS5zZW5kTWVzc2FnZSh0ZXh0KTtcbiAgICAgIGJveC52YWx1ZSA9IFwiXCI7XG4gICAgfVxuICB9XG4gIFxuICBwcml2YXRlIGRhdGFSZWNlaXZlZChkYXRhIDogc3RyaW5nKSB7XG4gICAgdGhpcy5jaGF0QnVmZmVyLnB1c2goZGF0YSk7XG4gICAgdGhpcy5yZWYubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpOyAvLyBhc3luYyBoYXggICAgXG4gIH1cbiAgc2V0dXBSZW1vdGVTdHJlYW0oZXZlbnQ6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICB0aGlzLmFjdGl2ZVN0cmVhbXMucHVzaChVUkwuY3JlYXRlT2JqZWN0VVJMKGV2ZW50LnN0cmVhbSkpO1xuICAgIHRoaXMucmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTsgLy8gYXN5bmMgaGF4XG4gICAgc2V0VGltZW91dCh0aGlzLmJlZ2luUGxheWJhY2suYmluZCh0aGlzKSwgMTAwMCk7ICAgIFxuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cExvY2FsU3RyZWFtKCkge1xuICAgIHRoaXMuYWN0aXZlU3RyZWFtcy5wdXNoKFVSTC5jcmVhdGVPYmplY3RVUkwodGhpcy5fbWVkaWFTdHJlYW0pKTtcbiAgICB0aGlzLnJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7IC8vIGFzeW5jIGhheFxuICAgIHNldFRpbWVvdXQodGhpcy5iZWdpblBsYXliYWNrLmJpbmQodGhpcyksIDEwMDApO1xuICB9XG4gIFxuICBwcml2YXRlIGJlZ2luUGxheWJhY2soKSB7XG4gICAgICB2YXIgbm9kZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndmlkZW8nKTtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG5vZGVzW2ldLnBsYXkoKTtcbiAgICAgIH1cbiAgfVxuICBcbiAgLypcbiAgKiBAcGFyYW0gbmV3bmFtZSAgYW55IHRleHQgYXMgaW5wdXQuXG4gICogQHJldHVybnMgcmV0dXJuIGZhbHNlIHRvIHByZXZlbnQgZGVmYXVsdCBmb3JtIHN1Ym1pdCBiZWhhdmlvciB0byByZWZyZXNoIHRoZSBwYWdlLlxuICAqL1xuICBhZGROYW1lKG5ld25hbWUpOiBib29sZWFuIHtcbiAgICB0aGlzLmxpc3QuYWRkKG5ld25hbWUudmFsdWUpO1xuICAgIG5ld25hbWUudmFsdWUgPSAnJztcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==