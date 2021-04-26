import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import {LOGS} from './constants';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  sub: Subscription;
  error = false;
  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl('',[Validators.required,Validators.minLength(6)])
    });
    this.sub = this.authService.logChanged.subscribe((data:Number)=>{
      if(data=== LOGS.FAILED){
        this.error = true;
      }
      this.cdr.detectChanges();
    });
  }
  login(){
    this.error = false;
    this.authService.login(this.loginForm.value['username'],this.loginForm.value['password']);
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
