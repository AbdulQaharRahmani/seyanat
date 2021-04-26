import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MainService } from 'src/app/main.service';
import { SalaryExpense } from 'src/app/models/salary-expense.model';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-salary-expense',
  templateUrl: './salary-expense.component.html',
  styleUrls: ['./salary-expense.component.css'],
  providers: [DatePipe]
})
export class SalaryExpenseComponent implements OnInit {
  salaryForm: FormGroup;
  salary: SalaryExpense;
  given_by_list;
  employee_list;
  inserted: boolean = false;
  showMessage: boolean = false;
  editMode = false;
    constructor(
      private mainService: MainService,
      private expenseService: ExpensesService,
      private cdr: ChangeDetectorRef,
      private route: ActivatedRoute,
      private datePipe: DatePipe
       ) {
    this.given_by_list = this.mainService.getShareHolders();
    this.employee_list = this.mainService.getEmployees();
  }

  ngOnInit(): void {
    this.route.params.subscribe((myParams: Params )=>{
      const id = +myParams['id'];
      this.editMode = myParams['id']!=null;
      this.initForm();
      if(this.editMode){
        this.expenseService.getSingleSalaryExpense(id).subscribe((data)=>{
          this.salary = data['results'][0];
          this.salaryForm.setValue({
            employee_id: this.salary.employee_id,
            amount: this.salary.amount,
            given_date: this.datePipe.transform(this.salary.given_date,'yyyy-MM-dd'),
            given_by: this.salary.given_by        
          });
          this.cdr.detectChanges();
        });  
      }      
    });
  }
  initForm(){
    this.salaryForm = new FormGroup({
      employee_id: new FormControl('',Validators.required),
      amount: new FormControl('',Validators.required),
      given_date: new FormControl('',Validators.required),
      given_by: new FormControl('',Validators.required)
    });
  }
  ngOnAddOrUpdate(){
    let salaryExpense = new SalaryExpense(
      this.salaryForm.value['employee_id'],
      this.salaryForm.value['amount'],
      this.salaryForm.value['given_date'],
      this.salaryForm.value['given_by']
    );
    if(!this.editMode){
      this.expenseService.addSalaryExpense(salaryExpense).subscribe((data)=>{
        this.success();
      },err=>{
        this.error();
      });
    }
    else{
      salaryExpense.id = this.salary.id; 
      this.expenseService.updateSalaryExpense(salaryExpense).subscribe((data)=>{
        this.success();
      },err=>{
        this.error();
      });
    }
    
    
  }
  success(){
    this.clearForm();
    this.showMessage = true;
    this.inserted = true;
    this.setMessageFalse();
    this.cdr.detectChanges();
  }
  error(){
    this.showMessage = true;
    this.inserted = false;
    this.setMessageFalse();
    this.cdr.detectChanges();
  }
  setMessageFalse(){
    setTimeout(()=>{this.showMessage = false;},2000);
  }
  clearForm(){
    this.salaryForm.setValue({
      employee_id: '',
      amount: '',
      given_date: '',
      given_by: ''  
    });
  }

}
