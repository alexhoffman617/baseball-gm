import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
   MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
   MatProgressBarModule,  MatSnackBarModule, MatCardModule, MatAutocompleteModule} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule, MatCardModule, MatAutocompleteModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule, MatCardModule, MatAutocompleteModule],
})
export class MaterialModule { }
