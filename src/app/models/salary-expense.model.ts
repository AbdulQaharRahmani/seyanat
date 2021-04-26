export class SalaryExpense{
    public id: number;
    constructor(public employee_id: number, public amount:number, public given_date:Date, public given_by:number){

    }
}