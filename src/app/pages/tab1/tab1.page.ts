import { NgTemplateOutlet } from '@angular/common';
import { CouponService } from './../../services/coupon.service';
import { Component, inject } from '@angular/core';

import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonSegment, 
  IonSegmentButton, IonSegmentContent, IonSegmentView, IonCard, 
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonCol, 
  IonGrid, IonRow, IonIcon, IonItem, IonButtons, IonButton
} from '@ionic/angular/standalone';

import { Coupon, ICouponData } from 'src/app/models/coupon.model';
import { FilterCouponCategoryPipe } from 'src/app/pipes/filter-coupon-category-pipe';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerScanResult } from '@capacitor/barcode-scanner';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonSegment, 
    IonSegmentButton, IonSegmentContent, IonSegmentView, FilterCouponCategoryPipe, 
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonCol, 
    IonGrid, IonRow, NgTemplateOutlet, IonIcon, IonButtons, IonButton
  ],
})
export class Tab1Page {
  
  private couponService: CouponService = inject(CouponService);
  private toastService: ToastService = inject(ToastService);
  coupons: Coupon[] = [];

  constructor() {
    // Registramos el icono para poder usarlo en standalone
    addIcons({ cameraOutline });
  }

  async ionViewWillEnter() {
    this.coupons = await this.couponService.getCoupons();
    console.log(this.coupons);
  }

  changeActive(coupon: Coupon) {
    coupon.active = !coupon.active;
    this.couponService.saveCoupons(this.coupons);
  }

  startCamera() {
    CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.QR_CODE
    })
    .then((resultBarcode: CapacitorBarcodeScannerScanResult) => {
      console.log(resultBarcode);
      if (resultBarcode.ScanResult) {
        try {
          const couponData: ICouponData = JSON.parse(resultBarcode.ScanResult);
          const coupon = new Coupon(couponData);

          if (coupon.isValid()) { // Asegurar que el cupon sea valido
            const couponExist = this.coupons.some((c: Coupon) => c.isEqual(coupon));

            if (!couponExist) { // Validando duplicidad
              this.coupons = [...this.coupons, coupon];
              this.couponService.saveCoupons(this.coupons);
              this.toastService.showToast("Cupon agregado");
            } else {
              this.toastService.showToast("El cupon ya existe");
            }
          } else {
            this.toastService.showToast("El cupon es Invalido");
          }
        } catch (error) {
          console.error(error);
          this.toastService.showToast("QR error");
        }
      }
    });
  }
}