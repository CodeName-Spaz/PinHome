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
  color= "custom";
  contribute = 0;
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
    this.bodyClick(event);
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
      
      
      // Determines the visibility of the search panel
      var search = document.getElementsByClassName('searchResults') as HTMLCollectionOf <HTMLElement>;

  
      // if the value is an empty string don't filter the items
      if (val && val.trim() != "") {
        this.items = this.items.filter((item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
        search[0].style.display = 'block';
        this.color ="light"
        search[0].style.opacity ="1"

        }
        if(val.length == 0 || val == null || val == undefined || val.length == undefined){
          search[0].style.display = 'none';
          search[0].style.opacity ="0"
        }
        // console.log(val.length);


    }
    bodyClick(event){
      console.log(event);
      
      var hide = document.getElementsByClassName('hidden') as HTMLCollectionOf <HTMLElement>;
      hide[0].style.right ="-100%";
      
      var search = document.getElementsByClassName('searchResults') as HTMLCollectionOf <HTMLElement>;
      search[0].style.display = "none"

    }
    showButton(){
      this.contribute = 1;
      let show = document.getElementsByClassName("hidden") as HTMLCollectionOf <HTMLElement>;
      if(this.contribute == 1){
        show[0].style.right = "0";
      }
      else{
        show[0].style.right = "-100%"
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
          // console.log(this.categoryArr);
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
    this.pinhomeProvider.getCurrentLocation().then((radius: any) => {
      this.pinhomeProvider.getOrganisations().then((org: any) => {
        this.pinhomeProvider.getNearByOrganisations(radius, org).then((data: any) => {
          this.orgArray = data;
          console.log(this.orgArray)
          // loading.dismiss();
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
 goToProfile(){
  this.bodyClick(event);
  this.navCtrl.push(ProfilePage);
 }
 gotToAddOrg(){
   console.log("this takes you to the Add Organisation Page");
   
 }
}
