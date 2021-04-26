export class Employee{
    constructor(public employee_id: number, public firstname: string, public lastname: string){
    }
    getFullname(){
        return this.firstname+" "+this.lastname;
    }
}