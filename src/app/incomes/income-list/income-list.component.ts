import { NgZone, OnDestroy } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {  FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService } from 'src/app/excel.service';
import { MainService } from 'src/app/main.service';
import { ShareHolder } from 'src/app/models/shareholder.model';
import { Income } from '../../models/income.model';
import { IncomeService } from '../income.service';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.css']
})
export class IncomeListComponent implements OnInit, OnDestroy,AfterViewInit {

  income_types;
  share_holders: ShareHolder[];
  displayedColumns: string[] = ['id','service_type', 'service_id', 'amount', 'received_at','received_by'];
  dataSource = new MatTableDataSource< Income>() ;
  
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  incomeSearch: FormGroup;
  receiver_list;
  loading = false;
  isListEmpty = true;
  error = false;
  items:Income[];

  constructor(
    private incomeService: IncomeService,
    private cdr: ChangeDetectorRef,
    private mainService: MainService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private excelService: ExcelService
   ) {
    this.income_types = this.mainService.getIncomeTypes();
    this.share_holders = this.mainService.getShareHolders();
    
  }
  ngOnInit(): void {

      this.incomeSearch= new FormGroup({
        service_type: new FormControl(''),
        service_id: new FormControl(''),
        year: new FormControl(''),
        month: new FormControl(''),
        received_by: new FormControl('')
      });
      
      
  }
  goToEditPage(id:number){
    console.log(id);
    this.zone.run(()=>{
      this.router.navigate(['../incomeedit',id],{relativeTo: this.route});
    });
  }
  search(){
    this.error = false;
    this.incomeService.getIncomeList(this.createQuery()).subscribe((arg)=>{
     this.items = arg['results'];
     this.clearForm();
     console.log(arg);
     console.log(this.items); 
      this.dataSource.data = this.items;
      this.dataSource.paginator = this.paginator;
        if(this.items.length>0){
        this.isListEmpty = false;}
        else{
          this.isListEmpty = true;
        }
        
      this.loading = false;
      this.cdr.detectChanges();
    },err=>{
      console.log(err);
      this.error = true;
    });
    
  }
  createQuery(){
    let arr = [];
    if( this.incomeSearch.value['service_type'] !==""){
      arr.push(`service_type = '${this.incomeSearch.value['service_type']}' `);
    }
    if(this.incomeSearch.value['service_id'] !==""){
      arr.push(`service_id = ${this.incomeSearch.value['service_id']} `);
    }
    if(this.incomeSearch.value['received_by'] !==""){
      arr.push(`received_by = ${this.incomeSearch.value['received_by']} `);
    }
    if(this.incomeSearch.value['year'] !==""){
      arr.push(`year(received_at) = ${this.incomeSearch.value['year']} `);
    }
    if(this.incomeSearch.value['month'] !==""){
      arr.push(`month(received_at) = ${this.incomeSearch.value['month']} `);
    }
    return arr.join(" and ");
  }
  // find shareholder name based on id
  findShareHolder(id){
    for( let item of this.share_holders){
      if (item.id===id){
        return item.name
      }
    }
    return 'نا شناخته';
  } 
  getTotalIncome(){
    if(this.items)
      return this.items.map(t => t.amount).reduce((acc, value) => +acc + +value, 0);
    return 0;
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy(){
  }
  clearForm(){
    this.incomeSearch.setValue({
      service_type: '',
        service_id: '',
        year: '',
        month: '',
        received_by: ''
    });
   
  }
  toExcel(){
    if(this.items)
    this.excelService.exportAsExcelFile(this.items,'income'+new Date().getDate());      
  }  
  }

  

  

