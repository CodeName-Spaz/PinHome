import { Injectable, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase'
import { Option, LoadingController, Select } from 'ionic-angular';
import moment from 'moment';
import { AlertController, ToastController } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
// import * as _ from 'lodash';
/*
  Generated class for the PinhomeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PinhomeProvider {

  downloadurl;
  Placeobject: any;
  url;
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
  resp;

  popState = 0;
  ratedOrgs = new Array();
  totRating;
  newSeachedHomes = [];


  constructor(private ngzone: NgZone, private geolocation: Geolocation, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, private nativeGeocoder: NativeGeocoder) {
    console.log('Hello PinhomeProvider Provider');
  }



  getTotalRatings() {
    this.ratedOrgs = [];
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        let userID = firebase.auth().currentUser;
        var numRating = 0;
        this.db.ref("comments/").on("value", (data: any) => {
          if (data.val() != null || data.val() != undefined) {
            let keys = Object.keys(data.val());
            for (var x = 0; x < keys.length; x++) {
              this.db.ref("comments/" + keys[x]).on("value", (data2: any) => {
                var values = data2.val();
                let inderKeys = Object.keys(values);
                for (var i = 0; i < inderKeys.length; i++) {
                  if (values[inderKeys[i]].uid == userID.uid) {
                    this.db.ref('Websiteprofiles/').on("value", (data3: any) => {
                      var xx = Object.keys(data3.val())
                      for (var p = 0; p < xx.length; p++) {
                        this.db.ref('Websiteprofiles/' + xx[p] + '/' + keys[x]).on("value", (data4: any) => {
                          if (data4.val() != undefined || data4.val() != null) {
                            console.log(data4.val());
                            if (data3.val() != null || data3.val() != undefined) {
                              var orgs = data3.val();
                              console.log(data3.val());
                              var gal1;
                              var gal2;
                              var gal3;
                              if (gal1 == undefined || gal1 == null) {
                                gal1 = "../../assets/imgs/Defaults/DP.jpg"
                              }
                              if (gal2 == undefined || gal2 == null) {
                                gal2 = "../../assets/imgs/Defaults/DP.jpg"
                              }
                              if (gal3 == undefined || gal3 == null) {
                                gal3 = "../../assets/imgs/Defaults/DP.jpg"
                              }

                            }
                            let organizationObject = {
                              orgCat: data4.val().category,
                              orgName: data4.val().OrganisationName,
                              orgContact: data4.val().Telephone,
                              orgPicture: data4.val().Url,
                              orgLat: data4.val().latitude,
                              orgLong: data4.val().longitude,
                              // orgEmail:data4.val().Email,
                              orgAbout: data4.val().desc,
                              rating: values[inderKeys[i]].rate,
                              key: keys[x],
                              comment: values[inderKeys[i]].comment,
                              // orgPrice: orgs.Price,
                              orgGallery: gal1,
                              orgGallery1: gal2,
                              orgGallery2: gal3,
                              city: data4.val().city,
                              orgLogo: data4.val().Logo,
                            }
                            console.log(organizationObject);

                            this.ratedOrgs.push(organizationObject)
                          }
                        })
                      }


                    })
                    numRating++;
                  }
                }
              })
            }
          }
          this.assignTotRating(numRating);
          accpt(this.ratedOrgs);
        })

      })
    })
  }

  getTotRating() {
    return this.totRating;
  }
  assignTotRating(num) {
    this.totRating = num;
    console.log(num)
  }



  checkstate() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
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
    })
  }
  loginx(email, password) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Sign in....',
      duration: 1000
    });
    loading.present();
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  Signup(email, password, name) {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        let loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Signing up...',
          duration: 4000000
        });
        loading.present();
        return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
          var user = firebase.auth().currentUser
          firebase.database().ref("profiles/" + user.uid).set({
            name: name,
            email: email,
            downloadurl: "../../assets/imgs/Defaults/default.jpg",
            address: "",
          })
          var user = firebase.auth().currentUser;
          user.sendEmailVerification().then(function () {
            // Email sent.
          }).catch(function (error) {
            // An error happened.
          });
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
      this.ngzone.run(() => {
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
    })

  }

  forgotpassword(email) {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
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
      })
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
      this.ngzone.run(() => {
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          accpt(data)
          // data can be a set of coordinates, or an error (if an error occurred).
          // data.coords.latitude
          // data.coords.longitude
        });
      })
    })
  }
  getOrgNames() {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
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
    })
  }

  setLocation(data) {
    this.Location = data;
    console.log(this.Location);
  }
  storeImgur1(url) {
    this.url = url;
    console.log(url);
  }
  getLocation() {
    console.log(this.Location);
    return this.Location;
  }
  assignResp(resp) {
    this.resp = resp
  }

  getResp() {
    return this.resp
  }



  getCurrentLocation() {
    //get current location
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.assignResp(resp)
          this.createPositionRadius(resp.coords.latitude, resp.coords.longitude).then((data: any) => {
            this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
              .then((result: NativeGeocoderReverseResult[]) => {
                this.setLocation(result[0])
              })
              .catch((error: any) => console.log(error))
            accpt(data);
          })
        }).catch((error) => {
          console.log('Error getting location', error);
          rej("no network");
        });
      })
    })
  }
  createPositionRadius(latitude, longitude) {
    var leftposition, rightposition, downposition, uposititon;
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        // down  position
        var downlat = new String(latitude);
        var latIndex = downlat.indexOf(".");
        var down = parseInt(downlat.substr(latIndex + 1, 2)) + 12;
        if (down >= 100) {
          if (downlat.substr(0, 1) == "-") {
            var firstDigits = parseInt(downlat.substr(0, 3)) + 1;
          }
          else {
            var firstDigits = parseInt(downlat.substr(0, 2)) - 1;
          }
          var remainder = down - 100;
          if (remainder >= 10) {
            downposition = firstDigits + "." + remainder;
          }
          else {
            downposition = firstDigits + ".0" + remainder;
          }

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
        var up = parseInt(uplat.substr(latIndex + 1, 2)) - 12;
        if (up >= 100) {
          if (uplat.substr(0, 1) == "-") {
            var firstDigits = parseInt(uplat.substr(0, 3)) + 1;
          }
          else {
            var firstDigits = parseInt(uplat.substr(0, 2)) - 1;
          }
          var remainder = up - 100;
          if (remainder >= 10) {
            uposititon = firstDigits + "." + remainder;
          }
          else {
            uposititon = firstDigits + ".0" + remainder;
          }
        } else {

          if (uplat.substr(0, 1) == "-") {
            var temp3 = "-" + (parseInt(uplat.substr(1, 2)) - 1)
            console.log(temp)
            if (up < 0) {
              var str = new String(up);
              var str2 = str.indexOf("-");
              var rem = parseInt(str.substr(str2 + 1, str.length));
              uposititon = temp3 + ".0" + rem;
            }
            else if (up >= 10) {
              uposititon = temp3 + "." + up;
            }
            else {
              uposititon = temp3 + ".0" + up;
            }
          }
        }
        //left position
        var leftlat = new String(longitude);
        var longIndex = leftlat.indexOf(".");
        //  var left =  parseInt(leftlat.substr(longIndex + 1,2)) - 6;
        var left = parseInt(leftlat.substr(longIndex + 1, 2)) - 12;
        if (left >= 100) {
          if (leftlat.substr(0, 1) == "-") {
            var firstDigits = parseInt(leftlat.substr(0, 3)) - 1;
          } else {
            var firstDigits = parseInt(leftlat.substr(0, 2)) + 1;
          }
          var remainder = left - 100;
          leftposition = firstDigits + ".0" + remainder;
        } else {
          if (leftlat.substr(0, 1) == "-") {
            var firstDigits = parseInt(leftlat.substr(0, 3)) + 1;
          }
          else {
            var firstDigits = parseInt(leftlat.substr(0, 2)) - 1;
            console.log(firstDigits)
          }

          if (left == 0) {
            var remainder = 0;
            leftposition = firstDigits + ".0" + remainder;
          }
          else if (left < 0) {
            var temp = new String(left);
            var temp2 = temp.indexOf("-");
            var remainder = parseInt(temp.substr(temp2 + 1, temp.length));
            leftposition = firstDigits + ".0" + remainder;
          }
          else if (left >= 10) {
            leftposition = firstDigits + "." + left
          }
          else {
            var remainder = left;
            leftposition = firstDigits + ".0" + remainder;
          }

          //right position

          var rightlat = new String(longitude);
          var longIndex = rightlat.indexOf(".");
          var right = parseInt(rightlat.substr(longIndex + 1, 2)) + 12;
          console.log(right)
          if (right >= 100) {
            if (rightlat.substr(0, 1) == "-") {
              var firstDigits = parseInt(rightlat.substr(0, 3)) - 1;
            } else {
              var firstDigits = parseInt(rightlat.substr(0, 2)) + 1;
            }
            var remainder = right - 100;
            rightposition = firstDigits + ".0" + remainder;
          } else {
            if (rightlat.substr(0, 1) == "-") {
              var firstDigits = parseInt(rightlat.substr(0, 3)) + 1;
            }
            else {
              var firstDigits = parseInt(rightlat.substr(0, 2)) - 1;
              console.log(firstDigits)
            }
            if (right == 0) {
              var remainder = 0;
              rightposition = firstDigits + ".0" + remainder;
            }
            else if (right < 0) {
              var temp = new String(right);
              var temp2 = temp.indexOf("-");
              var remainder = parseInt(temp.substr(temp2 + 1, temp.length));
              rightposition = firstDigits + ".0" + remainder;
            }
            else if (right >= 10) {
              rightposition = firstDigits + "." + right;
            }
            else {
              var remainder = right;
              rightposition = firstDigits + ".0" + remainder;
              console.log(firstDigits)
            }
          }

        }

        let radius = {
          left: leftposition,
          right: rightposition,
          up: uposititon,
          down: downposition
        }
        console.log(radius)
        accpt(radius);
      })
    })
  }

  getOrganisations() {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
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
                orgPrice: organisations[OrganisationKeys].Price,
                orgGallery: organisations[OrganisationKeys].UrlGallery,
                orgLogo: organisations[OrganisationKeys].UrlLogo,
                orgGallery1: organisations[OrganisationKeys].UrlGallery1,
                orgGallery2: organisations[OrganisationKeys].UrlGallery2,

              }
              this.oraganisations.push(organizationObject);
            }
            accpt(this.oraganisations);
          }
        })
      })
    })
  }

  getNearByOrganisations(radius, org) {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
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
    })
  }
  DisplayCategory(Category) {
    return new Promise((accpt, rej) => {
      this.categoryArr.length = 0;
      this.db.ref('Websiteprofiles').on('value', (data) => {
        if (data.val() != undefined || data.val() != null) {
          this.ngzone.run(() => {
            this.categoryArr.length = 0;
            let SelectCategory = data.val();
            let keys = Object.keys(SelectCategory);
            for (var i = 0; i < keys.length; i++) {
              let k = keys[i];
              this.db.ref('comments/' + k).on('value', (data2) => {
                let totalRating = 0;
                let avg = 0;
                if (data2.val() != null || data2.val() != undefined) {
                  let ratings = data2.val();
                  let ratingsKeys = Object.keys(ratings);
                  for (var x = 0; x < ratingsKeys.length; x++) {
                    totalRating = totalRating + ratings[ratingsKeys[x]].rate
                    avg++;
                  }
                  if (totalRating != 0)
                    totalRating = totalRating / avg;
                  totalRating = Math.round(totalRating)
                }
                this.db.ref('Websiteprofiles/' + k).on('value', (data2) => {
                  var branch = data2.val();
                  var bKeys = Object.keys(branch)
                  for (var p = 0; p < bKeys.length; p++) {
                    var x = bKeys[p]
                    if (branch[x].category == Category) {
                      var gal1;
                      var gal2;
                      var gal3;
                      if (gal1 == undefined || gal1 == null) {
                        gal1 = "../../assets/imgs/Defaults/DP.jpg"
                      }
                      if (gal2 == undefined || gal2 == null) {
                        gal2 = "../../assets/imgs/Defaults/DP.jpg"
                      }
                      if (gal3 == undefined || gal3 == null) {
                        gal3 = "../../assets/imgs/Defaults/DP.jpg"
                      }
                      let obj = {
                        orgCat: branch[x].category,
                        orgName: branch[x].OrganisationName,
                        orgAddress: branch[x].OrganizationAdress,
                        orgContact: branch[x].Telephone,
                        orgPicture: branch[x].Url,
                        orgLat: branch[x].latitude,
                        orgLong: branch[x].longitude,
                        orgEmail: branch[x].Email,
                        orgAbout: branch[x].desc,
                        orgLogo: branch[x].Logo,
                        orgGallery: gal1,
                        orgGallery1: gal2,
                        orgGallery2: gal2,
                        key: x,
                        rating: totalRating,
                        city: branch[x].city
                      }
                      this.categoryArr.push(obj);
                    }
                  }
                })
              })
            }
            console.log(this.categoryArr)
            accpt(this.categoryArr);
          })
        }
      })
    })
  }



  // DisplayCategory(Category) {
  //   this.categoryArr.length = 0;
  //   return new Promise((accpt, rej) => {
  //     this.ngzone.run(() => {
  //       this.db.ref('OrganizationList').on('value', (data: any) => {
  //         let SelectCategory = data.val();
  //         let keys = Object.keys(SelectCategory);
  //         for (var i = 0; i < keys.length; i++) {
  //           let k = keys[i];
  //           if (Category == SelectCategory[k].Category) {
  //             this.db.ref('comments/' + k).on('value', (data2) => {
  //               let totalRating = 0;
  //               let avg = 0;
  //               if (data2.val() != null || data2.val() != undefined) {
  //                 let ratings = data2.val();
  //                 let ratingsKeys = Object.keys(ratings);
  //                 for (var x = 0; x < ratingsKeys.length; x++) {
  //                   totalRating = totalRating + ratings[ratingsKeys[x]].rate
  //                   avg++;
  //                 }
  //                 if (totalRating != 0)
  //                   totalRating = totalRating / avg;
  //                 totalRating = Math.round(totalRating)
  //               }
  //               let obj = {
  //                 orgCat: SelectCategory[k].Category,
  //                 orgName: SelectCategory[k].OrganizationName,
  //                 orgAddress: SelectCategory[k].OrganizationAdress,
  //                 orgContact: SelectCategory[k].ContactDetails,
  //                 orgPicture: SelectCategory[k].Url,
  //                 orgLat: SelectCategory[k].latitude,
  //                 orgLong: SelectCategory[k].longitude,
  //                 orgEmail: SelectCategory[k].Email,
  //                 orgAbout: SelectCategory[k].AboutOrg,
  //                 orgPrice: SelectCategory[k].Price,
  //                 orgGallery: SelectCategory[k].UrlGallery,
  //                 key: k,
  //                 rating: totalRating
  //               }
  //               this.categoryArr.push(obj);
  //               console.log(this.categoryArr)
  //             })
  //           }
  //         }
  //         accpt(this.categoryArr);
  //       })
  //     })
  //   })
  // }

  categoryArr2 = new Array;

  retrieveOrganization2() {
    return new Promise((accpt, rej) => {
      this.db.ref('Websiteprofiles').on('value', (data) => {
        if (data.val() != undefined || data.val() != null) {
          this.categoryArr2.length = 0;
          this.ngzone.run(() => {
            let SelectCategory = data.val();
            let keys = Object.keys(SelectCategory);
            for (var i = 0; i < keys.length; i++) {
              let k = keys[i];
              this.db.ref('comments/' + k).on('value', (data2) => {

                let totalRating = 0;
                let avg = 0;
                if (data2.val() != null || data2.val() != undefined) {
                  let ratings = data2.val();
                  let ratingsKeys = Object.keys(ratings);
                  for (var x = 0; x < ratingsKeys.length; x++) {
                    totalRating = totalRating + ratings[ratingsKeys[x]].rate
                    avg++;
                  }
                  if (totalRating != 0)
                    totalRating = totalRating / avg;
                  totalRating = Math.round(totalRating)
                }
                this.db.ref('Websiteprofiles/' + k).on('value', (data2) => {
                  var branch = data2.val();
                  var bKeys = Object.keys(branch)
                  for (var p = 0; p < bKeys.length; p++) {
                    var x = bKeys[p]
                    if (branch[x].city != undefined || branch[x].city != null) {
                      this.SignCities(branch[x].city)
                    }
                    var gal1;
                    var gal2;
                    var gal3;
                    if (gal1 == undefined || gal1 == null) {
                      gal1 = "../../assets/imgs/Defaults/DP.jpg"
                    }
                    if (gal2 == undefined || gal2 == null) {
                      gal2 = "../../assets/imgs/Defaults/DP.jpg"
                    }
                    if (gal3 == undefined || gal3 == null) {
                      gal3 = "../../assets/imgs/Defaults/DP.jpg"
                    }
                    let obj = {
                      orgCat: branch[x].category,
                      orgName: branch[x].OrganisationName,
                      orgAddress: branch[x].OrganizationAdress,
                      orgContact: branch[x].Telephone,
                      orgPicture: branch[x].Url,
                      orgLat: branch[x].latitude,
                      orgLong: branch[x].longitude,
                      orgEmail: branch[x].Email,
                      orgAbout: branch[x].desc,
                      orgLogo: branch[x].Logo,
                      orgGallery: gal1,
                      orgGallery1: gal2,
                      orgGallery2: gal3,
                      key: x,
                      rating: totalRating,
                      city: branch[x].city
                    }
                    this.categoryArr2.push(obj);
                  }
                })
              })
            }
            console.log(this.categoryArr2)
            accpt(this.categoryArr2);
          })
        }
      })
    })
  }


  retrieveOrganization() {
    return new Promise((accpt, rej) => {
      this.db.ref('Websiteprofiles').on('value', (data) => {
        if (data.val() != undefined || data.val() != null) {
          this.categoryArr.length = 0;
          this.ngzone.run(() => {
            let SelectCategory = data.val();
            let keys = Object.keys(SelectCategory);
            for (var i = 0; i < keys.length; i++) {
              let k = keys[i];
              this.db.ref('comments/' + k).on('value', (data2) => {
                let totalRating = 0;

                let avg = 0;
                if (data2.val() != null || data2.val() != undefined) {
                  let ratings = data2.val();
                  let ratingsKeys = Object.keys(ratings);
                  for (var x = 0; x < ratingsKeys.length; x++) {
                    totalRating = totalRating + ratings[ratingsKeys[x]].rate
                    avg++;
                  }
                  if (totalRating != 0)
                    totalRating = totalRating / avg;
                  totalRating = Math.round(totalRating)
                }
                this.db.ref('Websiteprofiles/' + k).on('value', (data2) => {
                  var branch = data2.val();
                  var bKeys = Object.keys(branch)
                  for (var p = 0; p < bKeys.length; p++) {
                    var x = bKeys[p]
                    if (branch[x].city != undefined || branch[x].city != null) {
                      this.SignCities(branch[x].city)
                    }
                    console.log(branch[x].OrganisationName);
                    var gal1;
                    var gal2;
                    var gal3;
                    if (gal1 == undefined || gal1 == null) {
                      gal1 = "../../assets/imgs/Defaults/DP.jpg"
                    }
                    if (gal2 == undefined || gal2 == null) {
                      gal2 = "../../assets/imgs/Defaults/DP.jpg"
                    }
                    if (gal3 == undefined || gal3 == null) {
                      gal3 = "../../assets/imgs/Defaults/DP.jpg"
                    }
                    let obj = {
                      orgCat: branch[x].category,
                      orgName: branch[x].OrganisationName,
                      orgAddress: branch[x].OrganizationAdress,
                      orgContact: branch[x].Telephone,
                      orgPicture: branch[x].Url,
                      orgLat: branch[x].latitude,
                      orgLong: branch[x].longitude,
                      orgEmail: branch[x].Email,
                      orgAbout: branch[x].desc,
                      orgGallery: gal1,
                      orgGallery1: gal2,
                      orgGallery2: gal3,
                      key: x,
                      rating: totalRating,
                      city: branch[x].city
                    }
                    this.categoryArr.push(obj);
                  }
                })
              })
            }
            console.log(this.categoryArr)
            accpt(this.categoryArr);
          })
        }
      })
    })
  }

  // retrieveOrganization() {
  //   return new Promise((accpt, rej) => {
  //     this.db.ref('Websiteprofiles').on('value', (data) => {
  //       if (data.val() != undefined || data.val() != null) {
  //         this.ngzone.run(() => {
  //           this.categoryArr.length = 0;
  //           let SelectCategory = data.val();
  //           let keys = Object.keys(SelectCategory);
  //           for (var i = 0; i < keys.length; i++) {
  //             let k = keys[i];
  //             let totalRating = 0;
  //             this.db.ref('comments/' + k).on('value', (data2) => {
  //               let avg = 0;
  //               if (data2.val() != null || data2.val() != undefined) {
  //                 let ratings = data2.val();
  //                 let ratingsKeys = Object.keys(ratings);
  //                 for (var x = 0; x < ratingsKeys.length; x++) {
  //                   totalRating = totalRating + ratings[ratingsKeys[x]].rate
  //                   avg++;
  //                 }
  //                 if (totalRating != 0)
  //                   totalRating = totalRating / avg;
  //                 totalRating = Math.round(totalRating)
  //               }
  //               if (SelectCategory[k].city != undefined || SelectCategory[k].city != null) {
  //                 this.SignCities(SelectCategory[k].city)
  //               }
  //               let obj = {
  //                 orgCat: SelectCategory[k].category,
  //                 orgName: SelectCategory[k].OrganizationName,
  //                 orgAddress: SelectCategory[k].OrganizationAdress,
  //                 orgContact: SelectCategory[k].Tel,
  //                 orgPicture: SelectCategory[k].Url,
  //                 orgLat: SelectCategory[k].latitude,
  //                 orgLong: SelectCategory[k].longitude,
  //                 // orgEmail: SelectCategory[k].Email,
  //                 orgAbout: SelectCategory[k].desc,
  //                 // orgPrice: SelectCategory[k].Price,
  //                 orgLogo: SelectCategory[k].Logo,
  //                 // orgGallery: SelectCategory[k].Gallery,
  //                 // orgGallery1: SelectCategory[k].Gallery1,
  //                 // orgGallery2: SelectCategory[k].Gallery2,
  //                 key: k,
  //                 rating: totalRating,
  //                 city: SelectCategory[k].city
  //               }
  //               this.categoryArr.push(obj);

  //             })
  //           }
  //           console.log(this.categoryArr)
  //           accpt(this.categoryArr);
  //         })
  //       }
  //     })
  //   })
  // }


  cities = new Array();
  SignCities(city) {
    var results = "";
    for (var x = 0; x < this.cities.length; x++) {
      if (this.cities[x] == city) {
        results = "found";
        break
      }
    }
    if (results != "found") {
      this.cities.push(city);
    }
  }
  getAllcities() {
    return this.cities;
  }

  comments(comment: any, commentKey: any, rating) {
    let user = firebase.auth().currentUser;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var day = moment().format('MMMM Do YYYY, h:mm:ss a');
        firebase.database().ref('comments/' + commentKey).push({
          comment: comment,
          uid: user.uid,
          date: day,
          rate: parseInt(rating)
        })
        accpt('success');
      });
    })
  }
  viewComments(comment: any, commentKey: any) {
    this.rating = 0;
    this.commentArr.length = 0;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        this.commentArr.length = 0;
        let user = firebase.auth().currentUser
        this.db.ref("comments/" + commentKey).on("value", (data: any) => {

          let CommentDetails = data.val();
          if (data.val() != null || data.val() != undefined) {
            let keys1: any = Object.keys(CommentDetails);
            for (var i = 0; i < keys1.length; i++) {
              let key = keys1[i];
              let chckId = CommentDetails[key].uid;
              let obj = {
                comment: CommentDetails[key].comment,
                uid: CommentDetails[key].uid,
                url: this.downloadurl,
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
                obj.url = profileData.downloadurl;
                obj.username = profileData.name;
                this.commentArr.push(obj);
                console.log(this.commentArr)
              });
            }
            accpt(this.commentArr);
            console.log(this.commentArr);

          }
          else {
            this.categoryArr.length = 0;
            accpt('');
          }

        }, Error => {
          rejc(Error.message)
        })

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
      this.ngzone.run(() => {
        firebase.database().ref("profiles/" + userid).on("value", (data: any) => {
          var a = data.val();
          accpt(a);
        }, Error => {
          rejc(Error.message)
        })
      })
    })
  }

  getProfile() {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        this.auth.onAuthStateChanged(function (user) {
          if (user) {
            firebase.database().ref("profiles/" + user.uid).on('value', (data: any) => {
              let details = data.val();
              accpt(details.downloadurl)
            })
          } else {
            console.log('no user');
          }
        });
      })
    })
  }

  checkAuthState() {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        this.auth.onAuthStateChanged(function (user) {
          if (user) {
            accpt(true)
          } else {
            accpt(false)
          }
        });
      })
    })
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        firebase.auth().signOut();
        resolve()
      });
    })
  }



  uploadProfilePic(pic, name) {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        firebase.storage().ref(name).putString(pic, 'data_url').then(() => {
          accpt(name);
          console.log(name);
        }, Error => {
          rejc(Error.message)
        })
      })
    })
  }

  storeToDB1(name) {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
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
    })
  }


  viewUserProfile() {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        let user = firebase.auth().currentUser
        firebase.database().ref("profiles").on("value", (data: any) => {
          let DisplayData = data.val();
          let keys = Object.keys(DisplayData);
          if (DisplayData !== null) {
          }
          for (var i = 0; i < keys.length; i++) {
            this.storeImgur(DisplayData[keys[i]].downloadurl);
            console.log(DisplayData[keys[i]].downloadurl)
          }
          accpt(DisplayData);
        }, Error => {
          rejc(Error.message)
        })
      })
    })
  }

  getUserID() {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var userID = firebase.auth().currentUser
        firebase.database().ref("profiles").on("value", (data: any) => {
          var profileDetails = data.val();
          if (profileDetails !== null) {
          }
          console.log(profileDetails);
          accpt(userID.uid);
        }, Error => {
          rejc(Error.message)
        })
      })
    })
  }

  storeImgur(url) {
    this.url = url;
    console.log(this.url)
  }



  update(name, email, downloadurl, address, surname) {
    this.ProfileArr.length = 0;
    return new Promise((pass, fail) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser
        firebase.database().ref('profiles/' + user.uid).update({
          name: name,
          email: email,
          downloadurl: downloadurl,
          address: address,
          surname: surname
        });
      })
    })
  }

  retrieve() {
    let userID = firebase.auth().currentUser;
    return firebase.database().ref("profiles/" + userID.uid)
  }


  searchedOrg = new Array()
  filertUsingCity(city, org) {
    return new Promise((pass, fail) => {
      this.ngzone.run(() => {
        this.searchedOrg = [];
        for (var x = 0; x < org.length; x++) {
          console.log(org[x].city);
          if (org[x].city == city) {
            this.searchedOrg.push(org[x])
          }
        }
        pass(this.searchedOrg);
      })
    })
  }

}