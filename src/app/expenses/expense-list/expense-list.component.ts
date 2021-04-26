import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MainService } from 'src/app/main.service';
import { Employee } from 'src/app/models/employee.model';
import { ShareHolder } from 'src/app/models/shareholder.model';
import { ExpensesService } from '../expenses.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/excel.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup;
  given_by_list: ShareHolder[];
  employee_list: Employee[];
  expense_types: string[];
  isListEmpty: boolean = true;
  income_types;
  error = false;
  rows = new Array<any>();
  
  displayedColumns = [];
  columnNames;
  total = 0;
  items;
  dataSource: any;
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  constructor(
    private mainService: MainService,
    private cdr: ChangeDetectorRef,
    private expenseService: ExpensesService,
    private router:Router ,
    private zone:NgZone,
    private excelService: ExcelService
     ) {
    this.given_by_list = this.mainService.getShareHolders();
    this.expense_types = this.mainService.getExpenseListForSearch();
    this.columnNames = this.mainService.getColumnNames();
    this.employee_list = this.mainService.getEmployees();
    this.income_types = this.mainService.getIncomeTypes();
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      expense_type: new FormControl(''),
      given_by: new FormControl(''),
      year: new FormControl(''),
      month: new FormControl(''),
      group: new FormControl(''),
      service_type: new FormControl(''),
      service_id: new FormControl(''),
      employee_id: new FormControl('')
    });
  }
  search(){
    this.error = false;
    this.expenseService.getExpenseList(this.createQuery()).subscribe((data)=>{
      this.clearForm();        
      this.items = data['results'];
        this.isListEmpty = !(this.items.length > 0);
        this.displayedColumns = this.isListEmpty? []: Object.keys(this.items[0]);

        this.dataSource = new MatTableDataSource();
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
     let x: ExpenseSearch = this.searchForm.value;
     console.log(x);
     let q: string;
     /* if expense type is selected then simple queries with no group by */
     if(x.expense_type){
       if(x.expense_type === 'معاشات'){
         return this.getSalaryQuery();
       }
       else if(x.expense_type=== 'مصارف خدماتی'){
        return this.getServiceExpenseQuery();
       }else{
        return this.getExpenseQuery();
       }
     } 
     else{
        console.log(this.getTotalExpenseQuery());
        return this.getTotalExpenseQuery();
     } 
  }
  getTotal(){
    if(this.items){
     return this.items.map(t=>t.amount).reduce((acc,val)=>+acc + +val,0);
    }
    return 0;
  }
  isServiceTypeSelected(){
    // checks if service types is selected in order to show others fields
    return this.searchForm.value['expense_type'] ==='مصارف خدماتی';
  }
  isSalaryTypeSelected(){
    return this.searchForm.value['expense_type'] ==='معاشات';
  }
  
  ngAfterViewInit(): void {
    if(this.dataSource)
      this.dataSource.paginator = this.paginator;
  } 

  clearForm(){
    this.searchForm.setValue({
      expense_type: '',
      given_by: '',
      year: '',
      month: '',
      group: '',
      service_type: '',
      service_id: '',
      employee_id: ''
    });
  }

  getWhereClause(){
    let x:ExpenseSearch = this.searchForm.value;
    let arr = [];
    
    if(x.service_type !==''){
      arr.push(` service_type = '${x.service_type}'`);
    }
    if(x.service_id !==''){
      arr.push(` service_id = ${x.service_id}` );
    }// because this is a number
    if(this.searchForm.value['given_by']!==''){
      arr.push(` given_by = ${x.given_by}`);
    }
    if(this.searchForm.value['year']!==''){
      arr.push(` year(given_date) = ${x.year}`);
    }
    if(this.searchForm.value['month']!==''){
      arr.push(` month(given_date) = ${x.month}`);
    }
    if(this.searchForm.value['employee_id']!==''){
      arr.push(` employee_id = ${x.employee_id}`);
    }
    return arr.join(' and ').trim();
    
  }
  getSalaryQuery(){
    return `select 
        s.id,
        CONCAT(c.firstname,' ',c.lastname) as employee_id,
          s.amount,
          s.given_date,
          CONCAT(b.firstname,' ',b.lastname) as given_by
    from salary_expenses as s
    inner join share_holders b on b.id = s.given_by
      inner join employees c on c.id = s.employee_id `+((this.getWhereClause()!=="")?(`where ${this.getWhereClause()}`) : '');
    
  }
  getServiceExpenseQuery(){
    
    return `select s.id,service_type ,service_id ,expense_description , amount , given_date , CONCAT(b.firstname,' ',b.lastname) as given_by 
    from service_expenses as s
      inner join share_holders b on s.given_by = b.id `+((this.getWhereClause()!=="")?(`where ${this.getWhereClause()}`) : '');
  }
  getExpenseQuery(){
    return `select e.id,expense_type, expense_description, amount,given_date, 
    concat(s.firstname,' ',s.lastname) as given_by
      from expenses as e
      inner join share_holders s on e.given_by = s.id where expense_type = '${this.searchForm.value['expense_type']}'`+((this.getWhereClause()!=="")?(` and ${this.getWhereClause()}`) : '');
  }
  getTotalExpenseQuery(){
    return `select t.id,expense_type,amount,given_date, concat(s.firstname,' ',s.lastname) as given_by from total_expense as t
    inner join share_holders s on s.id = t.given_by `+((this.getWhereClause()!=="")?(`where ${this.getWhereClause()}`) : '');
  }
  goToEditPage(element:ExpenseSearch){
    switch(element.expense_type){
      case 'معاشات':
        this.zone.run(()=>{
          this.router.navigate(['/expenses/salary',element.id]);
        });
        break;
      case 'مصارف خدماتی': 
      this.zone.run(()=>{
        this.router.navigate(['/expenses/service',element.id]);
      });
      break;
      default: 
      this.zone.run(()=>{
        this.router.navigate(['/expenses/other',element.id]);
      });
    }
  }
  toExcel(){
    if(this.items)
    this.excelService.exportAsExcelFile(this.items,'income'+new Date().getDate());      
  }  
  toPrint(){
    
  }
}
interface ExpenseSearch{
  id: number;
  expense_type: string;
  given_by: number;
  year: number;
  month: number;
  group: boolean;
  service_type: string;
  service_id: string;
  employee_id: number;
}
