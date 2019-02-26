import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { ViewPage } from '../pages/view/view'
import { HomePage } from '../pages/home/home';
import { NearbyOrgPage } from '../pages/nearby-org/nearby-org';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { SignInPage } from '../pages/sign-in/sign-in'
import { ProfilePage } from '../pages/profile/profile';

import { EditProfilePage } from '../pages/edit-profile/edit-profile'

import { PinhomeProvider } from '../providers/pinhome/pinhome';

import { AddOrganizationPage } from '../pages/add-organization/add-organization';

import { timer } from 'rxjs/observable/timer'


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  showSplash = true;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public pinhomeProvider: PinhomeProvider) {

    platform.ready().then(() => {

      pinhomeProvider.checkstate().then((data: any) => {
        if (data == 1) {
          this.rootPage = HomePage
        }
        else {
          this.rootPage = SignInPage
        }
      })
      // Okay, so the plSignInPageatform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();
      this.c()
    });


  }

  c() {
    timer(3000).subscribe(() => this.showSplash = false)
  }
}