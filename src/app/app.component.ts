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
import { PinhomeProvider } from '../providers/pinhome/pinhome';
<<<<<<< HEAD
import { AddOrganizationPage } from '../pages/add-organization/add-organization'
=======
>>>>>>> e829aa534074054f1c7284cfe74390f08bd15616
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

<<<<<<< HEAD

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.rootPage = HomePage;
      ;
      // Okay, so the plSignInPageatform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
=======
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public PinhomeProvider: PinhomeProvider) {
    PinhomeProvider.checkstate().then((data:any)=>{
      if (data ==1){
        this.rootPage = HomePage;
      }
      else {
        this.rootPage = SignInPage
      }
     });
>>>>>>> e829aa534074054f1c7284cfe74390f08bd15616
  }
}
