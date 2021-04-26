import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MainService } from 'src/app/main.service';
import { ServiceExpense } from 'src/app/models/service-expense.model';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-service-expense',
  templateUrl: './service-expense.component.html',
  styleUrls: ['./service-expense.component.css'],
  providers: [DatePipe]
})
export class ServiceExpenseComponent implements OnInit {
  income_types ;
  receiver_list ;
  inserted: boolean = false;
  showMessage: boolean = false;
  serviceForm: FormGroup;
  editMode = false;
  expense: ServiceExpense;
  constructor(
    private mainService: MainService,
    private cdr: ChangeDetectorRef, 
    private expenseSerivce: ExpensesService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
    ) {
    this.income_types = this.mainService.getIncomeTypes();
      this.receiver_list = this.mainService.getShareHolders();
   
   }

   ngOnInit(): void {
    this.route.params.subscribe((myParams: Params )=>{
      const id = +myParams['id'];
      this.editMode = myParams['id']!=null;
      this.initForm();
      if(this.editMode){
        this.expenseSerivce.getSingleServiceExpense(id)
        .subscribe((data)=>{
          this.expense = data['results'][0];
          console.log(this.expense);
          this.serviceForm.setValue({
            service_type: this.expense.service_type,
            service_id: this.expense.service_id,
            amount: this.expense.amount,
            description: this.expense.expense_description,
            date: this.datePipe.transform(this.expense.given_date,'yyyy-MM-dd'),
            receiver: this.expense.given_by    
          });  
          this.cdr.detectChanges();
        });
      }
     
    });
        
  }
  initForm(){
    this.serviceForm = new FormGroup({
      service_type: new FormControl('',Validators.required),
      service_id: new FormControl('',Validators.required),
      amount: new FormControl('',Validators.required),
      description: new FormControl(''),
      date: new FormControl('',Validators.required),
      receiver: new FormControl('',Validators.required)
    });
  }

  ngOnAddOrUpdate(){
    let s = new ServiceExpense(
      this.serviceForm.value['service_type'],
      this.serviceForm.value['service_id'],
      this.serviceForm.value['amount'],
      this.serviceForm.value['description'],
      this.serviceForm.value['date'],
      this.serviceForm.value['receiver']
    );
    if(!this.editMode){
      this.expenseSerivce.addServiceExpense(s).subscribe((data)=>{
        this.success();
      },err=>{
        console.log(err);
        this.error();
      }
      );
    }else{// For Update
      s.id = this.expense.id;
      this.expenseSerivce.updateServiceExpense(s).subscribe((data)=>{
        this.success();
      },err=>{
        console.log(err);
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
  ngOnDestroy(): void {
  }
  setMessageFalse(){
    setTimeout(()=>{this.showMessage = false;},2000);
  }
  clearForm(){
    this.serviceForm.setValue({
      service_type: '',
      service_id: '',
      amount: '',
      description: '',
      date: '',
      receiver: ''
    
    });
  }
}
