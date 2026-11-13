import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonChip, IonLabel 
} from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { QRCodeComponent } from 'angularx-qrcode';
import { ScreenBrightness, GetBrightnessReturnValue } from '@capacitor-community/screen-brightness';
import { App } from '@capacitor/app';
import { CouponService } from '../../services/coupon.service';
import { Coupon } from 'src/app/models/coupon.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonChip, IonLabel, QRCodeComponent
  ]
})
export class Tab2Page {

  private couponService: CouponService = inject(CouponService);
  private platform: Platform = inject(Platform);
  
  QRCode!: string;
  activeCoupons: Coupon[] = [];
  private currentBrightness!: GetBrightnessReturnValue;

  constructor() {}

  async ionViewWillEnter() {
    if (!this.platform.is('desktop')) {
      this.currentBrightness = await ScreenBrightness.getBrightness();
      this.setMaxBrightness();

      if (this.platform.is('ios')) {
        App.addListener('appStateChange', (state) => {
          if (state.isActive) {
            this.setMaxBrightness();
          } else {
            this.restoreBrightness();
          }
        });
      }
    }

    const coupons: Coupon[] = await this.couponService.getCoupons();
    
    this.activeCoupons = coupons.filter((coupon: Coupon) => coupon.active);
    this.QRCode = this.activeCoupons.length > 0 ? JSON.stringify(this.activeCoupons) : '';
  }

  ionViewDidLeave() {
    if (!this.platform.is('desktop')) {
      this.restoreBrightness();
      App.removeAllListeners();
    }
  }

  setMaxBrightness() {
    ScreenBrightness.setBrightness({ brightness: 1 });
  }

  restoreBrightness() {
    ScreenBrightness.setBrightness({ brightness: this.currentBrightness.brightness });
  }
}