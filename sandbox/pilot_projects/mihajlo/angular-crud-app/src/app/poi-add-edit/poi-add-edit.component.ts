import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { PointOfInterestService } from '../services/point-of-interest.service';

@Component({
  selector: 'app-poi-add-edit',
  templateUrl: './poi-add-edit.component.html',
  styleUrls: ['./poi-add-edit.component.scss'],
})
export class PoiAddEditComponent implements OnInit {
  poiForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _poiService: PointOfInterestService,
    private _dialogRef: MatDialogRef<PoiAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.poiForm = this._fb.group({
      name: '',
      city: '',
      country: '',
      description: '',
    });
  }

  ngOnInit(): void {
    this.poiForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.poiForm.valid) {
      if (this.data) {
        this._poiService
          .updatePointOfInterest(this.data.id, this.poiForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Uspesno izmenjeno');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._poiService.addPointOfInterest(this.poiForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Uspesno dodato');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
}
