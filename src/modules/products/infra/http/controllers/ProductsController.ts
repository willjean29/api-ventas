import { NextFunction, Request, Response } from 'express';
import {
  CreateProductService,
  DeleteProductService,
  ListProductService,
  ShowProductService,
  UpdateProductService,
} from '../../../app';
import { container } from 'tsyringe';

class ProductsController {
  public async index(request: Request, response: Response) {
    const listProducts = container.resolve(ListProductService);

    const products = await listProducts.execute();

    return response.json(products);
  }

  public async show(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const showProduct = container.resolve(ShowProductService);
    try {
      const product = await showProduct.execute({ id });
      return response.json(product);
    } catch (error) {
      return next(error);
    }
  }

  public async create(request: Request, response: Response, next: NextFunction) {
    const { name, price, quantity } = request.body;

    const createProduct = container.resolve(CreateProductService);

    try {
      const product = await createProduct.execute({
        name,
        price,
        quantity,
      });

      return response.json(product);
    } catch (error) {
      return next(error);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction) {
    const { name, price, quantity } = request.body;
    const { id } = request.params;

    const updateProduct = container.resolve(UpdateProductService);
    try {
      const product = await updateProduct.execute({
        id,
        name,
        price,
        quantity,
      });

      return response.json(product);
    } catch (error) {
      return next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;

    const deleteProduct = container.resolve(DeleteProductService);

    try {
      const product = await deleteProduct.execute({ id });

      return response.json(product);
    } catch (error) {
      return next(error);
    }
  }
}

export default ProductsController;
