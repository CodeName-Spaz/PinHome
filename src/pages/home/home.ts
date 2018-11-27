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
      this.pinhomeProvider.getOrganisations().then((org:any) =>{
        this.pinhomeProvider.getNearByOrganizations(radius,org).then((data:any) =>{
         this.orgArray = data;
         console.log(this.orgArray)
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

<<<<<<< HEAD
  
=======
  more(indx){
    this.navCtrl.push(ViewPage,{orgObject:this.orgArray[indx]})
  }
>>>>>>> f922ebaaac3cff1ea6ab109d6f868980a189fe36

}
