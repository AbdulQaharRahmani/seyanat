import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection.service';

@Injectable({providedIn: 'root'})
export class TaxService{
    constructor(private connection: ConnectionService){

    }
    getMonthlyTax(year: number){
        let q = `select months,monthly_tax from tax where years = ${year}`;
        return this.connection.query(q);
    }
    getQuarterlyTax(year: number){
        let q = `select amount,quarters from quarter_tax where years = ${year}`;
        return this.connection.query(q);
    }
    getYearlyTax(year: number){
        let q = `select type,total from year_tax where years = ${year}`;
        return this.connection.query(q);
    }
}