var ControllerConfiguration = (function () {
    function ControllerConfiguration(url, context) {
        this._serverUrl = url;
        this._context = context;
    }
    Object.defineProperty(ControllerConfiguration.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControllerConfiguration.prototype, "url", {
        get: function () {
            return this._serverUrl;
        },
        enumerable: true,
        configurable: true
    });
    return ControllerConfiguration;
})();
exports.ControllerConfiguration = ControllerConfiguration;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL3J0Y19hcGkvQ29udHJvbGxlckNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOlsiQ29udHJvbGxlckNvbmZpZ3VyYXRpb24iLCJDb250cm9sbGVyQ29uZmlndXJhdGlvbi5jb25zdHJ1Y3RvciIsIkNvbnRyb2xsZXJDb25maWd1cmF0aW9uLmNvbnRleHQiLCJDb250cm9sbGVyQ29uZmlndXJhdGlvbi51cmwiXSwibWFwcGluZ3MiOiJBQUdBO0lBS0NBLGlDQUFZQSxHQUFZQSxFQUFFQSxPQUFnQkE7UUFDekNDLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ3RCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtJQUN6QkEsQ0FBQ0E7SUFFREQsc0JBQUlBLDRDQUFPQTthQUFYQTtZQUNDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUN0QkEsQ0FBQ0E7OztPQUFBRjtJQUVEQSxzQkFBSUEsd0NBQUdBO2FBQVBBO1lBQ0NHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBO1FBQ3hCQSxDQUFDQTs7O09BQUFIO0lBRUZBLDhCQUFDQTtBQUFEQSxDQWxCQSxBQWtCQ0EsSUFBQTtBQWxCWSwrQkFBdUIsMEJBa0JuQyxDQUFBIiwiZmlsZSI6InNlcnZpY2VzL3J0Y19hcGkvQ29udHJvbGxlckNvbmZpZ3VyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFByb3ZpZGVzIGEgY29uZmlndXJhdGlvbiBmb3Ige1J0Y0NvbnRyb2xsZXJ9IHRvIHVzZS4gUHJvdmlkZXMgaW5mb3JtYXRpb24gbGlrZSBjb250ZXh0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJDb25maWd1cmF0aW9uIHtcblx0XG5cdHByaXZhdGUgX3NlcnZlclVybCA6IHN0cmluZztcblx0cHJpdmF0ZSBfY29udGV4dCA6IHN0cmluZztcblx0XG5cdGNvbnN0cnVjdG9yKHVybCA6IHN0cmluZywgY29udGV4dCA6IHN0cmluZykge1xuXHRcdHRoaXMuX3NlcnZlclVybCA9IHVybDtcblx0XHR0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcblx0fVxuXHRcblx0Z2V0IGNvbnRleHQoKSA6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQ7XG5cdH1cblx0XHRcblx0Z2V0IHVybCgpIDogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5fc2VydmVyVXJsO1xuXHR9XG5cdFxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==