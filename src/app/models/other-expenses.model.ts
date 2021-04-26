export class OtherExpense{
    public id: number;
    constructor(
        public expense_type: string,
        public expense_description: string,
        public amount: number,
        public given_date: Date,
        public given_by: number
        ){

    }
}