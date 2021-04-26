import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ExpensesService } from '../expenses/expenses.service';
import { MainService } from '../main.service';
import {OfficeExpense} from '../models/office-expense.model';

@Component({
  selector: 'app-office-expenses',
  templateUrl: './office-expenses.component.html',
  styleUrls: ['./office-expenses.component.css'],
  providers: [DatePipe]
})
export class OfficeExpensesComponent implements OnInit {
  expenseForm:FormGroup;
   expense_types;
  inserted: boolean = false;
  showMessage: boolean = false;
  expense;
  editMode = false;

  constructor(
     private route: ActivatedRoute,
     private cdr: ChangeDetectorRef,
     private mainService: MainService,
     private datePipe: DatePipe,
     private expenseService: ExpensesService
    ) { 
    this.expense_types = this.mainService.getOfficeExpenseTypes();
    }

  ngOnInit(): void {
    console.log('ng On init');
    this.initForm();
    this.route.params.subscribe((myParams: Params )=>{
      const id = +myParams['id'];
      this.editMode = myParams['id']!=null;
      
      if(this.editMode){
        this.expenseService.getSingleOfficeExpense(id).subscribe((data)=>{
          this.expense = data['results'][0];
          this.expenseForm.setValue({
            expense_type: this.expense.expense_type,
            expense_description: this.expense.expense_description,
            amount: this.expense.amount,
            given_date: this.datePipe.transform(this.expense.given_date,'yyyy-MM-dd')               
          });
        });
      } 
    });
  }
  
  initForm(){
    this.expenseForm = new FormGroup({
      expense_type: new FormControl('',Validators.required),
      expense_description: new FormControl(''),
      amount: new FormControl('',Validators.required),
      given_date: new FormControl('',Validators.required),   
    });
  }
  ngOnAddOrUpdate(){
    let ex = new OfficeExpense(
      this.expenseForm.value['expense_type'],
      this.expenseForm.value['expense_description'],
      this.expenseForm.value['amount'],
      this.expenseForm.value['given_date']
    );
    if(!this.editMode){
      this.expenseService.addOfficeExpense(ex).subscribe((data)=>{
        this.success();
      },err=>{
        console.log(err);
        this.error();
      });
    }
    else{
      ex.id = this.expense.id;
      this.expenseService.updateOfficeExpense(ex).subscribe((data)=>{
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

  clearForm(){
    this.expenseForm.setValue({
      expense_type: '',
      expense_description: '',
      amount: '',
      given_date: '',
    });
  }
  setMessageFalse(){
    setTimeout(()=>{this.showMessage = false;},2000);
  }

}
