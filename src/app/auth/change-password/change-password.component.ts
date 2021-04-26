import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  inserted = false;
  showMessage = false;
  constructor(private authService: AuthService,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl('',Validators.required),
      confirm: new FormControl('',Validators.required)
    },{
      validators: this.passwordMatchValidator
    });
  }
  changePassword(){
    this.authService.changePassword(this.passwordForm.value['password']).subscribe(data=>{
      this.inserted = true;
      this.showMessage = true;
      this.clearForm();
      this.setMessageFalse();
      this.cdr.detectChanges();
    },err=>{
      this.inserted = false;
      this.showMessage = true;
      this.setMessageFalse();
      this.cdr.detectChanges();
    });
  }
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirm'].value ? null : {'mismatch': true};
  }
  setMessageFalse(){
    setTimeout(()=>{this.showMessage = false;},4000);
  }
  clearForm(){
    this.passwordForm.setValue({
      password: '',
      confirm: ''
    });
  }
}
