import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase'
import { Option,LoadingController } from 'ionic-angular';
import moment from 'moment';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the PinhomeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PinhomeProvider {

  // firebase instances
db = firebase.database();
auth = firebase.auth();

//arrays
oraganisations =  new Array()
nearByOrg =  new Array();
categoryArr = new Array();
commentArr = new Array();
searchOrgArray = new Array();
ProfileArr = new Array();
stayLoggedIn;
//variables


  constructor(private geolocation: Geolocation,public loadingCtrl: LoadingController,public alertCtrl: AlertController) {
    console.log('Hello PinhomeProvider Provider');
  }


  checkstate() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          this.stayLoggedIn = 1
        } else {
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
            subTitle: "It seems like you have not registered to use StreetArt, please check your login information or sign up to get started",
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

  listenForLocation(){
     //listen for current location
     return new Promise((accpt,rej) =>{
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        accpt(data)
   // data can be a set of coordinates, or an error (if an error occurred).
   // data.coords.latitude
   // data.coords.longitude
  });
     })
  }

  getCurrentLocation(){
   //get current location
    return new Promise ((accpt, rej) =>{
    this.geolocation.getCurrentPosition().then((resp) => {
      this.createPositionRadius(resp.coords.latitude, resp.coords.longitude).then((data:any) =>{
        accpt(data);
      })
       }).catch((error) => {
         console.log('Error getting location', error);
       });
     })
  }

  createPositionRadius(latitude, longitude){
    var leftposition, rightposition, downposition, uposititon;
    return new Promise ((accpt, rej) =>{
// down  position
var downlat = new String(latitude); 
var latIndex = downlat.indexOf( "." ); 
var down = parseInt(downlat.substr(latIndex + 1,2)) + 6;
if (down >= 100){
  if (downlat.substr(0,1) == "-"){
    var firstDigits = parseInt(downlat.substr(0,3)) - 1;
  }
  else{
    var firstDigits = parseInt(downlat.substr(0,2)) + 1;
  }
  var remainder = down - 100;
  downposition = firstDigits +  ".0" + down;
}else{
  if (downlat.substr(0,1) == "-"){
    downposition =  downlat.substr(0,3) + "." + down ;
  }
  else{
    downposition = downlat.substr(0,2) + "." + down;
  }
}
//up  position
var uplat = new String(latitude); 
var latIndex = uplat .indexOf( "." ); 
var up= parseInt(uplat .substr(latIndex + 1,2)) - 6;
if (up <= 0){
  if (uplat.substr(0,1) == "-"){
    var firstDigits = parseInt(uplat.substr(0,3)) + 1;
  }
  else{
    var firstDigits = parseInt(uplat.substr(0,2)) - 1;
  }
  var remainder = up - 100;
  uposititon = firstDigits +  ".0" + remainder;
}else{
  if (uplat.substr(0,1) == "-"){
    uposititon = uplat.substr(0,3) + "." + up ;
  }
  else{
    uposititon = uplat.substr(0,2) + "." + up ;
  }
}
  //left position
 var leftlat = new String(longitude);
 var longIndex =  leftlat.indexOf(".");
 var left =  parseInt(leftlat.substr(longIndex + 1,2)) - 6;
 if (left <= 0){
   if (leftlat.substr(0,1) == "-"){
      var firstDigits =  parseInt(leftlat.substr(0,3)) - 1;
   }else{
    var firstDigits =  parseInt(leftlat.substr(0,2)) + 1;
   }
   var remainder = left - 100;
   leftposition= firstDigits +  ".0" + remainder;
 }else{
   if (leftlat.substr(0,1) == "-"){
    leftposition = leftlat.substr(0,3) + "." + left;
   }
   else{
    leftposition = leftlat.substr(0,2) + "." + left;
   }

 }
    //right position
    var rightlat = new String(longitude);
    var longIndex =  rightlat.indexOf(".");
    var right =  parseInt(rightlat.substr(longIndex + 1,2)) + 6;
    if (right >= 100){
      if (rightlat.substr(0,1) == "-"){
         var firstDigits =  parseInt(rightlat.substr(0,3)) - 1;
      }else{
       var firstDigits =  parseInt(rightlat.substr(0,2)) + 1;
      }
      var remainder =  right - 100;
      rightposition = firstDigits +  ".0" + remainder;
    }else{
      rightposition = rightlat.substr(0,2) + "." + right;
    }
    let radius ={
      left: leftposition,
      right : rightposition,
      up : uposititon,
      down : downposition
    }
    accpt(radius);
    })
  }

  getOrganisations(){
    return new Promise((accpt, rej) =>{
      this.db.ref('OrganizationList').on('value', (data:any) =>{
        if (data.val() != null || data.val() != undefined){
          let organisations =  data.val();
          let keys = Object.keys(organisations);
            for (var x = 0; x < keys.length; x++){
            let OrganisationKeys = keys[x];
            let organizationObject ={
              orgCat : organisations[OrganisationKeys].Category,
              orgName:organisations[OrganisationKeys].OrganizationName,
              orgAddress: organisations[OrganisationKeys].OrganizationAdress,
              orgContact:organisations[OrganisationKeys].ContactDetails,
              orgPicture:organisations[OrganisationKeys].Url,
              orgLat : organisations[OrganisationKeys].latitude,
              orgLong  : organisations[OrganisationKeys].longitude,
              orgEmail : organisations[OrganisationKeys].Email,
              orgAbout : organisations[OrganisationKeys].AboutOrg,
              orgPrice : organisations[OrganisationKeys].Price
              }
              this.oraganisations.push(organizationObject);
            }
            accpt(this.oraganisations);
          }
       })
    })
  }

  getNearByOrganisations(radius,org){
    return new Promise((accpt,rej) =>{
      this.listenForLocation().then((resp:any) =>{
        var lat =  new String(resp.coords.latitude).substr(0,6);
        var long = new String(resp.coords.longitude).substr(0,5);
        for (var x = 0; x < org.length; x++){
          var orglat = new String(org[x].orgLat).substr(0,6);
          var orgLong =  new String(org[x].orgLong).substr(0,5);
         if ((orgLong  <= long  && orgLong  >= radius.left || orgLong  >= long  && orgLong  <= radius.right) && (orglat >= lat && orglat <= radius.down || orglat <= lat && orglat >= radius.up)){
          this.nearByOrg.push(org[x]);
          }
        }
        accpt(this.nearByOrg)
      })
    })
  }

  getOrgNames(){
    return new Promise((accpt, rej) =>{
      this.db.ref('OrganizationList').on('value', (data:any) =>{
        if (data.val() != null || data.val() != undefined){
          let organisations =  data.val();
          let keys = Object.keys(organisations);
            for (var x = 0; x < keys.length; x++){
            let OrganisationKeys = keys[x];
              this.searchOrgArray.push(organisations[OrganisationKeys].OrganizationName);
            }
            accpt(this.searchOrgArray);
          }
       })
    })
  }

  DisplayCategory(Category) {
    this.categoryArr.length =0;
    return new Promise((accpt, rej) => {
      this.db.ref('OrganizationList').on('value', (data: any) => {
        let SelectCategory = data.val();
        console.log(SelectCategory);
        let keys = Object.keys(SelectCategory);
        console.log(keys);
        for (var i = 0; i < keys.length; i++) {
          let k = keys[i];
          if(Category == SelectCategory[k].Category){
            let obj = {
              orgCat : SelectCategory[k].Category,
              orgName:SelectCategory[k].OrganizationName,
              orgAddress: SelectCategory[k].OrganizationAdress,
              orgContact:SelectCategory[k].ContactDetails,
              orgPicture:SelectCategory[k].Url,
              orgLat : SelectCategory[k].latitude,
              orgLong  : SelectCategory[k].longitude,
              orgEmail : SelectCategory[k].Email,
              orgAbout : SelectCategory[k].AboutOrg,
              orgPrice : SelectCategory[k].Price
  
            }
            this.categoryArr.push(obj);
            console.log(this.categoryArr)
          }
        }
        accpt(this.categoryArr);
      }) 
    })
  }
 
  retrieveOrganization() {
    this.categoryArr.length =0;
    return new Promise((accpt, rej) => {
      this.db.ref('OrganizationList').on('value', (data: any) => {
        let SelectCategory = data.val();
        console.log(SelectCategory);
        let keys = Object.keys(SelectCategory);
        console.log(keys);
        for (var i = 0; i < keys.length; i++) {
          let k = keys[i];
            let obj = {
              orgCat : SelectCategory[k].Category,
              orgName:SelectCategory[k].OrganizationName,
              orgAddress: SelectCategory[k].OrganizationAdress,
              orgContact:SelectCategory[k].ContactDetails,
              orgPicture:SelectCategory[k].Url,
              orgLat : SelectCategory[k].latitude,
              orgLong  : SelectCategory[k].longitude,
              orgEmail : SelectCategory[k].Email,
              orgAbout : SelectCategory[k].AboutOrg,
              orgPrice : SelectCategory[k].Price
  
            }
            this.categoryArr.push(obj);
            console.log(this.categoryArr)
        }
        accpt(this.categoryArr);
      }) 
    })
  }

  comments(comment: any) {
    // var user = firebase.auth().currentUser;
    return new Promise((accpt, rejc) => {
      var day = moment().format('MMMM Do YYYY, h:mm:ss a');
      firebase.database().ref('comments/').push({
        comment: comment,
        // uid: user.uid,
        date: day,
        // url: this.url
      })
      accpt('success');
    });

  }



  viewComments( comment: any) {
    this.commentArr.length =0;
    return new Promise((accpt, rejc) => {
      var user = firebase.auth().currentUser
      firebase.database().ref("comments/").on("value", (data: any) => {
        var CommentDetails = data.val();
        if (data.val() == null) {
          this.commentArr = null;
        }
        else {
          var keys1: any = Object.keys(CommentDetails);
          for (var i = 0; i < keys1.length; i++) {
            var key = keys1[i];
            var chckId = CommentDetails[key].uid;
            let obj = {
              comment: CommentDetails[key].comment,
              date: moment(CommentDetails[key].date, 'MMMM Do YYYY, h:mm:ss a').startOf('minutes').fromNow(),
            }
            this.commentArr.push(obj);
            console.log(this.commentArr);
            accpt(this.commentArr);
          }
        }
      }, Error => {
        rejc(Error.message)
      })

    })
  }



}
