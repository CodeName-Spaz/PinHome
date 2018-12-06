import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { AlertController } from 'ionic-angular';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
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
  contact;
  downloadurl;
  name;
  email;
  uid;
  imageArr= new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public pinhomeProvider: PinhomeProvider) {
  }

  ionViewDidLoad() {
    this.retreivePics1()
    console.log('ionViewDidLoad EditProfilePage');
  }

  ngOnInit() {
    this.pinhomeProvider.retrieve().on('value', (data: any) => {
      let details = data.val();
      this.name = details.name;
      this.email = details.email
      this.contact = details.contact
      this.downloadurl = details.downloadurl
    })
  }

  GoToProfile(){
    this.navCtrl.setRoot(ProfilePage);
  }

  uploadPicture() {
    this.imageArr.length = 0;
    if (this.contact.length < 11) {
      this.pinhomeProvider.uploadProfilePic(this.downloadurl,this.name).then(data => {
        console.log('added to db');
        this.pinhomeProvider.update(this.name,this.email,this.contact,this.downloadurl).then((data) => {
          this.imageArr.push(data);
        })
        this.navCtrl.setRoot(ProfilePage);
      },
        Error => {
          console.log(Error)
        })
    }
    else {
      const alert = this.alertCtrl.create({
        title: "Oops!",
        subTitle: "Please make sure that your mobile number is correct.",
        buttons: ['OK']
      });
      alert.present();
    }
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
    this.pinhomeProvider.viewPicGallery1().then(data => {
      var keys: any = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (this.uid == data[k].uid) {
          let objt = {
            downloadurl: data[k].downloadurl
          }
          this.imageArr.push(objt);
          console.log(this.imageArr);
        }
      }
 
    }, Error => {
      console.log(Error)
    });
  }


  insertpic(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.downloadurl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }

 
}
