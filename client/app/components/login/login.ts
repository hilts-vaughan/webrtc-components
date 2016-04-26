import {ControllerConfiguration} from "../../services/rtc_api/ControllerConfiguration";
import {StreamController} from "../../services/rtc_api/StreamController";
import {Component, CORE_DIRECTIVES, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/angular2';

@Component({
  selector: 'login',
  templateUrl: './components/login/login.html',
  styleUrls: ['./components/login/login.css'],
  directives: [CORE_DIRECTIVES]
})

export class LoginComponent {

  // This controller has to be setup initially for the login, so we can do it here
  private _streamController: StreamController = new StreamController(new ControllerConfiguration("http://localhost:1239/", "WLU-HOPPER"));

  constructor() {

  }

  /**
   * This method will authenticate the user into the gateway server.
   * @return {[type]} [description]
   */
  login() {
    this._streamController.authenticate(x, y, (success) => {
      if(success) {
        // move on
      } else {
        alert("Invalid credentials");
      }
    })
  }

}
