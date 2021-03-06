import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import firebase from 'firebase';
import { HomePage } from '../home/home';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ViewPage } from '../view/view';
import { unescapeIdentifier } from '@angular/compiler';
import { SignInPage } from '../sign-in/sign-in';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  detailArray = new Array();

  downloadurl = "../../assets/imgs/Defaults/default.jpg";
  coverUrl = "../../assets/imgs/Defaults/defaultCover1.jpg";
  popState=0;
  option = this.navParams.get('optionObject');

  totrating = 0;
  ratings = new Array();
 
  constructor(public pinhome : PinhomeProvider,public navCtrl: NavController, public navParams: NavParams, public pinhomeProvider: PinhomeProvider, public alertCtrl: AlertController) {
  }

  ionViewDidEnter() {
    this.detailArray.length = 0;
    console.log('ionViewDidLoad ProfilePage');
    let userID = firebase.auth().currentUser;
    firebase.database().ref("profiles/" + userID.uid).on('value', (data: any) => {
      let details = data.val();
      this.detailArray.length = 0;
      console.log(details)
      this.detailArray.push(details);
    });
    this.pinhome.getTotalRatings().then((data:any) =>{
      this.ratings.length =0;
      this.totrating = this.pinhome.getTotRating();
      if (this.totrating == undefined || this.totrating == null){
        this.totrating = 0;
      }
      this.ratings = data;
      console.log(this.ratings)
    })

  }

  GoTOHomePage() {
    this.navCtrl.pop();
  }

  viewMore(ind){
    this.navCtrl.push(ViewPage, { orgObject:this.ratings[ind] });
  }

  bodyClick(){
    this.removePopper()
  }

  scroller(event) {
    console.log(event.scrollTop);
    var mvtOfgreen = document.getElementsByClassName("greenBar") as HTMLCollectionOf<HTMLElement>;
    var bar = document.getElementsByClassName("colorThing") as HTMLCollectionOf<HTMLElement>;
    var hiderLeft = document.getElementsByClassName("theFab") as HTMLCollectionOf<HTMLElement>;
    var hiderRight = document.getElementsByClassName("theFab2") as HTMLCollectionOf<HTMLElement>;

    hiderLeft[0].style.transition = "700ms";
    hiderRight[0].style.transition = "700ms";
    bar[0].style.transition = "700ms";

    mvtOfgreen[0].style.transition = "700ms"
    if (event.directionY == "down") {
      hiderLeft[0].style.top = "-10%";
      hiderRight[0].style.top = "-10%";
      mvtOfgreen[0].style.top = "-10%"
    }
    else {
      hiderLeft[0].style.top = "-0.5%";
      hiderRight[0].style.top = "-0.5%";
      bar[0].style.opacity = "1";
      mvtOfgreen[0].style.top = "0"
    }
    if (event.scrollTop == 0) {
      bar[0].style.opacity = "0";
    }

  }
  showPopover(){
    this.popState =1
    console.log(this.popState);
    var thePop = document.getElementsByClassName("popover") as HTMLCollectionOf <HTMLElement>;
    let theState = this.popState;
    var setBtn = document.getElementsByClassName("settings") as HTMLCollectionOf <HTMLElement>;

    if (theState == 1){
      thePop[0].style.right = "0";
      setBtn[0].style.right = "-50px";
      thePop[0].style.zIndex = "10000000";
    }
    else{
      thePop[0].style.right = "-50%";
      setBtn[0].style.right = "10px";
    }
  }
  removePopper(){
    this.popState = 0;
    var setBtn = document.getElementsByClassName("settings") as HTMLCollectionOf <HTMLElement>;
    var thePop = document.getElementsByClassName("popover") as HTMLCollectionOf <HTMLElement>;
    let theState = this.popState;
    if (theState == 1){
      thePop[0].style.right = "0";
      thePop[0].style.opacity = "0";
      thePop[0].style.zIndex = "10000000";
      setBtn[0].style.right = "-50px";
    }
    else{
      thePop[0].style.right = "-50%";
      thePop[0].style.opacity = "1";
      thePop[0].style.zIndex = "-1000";
      setBtn[0].style.right = "-10px";
      
    }
    console.log(this.popState);
    
  }
  editProfile(){
    this.showPopover();
    this.navCtrl.push(EditProfilePage);
    this.bodyClick()
  }

  logOut(){
    this.bodyClick()
    this.pinhomeProvider.logout().then(() => {
      this.navCtrl.push(SignInPage, {out:'logout'});
    }, (error) => {
      console.log(error.message);
    })
  }
  requestAddOrg(){
    this.bodyClick()
   
    this.pinhomeProvider.checkRequestLink().then(() => {
      const alert2 = this.alertCtrl.create({
        title: 'Email Already Sent',
        subTitle: 'We have already sent you an email with a link to register an organisation, please check your email.',
        buttons: ['OK']
      });
      alert2.present();
    }, Error => {
      this.pinhomeProvider.requestLink().then(() => {
        const alert = this.alertCtrl.create({
          title: 'Request Sent',
          subTitle: 'We have sent you an email with a link to register an organisation, please check your email.',
          buttons: ['OK']
        });
    
        alert.present();
      })
    })
    }
  
}