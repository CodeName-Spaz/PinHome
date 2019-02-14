
import { Component, OnInit } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { AlertController } from 'ionic-angular';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var firebase

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage implements OnInit{
  mypic: any;
  contact;
  downloadurl;
  name;
  email;
  uid;
  address;
  imageArr= new Array();
  tempImg;
  surname;
  d=1;
  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public alertCtrl: AlertController,public pinhomeProvider: PinhomeProvider, public camera: Camera) {
    this.retreivePics1()
  }

  ionViewDidLoad() {
    this.retreivePics1()
    console.log('ionViewDidLoad EditProfilePage');
  }

  ngOnInit() {
    this.pinhomeProvider.retrieve().on('value', (data: any) => {
      let details = data.val();
      this.name = details.name;
      this.email = details.email;
      this.address = details.address;
      this.surname =details.surname;
      this.downloadurl = details.downloadurl;
      this.tempImg =  details.downloadurl;
    })
  }

  GoToProfile(){
    this.navCtrl.pop();
  }
  uploadPicture() {
    if (this.tempImg == this.downloadurl){
      this.pinhomeProvider.uploadProfilePic(this.downloadurl,this.name).then(data => {
        console.log('added to db');
        this.pinhomeProvider.update(this.name,this.email,this.downloadurl,this.address,this.surname).then((data) => {
          this.imageArr.push(data);
        });
        // this.viewCtrl.dismiss();
        this.navCtrl.pop();
      },
        Error => {
          const alert = this.alertCtrl.create({
            title: "Oops!",
            subTitle:  Error.message,
            buttons: ['OK']
          });
          alert.present();
        })
        this.viewCtrl.dismiss()
    
    }
    else{
      this.pinhomeProvider.uploadProfilePic(this.downloadurl,this.name).then(data => {
        console.log('added to db');
        this.pinhomeProvider.update(this.name,this.email,this.downloadurl,this.address,this.surname).then((data) => {
          this.imageArr.push(data);
          console.log(this.imageArr);
        });
        this.viewCtrl.dismiss()
        // this.navCtrl.push(ProfilePage);

      },
        Error => {
          const alert = this.alertCtrl.create({
            title: "Oops!",
            subTitle:  Error.message,
            buttons: ['OK']
          });
          alert.present();
        })
 
    }
    // this.navCtrl.push(ProfilePage)
    

  }

  getUid1() {
    this.pinhomeProvider.getUserID().then(data => {
      this.uid = data
      console.log(this.uid);
    })
  }
  retreivePics1() {
    this.imageArr.length = 0;
    this.getUid1();
    this.pinhomeProvider.viewUserProfile().then(data => {
      var keys: any = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (this.uid == data[k].uid) {
          let objt = {
            downloadurl: data[k].downloadurl
          }
          this.imageArr.push(objt);
        }
      }
 
    }, Error => {
      console.log(Error)
    });
  
   
  }

  insertpic(event: any){

    this.d = 1;

    let opts = document.getElementsByClassName('options') as HTMLCollectionOf <HTMLElement>;

    if(this.d == 1){
      // opts[0].style.top = "10vh";
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      if (event.target.files[0].size > 1500000){
        let alert = this.alertCtrl.create({
          title: "Oh no!",
          subTitle: "your photo is too large, please choose a photo with 1.5MB or less.",
          buttons: ['OK']
        });
        alert.present();
      }
      else{
        reader.onload = (event: any) => {
          this.downloadurl= event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
      }

    }
      
    }
  }

  uploadImage(){
    const options: CameraOptions = {
     quality: 70,
     destinationType: this.camera.DestinationType.DATA_URL,  
     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
     saveToPhotoAlbum:false
   }
   
   this.camera.getPicture(options).then((imageData) => {
     console.log(imageData)
    this.downloadurl = 'data:image/jpeg;base64,' + imageData;
    console.log(this.downloadurl);
   }, (err) => {
   console.log(err);
   
   });
  }
  

 
}