import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import { ViewPage } from '../view/view'
import { ProfilePage } from '../profile/profile';
import { SignInPage } from '../sign-in/sign-in';
import { NearbyOrgPage } from '../nearby-org/nearby-org';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  category;

  orgArray = new Array();
  categoryArr = new Array();


  searchQuery: string = '';
  items: string[];
  orgs = [];
  constructor(public navCtrl: NavController, public pinhomeProvider: PinhomeProvider, public loadingCtrl: LoadingController) {
    this.getNearByOrganizations();
  


    this.selectcategory();

    this.pinhomeProvider.retrieveOrganization().then((data: any) => {
      this.categoryArr = data;
      console.log(this.categoryArr);

    })

    this.pinhomeProvider.getOrgNames().then((data: any) => {
      this.storedata(data);
      this.initializeItems();
    })

  }

  storedata(data) {
    this.orgs = data;
  }

  initializeItems() {
    this.items =  this.orgs;
  }

  goToViewPage(indx) {
    this.navCtrl.push(ViewPage, { orgObject: this.categoryArr[indx] });
  }

  
  more(indx) {
    this.navCtrl.push(ViewPage, { orgObject: this.orgArray[indx] })
  }


  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    // set val to the value of the searchbar
    const val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  selectcategory() {
    this.categoryArr.length = 0;
    this.pinhomeProvider.DisplayCategory(this.category).then((data: any) => {
      console.log(data);
      let keys = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (this.category == data[k].category) {
          let obj = {
            orgAbout: data[k].orgAbout,
            orgCat: data[k].orgCat,
            orgContact: data[k].orgContact,
            orgEmail: data[k].orgEmail,
            orgAddress: data[k].orgAddress,
            orgName: data[k].orgName,
            orgPrice: data[k].orgPrice,
            orgPicture: data[k].orgPicture,
            orgLat: data[k].orgLat,
            orgLong: data[k].orgLong
          }
          this.categoryArr.push(obj);
          console.log(this.categoryArr);
        }
      }
    })
  }
  getNearByOrganizations() {
    // let loading = this.loadingCtrl.create({
    //   spinner: 'bubbles',
    //   content: 'please wait',
    //   duration: 222000
    // });
    // loading.present();
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'please wait',
      duration: 222000
    });
    loading.present();
    this.pinhomeProvider.getCurrentLocation().then((radius: any) => {
      this.pinhomeProvider.getOrganisations().then((org: any) => {
        this.pinhomeProvider.getNearByOrganisations(radius, org).then((data: any) => {
          this.orgArray = data;
          console.log(this.orgArray)
          // loading.dismiss();
          loading.dismiss();
        })
      })
    })
  }

  getAllOrganizations() {
  }
  viewPage() {
    this.navCtrl.push(SignInPage);
  }
 GoToMap(){
   this.navCtrl.setRoot(NearbyOrgPage);
 }
}
