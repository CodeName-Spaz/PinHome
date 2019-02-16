import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,LoadingController } from 'ionic-angular';
import { PlaceObject } from '../../app/class';
import { SignUpPage } from '../sign-up/sign-up';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import { ThrowStmt } from '@angular/compiler';
import { ViewPage } from '../view/view';
import firebase from 'firebase';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

ScreenOrientation



/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  // PinhomeProvider: any;
  email;
  password;
  PlaceObject = {} as object;
  errMsg;
  option = this.navParams.get('option');
  obj = this.navParams.get('obj');
  out = this.navParams.get('out');

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public pinhomeProvider: PinhomeProvider, public screenOrientation: ScreenOrientation, public loadingCtrl: LoadingController ) {
  }

  ionViewDidLoad() {
    console.log(this.obj);
  }


  SignIn(email:string,password:string) {
    console.log(email,password)
    this.pinhomeProvider.loginx(email,password).then((user) => {
      console.log(user);
      if (user.user.emailVerified == true) {
        if (email == undefined
          || password == undefined) {
          const alert = this.alertCtrl.create({
            // title: "Oh no! ",
            subTitle: "Please enter your valid email and password to login.",
            buttons: ['OK'],
            cssClass : 'myAlert',
          });
        } else if (this.email == "") {
          const alert = this.alertCtrl.create({
            // title: "No Email",
            subTitle: "Your email can't be blank.",
            buttons: ['OK'],
            cssClass : 'myAlert',
          });
          alert.present();
        }
        else if (password == "") {
          const alert = this.alertCtrl.create({
            // title: "No Password",
            subTitle: "Your password can't be blank",
            buttons: ['OK'],
            cssClass : 'myAlert',
          });
          alert.present();
        }
        this.navCtrl.setRoot(HomePage);
      }
    }).catch((error) => {
      const alert = this.alertCtrl.create({
        // title: "No Password",
        subTitle: error.message,
        buttons: ['OK'],
        cssClass : 'myAlert',
      });
      alert.present();
    })
  }

  GoToSignup() {
    this.navCtrl.push(SignUpPage)
  }
  Back() {
    this.navCtrl.pop()
  }
  Explore() {
    this.navCtrl.setRoot(HomePage);
  }



  forgotpassword(PlaceObject: object) {
    return new Promise((resolve, reject) => {
      if (this.email == null || this.email == undefined) {
        const alert = this.alertCtrl.create({
          title: 'Forgot your password?',
          message: "We just need your registered email address to reset your password.",
          inputs: [
            {
              name: 'title',
              placeholder: 'Your email address'
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Send',
              handler: data => {
                console.log('Saved clicked');
              }
            }
          ],
        });
        alert.present();
      }
      else if (this.email != null || this.email != undefined) {
        firebase.auth().sendPasswordResetEmail(this.email).then(() => {
          const alert = this.alertCtrl.create({
            title: 'Password request Sent',
            subTitle: "We've sent you and email with a reset link, go to your email to recover your account.",
            buttons: ['OK'],
            cssClass: 'myAlert'

          });
          alert.present();
          resolve()
        }, Error => {
          const alert = this.alertCtrl.create({
            subTitle: Error.message,
            buttons: ['OK'],
          });
          alert.present();
          resolve()
        });
      }
    }).catch((error) => {
      const alert = this.alertCtrl.create({
        subTitle: error.message,
        buttons: [
          {
            text: 'ok',
            handler: data => {
              console.log('Cancel clicked');
            }
          }
        ],
        cssClass: 'myAlert'
      });
      alert.present();
    })
  }
  lockOrientation() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }


}