import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import {LOGS} from './auth/constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'seyanat-application';
  sub: Subscription;
  logNumber: Number = 2;
  constructor(private zone:NgZone ,private authService: AuthService,private router: Router, private cdr: ChangeDetectorRef){
  }
  ngOnInit(){
    /*this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
  };*/
    this.sub = this.authService.logChanged.subscribe((data: Number)=>{
      this.logNumber = data;
      this.cdr.detectChanges();
      console.log('logNumber in app: '+ this.logNumber);
      if(this.logNumber === LOGS.ADMIN){
       
          this.zone.run(()=>{
          this.router.navigate(['/incomes']);
          });
      }else if(this.logNumber === LOGS.USER){
          this.zone.run(()=>{
          this.router.navigate(['/officeexpense']);
          });
      }
      else if(this.logNumber===LOGS.LOGOUT){
        this.zone.run(()=>{
          this.router.navigate(['/auth']);
        });
      }
    });
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
