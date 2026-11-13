import { Injectable } from '@angular/core';
import { Coupon, ICouponData } from '../models/coupon.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private couponsKey = 'user_coupons_v3';

  private initialCoupons: ICouponData[] = [
    { idProduct: 'DUL_01', name: 'Paleta de Caramelo', discount: 15, category: 'dulces', img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'DUL_02', name: 'Chocolate con Leche', discount: 20, category: 'dulces', img: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'DUL_03', name: 'Gomitas Frutales', discount: 10, category: 'dulces', img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'DUL_04', name: 'Malteada de Chocolate', discount: 12, category: 'dulces', img: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=400&q=80', active: false },

    { idProduct: 'BEB_01', name: 'Refresco Cola 2L', discount: 10, category: 'bebidas', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'BEB_02', name: 'Jugo de Naranja 1L', discount: 25, category: 'bebidas', img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'BEB_03', name: 'Agua Mineral 1.5L', discount: 15, category: 'bebidas', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'BEB_04', name: 'Té Verde Helado', discount: 20, category: 'bebidas', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80', active: false },

    { idProduct: 'CAR_01', name: 'Bistec de Res 1kg', discount: 30, category: 'carnes', img: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'CAR_02', name: 'Pechuga de Pollo 1kg', discount: 20, category: 'carnes', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'CAR_03', name: 'Chuleta de Puerco 1kg', discount: 25, category: 'carnes', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80', active: false },

    { idProduct: 'CON_01', name: 'Helado de Vainilla 1L', discount: 20, category: 'congelados', img: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'CON_02', name: 'Pizza Congelada Pepperoni', discount: 15, category: 'congelados', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'CON_03', name: 'Papas Francesas 1kg', discount: 18, category: 'congelados', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80', active: false },

    { idProduct: 'PAN_01', name: 'Pan Dulce Variado (6 pzs)', discount: 25, category: 'panaderia', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'PAN_02', name: 'Baguette Artesanal', discount: 10, category: 'panaderia', img: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'PAN_03', name: 'Concha de Vainilla', discount: 15, category: 'panaderia', img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80', active: false },

    { idProduct: 'FRU_01', name: 'Manzana Roja (Malla 1kg)', discount: 15, category: 'frutas', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'FRU_02', name: 'Aguacate Hass (Malla)', discount: 30, category: 'frutas', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80', active: false },
    { idProduct: 'FRU_03', name: 'Plátano Tabasco 1kg', discount: 10, category: 'frutas', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80', active: false }
  ];

  constructor() {}

  async getCoupons(): Promise<Coupon[]> {
    const saved = localStorage.getItem(this.couponsKey);
    if (!saved) {
      localStorage.setItem(this.couponsKey, JSON.stringify(this.initialCoupons));
      return this.initialCoupons.map(c => new Coupon(c));
    }
    const data: ICouponData[] = JSON.parse(saved);
    return data.map(c => new Coupon(c));
  }

  async saveCoupons(coupons: Coupon[]): Promise<void> {
    localStorage.setItem(this.couponsKey, JSON.stringify(coupons));
  }
}