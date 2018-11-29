import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase'
import { Option,LoadingController } from 'ionic-angular';
import moment from 'moment';

/*
  Generated class for the PinhomeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PinhomeProvider {

  //firebase instances
db = firebase.database();
auth = firebase.auth();

//arrays
oraganisations =  new Array()
nearByOrg =  new Array();
categoryArr = new Array();
commentArr = new Array();
searchOrgArray = new Array();
//variables


  constructor(private geolocation: Geolocation,public loadingCtrl: LoadingController) {
    console.log('Hello PinhomeProvider Provider');
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



  viewComments(key: any, comment: string) {
    this.commentArr.length = 0;
    return new Promise((accpt, rejc) => {
      var user = firebase.auth().currentUser
      firebase.database().ref("comments/" + key).on("value", (data: any) => {
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
              uid: user.uid,
              // url: this.url,
              date: moment(CommentDetails[key].date, 'MMMM Do YYYY, h:mm:ss a').startOf('minutes').fromNow(),
              // username: ""
            }
            accpt(this.commentArr);
          }
        }
      }, Error => {
        rejc(Error.message)
      })

    })
  }



}
