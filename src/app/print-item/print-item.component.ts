import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-print-item',
  templateUrl: './print-item.component.html',
  styleUrls: ['./print-item.component.css']
})
export class PrintItemComponent implements OnInit {
  columnNames;
  share_holders;
  @Input() items: [];
  constructor(
    private mainService:MainService
    ) {
    this.columnNames = this.mainService.getColumnNames();
    this.share_holders = this.mainService.getShareHolders();
  }

  ngOnInit(): void {
    
  }
  findShareHolder(id){
    for( let item of this.share_holders){
      if (item.id===id){
        return item.name
      }
    }
    return 'نا شناخته';
  } 
}
