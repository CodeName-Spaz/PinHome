import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// import firebase from 'firebase';
import firebase from 'firebase';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PinhomeProvider } from '../providers/pinhome/pinhome';
import { Geolocation } from '@ionic-native/geolocation';
import { ViewPage } from '../pages/view/view';


import { GoogleMaps } from '@ionic-native/google-maps';
import { NearbyOrgPage } from '../pages/nearby-org/nearby-org';
import { EmailComposer } from '@ionic-native/email-composer';
import { CallNumber } from '@ionic-native/call-number';
import { LaunchNavigator } from '@ionic-native/launch-navigator';


import { IonicImageViewerModule } from 'ionic-img-viewer';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { ProfilePage } from '../pages/profile/profile';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { AddOrganizationPage } from '../pages/add-organization/add-organization'

import { ScreenOrientation } from '@ionic-native/screen-orientation';



firebase.initializeApp({
  apiKey: "AIzaSyD_x4Z2kN-f2La1wNzDvgD2S3kKQHEWPBs",
  authDomain: "pinhome2-0.firebaseapp.com",
  databaseURL: "https://pinhome2-0.firebaseio.com",
  projectId: "pinhome2-0",
  storageBucket: "pinhome2-0.appspot.com",
  messagingSenderId: "966103659311"
})

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ViewPage,
    NearbyOrgPage,
    SignInPage,
    SignUpPage,
    ProfilePage,
    EditProfilePage,
    AddOrganizationPage
    // IonicImageViewerModule
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ViewPage,
    NearbyOrgPage,
    SignUpPage,
    SignInPage,
    ProfilePage,
    EditProfilePage,
    AddOrganizationPage
    // IonicImageViewerModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PinhomeProvider,
    Geolocation,
    GoogleMaps,
    EmailComposer,
    CallNumber,
    LaunchNavigator,
    ScreenOrientation
  ]
})
export class AppModule {}
