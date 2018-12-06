import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase'
import { Option, LoadingController, Select } from 'ionic-angular';
import moment from 'moment';
import { AlertController, ToastController } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import * as _ from 'lodash';
/*
  Generated class for the PinhomeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PinhomeProvider {

  downloadurl: any;
  Placeobject: any;
  url: any;
  detailArray: any;
  // firebase instances
  db = firebase.database();
  auth = firebase.auth();
  //arrays
  oraganisations = new Array()
  nearByOrg = new Array();
  categoryArr = new Array();
  commentArr = new Array();
  searchOrgArray = new Array();
  ProfileArr = new Array();
  stayLoggedIn;
  //variables
  // url;
  rating;
  Location;

  constructor(private geolocation: Geolocation, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, private nativeGeocoder: NativeGeocoder) {
    console.log('Hello PinhomeProvider Provider');
  }


  checkstate() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          this.stayLoggedIn = 1
        }
        else {
          this.stayLoggedIn = 0
        }
        resolve(this.stayLoggedIn)
      })
    })
  }

  Signup(email, password, name) {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Sign in....',
        duration: 4000000
      });
      loading.present();
      return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
        var user = firebase.auth().currentUser
        firebase.database().ref("profiles/" + user.uid).set({
          name: name,
          email: email,
          contact: "",
          downloadurl: "../../assets/imgs/Defaults/default.jpg"
        })
        resolve();
        loading.dismiss();
      }).catch((error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          subTitle: error.message,
          buttons: [
            {
              text: 'ok',
              handler: data => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        alert.present();
        console.log(error);
      })
    })
  }
  SignIn(email, password) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Sign In....',
      duration: 4000000
    });
    loading.present();
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        resolve();
        loading.dismiss();
      }).catch((error) => {
        loading.dismiss();
        if (error.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
          const alert = this.alertCtrl.create({
            subTitle: "It seems like you have not registered to use PinHome, please check your login information or sign up to get started",
            buttons: [
              {
                text: 'ok',
                handler: data => {
                  console.log('Cancel');
                }
              }
            ]
          });
          alert.present();
        }
        else {
          const alert = this.alertCtrl.create({


            subTitle: error.message,
            buttons: [
              {
                text: 'ok',
                handler: data => {
                  console.log('Cancel');
                }
              }
            ]
          });
          alert.present();
        }

      })
    })

  }

  forgotpassword(email) {
    return new Promise((resolve, reject) => {
      if (email == null || email == undefined) {
        const alert = this.alertCtrl.create({
          subTitle: 'Please enter your Email.',
          buttons: ['OK']
        });
        alert.present();
      }
      else if (email != null || email != undefined) {
        firebase.auth().sendPasswordResetEmail(email).then(() => {
          const alert = this.alertCtrl.create({
            title: 'Password request Sent',
            subTitle: "We've sent you and email with a reset link, go to your email to recover your account.",
            buttons: ['OK']

          });
          alert.present();
          resolve()
        }, Error => {
          const alert = this.alertCtrl.create({
            subTitle: Error.message,
            buttons: ['OK']
          });
          alert.present();
          resolve()
        });
      }
    }).catch((error) => {
      const alert = this.alertCtrl.create({
        subTitle: error.message,
        buttons: [
          {
            text: 'ok',
            handler: data => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      alert.present();
    })
  }

  listenForLocation() {
    //listen for current location
    return new Promise((accpt, rej) => {
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        accpt(data)
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
      });
    })
  }

  getOrgNames() {
    return new Promise((accpt, rej) => {
      this.db.ref('OrganizationList').on('value', (data: any) => {
        if (data.val() != null || data.val() != undefined) {
          let organisations = data.val();
          let keys = Object.keys(organisations);
          for (var x = 0; x < keys.length; x++) {
            let OrganisationKeys = keys[x];
            this.searchOrgArray.push(organisations[OrganisationKeys].OrganizationName);
          }
          accpt(this.searchOrgArray);
        }
      })
    })
  }

  setLocation(data){
    this.Location =  data;
    console.log(this.Location);
    }
  
    getLocation(){
      console.log(this.Location);
      return this.Location;
    }
  getCurrentLocation(){
   //get current location
    return new Promise ((accpt, rej) =>{
    this.geolocation.getCurrentPosition().then((resp) => {
      this.createPositionRadius(resp.coords.latitude, resp.coords.longitude).then((data:any) =>{
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
        .then((result: NativeGeocoderReverseResult[]) => {
          this.setLocation(result[0])
        })
        .catch((error: any) => console.log(error))
        accpt(data);
      })
       }).catch((error) => {
         console.log('Error getting location', error);
       });
     })
  }
  createPositionRadius(latitude, longitude) {
    var leftposition, rightposition, downposition, uposititon;
    return new Promise((accpt, rej) => {
      // down  position
      var downlat = new String(latitude);
      var latIndex = downlat.indexOf(".");
      var down = parseInt(downlat.substr(latIndex + 1, 2)) + 6;
      if (down >= 100) {
        if (downlat.substr(0, 1) == "-") {
          var firstDigits = parseInt(downlat.substr(0, 3)) - 1;
        }
        else {
          var firstDigits = parseInt(downlat.substr(0, 2)) + 1;
        }
        var remainder = down - 100;
        downposition = firstDigits + ".0" + down;
      } else {
        if (downlat.substr(0, 1) == "-") {
          downposition = downlat.substr(0, 3) + "." + down;
        }
        else {
          downposition = downlat.substr(0, 2) + "." + down;
        }
      }
      //up  position
      var uplat = new String(latitude);
      var latIndex = uplat.indexOf(".");
      var up = parseInt(uplat.substr(latIndex + 1, 2)) - 6;
      if (up <= 0) {
        if (uplat.substr(0, 1) == "-") {
          var firstDigits = parseInt(uplat.substr(0, 3)) + 1;
        }
        else {
          var firstDigits = parseInt(uplat.substr(0, 2)) - 1;
        }
        var remainder = up - 100;
        uposititon = firstDigits + ".0" + remainder;
      } else {
        if (uplat.substr(0, 1) == "-") {
          uposititon = uplat.substr(0, 3) + "." + up;
        }
        else {
          uposititon = uplat.substr(0, 2) + "." + up;
        }
      }
      //left position
      var leftlat = new String(longitude);
      var longIndex = leftlat.indexOf(".");
      var left = parseInt(leftlat.substr(longIndex + 1, 2)) - 6;
      if (left <= 0) {
        if (leftlat.substr(0, 1) == "-") {
          var firstDigits = parseInt(leftlat.substr(0, 3)) - 1;
        } else {
          var firstDigits = parseInt(leftlat.substr(0, 2)) + 1;
        }
        var remainder = left - 100;
        leftposition = firstDigits + ".0" + remainder;
      } else {
        if (leftlat.substr(0, 1) == "-") {
          leftposition = leftlat.substr(0, 3) + "." + left;
        }
        else {
          leftposition = leftlat.substr(0, 2) + "." + left;
        }

      }
      //right position
      var rightlat = new String(longitude);
      var longIndex = rightlat.indexOf(".");
      var right = parseInt(rightlat.substr(longIndex + 1, 2)) + 6;
      if (right >= 100) {
        if (rightlat.substr(0, 1) == "-") {
          var firstDigits = parseInt(rightlat.substr(0, 3)) - 1;
        } else {
          var firstDigits = parseInt(rightlat.substr(0, 2)) + 1;
        }
        var remainder = right - 100;
        rightposition = firstDigits + ".0" + remainder;
      } else {
        rightposition = rightlat.substr(0, 2) + "." + right;
      }
      let radius = {
        left: leftposition,
        right: rightposition,
        up: uposititon,
        down: downposition
      }
      accpt(radius);
    })
  }

  getOrganisations() {
    return new Promise((accpt, rej) => {
      this.db.ref('OrganizationList').on('value', (data: any) => {
        if (data.val() != null || data.val() != undefined) {
          let organisations = data.val();
          let keys = Object.keys(organisations);
          for (var x = 0; x < keys.length; x++) {
            let OrganisationKeys = keys[x];
            let organizationObject = {
              orgCat: organisations[OrganisationKeys].Category,
              orgName: organisations[OrganisationKeys].OrganizationName,
              orgAddress: organisations[OrganisationKeys].OrganizationAdress,
              orgContact: organisations[OrganisationKeys].ContactDetails,
              orgPicture: organisations[OrganisationKeys].Url,
              orgLat: organisations[OrganisationKeys].latitude,
              orgLong: organisations[OrganisationKeys].longitude,
              orgEmail: organisations[OrganisationKeys].Email,
              orgAbout: organisations[OrganisationKeys].AboutOrg,
              orgPrice: organisations[OrganisationKeys].Price
            }
            this.oraganisations.push(organizationObject);
          }
          accpt(this.oraganisations);
        }
      })
    })
  }

  getNearByOrganisations(radius, org) {
    return new Promise((accpt, rej) => {
      this.listenForLocation().then((resp: any) => {
        var lat = new String(resp.coords.latitude).substr(0, 6);
        var long = new String(resp.coords.longitude).substr(0, 5);
        for (var x = 0; x < org.length; x++) {
          var orglat = new String(org[x].orgLat).substr(0, 6);
          var orgLong = new String(org[x].orgLong).substr(0, 5);
          if ((orgLong <= long && orgLong >= radius.left || orgLong >= long && orgLong <= radius.right) && (orglat >= lat && orglat <= radius.down || orglat <= lat && orglat >= radius.up)) {
            this.nearByOrg.push(org[x]);
          }
        }
        accpt(this.nearByOrg)
      })
    })
  }



  DisplayCategory(Category) {
    this.categoryArr.length = 0;
    return new Promise((accpt, rej) => {
      this.db.ref('OrganizationList').on('value', (data: any) => {
        let SelectCategory = data.val();
        let keys = Object.keys(SelectCategory);
        for (var i = 0; i < keys.length; i++) {
          let k = keys[i];
          if (Category == SelectCategory[k].Category) {
            let obj = {
              orgCat: SelectCategory[k].Category,
              orgName: SelectCategory[k].OrganizationName,
              orgAddress: SelectCategory[k].OrganizationAdress,
              orgContact: SelectCategory[k].ContactDetails,
              orgPicture: SelectCategory[k].Url,
              orgLat: SelectCategory[k].latitude,
              orgLong: SelectCategory[k].longitude,
              orgEmail: SelectCategory[k].Email,
              orgAbout: SelectCategory[k].AboutOrg,
              orgPrice: SelectCategory[k].Price,
              orgGallery :SelectCategory[k].UrlGallery,
              key: k,
            }
            this.categoryArr.push(obj);
            // console.log(this.categoryArr);
          }
        }
        accpt(this.categoryArr);
      })
    })
  }

  retrieveOrganization() {
    this.categoryArr.length = 0;
    return new Promise((accpt, rej) => {
      this.db.ref('OrganizationList').on('value', (data) => {
        let SelectCategory = data.val();
        console.log(SelectCategory);
        let keys = Object.keys(SelectCategory);
        console.log(keys);
        for (var i = 0; i < keys.length; i++) {
          let k = keys[i];
          let obj = {
            orgCat: SelectCategory[k].Category,
            orgName: SelectCategory[k].OrganizationName,
            orgAddress: SelectCategory[k].OrganizationAdress,
            orgContact: SelectCategory[k].ContactDetails,
            orgPicture: SelectCategory[k].Url,
            orgLat: SelectCategory[k].latitude,
            orgLong: SelectCategory[k].longitude,
            orgEmail: SelectCategory[k].Email,
            orgAbout: SelectCategory[k].AboutOrg,
            orgPrice: SelectCategory[k].Price,
            orgGallery :SelectCategory[k].UrlGallery,
            key: k,
          }
          this.categoryArr.push(obj);
          // console.log(this.categoryArr)
        }
        accpt(this.categoryArr);
      })
    })
  }

  comments(comment: any, commentKey: any, rating) {
    let user = firebase.auth().currentUser;
    return new Promise((accpt, rejc) => {
      var day = moment().format('MMMM Do YYYY, h:mm:ss a');
      firebase.database().ref('comments/' + commentKey).push({
        comment: comment,
        uid: user.uid,
        date: day,
        rate: parseInt(rating)
        // url: this.url
      })
      accpt('success');
    });
  }
  viewComments(comment: any, commentKey: any) {
    return new Promise((accpt, rejc) => {
      // this.commentArr.length = 0;
      let user = firebase.auth().currentUser
      this.db.ref("comments/" + commentKey).on("value", (data: any) => {
        let CommentDetails = data.val();
        this.commentArr = _.uniqWith(this.commentArr,_ .isEqual);
        if (data.val() != null || data.val() != undefined || this.commentArr != null) {
          // this.commentArr.length = 0;
          let keys1: any = Object.keys(CommentDetails);
          for (var i = 0; i < keys1.length; i++) {
            let key = keys1[i];
            let chckId = CommentDetails[key].uid;
            let obj = {
              comment: CommentDetails[key].comment,
              uid: CommentDetails[key].uid,
              url: this.url,
              rating: parseInt(CommentDetails[key].rate),
              username: "",
              date: moment(CommentDetails[key].date, 'MMMM Do YYYY, h:mm:ss a').startOf('minutes').fromNow(),
              key: key,
            }
            if (user) {
              if (user.uid == CommentDetails[key].uid) {
                this.assignRating(CommentDetails[key].rate)
              }
            }
            this.viewProfileMain(chckId).then((profileData: any) => {
              obj.url = profileData.downloadurl
              obj.username = profileData.name
              console.log(obj)
              this.commentArr.push(obj);
              console.log(this.commentArr)
            });
          }
          accpt(this.commentArr);
        }
        else {
          this.commentArr = null;
        }

      }, Error => {
        rejc(Error.message)
      })

    })
  }

  assignRating(rating) {
    this.rating = rating;
  }

  getRating() {
    return this.rating;
  }

  viewProfileMain(userid: string) {
    return new Promise((accpt, rejc) => {
      firebase.database().ref("profiles/" + userid).on("value", (data: any) => {
        var a = data.val();
        accpt(a);
      }, Error => {
        rejc(Error.message)
      })
    })
  }

  getProfile() {
    this.auth.onAuthStateChanged(function (user) {
      return new Promise((accpt, rej) => {
        if (user) {
          firebase.database().ref("profiles/" + user.uid).on('value', (data: any) => {
            let details = data.val();
            console.log(details)
          })
        } else {
          console.log('no user');
        }
      });
    })
  }

  checkAuthState() {
    return new Promise((accpt, rej) => {
      this.auth.onAuthStateChanged(function (user) {
        if (user) {
          accpt(true)
        } else {
          accpt(false)
        }
      });
    })
  }

  logout() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(() => {
        resolve()
      }, (error) => {
        reject(error)
      });
    });
  }



  uploadProfilePic(pic, name) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait',
      duration: 2000
    });
    const toast = this.toastCtrl.create({
      message: 'data has been updated!',
      duration: 3000
    });
    return new Promise((accpt, rejc) => {
      toast.present();
      firebase.storage().ref(name).putString(pic, 'data_url').then(() => {
        accpt(name);
        console.log(name);
      }, Error => {
        rejc(Error.message)
      })
    })
  }

  storeToDB1(name) {
    return new Promise((accpt, rejc) => {
      this.ProfileArr.length = 0;
      var storageRef = firebase.storage().ref(name);
      storageRef.getDownloadURL().then(url => {
        console.log(url)
        var user = firebase.auth().currentUser;
        var link = url;
        firebase.database().ref('profiles/' + user.uid).update({
          downloadurl: link,
        });
        accpt('success');
      }, Error => {
        rejc(Error.message);
        console.log(Error.message);
      });
    })
  }


  viewPicGallery1() {
    return new Promise((accpt, rejc) => {
      var user = firebase.auth().currentUser
      firebase.database().ref("profiles").on("value", (data: any) => {
        var b = data.val();
        var keys = Object.keys(b);
        if (b !== null) {
        }
        this.storeImgur(b[keys[0]].downloadurl);
        accpt(b);
      }, Error => {
        rejc(Error.message)
      })
    })
  }

  getUserID() {
    return new Promise((accpt, rejc) => {
      var userID = firebase.auth().currentUser
      firebase.database().ref("profiles").on("value", (data: any) => {
        var b = data.val();
        if (b !== null) {
        }
        console.log(b);
        accpt(userID.uid);
      }, Error => {
        rejc(Error.message)
      })
    })
  }

  storeImgur(downloadurl) {
    this.downloadurl = downloadurl;
    console.log(downloadurl);
  }

  update(name, email, contact, downloadurl) {
    this.ProfileArr.length = 0;
    return new Promise((pass, fail) => {
      var user = firebase.auth().currentUser
      firebase.database().ref('profiles/' + user.uid).update({
        name: name,
        email: email,
        contact: contact,
        downloadurl: downloadurl,
      });
    })
  }

  retrieve() {
    let userID = firebase.auth().currentUser;
    return firebase.database().ref("profiles/" + userID.uid)
  }

}