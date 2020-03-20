import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Product } from '../../product';
import { Store, select } from '@ngrx/store';
import * as fromProduct from './../../state';
import * as  productActions from './../../state/product.actions';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {

  errorMessage$: Observable<string>;
  displayCode$: Observable<boolean>;
  products$: Observable<Product[]>;
  selectedProduct$: Observable<Product>;

  constructor(private store: Store<fromProduct.State>) { }

  ngOnInit(): void {
    this.errorMessage$ = this.store.pipe(select(fromProduct.getError));
    this.displayCode$ = this.store.pipe(select(fromProduct.getShowProductCode));
    this.products$ = this.store.pipe(select(fromProduct.getProducts));
    this.selectedProduct$ = this.store.pipe(select(fromProduct.getCurrentProduct))

    this.store.dispatch(new productActions.Load());
  }


  checkChanged(value: boolean): void {
    this.store.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    this.store.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.store.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
    if (product && product.id) {
      if (confirm(`Really delete the product: ${product.productName}?`)) {
        this.store.dispatch(new productActions.DeleteProduct(product));
      }
    } else {
      // No need to delete, it was never saved
      this.store.dispatch(new productActions.ClearCurrentProduct())
    }
  }

  saveProduct(product: Product): void {
    if (product.id === 0) {
      this.store.dispatch(new productActions.CreateProduct(product));
    } else {
      this.store.dispatch(new productActions.UpdateProduct(product));
    }
  }


}
