import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
   MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
   MatProgressBarModule,  MatSnackBarModule} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule],
})
export class MaterialModule { }
