import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import firebase from 'firebase'
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PinhomeProvider } from '../providers/pinhome/pinhome';
import { ViewPage } from '../pages/view/view';
import { Geolocation } from '@ionic-native/geolocation';
<<<<<<< HEAD
import { NativeGeocoder } from '@ionic-native/native-geocoder';
=======
//import { NativeGeocoder } from '@ionic-native/native-geocoder';

firebase.initializeApp({
  apiKey: "AIzaSyCbq2cRI0kgYRsLvx7VvBKYrz-FobKtBME",
  authDomain: "pinhome-823ec.firebaseapp.com",
  databaseURL: "https://pinhome-823ec.firebaseio.com",
  projectId: "pinhome-823ec",
  storageBucket: "pinhome-823ec.appspot.com",
  messagingSenderId: "523364615140"
})
>>>>>>> c2c18daf5a17dcfed420f94b18851a49a357c137

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PinhomeProvider,
<<<<<<< HEAD
   Geolocation,
   NativeGeocoder
=======
    Geolocation,
    //NativeGeocoder
>>>>>>> c2c18daf5a17dcfed420f94b18851a49a357c137
  ]
})
export class AppModule {}
