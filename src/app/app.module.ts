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
<<<<<<< HEAD
import { AddOrganizationPage } from '../pages/add-organization/add-organization';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
=======
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { AddOrganizationPage } from '../pages/add-organization/add-organization'
>>>>>>> 8d58149e111b989332e8d69bc751344fcace2cb2


firebase.initializeApp({
  apiKey: "AIzaSyCbq2cRI0kgYRsLvx7VvBKYrz-FobKtBME",
  authDomain: "pinhome-823ec.firebaseapp.com",
  databaseURL: "https://pinhome-823ec.firebaseio.com",
  projectId: "pinhome-823ec",
  storageBucket: "pinhome-823ec.appspot.com",
  messagingSenderId: "523364615140"
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
<<<<<<< HEAD
  AddOrganizationPage,
   EditProfilePage
=======
    EditProfilePage,
    AddOrganizationPage
>>>>>>> 8d58149e111b989332e8d69bc751344fcace2cb2
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
<<<<<<< HEAD
    AddOrganizationPage,
    EditProfilePage
=======
    EditProfilePage,
    AddOrganizationPage
>>>>>>> 8d58149e111b989332e8d69bc751344fcace2cb2
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
    NativeGeocoder
  ]
})
export class AppModule {}
