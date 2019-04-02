

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CompileNgModuleMetadata } from '@angular/compiler';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { AlertController } from 'ionic-angular';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import { SignInPage } from '../sign-in/sign-in';
import { HomePage } from '../home/home';
import * as _ from 'lodash';



/**
 * Generated class for the ViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
declare var firebase;
@IonicPage()
@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {
  pet = "Gallery"
  orgArray = new Array();
  commentArr = new Array();
  profileArr = new Array();
  ContributionArr = new Array();
  comments;
  address;
  state = ["star-outline", "star-outline", "star-outline", "star-outline", "star-outline"]
  Star1 = "star-outline";
  Star2 = "star-outline";
  Star3 = "star-outline";
  Star4 = "star-outline";
  Star5 = "star-outline";
  rateState: boolean;
  condition;
  commentKey: any;
  keys2;
  blankStar = "star-outline";
  imageKey;
  username: any;
  logInState;
  img;
  gallery = new Array()
  constructor(public navCtrl: NavController, public navParams: NavParams, public emailComposer: EmailComposer, public callNumber: CallNumber, public launchNavigator: LaunchNavigator, public alertCtrl: AlertController, public pinhomeProvider: PinhomeProvider) {
    this.orgArray.push(this.navParams.get('orgObject'));
    console.log(this.navParams.get('orgObject'))
    this.imageKey = this.orgArray[0].key;
    console.log(this.imageKey);
    console.log(this.orgArray);
    this.pinhomeProvider.getGallery(this.orgArray[0].orgId).then((data: any) => {
      this.gallery.length = 0;
      this.gallery = data
    })


    this.pinhomeProvider.getContributions(this.orgArray[0].orgId).then((data:any) => {
      this.gallery.length = 0;
      this.ContributionArr = data
      console.log( this.ContributionArr)
    })

  }
  ionViewDidEnter() {
    this.initMap(this.orgArray[0].orgAddress);
    console.log(this.pet)


    this.pinhomeProvider.checkstate().then((data) => {
      console.log(data);
    })


    this.pinhomeProvider.retrieveOrganization().then((data) => {
      console.log(data)
    })


  }

  ngOnInit() {
    this.retrieveComments();
  }


  // ionViewDidLoad() {
  //   this.retrieveComments();
  //   console.log('ionViewDidLoad SignUpPage');
  // }


  storeCatData(data) {
    this.profileArr = data;
    console.log(this.profileArr)
    // console.log(this.tempArray);
  }
  retrieveComments() {
    this.commentArr = [];
    this.pinhomeProvider.viewComments(this.comments, this.imageKey).then((data: any) => {
      this.commentArr = data;
      this.commentArr.reverse();
      let rating = this.pinhomeProvider.getRating();
      if (rating > 0) {
        this.rate(rating);
        this.rateState = true;
      }
      else if (rating == undefined || rating == 0) {
        this.rateState = false
      }
    })
  }
  initMap(address) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
      }
      let myLatLng = { lat: this.latitude, lng: this.longitude };
      this.objectArray = "test"
      let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: myLatLng,
        mapTypeId: 'terrain'
      });
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
      });
    })
  }

  Back() {
    this.navCtrl.pop();
  }

  reposition(event) {
    this.initMap(this.orgArray[0].orgAddress);
    let segPosition = document.getElementsByClassName('segment') as HTMLCollectionOf<HTMLElement>;
    segPosition[0].style.transform = "translateY(0%)"
  }


  scroller(event) {
    // console.log(event.directionY);


    let btnBack = document.getElementsByClassName('backBtn') as HTMLCollectionOf<HTMLElement>;

    if (event.scrollTop > 0 && event.directionY == "down") {
      btnBack[0].style.transition = "700ms"
      btnBack[0].style.transform = "translateY(-200%)"
    }
    else if (event.directionY == "up" || event.scrollTop == 0) {
      btnBack[0].style.transform = "translateY(0%)"
    }

    // let seg = document.getElementsByClassName('segment') as HTMLCollectionOf<HTMLElement>;

    // if (event.scrollTop >= 400) {
    //   seg[0].style.width = "100%";
    //   seg[0].style.position = 'absolute';
    //   seg[0].style.transform = "translateY(" + (event.scrollTop - 420) + "px)";
    // }
    // else {
    //   seg[0].style.width = "100%";
    //   seg[0].style.transform = "translateY(0)"

    // }
  }

  directions(address) {
    this.launchNavigator.navigate(address)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  call(cell) {
    console.log(cell);

    this.callNumber.callNumber(cell, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  email(emails) {
    let email = {
      to: emails,
      cc: [],
      bcc: [],
      attachment: [],
      subject: '',
      body: '',
      isHtml: false,
      app: 'Gmail'
    };
    // Send a text message using default options
    this.emailComposer.open(email);
  }


  // view() {
  //   this.pinhomeProvider.viewComments(this.comments, this.imageKey).then((data) => {
  //     console.log(data);
  //   })
  // }

  comment(num) {
    this.pinhomeProvider.checkAuthState().then(data => {
      if (data == true) {
        console.log(data);
        if (this.rateState == false || this.rateState == undefined) {
          const prompt = this.alertCtrl.create({
            // title: 'Comment',
            message: "Pleave leave your comment below",
            inputs: [
              {
                name: 'comments',
                placeholder: 'comments'
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
                text: 'Comment',
                handler: data => {
                  console.log('Saved clicked' + data.comments);
                  this.pinhomeProvider.comments(data.comments, this.imageKey, num).then((data) => {
                    this.pinhomeProvider.viewComments(this.comments, this.imageKey).then((data: any) => {
                      var y = this.orgArray[0].avg + 1;
                      var x = ((num - this.orgArray[0].rating) / y);
                      x = x + this.orgArray[0].rating
                      this.orgArray[0].rating = Math.round(x);
                      this.commentArr = data;
                      this.commentArr.reverse();
                      this.commentArr.length = 0;
                      this.retrieveComments();
                      this.rate(num);
                      this.rateState = true;
                    })
                  })
                }
              }
            ],
            cssClass: 'myAlert',
          });
          prompt.present();
        }
        else if (this.rateState == true) {
          let alert = this.alertCtrl.create({
            title: 'Oops!',
            subTitle: 'You cannot rate more than once',
            buttons: ['Ok']
          });
          alert.present();
        }
      }
      else {
        let alert = this.alertCtrl.create({
          title: '',
          subTitle: 'You have to sign in before you can rate this organistion, would you like to sign in now?',
          buttons: [
            {
              text: 'Sign in',
              handler: data => {
                var opt = "rate";
                this.navCtrl.push(SignInPage, { option: opt, obj: this.orgArray })
              }
            },
            {
              text: 'Cancel',
              handler: data => {
                this.retrieveComments();
              }
            }
          ],
          cssClass: 'myAlert',
        });
        alert.present();
      }
    })

  }

  rate(num) {
    if (num == 1) {
      if (this.Star1 == "star-outline") {
        this.Star1 = "star";
      }
      else {
        this.Star1 = "star-outline";
        this.Star2 = "star-outline"
        this.Star3 = "star-outline";
        this.Star4 = "star-outline"
        this.Star5 = "star-outline";
      }
    }
    else if (num == 2) {
      if (this.Star2 == "star-outline") {
        this.Star1 = "star";
        this.Star2 = "star";
      }
      else {
        this.Star1 = "star";
        this.Star2 = "star-outline"
        this.Star3 = "star-outline";
        this.Star4 = "star-outline"
        this.Star5 = "star-outline";
      }
    }
    else if (num == 3) {
      if (this.Star3 == "star-outline") {
        this.Star1 = "star";
        this.Star2 = "star";
        this.Star3 = "star";
      }
      else {
        this.Star1 = "star";
        this.Star2 = "star"
        this.Star3 = "star-outline";
        this.Star4 = "star-outline"
        this.Star5 = "star-outline";
      }
    }
    else if (num == 4) {
      if (this.Star4 == "star-outline") {
        this.Star1 = "star";
        this.Star2 = "star";
        this.Star3 = "star";
        this.Star4 = "star";
      }
      else {
        this.Star1 = "star";
        this.Star2 = "star"
        this.Star3 = "star";
        this.Star4 = "star-outline"
        this.Star5 = "star-outline";
      }
    }
    else if (num == 5) {
      if (this.Star5 == "star-outline") {
        this.Star1 = "star";
        this.Star2 = "star";
        this.Star3 = "star";
        this.Star4 = "star";
        this.Star5 = "star";
      }
      else {
        this.Star1 = "star";
        this.Star2 = "star"
        this.Star3 = "star";
        this.Star4 = "star"
        this.Star5 = "star-outline";
      }
    }
  }


}