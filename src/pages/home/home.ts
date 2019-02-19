import { Component, NgZone } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import { ViewPage } from '../view/view'
import { ProfilePage } from '../profile/profile';
import { SignInPage } from '../sign-in/sign-in';
import { NearbyOrgPage } from '../nearby-org/nearby-org';
import { text } from '@angular/core/src/render3/instructions';
import * as _ from 'lodash';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AddOrganizationPage } from '../add-organization/add-organization';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  category;

  orgArray = new Array();
  categoryArr = new Array();
  filtereditems: any;
  searchTerm: string = '';
  searchLocation;
  searchbar = [];
  searchQuery: string = '';
  items: any;
  orgs = [];
  color = "custom";
  contribute = 0;
  tempArray = [];
  state = "search";
  storeAllOrgs = [];
  storeNear = new Array();
  custom1 = "custom1";
  custom2 = "custom2";
  temp;
  colorState = false;
  location = "Searching for location..."
  textField = "";
  logInState;
  img = "../../assets/imgs/Defaults/default.png";;
  locationColor = "secondary"
  Searchlat;
  mapPageState = false;
  tempOrg = new Array();
  nearbyArray = new Array();
  profilePic = "../../assets/imgs/Defaults/default.png";
  locationState = false;
  resp;

  constructor(public navParams: NavParams, public statusBar: StatusBar, public screenOrientation: ScreenOrientation, public alertCtrl: AlertController, public navCtrl: NavController, public pinhomeProvider: PinhomeProvider, public loadingCtrl: LoadingController) {
    this.getNearByOrganizations();
    this.pinhomeProvider.retrieveOrganization2().then((data: any) => {
      console.log(data)
      this.storeCatData(data)
      this.storeCities(this.pinhomeProvider.getAllcities())
      this.initializeItems();
    })
    this.pinhomeProvider.getOrgNames().then((data: any) => {
      console.log(data);
      this.storedata(data);
      this.initializeItems();
    })
    this.filtereditems = [];
    this.lockOrientation();
    this.pinhomeProvider.checkAuthState().then(data => {
      if (data == true) {
        this.logInState = true;
        this.pinhomeProvider.getProfile().then((data: any) => {
          console.log(this.logInState);
          this.img = data;
          console.log(this.img)
        })
      }
      else if (data == false) {
        this.img = "assets/imgs/default.png";
      }
    })
    this.pinhomeProvider.getLocation();
  }
  searchForLocation(name) {

  }
  ionViewDidEnter() {
    this.pinhomeProvider.checkAuthState().then(data => {
      if (data == true) {
        this.logInState = true;
        this.pinhomeProvider.getProfile().then((data: any) => {
          console.log(this.logInState);
          this.img = data;
          console.log(this.img)
        })
      }
      else if (data == false) {
        this.img = "assets/imgs/default.png";
      }
    })

  }

  changeStatusBarColor() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByName('white')
  }

  storeCatData(data) {
    this.categoryArr = data;
    console.log(this.categoryArr)
    this.tempArray = this.categoryArr;
    this.storeAllOrgs = data;
  }

  lockOrientation() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  storeNearByOrgs(data) {
    this.storeNear = _.uniqWith(data, _.isEqual)
    // console.log(this.storeNear);
  }


  //this.storeNear[x] =  data[x];
  near() {
    if (this.locationState == false) {
      this.getNearByOrganizations();
    }
    else {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Loading...',
        duration: 222000
      });
      loading.present();
      if (this.colorState == false) {
        this.categoryArr = this.storeNear;
        console.log(this.categoryArr)
        this.temp = this.custom1;
        this.custom1 = this.custom2;
        this.custom2 = this.temp;
        this.colorState = true
      }
      loading.dismiss();
    }


  }

  all() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...',
      duration: 222000
    });
    loading.present();
    if (this.colorState == true) {
      this.categoryArr = _.uniqWith(this.storeAllOrgs, _.isEqual);
      this.temp = this.custom2;
      this.custom2 = this.custom1;
      this.custom1 = this.temp;
      this.colorState = false
    }
    loading.dismiss();
  }

  setArrayBack(data) {
    this.categoryArr = data;
    console.log(this.categoryArr)
  }

  storedata(data) {
    // this.categoryArr.length =0;
    this.orgs = data;
  }

  cities = new Array()
  storeCities(cities) {
    // this.categoryArr.length =0;
    this.cities = cities;
    console.log(this.cities);

  }

  initializeItems() {
    this.items = null;
    this.items = this.cities;
    console.log(this.items);
  }

  goToViewPage(name) {
    this.bodyClick(event);
    for (var x = 0; x < this.categoryArr.length; x++) {
      if (name == this.categoryArr[x].orgName) {
        this.navCtrl.push(ViewPage, { orgObject: this.categoryArr[x] });
      }
    }
  }
  assignName(name) {
    this.pinhomeProvider.filertUsingCity(name, this.tempArray).then((data: any) => {
      this.categoryArr = [];
      this.categoryArr = data;
      console.log(data)
    })
    console.log(name)
    this.searchTerm = name;
    this.filtereditems = [];
    this.initializeItems();
  }

  more(indx) {
    this.navCtrl.push(ViewPage, { orgObject: this.orgArray[indx] })
  }
  trimPictures(state) {
    // this.categoryArr.length = 0;
    this.categoryArr = this.tempArray;
  }

  filterItems() {
    console.log(this.searchTerm);
    this.initializeItems();
    if (this.searchTerm != "") {
      this.filtereditems = this.items.filter((item) => {
        return item.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    } else if (this.searchTerm == "" || this.searchTerm == null) {
      this.filtereditems = [];
    }
    console.log(this.filtereditems)
  }


  // getItem(name) {
  //   // Reset items back to all of the items
  //   this.initializeItems();
  //   this.setArrayBack(this.tempArray)
  //   // set val to the value of the searchbar
  //   const val = name;
  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != "") {
  //     this.items = this.items.filter((item) => {

  //       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })

  //   }
  // }

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
    var theCard = document.getElementsByClassName("options") as HTMLCollectionOf<HTMLElement>;
    let searcher = document.getElementsByClassName('searchBar') as HTMLCollectionOf<HTMLElement>;
    var theTitle = document.getElementsByClassName("theTitle") as HTMLCollectionOf<HTMLElement>
    var nav = document.getElementsByClassName("theHead") as HTMLCollectionOf<HTMLElement>;
    var searchBtn = document.getElementsByClassName("more") as HTMLCollectionOf<HTMLElement>;
    var prof = document.getElementsByClassName("profile") as HTMLCollectionOf<HTMLElement>;
    var restOf = document.getElementsByClassName("restOfBody") as HTMLCollectionOf<HTMLElement>;

    if (this.state == "close") {
      this.state = "search";
      // console.log(this.state);
      searcher[0].style.width = "0";
      searcher[0].style.left = "-10%";
      searcher[0].style.top = "18px";
      theTitle[0].style.opacity = "1";

      theCard[0].style.height = "130px";
      theCard[0].style.top = "60px";
      theCard[0].style.opacity = "1";

      nav[0].style.height = "120px";

      searchBtn[0].style.top = "20px";

      prof[0].style.top = "25px";
      this.filtereditems = [];
      this, this.searchTerm = "";
      this.initializeItems();
      this.setArrayBack(this.tempArray)
      restOf[0].style.paddingTop = "210px";

    }
    else if (this.state == "search") {
      this.state = "close";
      // console.log(this.state);
      searcher[0].style.width = "72vw";
      searcher[0].style.left = "15%";
      searcher[0].style.top = "5px"
      theTitle[0].style.opacity = "0";

      theCard[0].style.height = "50px";
      theCard[0].style.top = "-65px";
      theCard[0].style.opacity = "0.5";

      nav[0].style.height = "50px";

      searchBtn[0].style.top = "0";
      prof[0].style.top = "8px";

      restOf[0].style.paddingTop = "60px";
      this.filtereditems = [];



    }
    // console.log(this.textField);
    this.searchTerm = "";

  }

  assignresp() {
    this.resp = this.pinhomeProvider.getResp();
    console.log(this.resp);
  }

  getNearByOrganizations() {

    var theColor = document.getElementsByClassName("statement") as HTMLCollectionOf<HTMLElement>;
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...',
      duration: 222000
    });
    loading.present();
    this.pinhomeProvider.getCurrentLocation().then((radius: any) => {
      this.pinhomeProvider.retrieveOrganization().then((org: any) => {
        this.pinhomeProvider.getNearByOrganisations(radius, org).then((data: any) => {
          var loc = this.pinhomeProvider.getLocation();
          this.orgArray.length = 0
          this.location = loc.locality;
          this.orgArray = data;
          this.storeNearByOrgs(data);
          this.assignresp();
          this.locationState = true;
          theColor[0].style.color = "green"
        })
        loading.dismiss();
      })

    }, Error => {
      this.pinhomeProvider.getOrganisations().then((org: any) => {
        console.log(org)
        this.orgArray = org;
        this.location = "Location Disabled"
        theColor[0].style.color = "red"
        console.log(this.orgArray)
        loading.dismiss();
      })
      // console.log('no permission')
    })
  }
  getAllOrganizations() {
  }

  profile() {
    this.pinhomeProvider.checkAuthState().then(data => {
      if (data == false) {
        let alert = this.alertCtrl.create({
          subTitle: 'You have to sign in before you can view your profile, would you like to sign in now?',
          cssClass: 'myAlert',
          buttons: [
            {
              text: 'Sign in',
              handler: data => {
                var opt = "profile";
                this.navCtrl.push(SignInPage, { option: opt })
              }
            },
            {
              text: 'Cancel',
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

    // if (this.mapPageState == false){
    this.navCtrl.push(NearbyOrgPage, { img: this.img, locState: this.locationState, resp: this.resp });
    //   this.mapPageState = true;
    // }
    // else if  (this.mapPageState == true){
    //   this.navCtrl.pop();
    // }    
  }
  goToProfile() {
    this.bodyClick(event);
    this.navCtrl.push(ProfilePage);
  }
  // gotToAddOrg() {
  //   this.navCtrl.setRoot(AddOrganizationPage);
  //   // console.log("this takes you to the Add Organisation Page");

  // }
  scroll(event) {
    // console.log(event.directionY);
    var theCard = document.getElementsByClassName("options") as HTMLCollectionOf<HTMLElement>;
    var nav = document.getElementsByClassName("theHead") as HTMLCollectionOf<HTMLElement>;
    var restOf = document.getElementsByClassName("restOfBody") as HTMLCollectionOf<HTMLElement>;
    var searchBtn = document.getElementsByClassName("more") as HTMLCollectionOf<HTMLElement>;
    var prof = document.getElementsByClassName("profile") as HTMLCollectionOf<HTMLElement>;
    var barTitle = document.getElementsByClassName("theTitle") as HTMLCollectionOf<HTMLElement>;
    var searchTxt = document.getElementsByClassName("searchBar") as HTMLCollectionOf<HTMLElement>;
    var FAB = document.getElementsByClassName("theFab") as HTMLCollectionOf<HTMLElement>;

    restOf[0].style.transition = "700ms";
    if (event.directionY == "down") {
      if (event.scrollTop > 15) {
        // console.log("hide card");

        theCard[0].style.height = "50px";
        theCard[0].style.top = "-65px";
        theCard[0].style.opacity = "0.5";

        nav[0].style.height = "50px";

        restOf[0].style.paddingTop = "90px";

        searchBtn[0].style.top = "0";

        prof[0].style.top = "8px";

        barTitle[0].style.top = "12px";

        searchTxt[0].style.top = "5px";

        FAB[0].style.transform = "rotateZ(180DEG)";
        FAB[0].style.right = "-15%";

        // footBtn[0].style.top= "0";
      }
    }
    else {
      // console.log("show Card");
      theCard[0].style.height = "130px";
      theCard[0].style.top = "60px";
      theCard[0].style.opacity = "1";

      nav[0].style.height = "120px";

      restOf[0].style.paddingTop = "210px";

      searchBtn[0].style.top = "20px";

      prof[0].style.top = "25px";

      barTitle[0].style.top = "25px";

      searchTxt[0].style.top = "18px";

      FAB[0].style.transform = "rotateZ(0DEG)";
      FAB[0].style.right = "10px";

    }

  }


}