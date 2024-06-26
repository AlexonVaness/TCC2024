import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsProductPageRoutingModule } from './details-product-routing.module';

import { DetailsPage } from './details-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsProductPageRoutingModule
  ],

  declarations: [DetailsPage]
})
export class DetailsProductPageModule {}
