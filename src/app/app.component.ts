import { Component } from '@angular/core';

import { MenuController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalStorageService } from './shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages: Array<{title: string, url: string, icon: string}>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localStorageService: LocalStorageService,
    private menuController: MenuController,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.initializeApp();
    this.appPages = [
      { title: '开店论坛', url: 'tabs/home', icon: 'chatbox' },
      { title: '手机橱窗', url: 'tabs/home', icon: 'create' },
      { title: '邀请有礼', url: 'tabs/home', icon: 'git-merge' },
      { title: '资金账户', url: 'tabs/home', icon: 'cash' },
      { title: '反馈建议', url: 'tabs/home', icon: 'mail' },
      { title: '帮助中心', url: 'tabs/home', icon: 'help-circle' }
    ];
  }
  public shopName = '';
  public phone = '';

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      const user = this.localStorageService.get('user', '');
      if ( user != null) {
        this.shopName = user.shopName;
        this.phone = user.accounts[0].identifier;
      }
    });
  }

  ionViewWillEnter(){
    this.menuController.enable(false);
    console.log('1111111111');
  }
  ionViewDidLeave() {
    this.menuController.enable(true);
  }

  goToSetting() {
    this.ionViewWillEnter();
    console.log('go to setting page');
    this.router.navigateByUrl('/me/setting');
  }
}
