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
<<<<<<< HEAD
import { SignUpPage } from '../pages/sign-up/sign-up';
import { SignInPage } from '../pages/sign-in/sign-in';
import { ProfilePage } from '../pages/profile/profile';
//import { NativeGeocoder } from '@ionic-native/native-geocoder';
=======
import { ViewPage } from '../pages/view/view';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NearbyOrgPage } from '../pages/nearby-org/nearby-org';
>>>>>>> b59fd0333f60653f485e4f8a8c27889716d62bec

firebase.initializeApp({
  apiKey: "AIzaSyCbq2cRI0kgYRsLvx7VvBKYrz-FobKtBME",
  authDomain: "pinhome-823ec.firebaseapp.com",
  databaseURL: "https://pinhome-823ec.firebaseio.com",
  projectId: "pinhome-823ec",
  storageBucket: "pinhome-823ec.appspot.com",
  messagingSenderId: "523364615140"
})
<<<<<<< HEAD


=======
>>>>>>> b59fd0333f60653f485e4f8a8c27889716d62bec

@NgModule({
  declarations: [
    MyApp,
<<<<<<< HEAD
    HomePage,
    ViewPage,
    SignUpPage,
    SignInPage,
    ProfilePage
=======
    HomePage,ViewPage,
    NearbyOrgPage
>>>>>>> b59fd0333f60653f485e4f8a8c27889716d62bec
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
<<<<<<< HEAD
    HomePage,
    ViewPage,
    SignUpPage,
    SignInPage,
    ProfilePage
=======
    HomePage,ViewPage,
    NearbyOrgPage
>>>>>>> b59fd0333f60653f485e4f8a8c27889716d62bec
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PinhomeProvider,
    Geolocation,
<<<<<<< HEAD
    //NativeGeocoder
=======
    GoogleMaps
>>>>>>> b59fd0333f60653f485e4f8a8c27889716d62bec
  ]
})
export class AppModule {}
