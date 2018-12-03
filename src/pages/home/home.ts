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
  tempArray =  []
  constructor(public navCtrl: NavController, public pinhomeProvider: PinhomeProvider, public loadingCtrl: LoadingController) {
    this.getNearByOrganizations();
    this.pinhomeProvider.retrieveOrganization().then((data: any) => {
   this.storeCatData(data)
    })
    this.pinhomeProvider.getOrgNames().then((data: any) => {
      this.storedata(data);
      this.initializeItems();
    })

  }

  storeCatData(data){
    this.categoryArr =  data;
    this.tempArray = this.categoryArr;
  }

  setArrayBack(data){
    this.categoryArr = data;
  }

  storedata(data) {
    this.orgs = data;
  }

  initializeItems() {
    this.items = this.orgs;
  }

  goToViewPage(name) {
    for (var x = 0; x < this.categoryArr.length; x++){
      if (name == this.categoryArr[x].orgName){
        this.navCtrl.push(ViewPage, { orgObject: this.categoryArr[x]});
      }
    }

  }

  
  more(indx) {
    this.navCtrl.push(ViewPage, { orgObject: this.orgArray[indx] })
  }
  trimPictures(state){
    this.categoryArr.length =  0;
    this.categoryArr = this.tempArray;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
   // this.setArrayBack(this.tempArray)
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
          console.log(data[k].orgName)
          this.categoryArr.push(obj);
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
