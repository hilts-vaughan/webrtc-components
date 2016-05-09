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
var ControllerConfiguration_1 = require("../../services/rtc_api/ControllerConfiguration");
var StreamController_1 = require("../../services/rtc_api/StreamController");
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var LoginComponent = (function () {
    function LoginComponent(router) {
        this.router = router;
        this._streamController = new StreamController_1.StreamController(new ControllerConfiguration_1.ControllerConfiguration("http://192.168.1.160:1239/", "WLU-HOPPER"));
        this.username = "default";
        window['instanceStream'] = this._streamController;
    }
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.username = document.getElementById('user-form')['value'];
        this.password = document.getElementById('password-form')['value'];
        this._streamController.authenticate(this.username, this.password, function (success) {
            if (success) {
                _this.router.navigate(['Home']);
            }
            else {
                alert("Invalid credentials");
            }
        });
    };
    __decorate([
        angular2_1.Input(), 
        __metadata('design:type', String)
    ], LoginComponent.prototype, "username");
    __decorate([
        angular2_1.Input(), 
        __metadata('design:type', String)
    ], LoginComponent.prototype, "password");
    LoginComponent = __decorate([
        angular2_1.Component({
            selector: 'login',
            template: "\n    <div class=\"centered\">\n        <h1 style=\"text-align: center; margin-bottom: 32px;\">Please login</h1>\n        <div class=\"button-wrapper\">\n          <input id=\"user-form\"  name=\"username\" placeholder=\"Username\" type=\"text\" />\n          <input id=\"password-form\"  name=\"password\" placeholder=\"Password\" class=\"right\" type=\"password\" />\n        </div>\n\n        <div class=\"button-wrapper\">\n          <a (click)=\"login()\" class=\"btn\">Login</a>\n        </div>\n      </div>\n  ",
            styles: ["\n\n  "],
            directives: [angular2_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], LoginComponent);
    return LoginComponent;
})();
exports.LoginComponent = LoginComponent;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvbG9naW4vbG9naW4udHMiXSwibmFtZXMiOlsiTG9naW5Db21wb25lbnQiLCJMb2dpbkNvbXBvbmVudC5jb25zdHJ1Y3RvciIsIkxvZ2luQ29tcG9uZW50LmxvZ2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHdDQUFzQyxnREFBZ0QsQ0FBQyxDQUFBO0FBQ3ZGLGlDQUErQix5Q0FBeUMsQ0FBQyxDQUFBO0FBQ3pFLHlCQUE2RyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ2pJLHVCQUFxQixpQkFFckIsQ0FBQyxDQUZxQztBQUV0QztJQTZCRUEsd0JBQW9CQSxNQUFlQTtRQUFmQyxXQUFNQSxHQUFOQSxNQUFNQSxDQUFTQTtRQUwzQkEsc0JBQWlCQSxHQUFxQkEsSUFBSUEsbUNBQWdCQSxDQUFDQSxJQUFJQSxpREFBdUJBLENBQUNBLDRCQUE0QkEsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDM0hBLGFBQVFBLEdBQVlBLFNBQVNBLENBQUNBO1FBSzdDQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0E7SUFDcERBLENBQUNBO0lBTURELDhCQUFLQSxHQUFMQTtRQUFBRSxpQkFXQ0E7UUFWQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsUUFBUUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQUE7UUFDN0RBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUFBO1FBRWpFQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFVBQUNBLE9BQU9BO1lBQ3hFQSxFQUFFQSxDQUFBQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWEEsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakNBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNOQSxLQUFLQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBO1lBQy9CQSxDQUFDQTtRQUNIQSxDQUFDQSxDQUFDQSxDQUFBQTtJQUNKQSxDQUFDQTtJQXZCREY7UUFBQ0EsZ0JBQUtBLEVBQUVBOztPQUFTQSxvQ0FBUUEsRUFBc0JBO0lBQy9DQTtRQUFDQSxnQkFBS0EsRUFBRUE7O09BQVNBLG9DQUFRQSxFQUFVQTtJQTFCckNBO1FBQUNBLG9CQUFTQSxDQUFDQTtZQUNUQSxRQUFRQSxFQUFFQSxPQUFPQTtZQUNqQkEsUUFBUUEsRUFBRUEsd2dCQVlUQTtZQUNEQSxNQUFNQSxFQUFFQSxDQUFDQSxRQUVSQSxDQUFDQTtZQUNGQSxVQUFVQSxFQUFFQSxDQUFDQSwwQkFBZUEsQ0FBQ0E7U0FDOUJBLENBQUNBOzt1QkErQkRBO0lBQURBLHFCQUFDQTtBQUFEQSxDQWxEQSxBQWtEQ0EsSUFBQTtBQTdCWSxzQkFBYyxpQkE2QjFCLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy9sb2dpbi9sb2dpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29udHJvbGxlckNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9ydGNfYXBpL0NvbnRyb2xsZXJDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge1N0cmVhbUNvbnRyb2xsZXJ9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9ydGNfYXBpL1N0cmVhbUNvbnRyb2xsZXJcIjtcbmltcG9ydCB7Q29tcG9uZW50LCBOZ01vZGVsLCBDT1JFX0RJUkVDVElWRVMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgT3V0cHV0LCBJbnB1dH0gZnJvbSAnYW5ndWxhcjIvYW5ndWxhcjInO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcidcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbG9naW4nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJjZW50ZXJlZFwiPlxuICAgICAgICA8aDEgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7IG1hcmdpbi1ib3R0b206IDMycHg7XCI+UGxlYXNlIGxvZ2luPC9oMT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi13cmFwcGVyXCI+XG4gICAgICAgICAgPGlucHV0IGlkPVwidXNlci1mb3JtXCIgIG5hbWU9XCJ1c2VybmFtZVwiIHBsYWNlaG9sZGVyPVwiVXNlcm5hbWVcIiB0eXBlPVwidGV4dFwiIC8+XG4gICAgICAgICAgPGlucHV0IGlkPVwicGFzc3dvcmQtZm9ybVwiICBuYW1lPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCIgY2xhc3M9XCJyaWdodFwiIHR5cGU9XCJwYXNzd29yZFwiIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24td3JhcHBlclwiPlxuICAgICAgICAgIDxhIChjbGljayk9XCJsb2dpbigpXCIgY2xhc3M9XCJidG5cIj5Mb2dpbjwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbYFxuXG4gIGBdLFxuICBkaXJlY3RpdmVzOiBbQ09SRV9ESVJFQ1RJVkVTXVxufSlcblxuZXhwb3J0IGNsYXNzIExvZ2luQ29tcG9uZW50IHtcblxuICAvLyBUaGlzIGNvbnRyb2xsZXIgaGFzIHRvIGJlIHNldHVwIGluaXRpYWxseSBmb3IgdGhlIGxvZ2luLCBzbyB3ZSBjYW4gZG8gaXQgaGVyZVxuICBwcml2YXRlIF9zdHJlYW1Db250cm9sbGVyOiBTdHJlYW1Db250cm9sbGVyID0gbmV3IFN0cmVhbUNvbnRyb2xsZXIobmV3IENvbnRyb2xsZXJDb25maWd1cmF0aW9uKFwiaHR0cDovLzE5Mi4xNjguMS4xNjA6MTIzOS9cIiwgXCJXTFUtSE9QUEVSXCIpKTtcbiAgQElucHV0KCkgcHJpdmF0ZSB1c2VybmFtZSA6IHN0cmluZyA9IFwiZGVmYXVsdFwiO1xuICBASW5wdXQoKSBwcml2YXRlIHBhc3N3b3JkIDogc3RyaW5nO1xuXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXIgOiBSb3V0ZXIpIHtcbiAgICB3aW5kb3dbJ2luc3RhbmNlU3RyZWFtJ10gPSB0aGlzLl9zdHJlYW1Db250cm9sbGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgYXV0aGVudGljYXRlIHRoZSB1c2VyIGludG8gdGhlIGdhdGV3YXkgc2VydmVyLlxuICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGxvZ2luKCkge1xuICAgIHRoaXMudXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1mb3JtJylbJ3ZhbHVlJ11cbiAgICB0aGlzLnBhc3N3b3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bhc3N3b3JkLWZvcm0nKVsndmFsdWUnXVxuXG4gICAgdGhpcy5fc3RyZWFtQ29udHJvbGxlci5hdXRoZW50aWNhdGUodGhpcy51c2VybmFtZSwgdGhpcy5wYXNzd29yZCwgKHN1Y2Nlc3MpID0+IHtcbiAgICAgIGlmKHN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWydIb21lJ10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGNyZWRlbnRpYWxzXCIpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9