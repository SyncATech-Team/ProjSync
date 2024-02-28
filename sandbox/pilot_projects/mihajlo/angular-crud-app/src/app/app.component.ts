import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PoiAddEditComponent } from './poi-add-edit/poi-add-edit.component';
import { PointOfInterestService } from './services/point-of-interest.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'pointOfInterest',
    'city',
    'country',
    'description',
    'actions'
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _poiService: PointOfInterestService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.getPointOfInterestList();
  }

  openAddEditPoiForm() {
    const dialogRef = this._dialog.open(PoiAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getPointOfInterestList();
        }
      },
    });
  }

  getPointOfInterestList() {
    this._poiService.getPointOfInterestList().subscribe({
      next: (res) => {
        console.log(res)
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
      },
      error: console.log,
    });
  }


  deletePointOfInterest(id: number) {
    this._poiService.deletePointOfInterest(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Obrisano', 'done');
        this.getPointOfInterestList();
      },
      error: console.log,
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(PoiAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getPointOfInterestList();
        }
      },
    });
  }
}
