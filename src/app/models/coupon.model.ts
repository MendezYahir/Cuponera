export interface ICouponData {
  idProduct: string;
  name: string;
  discount: number;
  category: string;
  img: string;
  active: boolean;
}

export class Coupon implements ICouponData {
  idProduct: string;
  name: string;
  discount: number;
  category: string;
  img: string;
  active: boolean;

  constructor(data: ICouponData) {
    this.idProduct = data.idProduct || '';
    this.name = data.name || '';
    this.discount = data.discount || 0;
    this.category = data.category || '';
    this.img = data.img || '';
    this.active = data.active ?? false;
  }

  isValid(): boolean {
    return !!(this.idProduct && this.name && this.category);
  }

  isEqual(other: Coupon): boolean {
    return this.idProduct === other.idProduct;
  }
}