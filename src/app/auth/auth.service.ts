import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConnectionService } from '../connection.service';
import {LOGS} from './constants';
@Injectable({providedIn: 'root'})
export class AuthService{
    id = 0;
    logChanged = new Subject<Number>();
    constructor(private connection: ConnectionService){

    }
    login(username, password){
        this.connection.query(`select id , privilage from users where username='${username}' and pass = '${password}'`).subscribe((data)=>{
            console.log(data);
            if(data['results'].length >0 ){
                this.id = +data['results'][0]['id'];
                this.logChanged.next(+data['results'][0]['privilage']);
            }else{
                this.id = 0;
                this.logChanged.next(LOGS.FAILED);
                console.log('failed');
            }
        },err=>{
            this.id = 0;
            this.logChanged.next(LOGS.FAILED);
            console.log(err);
        });
    }
    logout(){
        this.id = 0;
        this.logChanged.next(LOGS.LOGOUT);
    }
    changePassword(newPassword: string){
       return this.connection.query(`update users set pass = '${newPassword}' where id = ${this.id}`);
    }
}