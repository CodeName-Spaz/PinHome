import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import { ViewPage } from '../view/view';
import { HomePage } from '../home/home';

/**
 * Generated class for the NearbyOrgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-nearby-org',
  templateUrl: 'nearby-org.html',
})
export class NearbyOrgPage {
  map: GoogleMap;
  orgArray =  new Array();
  cat = [];
  location;
 

  constructor(public pinhome : PinhomeProvider, public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadMap();
    // this.pinhome.getProfile()
    //this.createCurrentLocationMarker();
  }

  loadMap() {
       let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Getting your location,please wait',
      // duration: 22222000
        duration: 2000
    });
    loading.present();
    // This code is necessary for browser
    this.pinhome.listenForLocation().then((resp:any) =>{
      this.assignLocation(resp);
      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': '(your api key for `https://`)',
        'API_KEY_FOR_BROWSER_DEBUG': '(your api key for `http://`)'
      });
  
      let mapOptions: GoogleMapOptions = {
        camera: {
           target: {
             lat: resp.coords.latitude,
             lng: resp.coords.longitude
           },
           zoom: 10,
           tilt: 25
         }
      };
      this.map = GoogleMaps.create('map_canvas', mapOptions);
      this.map.addMarker({
        title: 'current Location',
        icon: 'blue',
        animation: 'DROP',
        position: {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        }
      }).then((marker : Marker ) =>{
        marker.showInfoWindow();
      })
      this.pinhome.getOrganisations().then((data:any) =>{
        this.orgArray =  data;
        for (var x = 0; x < this.orgArray.length; x++){
          this.map.addMarker({
            title: this.orgArray[x].orgName,
            icon: 'red',
            animation: 'DROP',
            position: {
              lat: this.orgArray[x].orgLat,
              lng:  this.orgArray[x].orgLong 
            }
          }).then((marker : Marker ) =>{
            marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(e =>{
                for (var i = 0; i < this.orgArray.length; i++ ){
                  if (this.orgArray[i].orgName ==  marker.getTitle()){
                    this.navCtrl.push(ViewPage,{orgObject: this.orgArray[i]})
                      break;
                  }
                }
            })
          })
        }
        loading.dismiss();
      })
    })

  }

  createCurrentLocationMarker(){
    this.pinhome.getCurrentLocation().then((resp:any) =>{
      this.map.addMarker({
        title: 'current Location',
        icon: 'red',
        animation: 'DROP',
        position: {
          lat: -26.26099,
          lng:  27.9496564
        }
      }).then((marker : Marker ) =>{
        marker.showInfoWindow();
      })
      this.pinhome.createPositionRadius(resp.coords.latitude,resp.coords.longitude).then(data =>{
      })
    })
  }
  GoToHomePage(){
    this.navCtrl.setRoot(HomePage);
  }
  more(category){
    console.log(category);
    this.map.clear();
    this.pinhome.DisplayCategory(category).then((data:any) =>{
     this.cat =  data;
    this.map.addMarker({
      title: 'current Location',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat:this.location.coords.latitude,
        lng: this.location.coords.longitude
      }
    }).then((marker : Marker ) =>{
      marker.showInfoWindow();
    })
      this.orgArray =  data;
      for (var x = 0; x <this.cat.length; x++){
        this.map.addMarker({
          title: this.cat[x].orgName,
          icon: 'red',
          animation: 'DROP',
          position: {
            lat: this.cat[x].orgLat,
            lng:  this.cat[x].orgLong 
          }
        }).then((marker : Marker ) =>{
          marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(e =>{
              for (var i = 0; i < this.cat.length; i++ ){
                if (this.orgArray[i].orgName ==  marker.getTitle()){
                  this.navCtrl.push(ViewPage,{orgObject: this.orgArray[i]})
                    break;
                }
              }
          })
        })
      }
    })
  }

  assignLocation(resp){
    this.location =  resp;
  }
}