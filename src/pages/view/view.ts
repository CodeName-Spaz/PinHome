import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { IonicImageViewerModule } from 'ionic-img-viewer';


/**
 * Generated class for the ViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {

  orgArray = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.orgArray.push(this.navParams.get('orgObject'));
    console.log(this.orgArray)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPage');
  }

}
