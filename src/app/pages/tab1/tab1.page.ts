import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonSegment,
  IonSegmentButton, IonSegmentContent, IonSegmentView, IonCard,
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol,
  IonGrid, IonRow, IonIcon, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { CouponService } from 'src/app/services/coupon.service';
import { ToastService } from 'src/app/services/toast.service';
import { Coupon, ICouponData } from 'src/app/models/coupon.model';
import { FilterCouponCategoryPipe } from 'src/app/pipes/filter-coupon-category-pipe';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerScanResult } from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonSegment,
    IonSegmentButton, IonSegmentContent, IonSegmentView, FilterCouponCategoryPipe,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol,
    IonGrid, IonRow, NgTemplateOutlet, IonIcon, IonButtons, IonButton
  ],
})
export class Tab1Page {

  private couponService: CouponService = inject(CouponService);
  private toastService: ToastService = inject(ToastService);
  coupons: Coupon[] = [];

  constructor() {
    addIcons({ cameraOutline });
  }

  async ionViewWillEnter() {
    this.coupons = await this.couponService.getCoupons();
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
      if (resultBarcode.ScanResult) {
        try {
          const couponData: ICouponData = JSON.parse(resultBarcode.ScanResult);
          const coupon = new Coupon(couponData);

          if (coupon.isValid()) {
            const couponExist = this.coupons.some((c: Coupon) => c.isEqual(coupon));

            if (!couponExist) {
              this.coupons = [...this.coupons, coupon];
              this.couponService.saveCoupons(this.coupons);
              this.toastService.showToast("Cupón agregado");
            } else {
              this.toastService.showToast("El cupón ya existe");
            }
          } else {
            this.toastService.showToast("El cupón es inválido");
          }
        } catch (error) {
          console.error(error);
          this.toastService.showToast("Error en QR");
        }
      }
    });
  }
}