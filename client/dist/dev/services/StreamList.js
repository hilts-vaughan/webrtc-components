var StreamList = (function () {
    function StreamList() {
        this.streams = [];
    }
    StreamList.prototype.get = function () {
        return this.streams;
    };
    StreamList.prototype.add = function (value) {
        this.streams.push(value);
    };
    return StreamList;
})();
exports.StreamList = StreamList;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL1N0cmVhbUxpc3QudHMiXSwibmFtZXMiOlsiU3RyZWFtTGlzdCIsIlN0cmVhbUxpc3QuY29uc3RydWN0b3IiLCJTdHJlYW1MaXN0LmdldCIsIlN0cmVhbUxpc3QuYWRkIl0sIm1hcHBpbmdzIjoiQUFHQTtJQUFBQTtRQUNFQyxZQUFPQSxHQUFHQSxFQUFFQSxDQUFDQTtJQVFmQSxDQUFDQTtJQU5DRCx3QkFBR0EsR0FBSEE7UUFDRUUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7SUFDdEJBLENBQUNBO0lBQ0RGLHdCQUFHQSxHQUFIQSxVQUFJQSxLQUFhQTtRQUNmRyxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFDSEgsaUJBQUNBO0FBQURBLENBVEEsQUFTQ0EsSUFBQTtBQVRZLGtCQUFVLGFBU3RCLENBQUEiLCJmaWxlIjoic2VydmljZXMvU3RyZWFtTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUHJvdmlkZXMgYSBzZXQgb2Ygc3RyZWFtcyBlbmNhcHVzbGF0ZWQgaW50byBhIGxpc3QuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJlYW1MaXN0IHtcbiAgc3RyZWFtcyA9IFtdO1xuICBcbiAgZ2V0KCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5zdHJlYW1zOyAgICBcbiAgfVxuICBhZGQodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc3RyZWFtcy5wdXNoKHZhbHVlKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9