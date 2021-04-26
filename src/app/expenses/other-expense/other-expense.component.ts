import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MainService } from 'src/app/main.service';
import { OtherExpense } from 'src/app/models/other-expenses.model';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-other-expense',
  templateUrl: './other-expense.component.html',
  styleUrls: ['./other-expense.component.css'],
  providers: [DatePipe]
})
export class OtherExpenseComponent implements OnInit {
  expenseForm:FormGroup;
  given_by_list;
  expense_types;
  inserted: boolean = false;
  showMessage: boolean = false;
  expense: OtherExpense;
  editMode = false;
  constructor(
    private mainService: MainService,
    private expenseService: ExpensesService, 
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private datePipe: DatePipe
    ) {
    this.given_by_list = this.mainService.getShareHolders();
    this.expense_types = this.mainService.getExpenseType();
  }

  ngOnInit(): void {
    this.route.params.subscribe((myParams: Params )=>{
      const id = +myParams['id'];
      this.editMode = myParams['id']!=null;
      this.initForm();
      if(this.editMode){
        this.expenseService.getSingleOtherExpense(id).subscribe((data)=>{
          this.expense = data['results'][0];
          this.expenseForm.setValue({
            expense_type: this.expense.expense_type,
            expense_description: this.expense.expense_description,
            amount: this.expense.amount,
            given_date: this.datePipe.transform(this.expense.given_date,'yyyy-MM-dd'),
            given_by: this.expense.given_by,                  
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
      given_by: new FormControl('',Validators.required),   
    });
  }
  ngOnAddOrUpdate(){
    let ex = new OtherExpense(
      this.expenseForm.value['expense_type'],
      this.expenseForm.value['expense_description'],
      this.expenseForm.value['amount'],
      this.expenseForm.value['given_date'],
      this.expenseForm.value['given_by']
    );
    if(!this.editMode){
      this.expenseService.addOtherExpense(ex).subscribe((data)=>{
        this.success();
      },err=>{
        this.error();
      });
    }
    else{
      ex.id = this.expense.id;
      this.expenseService.updateOtherExpense(ex).subscribe((data)=>{
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
      given_by: '',
    });
  }
  setMessageFalse(){
    setTimeout(()=>{this.showMessage = false;},2000);
  }
}
