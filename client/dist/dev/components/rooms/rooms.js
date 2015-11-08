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
        this.name = "Harley";
        this.activeStreams = [];
        this._myStream = new VideoStream_1.VideoStream();
        this._myStream.getStream(true, true, function (s) {
            this._mediaStream = s;
            this._currentRoom = new RtcRoom_1.RtcRoom(s);
            this._currentRoom.join();
            this._currentRoom.on('newstream', this.setupRemoteStream.bind(this));
        }.bind(this));
    }
    RoomCmp.prototype.setupRemoteStream = function (event) {
        console.log(event);
        this.activeStreams.push(URL.createObjectURL(event.stream));
        console.log(this.streams);
        this.name = "Vaugan";
        this.ref.markForCheck();
        this.ref.detectChanges();
    };
    RoomCmp.prototype.addName = function (newname) {
        this.list.add(newname.value);
        newname.value = '';
        return false;
    };
    RoomCmp = __decorate([
        angular2_1.Component({
            selector: 'about',
            template: "\n    {{name}}\n    <div id=\"chat-view\">\n      <div class=\"col-md-12\">\n        <div class=\"row\">\n          <div id=\"chat-sidebar\" class=\"col-sm-2\">\n            <ul>\n              <li *ng-for=\"#name of list.get()\">{{name}}</li>\n            </ul>\n          </div>\n          <div id=\"chat-main\" class=\"col-sm-10\">\n            <!--Video displays here-->\n            <div *ng-for=\"#stream of activeStreams\">\n              <video src=\"{{stream}}\" autoplay=\"true\"></video>\n            </div>\n          </div>\n\n        </div>\n      </div>\n    </div>\n    </div>\n  ",
            directives: [angular2_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [name_list_1.NameList, StreamList_1.StreamList, angular2_1.ChangeDetectorRef])
    ], RoomCmp);
    return RoomCmp;
})();
exports.RoomCmp = RoomCmp;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvcm9vbXMvcm9vbXMudHMiXSwibmFtZXMiOlsiUm9vbUNtcCIsIlJvb21DbXAuY29uc3RydWN0b3IiLCJSb29tQ21wLnNldHVwUmVtb3RlU3RyZWFtIiwiUm9vbUNtcC5hZGROYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlCQUFxRixtQkFBbUIsQ0FBQyxDQUFBO0FBRXpHLDBCQUF1QiwwQkFBMEIsQ0FBQyxDQUFBO0FBQ2xELDJCQUF5QiwyQkFBMkIsQ0FBQyxDQUFBO0FBRXJELDRCQUEwQiw0QkFBNEIsQ0FBQyxDQUFBO0FBQ3ZELHdCQUFzQix3QkFBd0IsQ0FBQyxDQUFBO0FBRS9DO0lBa0NFQSxpQkFBbUJBLElBQWNBLEVBQVNBLE9BQW1CQSxFQUFTQSxHQUFzQkE7UUFBekVDLFNBQUlBLEdBQUpBLElBQUlBLENBQVVBO1FBQVNBLFlBQU9BLEdBQVBBLE9BQU9BLENBQVlBO1FBQVNBLFFBQUdBLEdBQUhBLEdBQUdBLENBQW1CQTtRQUw1RkEsU0FBSUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFHVEEsa0JBQWFBLEdBQUdBLEVBQUVBLENBQUNBO1FBR3hCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSx5QkFBV0EsRUFBRUEsQ0FBQ0E7UUFDbkNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLFVBQVNBLENBQUNBO1lBQzdDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxpQkFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV2RSxDQUFDLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUFBO0lBQ2ZBLENBQUNBO0lBRURELG1DQUFpQkEsR0FBakJBLFVBQWtCQSxLQUFVQTtRQUMxQkUsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDbkJBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLGVBQWVBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1FBQzNEQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDckJBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1FBQ3hCQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFNREYseUJBQU9BLEdBQVBBLFVBQVFBLE9BQU9BO1FBQ2JHLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzdCQSxPQUFPQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUNuQkEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZkEsQ0FBQ0E7SUEvREhIO1FBQUNBLG9CQUFTQSxDQUFDQTtZQUNUQSxRQUFRQSxFQUFFQSxPQUFPQTtZQUNqQkEsUUFBUUEsRUFBRUEsc2xCQXFCVEE7WUFDREEsVUFBVUEsRUFBRUEsQ0FBQ0EsMEJBQWVBLENBQUNBO1NBQzlCQSxDQUFDQTs7Z0JBdUNEQTtJQUFEQSxjQUFDQTtBQUFEQSxDQWhFQSxBQWdFQ0EsSUFBQTtBQXJDWSxlQUFPLFVBcUNuQixDQUFBIiwiZmlsZSI6ImNvbXBvbmVudHMvcm9vbXMvcm9vbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgQ09SRV9ESVJFQ1RJVkVTLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ2FuZ3VsYXIyL2FuZ3VsYXIyJztcblxuaW1wb3J0IHtOYW1lTGlzdH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmFtZV9saXN0JztcbmltcG9ydCB7U3RyZWFtTGlzdH0gZnJvbSAnLi4vLi4vc2VydmljZXMvU3RyZWFtTGlzdCc7XG5cbmltcG9ydCB7VmlkZW9TdHJlYW19IGZyb20gJy4uLy4uL3NlcnZpY2VzL1ZpZGVvU3RyZWFtJztcbmltcG9ydCB7UnRjUm9vbX0gZnJvbSAnLi4vLi4vc2VydmljZXMvUnRjUm9vbSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Fib3V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICB7e25hbWV9fVxuICAgIDxkaXYgaWQ9XCJjaGF0LXZpZXdcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgaWQ9XCJjaGF0LXNpZGViYXJcIiBjbGFzcz1cImNvbC1zbS0yXCI+XG4gICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgIDxsaSAqbmctZm9yPVwiI25hbWUgb2YgbGlzdC5nZXQoKVwiPnt7bmFtZX19PC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBpZD1cImNoYXQtbWFpblwiIGNsYXNzPVwiY29sLXNtLTEwXCI+XG4gICAgICAgICAgICA8IS0tVmlkZW8gZGlzcGxheXMgaGVyZS0tPlxuICAgICAgICAgICAgPGRpdiAqbmctZm9yPVwiI3N0cmVhbSBvZiBhY3RpdmVTdHJlYW1zXCI+XG4gICAgICAgICAgICAgIDx2aWRlbyBzcmM9XCJ7e3N0cmVhbX19XCIgYXV0b3BsYXk9XCJ0cnVlXCI+PC92aWRlbz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGRpcmVjdGl2ZXM6IFtDT1JFX0RJUkVDVElWRVNdXG59KVxuXG5leHBvcnQgY2xhc3MgUm9vbUNtcCB7XG5cbiAgbmFtZSA9IFwiSGFybGV5XCI7XG4gIHByaXZhdGUgX215U3RyZWFtOiBWaWRlb1N0cmVhbTtcbiAgcHJpdmF0ZSBfY3VycmVudFJvb206IFJ0Y1Jvb207XG4gIHB1YmxpYyBhY3RpdmVTdHJlYW1zID0gW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxpc3Q6IE5hbWVMaXN0LCBwdWJsaWMgc3RyZWFtczogU3RyZWFtTGlzdCwgcHVibGljIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLl9teVN0cmVhbSA9IG5ldyBWaWRlb1N0cmVhbSgpO1xuICAgIHRoaXMuX215U3RyZWFtLmdldFN0cmVhbSh0cnVlLCB0cnVlLCBmdW5jdGlvbihzKSB7XG4gICAgICB0aGlzLl9tZWRpYVN0cmVhbSA9IHM7XG4gICAgICB0aGlzLl9jdXJyZW50Um9vbSA9IG5ldyBSdGNSb29tKHMpO1xuICAgICAgdGhpcy5fY3VycmVudFJvb20uam9pbigpO1xuXG4gICAgICB0aGlzLl9jdXJyZW50Um9vbS5vbignbmV3c3RyZWFtJywgdGhpcy5zZXR1cFJlbW90ZVN0cmVhbS5iaW5kKHRoaXMpKTtcblxuICAgIH0uYmluZCh0aGlzKSlcbiAgfVxuXG4gIHNldHVwUmVtb3RlU3RyZWFtKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgdGhpcy5hY3RpdmVTdHJlYW1zLnB1c2goVVJMLmNyZWF0ZU9iamVjdFVSTChldmVudC5zdHJlYW0pKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0cmVhbXMpOyBcbiAgICB0aGlzLm5hbWUgPSBcIlZhdWdhblwiO1xuICAgIHRoaXMucmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTsgLy8gYXN5bmMgaGF4XG4gIH1cbiAgXG4gIC8qXG4gICogQHBhcmFtIG5ld25hbWUgIGFueSB0ZXh0IGFzIGlucHV0LlxuICAqIEByZXR1cm5zIHJldHVybiBmYWxzZSB0byBwcmV2ZW50IGRlZmF1bHQgZm9ybSBzdWJtaXQgYmVoYXZpb3IgdG8gcmVmcmVzaCB0aGUgcGFnZS5cbiAgKi9cbiAgYWRkTmFtZShuZXduYW1lKTogYm9vbGVhbiB7XG4gICAgdGhpcy5saXN0LmFkZChuZXduYW1lLnZhbHVlKTtcbiAgICBuZXduYW1lLnZhbHVlID0gJyc7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=