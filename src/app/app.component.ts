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
<<<<<<< HEAD

import { AddOrganizationPage } from '../pages/add-organization/add-organization';



=======
import { EditProfilePage } from '../pages/edit-profile/edit-profile'
>>>>>>> 8d58149e111b989332e8d69bc751344fcace2cb2
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
<<<<<<< HEAD


    platform.ready().then(() => {
      this.rootPage = HomePage;

=======
    platform.ready().then(() => {
<<<<<<< HEAD
      this.rootPage = HomePage;
=======
      this.rootPage = EditProfilePage;
>>>>>>> 8d58149e111b989332e8d69bc751344fcace2cb2
>>>>>>> 9b0603ae8743caf5c76db55b0b1d7d6145040303
      ;
      // Okay, so the plSignInPageatform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
