import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from '../main.service';
import { Income } from '../models/income.model';
import { IncomeService } from './income.service';
import {DatePipe} from '@angular/common';
@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.css'],
  providers: [DatePipe]
})
export class IncomesComponent implements OnInit,OnDestroy {
  income_types ;
  receiver_list ;
  editMode = false;
  showMessage: boolean = false;
  inserted: boolean = false;
  sub: Subscription;
  income: Income;
  incomeForm: FormGroup;
  constructor(
    private incomeService: IncomeService,
     private mainService: MainService,
     private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
    ) {
      this.income_types = this.mainService.getIncomeTypes();
      this.receiver_list = this.mainService.getShareHolders();
      this.router.onSameUrlNavigation = 'reload';
      console.log(this.income_types);
     
   }

  ngOnInit(): void {
    this.sub= this.route.params.subscribe((myParams: Params )=>{
      const id = +myParams['id'];
      this.editMode = myParams['id']!=null;
      if(this.editMode){
        this.income= this.incomeService.getOfflineIncome(id);
      }
      this.initForm();
    });
  }
  initForm(){
    this.incomeForm = new FormGroup({
      service_type: new FormControl('',Validators.required),
      service_id: new FormControl('',Validators.required),
      amount: new FormControl('',Validators.required),
      date: new FormControl('',Validators.required),
      receiver: new FormControl('',Validators.required)
    });
    if(this.editMode){
      console.log('date: '+this.income.received_at);
      this.incomeForm.setValue({
        service_type: this.income.service_type,
        service_id: this.income.service_id,
        amount: this.income.amount,
        date: this.datePipe.transform(this.income.received_at,'yyyy-MM-dd'),
        receiver: this.income.received_by
      });
    }
    
  }

  ngOnAddOrUpdate(){
    let inc: Income = new Income(this.incomeForm.value.service_type,
      this.incomeForm.value.service_id,
      this.incomeForm.value.amount,
      this.incomeForm.value.date,
      this.incomeForm.value.receiver
    );
    if(!this.editMode){
        this.incomeService.addIncome(inc).subscribe((data)=>{
          this.success();
        },err=>{
          this.error();
        });
    }
    else{
      inc.id = this.income.id; 
      this.incomeService.updateIncome(inc).subscribe((data)=>{
        this.success();
      },err=>{
        this.error();
      });
    }
  }
  success(){
    this.showMessage = true;
    this.inserted = true;
    this.setMessageFalse();
    this.clearForm();
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
    setTimeout(()=>{this.showMessage = false;},4000);
  }
  clearForm(){
    this.incomeForm.setValue({
      service_type: '',
      service_id: '',
      amount: '',
      date: '',
      receiver: ''
    });
  }
}
