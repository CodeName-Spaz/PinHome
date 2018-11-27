import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { PinhomeProvider } from '../../providers/pinhome/pinhome';
import { ViewPage } from '../view/view'
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
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'please wait',
      duration: 222000
    });
    loading.present();
    this.pinhomeProvider.getCurrentLocation().then((radius:any) =>{
      console.log(radius)
      this.pinhomeProvider.getOrganisations().then((org:any) =>{
        this.pinhomeProvider.getNearByOrganizations(radius,org).then((data:any) =>{
         this.orgArray = data;
          loading.dismiss();
        })
      })
    })
  }

  getAllOrganizations(){
  }
  viewPage(){
    this.navCtrl.push(ViewPage)

  }

  

}
