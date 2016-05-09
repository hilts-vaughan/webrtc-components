import {ControllerConfiguration} from "../../services/rtc_api/ControllerConfiguration";
import {StreamController} from "../../services/rtc_api/StreamController";
import {Component, NgModel, CORE_DIRECTIVES, ChangeDetectionStrategy, ChangeDetectorRef, Output, Input} from 'angular2/angular2';
import {Router} from 'angular2/router'

@Component({
  selector: 'login',
  templateUrl: './components/login/login.html',
  styleUrls: ['./components/login/login.css'],
  directives: [CORE_DIRECTIVES]
})

export class LoginComponent {

  // This controller has to be setup initially for the login, so we can do it here
  private _streamController: StreamController = new StreamController(new ControllerConfiguration("http://192.168.1.160:1239/", "WLU-HOPPER"));
  @Input() private username : string = "default";
  @Input() private password : string;


  constructor(private router : Router) {
    window['instanceStream'] = this._streamController;
  }

  /**
   * This method will authenticate the user into the gateway server.
   * @return {[type]} [description]
   */
  login() {
    this.username = document.getElementById('user-form')['value']
    this.password = document.getElementById('password-form')['value']

    this._streamController.authenticate(this.username, this.password, (success) => {
      if(success) {
        this.router.navigate(['Home']);
      } else {
        alert("Invalid credentials");
      }
    })
  }

}
