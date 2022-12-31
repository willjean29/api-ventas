import { IOrderProducts } from '@modules/orders/domain/models/IOrderProducts';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  order_products: IOrderProducts[];
  created_at: Date;
  updated_at: Date;
}
