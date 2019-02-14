import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { PlaceObject} from '../../app/class';
import { SignInPage } from '../sign-in/sign-in';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { ScreenOrientation } from '@ionic-native/screen-orientation';






/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  name: any;
  email;
  password;
  PlaceObject = {} as object;
  errMsg;
  surname;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public loadingCtrl: LoadingController,public pinhomeProvider: PinhomeProvider,public alertCtrl:AlertController, public screenOrientation: ScreenOrientation, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }
  SignUp() {
    if (this.name == undefined,
      this.email == undefined || this.email == null,
      this.password == undefined || this.password == null) {
      const alert = this.alertCtrl.create({
        // title: "Oops! ",
        subTitle: "Please enter your valid name,email and password to login.",
        buttons: ['OK'],
        cssClass : 'myAlert',
      });
      alert.present();
    }
    else if (this.email == undefined || this.email == null) {
      const alert = this.alertCtrl.create({
        // title: "No Email",
        subTitle: "Email address cannot be left empty.",
        buttons: ['OK'],
        cssClass : 'myAlert',
      });
      alert.present();
    }
    else if (this.password == undefined || this.password == null) {
      const alert = this.alertCtrl.create({
        // title: "No Password",
        subTitle: "Password cannot be left empty",
        buttons: ['OK'],
        cssClass : 'myAlert',
      });
      alert.present();
    }
    else if (this.name == undefined) {
      const alert = this.alertCtrl.create({
        // title: "No Name",
        subTitle: " Name cannot be left empty.",
        buttons: ['OK'],
        cssClass : 'myAlert',
      });
      alert.present();
    }
    else {
      this.pinhomeProvider.Signup(this.email,this.password,this.name).then(() => {
        // this.presentLoading1();
        this.navCtrl.push(ProfilePage);
      }, (error) => {
        console.log(error.message);
      })
    }
  }

  presentLoading1() {
    const loader = this.loadingCtrl.create({
      content: "loading....",
      duration: 4000
    });
    loader.present();
  }
  Back(){
this.navCtrl.pop()  
}

lockOrientation() {
  this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
}

}



