var RtcRoom = (function () {
    function RtcRoom(stream, roomName) {
        this._peerMap = {};
        this._channelMap = {};
        this._eventMap = {};
        this._socket = io.connect(RtcRoom.SIGNALING_URL);
        this._localStream = stream;
        this._roomId = roomName;
        var self = this;
        this._socket.on('msg', function (data) {
            self.handleMessages(data);
        });
        this._socket.on('peer.connected', function (data) {
            self.makeOfferFor(data.id);
        });
        this._socket.on('peer.disconnected', function (data) {
            console.log("peer aborted");
        });
    }
    RtcRoom.prototype.getPeerConnection = function (id) {
        if (this._peerMap[id]) {
            return this._peerMap[id];
        }
        var pc = new RTCPeerConnection(RtcRoom.ICE_CONFIG);
        this._peerMap[id] = pc;
        var self = this;
        pc.addStream(this._localStream);
        pc.onicecandidate = function (evnt) {
            console.log("ICE candidate recieved... broadcasting request");
            self._socket.emit('msg', { by: self._currentId, to: id, ice: evnt.candidate, type: 'ice' });
        };
        pc.onaddstream = function (event) {
            console.log("Got new stream.. inform UI?");
            self.trigger('newstream', event);
        };
        pc.onremovestream = function (event) {
            console.log("Stream lost");
        };
        var options = {
            ordered: false
        };
        var _channel = pc.createDataChannel("data", options);
        _channel.onopen = function () {
            console.log("Attempted to send data down the pipe.");
        };
        this._channelMap[id] = _channel;
        pc.ondatachannel = function (event) {
            console.log(event);
            console.log("Channel was created");
            event.channel.onmessage = function (payload) {
                self.trigger('data', payload.data);
            };
        };
        return pc;
    };
    RtcRoom.prototype.makeOfferFor = function (id) {
        var _this = this;
        var peer = this.getPeerConnection(id);
        peer.createOffer(function (description) {
            peer.setLocalDescription(description);
            console.log("Creating offer for Peer... ID: " + id);
            _this._socket.emit('msg', { by: _this._currentId, to: id, sdp: description, type: 'sdp-offer' });
        });
    };
    RtcRoom.prototype.handleMessages = function (messageData) {
        var peer = this.getPeerConnection(messageData.by);
        var self = this;
        switch (messageData.type) {
            case 'sdp-offer':
                peer.setRemoteDescription(new RTCSessionDescription(messageData.sdp), function () {
                    console.log('Setting remote description by offer');
                    peer.createAnswer(function (sdp) {
                        peer.setLocalDescription(sdp);
                        self._socket.emit('msg', { by: self._currentId, to: messageData.by, sdp: sdp, type: 'sdp-answer' });
                    });
                });
                break;
            case 'sdp-answer':
                peer.setRemoteDescription(new RTCSessionDescription(messageData.sdp), function () {
                    console.log('Setting remote description by answer');
                }, function (e) {
                    console.error(e);
                });
                break;
            case 'ice':
                if (messageData.ice) {
                    console.log('Adding ice candidates... OK!');
                    console.log(messageData);
                    var cand = new RTCIceCandidate(messageData.ice);
                    peer.addIceCandidate(cand, function () { }, function () { });
                }
                break;
        }
    };
    RtcRoom.createRoom = function (roomName, callback) {
        var socket = io.connect(RtcRoom.SIGNALING_URL);
        socket.emit('init', null, function (room, userId) {
            callback(room, userId);
            socket.disconnect();
        });
    };
    RtcRoom.prototype.join = function (callback) {
        var _this = this;
        this._socket.emit('init', { room: this._roomId }, function (room, userId) {
            _this._currentId = userId;
            callback(userId);
        });
    };
    RtcRoom.prototype.sendMessage = function (message) {
        var _this = this;
        Object.keys(this._channelMap).forEach(function (key) {
            var channel = _this._channelMap[key];
            channel.send(message);
        });
    };
    RtcRoom.prototype.on = function (eventType, listener) {
        if (!this._eventMap[eventType])
            this._eventMap[eventType] = [];
        this._eventMap[eventType].push(listener);
    };
    RtcRoom.prototype.trigger = function (eventType, data) {
        this._eventMap[eventType].forEach(function (listener) {
            listener(data);
        });
    };
    RtcRoom.ICE_CONFIG = {
        'iceServers': [{
                'url': 'stun:stun.l.google.com:19302'
            }]
    };
    RtcRoom.SIGNALING_URL = "http://192.168.1.160:1239/";
    return RtcRoom;
})();
exports.RtcRoom = RtcRoom;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL1J0Y1Jvb20udHMiXSwibmFtZXMiOlsiUnRjUm9vbSIsIlJ0Y1Jvb20uY29uc3RydWN0b3IiLCJSdGNSb29tLmdldFBlZXJDb25uZWN0aW9uIiwiUnRjUm9vbS5tYWtlT2ZmZXJGb3IiLCJSdGNSb29tLmhhbmRsZU1lc3NhZ2VzIiwiUnRjUm9vbS5jcmVhdGVSb29tIiwiUnRjUm9vbS5qb2luIiwiUnRjUm9vbS5zZW5kTWVzc2FnZSIsIlJ0Y1Jvb20ub24iLCJSdGNSb29tLnRyaWdnZXIiXSwibWFwcGluZ3MiOiJBQU1BO0lBc0JDQSxpQkFBWUEsTUFBbUJBLEVBQUVBLFFBQWlCQTtRQU4xQ0MsYUFBUUEsR0FBV0EsRUFBRUEsQ0FBQ0E7UUFDdEJBLGdCQUFXQSxHQUFZQSxFQUFFQSxDQUFDQTtRQW9KMUJBLGNBQVNBLEdBQVdBLEVBQUVBLENBQUNBO1FBOUk5QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7UUFDakRBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLE1BQU1BLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUV4QkEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFHaEJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEtBQUtBLEVBQUVBLFVBQUNBLElBQUlBO1lBQzNCQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMzQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFSEEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxVQUFDQSxJQUFJQTtZQUN0Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDNUJBLENBQUNBLENBQUNBLENB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RUFBRUEsUUFBa0JBO1FBQ3ZDUSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFFaENBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO0lBQzFDQSxDQUFDQTtJQUVPUix5QkFBT0EsR0FBZkEsVUFBZ0JBLFNBQWlCQSxFQUFFQSxJQUFTQTtRQUMzQ1MsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsUUFBUUE7WUFDekNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ2hCQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNKQSxDQUFDQTtJQW5MY1Qsa0JBQVVBLEdBQVdBO1FBQ25DQSxZQUFZQSxFQUFFQSxDQUFDQTtnQkFDZEEsS0FBS0EsRUFBRUEsOEJBQThCQTthQUNyQ0EsQ0FBQ0E7S0FDRkEsQ0FBQUE7SUFFY0EscUJBQWFBLEdBQUdBLDRCQUE0QkEsQ0FBQ0E7SUErSzdEQSxjQUFDQTtBQUFEQSxDQXZMQSxBQXVMQ0EsSUFBQTtBQXZMWSxlQUFPLFVBdUxuQixDQUFBIiwiZmlsZSI6InNlcnZpY2VzL1J0Y1Jvb20uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1ZpZGVvU3RyZWFtfSBmcm9tICcuL1ZpZGVvU3RyZWFtJztcblxuLyoqXG4gKiBQcm92aWRlcyBhbiBlbmNhcHN1bGF0ZWQgdmlldyBvZiBhIHJvb20gaW4gV2ViUlRDLlxuICogQWxsb3dzIHVzZXJzIHRvIGdldCB1cCBhbmQgcnVubmluZyB3aXRoIGEgcm9vbS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJ0Y1Jvb20ge1xuXG5cdHByaXZhdGUgc3RhdGljIElDRV9DT05GSUc6IE9iamVjdCA9IHtcblx0XHQnaWNlU2VydmVycyc6IFt7XG5cdFx0XHQndXJsJzogJ3N0dW46c3R1bi5sLmdvb2dsZS5jb206MTkzMDInXG5cdFx0fV1cblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIFNJR05BTElOR19VUkwgPSBcImh0dHA6Ly8xOTIuMTY4LjEuMTYwOjEyMzkvXCI7IFxuXHRcblx0cHJpdmF0ZSBfcm9vbUlkOiBzdHJpbmc7XG5cdHByaXZhdGUgX2N1cnJlbnRJZDogc3RyaW5nO1xuXHRwcml2YXRlIF9jaGFubmVsIDogUlRDRGF0YUNoYW5uZWw7XG5cblx0cHJpdmF0ZSBfc29ja2V0OiBTb2NrZXQ7XG5cdFxuXHRwcml2YXRlIF9wZWVyTWFwOiBPYmplY3QgPSB7fTtcblx0cHJpdmF0ZSBfY2hhbm5lbE1hcCA6IE9iamVjdCA9IHt9O1xuXG5cdHByaXZhdGUgX2xvY2FsU3RyZWFtOiBNZWRpYVN0cmVhbTtcblxuXG5cdGNvbnN0cnVjdG9yKHN0cmVhbTogTWVkaWFTdHJlYW0sIHJvb21OYW1lIDogc3RyaW5nKSB7XG5cdFx0dGhpcy5fc29ja2V0ID0gaW8uY29ubmVjdChSdGNSb29tLlNJR05BTElOR19VUkwpO1xuXHRcdHRoaXMuX2xvY2FsU3RyZWFtID0gc3RyZWFtO1xuXHRcdHRoaXMuX3Jvb21JZCA9IHJvb21OYW1lO1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdC8vIFJlZ2lzdGVyIGhhbmRsZXJzIGFzIG5lZWRlZFxuXHRcdHRoaXMuX3NvY2tldC5vbignbXNnJywgKGRhdGEpID0+IHtcblx0XHRcdHNlbGYuaGFuZGxlTWVzc2FnZXMoZGF0YSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9zb2NrZXQub24oJ3BlZXIuY29ubmVjdGVkJywgKGRhdGEpID0+IHtcblx0XHRcdHNlbGYubWFrZU9mZmVyRm9yKGRhdGEuaWQpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fc29ja2V0Lm9uKCdwZWVyLmRpc2Nvbm5lY3RlZCcsIChkYXRhKSA9PiB7XG5cdFx0XHQvLyBSZW1vdmUgdGhlbSBwcm9wZXJseSBmcm9tIHRoZSBVST4/XG5cdFx0XHRjb25zb2xlLmxvZyhcInBlZXIgYWJvcnRlZFwiKTtcblx0XHR9KVxuXHR9XG5cblx0cHJpdmF0ZSBnZXRQZWVyQ29ubmVjdGlvbihpZDogc3RyaW5nKTogUlRDUGVlckNvbm5lY3Rpb24ge1xuXHRcdCAgICAgIGlmICh0aGlzLl9wZWVyTWFwW2lkXSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3BlZXJNYXBbaWRdO1xuXHRcdH1cblxuXHRcdHZhciBwYzogUlRDUGVlckNvbm5lY3Rpb24gPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oUnRjUm9vbS5JQ0VfQ09ORklHKTtcblxuXHRcdHRoaXMuX3BlZXJNYXBbaWRdID0gcGM7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0cGMuYWRkU3RyZWFtKHRoaXMuX2xvY2FsU3RyZWFtKTtcblxuXHRcdHBjLm9uaWNlY2FuZGlkYXRlID0gZnVuY3Rpb24oZXZudCkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJJQ0UgY2FuZGlkYXRlIHJlY2lldmVkLi4uIGJyb2FkY2FzdGluZyByZXF1ZXN0XCIpO1xuXHRcdFx0c2VsZi5fc29ja2V0LmVtaXQoJ21zZycsIHsgYnk6IHNlbGYuX2N1cnJlbnRJZCwgdG86IGlkLCBpY2U6IGV2bnQuY2FuZGlkYXRlLCB0eXBlOiAnaWNlJyB9KTtcblx0XHR9O1xuXHRcdHBjLm9uYWRkc3RyZWFtID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiR290IG5ldyBzdHJlYW0uLiBpbmZvcm0gVUk/XCIpO1xuXHRcdFx0c2VsZi50cmlnZ2VyKCduZXdzdHJlYW0nLCBldmVudCk7XG5cdFx0fTtcblxuXHRcdHBjLm9ucmVtb3Zlc3RyZWFtID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiU3RyZWFtIGxvc3RcIik7XG5cdFx0fVxuXHRcblx0XHRcblx0XHQvLyBDYWxsYmFja3MgZm9yIHRleHQgc3RyZWFtc1xuXHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0b3JkZXJlZDogZmFsc2Vcblx0XHR9XG5cdFx0XG5cdFx0dmFyIF9jaGFubmVsIDogUlRDRGF0YUNoYW5uZWwgPSBwYy5jcmVhdGVEYXRhQ2hhbm5lbChcImRhdGFcIiwgb3B0aW9ucyk7XG5cdFx0XG5cdFx0X2NoYW5uZWwub25vcGVuID0gKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJBdHRlbXB0ZWQgdG8gc2VuZCBkYXRhIGRvd24gdGhlIHBpcGUuXCIpO1xuXHRcdH07XG5cdFx0XG5cdFx0Ly8gTWFwcyB0byB0aGUgY2hhbm5lbFxuXHRcdHRoaXMuX2NoYW5uZWxNYXBbaWRdID0gX2NoYW5uZWw7XG5cdFx0XG5cdFx0cGMub25kYXRhY2hhbm5lbCA9IChldmVudCA6IGFueSkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZXZlbnQpO1xuXHRcdFx0Y29uc29sZS5sb2coXCJDaGFubmVsIHdhcyBjcmVhdGVkXCIpO1xuXHRcdFx0ZXZlbnQuY2hhbm5lbC5vbm1lc3NhZ2UgPSAocGF5bG9hZCkgPT4ge1xuXHRcdFx0XHRzZWxmLnRyaWdnZXIoJ2RhdGEnLCBwYXlsb2FkLmRhdGEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XG5cdFx0cmV0dXJuIHBjO1xuXHR9XG5cblx0cHJpdmF0ZSBtYWtlT2ZmZXJGb3IoaWQ6IHN0cmluZykge1xuXHRcdHZhciBwZWVyOiBSVENQZWVyQ29ubmVjdGlvbiA9IHRoaXMuZ2V0UGVlckNvbm5lY3Rpb24oaWQpO1xuXG5cdFx0cGVlci5jcmVhdGVPZmZlcigoZGVzY3JpcHRpb246IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbikgPT4ge1xuXHRcdFx0cGVlci5zZXRMb2NhbERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgb2ZmZXIgZm9yIFBlZXIuLi4gSUQ6IFwiICsgaWQpO1xuXHRcdFx0dGhpcy5fc29ja2V0LmVtaXQoJ21zZycsIHsgYnk6IHRoaXMuX2N1cnJlbnRJZCwgdG86IGlkLCBzZHA6IGRlc2NyaXB0aW9uLCB0eXBlOiAnc2RwLW9mZmVyJyB9KTtcblx0XHR9KVxuXHR9XG5cblx0cHJpdmF0ZSBoYW5kbGVNZXNzYWdlcyhtZXNzYWdlRGF0YTogYW55KSB7XG5cdFx0dmFyIHBlZXI6IFJUQ1BlZXJDb25uZWN0aW9uID0gdGhpcy5nZXRQZWVyQ29ubmVjdGlvbihtZXNzYWdlRGF0YS5ieSk7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0c3dpdGNoIChtZXNzYWdlRGF0YS50eXBlKSB7XG5cdFx0XHRjYXNlICdzZHAtb2ZmZXInOlxuXHRcdFx0XHRwZWVyLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24obWVzc2FnZURhdGEuc2RwKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ1NldHRpbmcgcmVtb3RlIGRlc2NyaXB0aW9uIGJ5IG9mZmVyJyk7XG5cdFx0XHRcdFx0cGVlci5jcmVhdGVBbnN3ZXIoZnVuY3Rpb24oc2RwKSB7XG5cdFx0XHRcdFx0XHRwZWVyLnNldExvY2FsRGVzY3JpcHRpb24oc2RwKTtcblx0XHRcdFx0XHRcdHNlbGYuX3NvY2tldC5lbWl0KCdtc2cnLCB7IGJ5OiBzZWxmLl9jdXJyZW50SWQsIHRvOiBtZXNzYWdlRGF0YS5ieSwgc2RwOiBzZHAsIHR5cGU6ICdzZHAtYW5zd2VyJyB9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlICdzZHAtYW5zd2VyJzpcblx0XHRcdFx0cGVlci5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKG1lc3NhZ2VEYXRhLnNkcCksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdTZXR0aW5nIHJlbW90ZSBkZXNjcmlwdGlvbiBieSBhbnN3ZXInKTtcblx0XHRcdFx0fSwgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAnaWNlJzpcblx0XHRcdFx0aWYgKG1lc3NhZ2VEYXRhLmljZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdBZGRpbmcgaWNlIGNhbmRpZGF0ZXMuLi4gT0shJyk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cobWVzc2FnZURhdGEpO1xuXHRcdFx0XHRcdHZhciBjYW5kOiBSVENJY2VDYW5kaWRhdGUgPSBuZXcgUlRDSWNlQ2FuZGlkYXRlKG1lc3NhZ2VEYXRhLmljZSk7XG5cdFx0XHRcdFx0cGVlci5hZGRJY2VDYW5kaWRhdGUoY2FuZCwgKCkgPT4geyB9LCAoKSA9PiB7IH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRcblx0LyoqXG4gXHQqIEF0dGVtcHRzIHRvIGNyZWF0ZSB0aGUgY3VycmVudCByb29tLlxuIFx0Ki9cblx0c3RhdGljIGNyZWF0ZVJvb20ocm9vbU5hbWUgOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuXHRcdHZhciBzb2NrZXQgOiBTb2NrZXQgPSBpby5jb25uZWN0KFJ0Y1Jvb20uU0lHTkFMSU5HX1VSTCk7XG5cdFx0XG5cdFx0c29ja2V0LmVtaXQoJ2luaXQnLCBudWxsLCAocm9vbSwgdXNlcklkKSA9PiB7XG5cdFx0XHRjYWxsYmFjayhyb29tLCB1c2VySWQpO1xuXHRcdFx0c29ja2V0LmRpc2Nvbm5lY3QoKTsgLy8gY2xvc2Ugb2ZmIHRoZSB0ZW1wb3JhcnkgY29ubmVjdGlvblxuXHRcdH0pO1xuXHR9XG5cblx0am9pbihjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHR0aGlzLl9zb2NrZXQuZW1pdCgnaW5pdCcsIHsgcm9vbTogdGhpcy5fcm9vbUlkIH0sIChyb29tLCB1c2VySWQpID0+IHtcblx0XHRcdHRoaXMuX2N1cnJlbnRJZCA9IHVzZXJJZDtcblx0XHRcdGNhbGxiYWNrKHVzZXJJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRzZW5kTWVzc2FnZShtZXNzYWdlIDogc3RyaW5nKSA6IHZvaWQge1xuXHRcdE9iamVjdC5rZXlzKHRoaXMuX2NoYW5uZWxNYXApLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0bGV0IGNoYW5uZWwgOiBSVENEYXRhQ2hhbm5lbCA9IHRoaXMuX2NoYW5uZWxNYXBba2V5XTtcblx0XHRcdGNoYW5uZWwuc2VuZChtZXNzYWdlKTtcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX2V2ZW50TWFwOiBPYmplY3QgPSB7fTtcblxuXHQvKipcblx0ICogQWxsb3dzIGxpc3RlbmluZyBmb3IgYSBwYXJ0aWN1bGFyIHNldCBvZiBsaXN0ZW5lcnMgZm9yIGEgY2VydGFpbiBldmVudFxuXHQgKi9cblx0b24oZXZlbnRUeXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbikge1xuXHRcdGlmICghdGhpcy5fZXZlbnRNYXBbZXZlbnRUeXBlXSlcblx0XHRcdHRoaXMuX2V2ZW50TWFwW2V2ZW50VHlwZV0gPSBbXTtcblxuXHRcdHRoaXMuX2V2ZW50TWFwW2V2ZW50VHlwZV0ucHVzaChsaXN0ZW5lcik7XG5cdH1cblxuXHRwcml2YXRlIHRyaWdnZXIoZXZlbnRUeXBlOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuXHRcdHRoaXMuX2V2ZW50TWFwW2V2ZW50VHlwZV0uZm9yRWFjaChsaXN0ZW5lciA9PiB7XG5cdFx0XHRsaXN0ZW5lcihkYXRhKTtcblx0XHR9KTtcblx0fVxuXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9