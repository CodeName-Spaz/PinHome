import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CompileNgModuleMetadata } from '@angular/compiler';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
//import { IonicImageViewerModule } from 'ionic-img-viewer';
import { AlertController } from 'ionic-angular';



/**
 * Generated class for the ViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {
  pet =  "Location"
  orgArray = new Array();
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public emailComposer: EmailComposer, public callNumber: CallNumber, public launchNavigator: LaunchNavigator,public alertCtrl: AlertController) {
    this.orgArray.push(this.navParams.get('orgObject'));

  console.log(this.orgArray[0].orgAddress)
  }

  ionViewDidEnter() {
    this.initMap(this.orgArray[0].orgAddress);
    console.log(this.pet)
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
        zoom: 15,
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

  Back(){
    this.navCtrl.pop()
  }
  reposition(event){
    this.initMap(this.orgArray[0].orgAddress);
    let segPosition = document.getElementsByClassName('segment') as HTMLCollectionOf <HTMLElement>;
    segPosition[0].style.transform ="translateY(0%)"
  }

  scroller(event){
    // console.log(event.directionY);
    
    let btnBack = document.getElementsByClassName('backBtn') as HTMLCollectionOf <HTMLElement>;

    if(event.scrollTop > 0 && event.directionY == "down"){
      btnBack[0].style.transition = "700ms"
      btnBack[0].style.transform ="translateY(-200%)"
    }
    else if (event.directionY == "up" || event.scrollTop == 0){
      btnBack[0].style.transform ="translateY(0%)"
    }

    let seg = document.getElementsByClassName('segment') as HTMLCollectionOf <HTMLElement>;
    
    if(event.scrollTop >= 400){
      seg[0].style.width = "100%";
      seg[0].style.position = 'absolute';
      seg[0].style.transform = "translateY("+(event.scrollTop - 420)+"px)";
    }
    else{
      seg[0].style.width = "100%";
      seg[0].style.transform = "translateY(0)"

    }
  }

  directions(address){
    this.launchNavigator.navigate(address)
    .then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );
  }

  call(cell){
    this.callNumber.callNumber(cell, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  email(emails){
    let email = {
      to: emails,
      cc: [],
      bcc: [],
      attachment:[],
      subject: '',
      body: '',
      isHtml: false,
      app: 'Gmail'
    };
    // Send a text message using default options
    this.emailComposer.open(email);
  }

  comment() {
    const prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
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
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }


}
