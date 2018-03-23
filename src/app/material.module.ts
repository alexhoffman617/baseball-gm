import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
   MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
   MatProgressBarModule,  MatSnackBarModule, MatCardModule, MatAutocompleteModule, MatIconModule, MatTooltipModule}
   from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule, MatCardModule, MatAutocompleteModule, MatIconModule, MatTooltipModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule, MatCardModule, MatAutocompleteModule, MatIconModule, MatTooltipModule],
})
export class MaterialModule { }
