import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
   MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
   MatProgressBarModule,  MatSnackBarModule, MatCardModule, MatAutocompleteModule, MatIconModule} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule, MatCardModule, MatAutocompleteModule, MatIconModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule, MatCardModule, MatAutocompleteModule, MatIconModule],
})
export class MaterialModule { }
