export class Profit{
    public id:number;
    constructor(
        public service_type: string,
        public service_id: number,
        public total_income: number,
        public total_expense: number,
        public net_income: number
        ){

    }
}