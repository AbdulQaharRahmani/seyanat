import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelService } from 'src/app/excel.service';
import { MainService } from 'src/app/main.service';
import { TaxService } from '../tax.service';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.css']
})
export class CalculateComponent implements OnInit {
  searchForm: FormGroup;
  tax_types;
  displayedColumns =[];
  items:[] ;
  dataSource: any;
  isListEmpty = true;
  error = false;
  columnNames;
  month_names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  constructor(
    private mainService: MainService,
    private taxService: TaxService,
    private cdr: ChangeDetectorRef,
    private excelService: ExcelService,
    ) { 
      this.columnNames = this.mainService.getColumnNames();

    }

  ngOnInit(): void {
    this.tax_types = this.mainService.getTaxTypes();
    this.searchForm =new FormGroup({
      year: new FormControl('',Validators.required),
      tax_type: new FormControl('',Validators.required)
    });
  }
  search(){
    
    this.createQuery().subscribe((data)=>{
      this.clearForm();        
      this.items = data['results'];
      console.log(this.items);
        this.isListEmpty = !(this.items.length > 0);
        this.displayedColumns = this.isListEmpty? []: Object.keys(data['results'][0]);

        this.dataSource = new MatTableDataSource();
        this.dataSource.data = this.items;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
    });
  }

  createQuery(){
    let t:Tax = this.searchForm.value;
  
    switch(t.tax_type){
      case 'ماهانه': 
         return this.taxService.getMonthlyTax(t.year);
      case 'سالانه': return this.taxService.getYearlyTax(t.year);
      default: return this.taxService.getQuarterlyTax(t.year); 
    }
  }
  clearForm(){
    this.searchForm.setValue({
      year: '',
      tax_type: ''
    });
  }
  ngAfterViewInit(){
    if(this.dataSource)
    this.dataSource.paginator = this.paginator;
  }
  toExcel(){
    if(this.items)
    this.excelService.exportAsExcelFile(this.items, 'tax'+ new Date().getDate());
  }
  toPrint(){
 //   this.printService.setItems(this.items,'tax');
  }  
}
export interface Tax{
    year: number;
    tax_type: string;
}
