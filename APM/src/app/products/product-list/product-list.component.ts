import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product';
import { Store, select } from '@ngrx/store';
import * as fromProduct from './../state/product.reducer';
import * as  productActions from './../state/product.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage$ = this.store.pipe(select(fromProduct.getError));

  displayCode: boolean;
  isComponentActive = true;

  products$ = this.store.pipe(select(fromProduct.getProducts));

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;

  constructor(private store: Store<fromProduct.State>) { }

  ngOnInit(): void {
    // takeWhile will gaurantee the unsubscribe when the property componentActive become false on destroy
    this.store.pipe(select(fromProduct.getCurrentProduct),
      takeWhile(() => this.isComponentActive)).subscribe(
        selectedProduct => this.selectedProduct = selectedProduct
      );

    this.store.dispatch(new productActions.Load());

    this.store.pipe(select(fromProduct.getShowProductCode),
      takeWhile(() => this.isComponentActive)).subscribe(
        showProductCode => this.displayCode = showProductCode
      );


  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
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

}
