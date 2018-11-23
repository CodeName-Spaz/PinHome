import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
 

  constructor(public pinhome : PinhomeProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap();
    //this.createCurrentLocationMarker();
  }

  loadMap() {
    // This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': '(your api key for `https://`)',
      'API_KEY_FOR_BROWSER_DEBUG': '(your api key for `http://`)'
    });

    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: -26.26099,
           lng:  27.9496564
         },
         zoom: 18,
         tilt: 30
       }
    };
    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.pinhome.getOrganisations().then((data:any) =>{
      this.orgArray =  data;
      console.log(this.orgArray);
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
              var mark = e[0];
              for (var i = 0; i < this.orgArray.length; i++ ){
                if (this.orgArray[i].orgLat == mark[0].lat && this.orgArray[i].orgLong == mark[0].lng){
                  this.navCtrl.push(ViewPage,{orgObject: this.orgArray[i]})
                    break;
                }
              }
          })
        })
      }
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
      console.log(data)
      })
    })
  }
}
