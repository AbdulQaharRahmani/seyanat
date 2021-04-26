import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ExcelService } from '../excel.service';
import { IncomeService } from '../incomes/income.service';
import { MainService } from '../main.service';
import { Income } from '../models/income.model';
import { Profit } from '../models/profit.model';
import { ShareHolder } from '../models/shareholder.model';

@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.css']
})
export class ProfitComponent implements OnInit {

 
  income_types;
  displayedColumns: string[] = ['service_type', 'service_id', 'total_income', 'total_expense','net_income'];
  dataSource = new MatTableDataSource< Profit>() ;
  
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  profitSearch: FormGroup;
  isListEmpty = true;
  error = false;
  items:Profit[];

  constructor(
    private cdr: ChangeDetectorRef,
    private mainService: MainService,
    private incomeService: IncomeService,
    private excelService: ExcelService
   ) {
    this.income_types = this.mainService.getIncomeTypes();
    
  }
  ngOnInit(): void {

      this.profitSearch= new FormGroup({
        service_type: new FormControl(''),
        service_id: new FormControl('')
      });  
  }
  search(){
    this.error = false;
    this.incomeService.getNetIncomeList(this.createQuery()).subscribe((arg)=>{
     this.items = arg['results'];
     this.clearForm();
      this.dataSource.data = this.items;
      this.dataSource.paginator = this.paginator;
        if(this.items.length>0){
        this.isListEmpty = false;}
        else{
          this.isListEmpty = true;
        }
        
      this.cdr.detectChanges();
    },err=>{
      console.log(err);
      this.error = true;
    });
    
  }
  createQuery(){
    let arr = [];
    if( this.profitSearch.value['service_type'] !==""){
      arr.push(`service_type = '${this.profitSearch.value['service_type']}' `);
    }
    if(this.profitSearch.value['service_id'] !==""){
      arr.push(`service_id = ${this.profitSearch.value['service_id']} `);
    }
    return arr.join(" and ");
  }
  clearForm(){
    this.profitSearch.setValue({
      service_type: '',
        service_id: ''
    });
   
  }
  toExcel(){
    if(this.items)
    this.excelService.exportAsExcelFile(this.items,'income'+new Date().getDate());      
  } 
  getTotalIncome(){
    if(this.items)
      return this.items.map(t => t.total_income).reduce((acc, value) => +acc + +value, 0);
    return 0;
  }
  getTotalExpense(){
    if(this.items)
      return this.items.map(t => t.total_expense).reduce((acc, value) => +acc + +value, 0);
    return 0;
  }
  getNetIncome(){
    if(this.items)
      return this.items.map(t => t.net_income).reduce((acc, value) => +acc + +value, 0);
    return 0;
  }
}
