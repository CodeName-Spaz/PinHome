import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { HomePage } from '../home/home';


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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPage');
  }

  Back(){
    this.navCtrl.pop()
  }
  reposition(event){
    let segPosition = document.getElementsByClassName('segment') as HTMLCollectionOf <HTMLElement>;
    segPosition[0].style.transform ="translateY(0%)"
  }

  scroller(event){
    console.log(event);
    // console.log(event.directionY);
    
    let btnBack = document.getElementsByClassName('backBtn') as HTMLCollectionOf <HTMLElement>;

    if(event.scrollTop > 0 && event.directionY == "down"){
      btnBack[0].style.transition = "700ms"
      btnBack[0].style.transform ="translateY(-200%)"
    }
    else if (event.directionY == "up" || event.scrollTop == 0){
      btnBack[0].style.transform ="translateY(0%)"
    }

    let seg = document.getElementsByClassName('segment') as HTMLCollectionOf <HTMLElement>;
    
    if(event.scrollTop >= 400){
      seg[0].style.width = "100%";
      seg[0].style.position = 'absolute';
      seg[0].style.transform = "translateY("+(event.scrollTop - 420)+"px)";
    }
    else{
      seg[0].style.width = "100%";
      seg[0].style.transform = "translateY(0)"

    }

  }

}
