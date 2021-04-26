import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Income } from '../models/income.model';
import{ map, tap} from 'rxjs/Operators';
@Injectable({providedIn: 'root'})
export class IncomeService{
    incomes: Income[];
    constructor(private connection: ConnectionService){
       
    }   
    addIncome(income: Income){
        let q:string = `INSERT INTO incomes(service_type,service_id,amount,received_at,received_by) VALUES('${income.service_type}',${income.service_id},${income.amount},'${income.received_at}',${income.received_by})`;
        
        return this.connection.query(q);
    }
    getIncome(id: number){
        let q:string = `select service_type, service_id, amount, received_at, received_by from incomes where id = ${id}`;
        return this.connection.query(q);
    }
    updateIncome(income: Income){
        let q:string = `update incomes set service_type='${income.service_type}' , service_id = ${income.service_id}, amount=${income.amount},received_at = '${income.received_at}',received_by=${income.received_by}
                        where id = ${income.id}
        `;
        return this.connection.query(q);
    }
    getIncomeList(sql: String){
        let q:string = "select id, service_type, service_id, amount , received_at , received_by from incomes "+(sql!==""?" where ":"")+sql;     
        return this.connection.query(q).pipe(tap(data=>{
             this.incomes = data['results'];
        }));
    }
    getNetIncomeList(sql: String){
        let q:string = `select service_type,service_id,total_income,total_expense,net_income from profit ${(sql!=='')?('where '+sql):('')}`;
        return this.connection.query(q);
    }
    getOfflineIncome(id: number):Income{
        for(let inc of this.incomes){
            if(inc.id===id)
            return inc;
        }
        return null;
    }
    
}