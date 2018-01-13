import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule,
   MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule } from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule],
})
export class MaterialModule { }
