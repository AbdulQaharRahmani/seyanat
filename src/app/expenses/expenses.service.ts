import { Injectable } from '@angular/core';
import { FieldInfo, MysqlError } from 'mysql';
import { Observable } from 'rxjs';
import { ConnectionService } from '../connection.service';
import { OfficeExpense } from '../models/office-expense.model';
import { OtherExpense } from '../models/other-expenses.model';
import { SalaryExpense } from '../models/salary-expense.model';
import { ServiceExpense } from '../models/service-expense.model';

@Injectable({providedIn: 'root'})
export class ExpensesService{
    
    constructor(private connection: ConnectionService){
    }

    addServiceExpense(expense: ServiceExpense){
        let q = `INSERT INTO service_expenses(service_type,service_id,expense_description,amount,given_date,given_by) VALUES('${expense.service_type}',${expense.service_id},'${expense.expense_description}',${expense.amount},'${expense.given_date}',${expense.given_by})`
        console.log(q);
        return this.connection.query(q);
    }
    getSingleServiceExpense(id: number){
        let q = `select id,service_type,service_id,expense_description,amount,given_by,given_date from service_expenses where id=${id}`;
        return this.connection.query(q);
    }
    updateServiceExpense(expense: ServiceExpense){
        let q = `update service_expenses set service_type = '${expense.service_type}' , service_id = ${expense.service_id} , 
                expense_description = '${expense.expense_description}' , amount = ${expense.amount}, given_date = '${expense.given_date}',
                given_by = ${expense.given_by} where id = ${expense.id} `;
                return this.connection.query(q);
    }
    addSalaryExpense(expense: SalaryExpense){
        let q = `INSERT INTO salary_expenses(employee_id,amount,given_date,given_by)
        VALUES(${expense.employee_id},${expense.amount},'${expense.given_date}',${expense.given_by})`;
        return this.connection.query(q);
    }
    getSingleSalaryExpense(id: number){
        let q = `select id,employee_id,amount,given_date,given_by from salary_expenses 
                where id = ${id}
        `;
        return this.connection.query(q);
    }
    updateSalaryExpense(expense: SalaryExpense){
        let q = `update salary_expenses set employee_id = ${expense.employee_id}, amount = ${expense.amount},
            given_date = '${expense.given_date}', given_by = ${expense.given_by}
            where id = ${expense.id} `;
        return this.connection.query(q); 
    }
    addOtherExpense(expense: OtherExpense){
        let q = `INSERT INTO expenses(expense_type,expense_description,amount,given_date,given_by)
        VALUES('${expense.expense_type}','${expense.expense_description}',${expense.amount},'${expense.given_date}',${expense.given_by})`;
        return this.connection.query(q);
    }
    getSingleOtherExpense(id: number){
        let q = `select id,expense_type,expense_description,amount,given_date,given_by from expenses 
                where id = ${id}`;
        return this.connection.query(q);
    }
    updateOtherExpense(expense: OtherExpense){
        let q = `update expenses set expense_type = '${expense.expense_type}' , expense_description = '${expense.expense_description}',
                amount = ${expense.amount} , given_date = '${expense.given_date}', given_by = ${expense.given_by}
                where id= ${expense.id}`;
        return this.connection.query(q);
    }
    getExpenseList(q: String){
        return this.connection.query(q);
    }
    getOfficeExpenseList(q: String){
        let x = `select id,expense_type,expense_description,amount,given_date from office_expenses ${(q!=='')?('where '+q) : ('')}`;
        console.log('x: '+x);
        return this.connection.query(x);
    }
    getSingleOfficeExpense(id: number){
        let q = `select id,expense_type,expense_description,amount,given_date from office_expenses 
                where id = ${id}`;
        return this.connection.query(q);
    }
    addOfficeExpense(expense: OfficeExpense){
        let q = `INSERT INTO office_expenses(expense_type,expense_description,amount,given_date)
        VALUES('${expense.expense_type}','${expense.expense_description}',${expense.amount},'${expense.given_date}')`;
        return this.connection.query(q);
    }
    updateOfficeExpense(expense: OfficeExpense){
        let q = `update office_expenses set expense_type = '${expense.expense_type}' , expense_description = '${expense.expense_description}',
                amount = ${expense.amount} , given_date = '${expense.given_date}'
                where id= ${expense.id}`;
        return this.connection.query(q);
    }
}