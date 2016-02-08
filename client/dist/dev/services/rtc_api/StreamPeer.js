var StreamPeer = (function () {
    function StreamPeer(peerConnection, token) {
        this._streams = [];
        this._token = token;
        this._connection = peerConnection;
    }
    StreamPeer.prototype.addStream = function (stream) {
        this._streams.push(stream);
        this._connection.addStream(stream);
    };
    StreamPeer.prototype.removeStream = function (stream) {
        var index = this._streams.indexOf(stream);
        if (index > -1) {
            this._streams.splice(index, 1);
        }
        this._connection.removeStream(stream);
    };
    StreamPeer.prototype.getStreams = function () {
        return this._streams;
    };
    return StreamPeer;
})();
exports.StreamPeer = StreamPeer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL3J0Y19hcGkvU3RyZWFtUGVlci50cyJdLCJuYW1lcyI6WyJTdHJlYW1QZWVyIiwiU3RyZWFtUGVlci5jb25zdHJ1Y3RvciIsIlN0cmVhbVBlZXIuYWRkU3RyZWFtIiwiU3RyZWFtUGVlci5yZW1vdmVTdHJlYW0iLCJTdHJlYW1QZWVyLmdldFN0cmVhbXMiXSwibWFwcGluZ3MiOiJBQUdBO0lBS0NBLG9CQUFZQSxjQUFrQ0EsRUFBRUEsS0FBY0E7UUFGdERDLGFBQVFBLEdBQXdCQSxFQUFFQSxDQUFDQTtRQUcxQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDcEJBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLGNBQWNBLENBQUNBO0lBQ25DQSxDQUFDQTtJQUVNRCw4QkFBU0EsR0FBaEJBLFVBQWlCQSxNQUFvQkE7UUFDcENFLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtJQUNwQ0EsQ0FBQ0E7SUFFTUYsaUNBQVlBLEdBQW5CQSxVQUFvQkEsTUFBb0JBO1FBQ3ZDRyxJQUFJQSxLQUFLQSxHQUFZQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUNuREEsRUFBRUEsQ0FBQUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDaENBLENBQUNBO1FBQ0RBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0lBQ3ZDQSxDQUFDQTtJQU9NSCwrQkFBVUEsR0FBakJBO1FBQ0NJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO0lBQ3RCQSxDQUFDQTtJQUVGSixpQkFBQ0E7QUFBREEsQ0FoQ0EsQUFnQ0NBLElBQUE7QUFoQ1ksa0JBQVUsYUFnQ3RCLENBQUEiLCJmaWxlIjoic2VydmljZXMvcnRjX2FwaS9TdHJlYW1QZWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXByZXNlbnRzIGEgcmVtb3RlIHBlZXIgXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJlYW1QZWVyIHtcblx0cHJpdmF0ZSBfdG9rZW4gOiBzdHJpbmc7XG5cdHByaXZhdGUgX2Nvbm5lY3Rpb24gOiBSVENQZWVyQ29ubmVjdGlvbjtcblx0cHJpdmF0ZSBfc3RyZWFtcyA6IEFycmF5PE1lZGlhU3RyZWFtPiA9IFtdO1xuXHRcblx0Y29uc3RydWN0b3IocGVlckNvbm5lY3Rpb24gOiBSVENQZWVyQ29ubmVjdGlvbiwgdG9rZW4gOiBzdHJpbmcpIHtcblx0XHR0aGlzLl90b2tlbiA9IHRva2VuO1xuXHRcdHRoaXMuX2Nvbm5lY3Rpb24gPSBwZWVyQ29ubmVjdGlvbjtcblx0fVxuXHRcblx0cHVibGljIGFkZFN0cmVhbShzdHJlYW0gOiBNZWRpYVN0cmVhbSkge1x0XHRcblx0XHR0aGlzLl9zdHJlYW1zLnB1c2goc3RyZWFtKTtcblx0XHR0aGlzLl9jb25uZWN0aW9uLmFkZFN0cmVhbShzdHJlYW0pO1xuXHR9XG5cdFxuXHRwdWJsaWMgcmVtb3ZlU3RyZWFtKHN0cmVhbSA6IE1lZGlhU3RyZWFtKSB7XG5cdFx0dmFyIGluZGV4IDogbnVtYmVyID0gdGhpcy5fc3RyZWFtcy5pbmRleE9mKHN0cmVhbSk7XG5cdFx0aWYoaW5kZXggPiAtMSkge1xuXHRcdFx0dGhpcy5fc3RyZWFtcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdH1cblx0XHR0aGlzLl9jb25uZWN0aW9uLnJlbW92ZVN0cmVhbShzdHJlYW0pO1xuXHR9XG5cdFxuXHQvKipcblx0ICogRmV0Y2hlcyBhbGwgYWN0aXZlIHN0cmVhbXMgYnkgdGhpcyBwZWVyLiBUaGlzIGlzIG9mdGVuIHVzZWZ1bCB3aGVuIGNsZWFuaW5nIHVwIGFmdGVyIGEgcGVlciB0aGF0IGhhcyBkaXNjb25uZWN0ZWQuXG5cdCAqIEFsbCBzdHJlYW1zIGZldGNoZWQgZnJvbSB0aGlzIGFyZSB2YWxpZCBhdCB0aGUgdGltZSBvZiBjb2xsZWN0aW9uLCAgaG93ZXZlciwgaXQgaXMgcG9zc2libGUgZm9yIHRoZSBzdHJlYW1zIHRvIGJlY29tZVxuXHQgKiBpbnZhbGlkIGlmIHRoZSBzdHJlYW0gbGlzdCBpcyBjYWNoZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0U3RyZWFtcygpIDogQXJyYXk8TWVkaWFTdHJlYW0+IHtcblx0XHRyZXR1cm4gdGhpcy5fc3RyZWFtcztcblx0fVxuXHRcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=