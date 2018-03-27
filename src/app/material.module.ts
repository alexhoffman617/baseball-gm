import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
   MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
   MatProgressBarModule,  MatSnackBarModule, MatCardModule, MatAutocompleteModule, MatIconModule, MatTooltipModule,
   MatChipsModule, MatRadioModule }
   from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule, MatCardModule, MatAutocompleteModule, MatIconModule, MatTooltipModule,
    MatChipsModule, MatRadioModule],
  exports: [MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatTabsModule, MatInputModule,
    MatToolbarModule, MatDialogModule, MatProgressSpinnerModule, MatSlideToggleModule, MatMenuModule,
    MatProgressBarModule, MatSnackBarModule, MatCardModule, MatAutocompleteModule, MatIconModule, MatTooltipModule,
    MatChipsModule, MatRadioModule],
})
export class MaterialModule { }
