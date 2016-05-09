import {Component, ViewEncapsulation} from 'angular2/angular2';
import {
  RouteConfig,
  ROUTER_DIRECTIVES,
  Router
} from 'angular2/router';
// import {HTTP_PROVIDERS} from 'http/http';

import {HomeCmp} from '../home/home';
import {RoomCmp} from '../rooms/rooms';
import {LoginComponent} from '../login/login'
import {NameList} from '../../services/name_list';
import {StreamList} from '../../services/StreamList';
import {VideoStream} from '../../services/VideoStream';

@Component({
  selector: 'app',
  viewProviders: [NameList, VideoStream, StreamList],
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '/', component: LoginComponent, as: 'Login' },
  { path: '/home', component: HomeCmp, as: 'Home' },
  { path: '/rooms', component: RoomCmp, as: 'Room' }
])

export class AppCmp {

  constructor(private router : Router) {
    // This route is the default, no matter where you load on the page
    // to prevent crashes and the like
    this.router.navigate(['Login']);
  }

}
