import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import { ViewPage } from '../view/view'
import { ProfilePage } from '../profile/profile';
import { SignInPage } from '../sign-in/sign-in';
import { NearbyOrgPage } from '../nearby-org/nearby-org';
import { text } from '@angular/core/src/render3/instructions';
// import { ScreenOrientation } from '@ionic-native/screen-orientation';

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
  color = "custom";
  contribute = 0;
  tempArray = [];
  state = "search";
  storeAllOrgs = [];
  storeNear = [];
  custom1 = "custom1";
  custom2 = "custom2";
  temp;
  colorState = false;
  location;
  textField = "";

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public pinhomeProvider: PinhomeProvider, public loadingCtrl: LoadingController) {
    this.getNearByOrganizations();
    this.pinhomeProvider.retrieveOrganization().then((data: any) => {
      this.storeCatData(data)
    })
    this.pinhomeProvider.getOrgNames().then((data: any) => {
      this.storedata(data);
      this.initializeItems();
    })

  }

  storeCatData(data) {
    this.categoryArr = data;
    this.tempArray = this.categoryArr;
    this.storeAllOrgs = data;
  }

  near(){
    if (this.colorState == false){
      this.categoryArr = this.storeNear;
      this.temp = this.custom1;
      this.custom1 =  this.custom2;
      this.custom2 =  this.temp;
      this.colorState =  true
    }

  }

  all()
  {
    if (this.colorState == true){
    this.categoryArr =  this.storeAllOrgs;
    this.temp = this.custom2;
    this.custom2 =  this.custom1;
    this.custom1 =  this.temp;
    this.colorState =  false
    }
  }

  setArrayBack(data) {
    this.categoryArr = data;
  }

  storedata(data) {
    this.orgs = data;
  }

  initializeItems() {
    this.items = this.orgs;
  }

  goToViewPage(name) {
    this.bodyClick(event);
    for (var x = 0; x < this.categoryArr.length; x++) {
      if (name == this.categoryArr[x].orgName) {
        this.navCtrl.push(ViewPage, { orgObject: this.categoryArr[x] });
      }
    }

  }


  more(indx) {
    this.navCtrl.push(ViewPage, { orgObject: this.orgArray[indx] })
  }
  trimPictures(state) {
    this.categoryArr.length = 0;
    this.categoryArr = this.tempArray;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    this.setArrayBack(this.tempArray)
    // set val to the value of the searchbar
    const val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.items = this.items.filter((item) => {

        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })

    }
  }
  bodyClick(event) {
    console.log(event);

    // var hide = document.getElementsByClassName('hidden') as HTMLCollectionOf <HTMLElement>;
    // hide[0].style.right ="-100%";

    // var search = document.getElementsByClassName('searchResults') as HTMLCollectionOf <HTMLElement>;
    // search[0].style.display = "none"

  }
  showButton() {
    
    let searcher = document.getElementsByClassName('searchBar') as HTMLCollectionOf <HTMLElement>;
    var theTitle = document.getElementsByClassName("theTitle") as HTMLCollectionOf <HTMLElement>
    if (this.state =="close"){
      this.state = "search";
      // console.log(this.state);
      searcher[0].style.width = "0";
      searcher[0].style.left = "-10%";
      theTitle[0].style.opacity = "1"
    } 
    else if(this.state == "search"){
      this.state ="close";
      // console.log(this.state);
      searcher[0].style.width = "72vw"
      searcher[0].style.left = "15%"
      theTitle[0].style.opacity = "0"

      
    }
      console.log(this.textField);
      this.textField =""
      
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
  storeNearByOrgs(data){
  this.storeNear =  data;
  }
  getNearByOrganizations() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'please wait',
      duration: 222000
    });
    // loading.present();
    this.pinhomeProvider.getCurrentLocation().then((radius: any) => {
      this.pinhomeProvider.getOrganisations().then((org: any) => {
        this.pinhomeProvider.getNearByOrganisations(radius, org).then((data: any) => {
          // this.location =  this.pinhomeProvider.getLocation();
         this.location =  this.location.locality; 
          this.orgArray = data;
          this.storeNearByOrgs(data);
          loading.dismiss();
        })
      })
    })
  }

  getAllOrganizations() {
  }
  viewPage() {
    this.pinhomeProvider.checkAuthState().then(data => {
      if (data == false) {
        let alert = this.alertCtrl.create({
          title: 'ohhhh! sorry!',
          subTitle: 'you have to sign in before you can view your profile, would you like to sign in now?',
          buttons: [
            {
              text: 'Yes',
              handler: data => {
                var opt = "profile";
                this.navCtrl.push(SignInPage, { option: opt })
              }
            },
            {
              text: 'No',
              handler: data => {

              }
            }
          ]
        });
        alert.present();
      } else {
        this.navCtrl.push(ProfilePage)
      }

    })
  }
  GoToMap() {
    this.navCtrl.setRoot(NearbyOrgPage);
  }
  header($event){
    console.log("header");

    var locSearch = document.getElementsByClassName("locationSearch") as HTMLCollectionOf <HTMLElement>
    
    locSearch[0].style.display = "none"
  }
  goToProfile() {
    this.bodyClick(event);
    this.navCtrl.push(ProfilePage);
  }
  gotToAddOrg() {
    console.log("this takes you to the Add Organisation Page");

  }
  scroll(event){
    console.log(event.directionY);
    var theCard = document.getElementsByClassName("options") as HTMLCollectionOf <HTMLElement>;
    var nav = document.getElementsByClassName("theHead") as HTMLCollectionOf <HTMLElement>;
    var restOf = document.getElementsByClassName("restOfBody") as HTMLCollectionOf <HTMLElement>;
    var searchBtn = document.getElementsByClassName("more") as HTMLCollectionOf <HTMLElement>;
    var prof = document.getElementsByClassName("profile") as HTMLCollectionOf <HTMLElement>;
    var barTitle = document.getElementsByClassName("theTitle") as HTMLCollectionOf <HTMLElement>;
    var searchTxt = document.getElementsByClassName("searchBar") as HTMLCollectionOf <HTMLElement>;
    var footBtn = document.getElementsByClassName("listerBtn") as HTMLCollectionOf <HTMLElement>;

    restOf[0].style.transition ="700ms";
    if(event.directionY == "down"){
      if(event.scrollTop > 15){
        console.log("hide card");

        theCard[0].style.height = "50px";
        theCard[0].style.top = "-100px";
        theCard[0].style.opacity = "0";
        
        nav[0].style.height = "50px";

        restOf[0].style.paddingTop = "90px";

        searchBtn[0].style.top = "0";

        prof[0].style.top = "0";

        barTitle[0].style.top = "12px";

        searchTxt[0].style.top = "5px";

        footBtn[0].style.transition = "300ms"
        footBtn[0].style.top= "0";
      }
    }
    else{
      console.log("show Card");
      theCard[0].style.height = "140px";
        theCard[0].style.top = "60px";
        theCard[0].style.opacity = "1";

        nav[0].style.height = "120px";

        restOf[0].style.paddingTop = "230px";

        searchBtn[0].style.top = "20px";

        prof[0].style.top = "15px";

        barTitle[0].style.top = "25px";

        searchTxt[0].style.top = "18px";

        footBtn[0].style.top= "-45px";
      
    }
    
  }

}