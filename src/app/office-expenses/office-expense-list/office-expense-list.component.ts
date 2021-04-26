import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService } from 'src/app/excel.service';
import { ExpensesService } from 'src/app/expenses/expenses.service';
import { MainService } from 'src/app/main.service';
import { OfficeExpense } from 'src/app/models/office-expense.model';

@Component({
  selector: 'app-office-expense-list',
  templateUrl: './office-expense-list.component.html',
  styleUrls: ['./office-expense-list.component.css']
})
export class OfficeExpenseListComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup;
  expense_types: string[];
  isListEmpty: boolean = true;
  error = false;
  rows = new Array<any>();
  
  displayedColumns = ['id','expense_type','expense_description','amount','given_date'];
  columnNames;
  total = 0;
  items;
  dataSource = new MatTableDataSource<OfficeExpense>();
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  constructor(private mainService: MainService,
    private cdr: ChangeDetectorRef,
    private expenseService: ExpensesService,
    private router:Router ,
    private route: ActivatedRoute,
    private zone:NgZone,
    private excelService: ExcelService) { }

  ngOnInit(): void {
    this.expense_types = this.mainService.getOfficeExpenseTypes();
    this.columnNames = this.mainService.getColumnNames();
    this.initForm();
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }
  initForm(){
    
    this.searchForm = new FormGroup({
      expense_type: new FormControl(''),
      year: new FormControl(''),
      month: new FormControl('')
    });
  }
  search(){
    this.error = false;
    this.expenseService.getOfficeExpenseList(this.createQuery()).subscribe((data)=>{
      this.clearForm();        
      this.items = data['results'];
        this.isListEmpty = !(this.items.length > 0);
        this.dataSource.data = this.items;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
    },
    err=>{
      console.log(err);
      this.error = true;
    });
  }
  createQuery(){
    let arr = [];
    if( this.searchForm.value['expense_type'] !==""){
      arr.push(`expense_type = '${this.searchForm.value['expense_type']}' `);
    }
    if(this.searchForm.value['year'] !==""){
      arr.push(`year(given_date) = ${this.searchForm.value['year']} `);
    }
    if(this.searchForm.value['month'] !==""){
      arr.push(`month(given_date) = ${this.searchForm.value['month']} `);
    }
    return arr.join(" and ");
  }
  clearForm(){
    this.searchForm.setValue({
      expense_type: '',
      year: '',
      month: ''
    });
  }
  toExcel(){
    if(this.items)
    this.excelService.exportAsExcelFile(this.items,'income'+new Date().getDate());      
  }  
  goToEditPage(id:number){
    console.log(id);
    this.zone.run(()=>{
      this.router.navigate(['../officeexpense',id],{relativeTo: this.route});
    });
  }
  getTotalIncome(){
    if(this.items)
      return this.items.map(t => t.amount).reduce((acc, value) => +acc + +value, 0);
    return 0;
  }
}
