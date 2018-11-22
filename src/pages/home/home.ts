import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
orgArray  = new Array();
  constructor(public navCtrl: NavController, public pinhomeProvider: PinhomeProvider,public loadingCtrl: LoadingController) {
this.getNearByOrganizations();
  }
  getNearByOrganizations(){
    // let loading = this.loadingCtrl.create({
    //   spinner: 'bubbles',
    //   content: 'please wait',
    //   duration: 2000
    // });
    // loading.present();
    this.pinhomeProvider.getCurrentLocation().then((radius:any) =>{
      console.log(radius);
      // this.pinhomeProvider.getOrganisations().then((org:any) =>{
      //   console.log(org)
        // this.pinhomeProvider.getNearByOrganizations(radius,org).then((data:any) =>{
        //   loading.dismiss();
        // })
      // })
    })
  }

  getAllOrganizations(){

  }

}
