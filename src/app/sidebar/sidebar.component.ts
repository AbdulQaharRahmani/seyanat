
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit ,OnDestroy{
  sub: Subscription;
  logNumber = 2;
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private zone: NgZone
    ) {  }

  ngOnInit(): void {
    this.authService.logChanged.subscribe((data: number)=>{
      this.logNumber = data;
      this.cdr.detectChanges();
    });
  }
  logout(){
    this.authService.logout();
  }
  
  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}
