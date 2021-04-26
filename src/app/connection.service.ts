import { Injectable } from '@angular/core';
import { FieldInfo, MysqlError } from 'mysql';
import { Observable } from 'rxjs';
const mysql = (<any>window).require('mysql');
@Injectable({providedIn: 'root'})
export class ConnectionService{
    connection: any;
    constructor(){
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'seyanat'
        });
        this.connection.connect((err) => {
           if (err) {
             console.log('error connecting', err);
           }
        });
    }
    query(queryString: String){
        return new Observable(observer=>{
            this.connection.query(queryString,(err: MysqlError, results?: Object[], fields?: FieldInfo[])=>{
                if(err){
                    observer.error(err);
                }else{
                    observer.next({results,fields});
                }
                observer.complete();
            });
        });
    }

}