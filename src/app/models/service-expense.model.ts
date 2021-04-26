export class ServiceExpense{
    id: number;
    constructor(public service_type: String,
        public service_id: Number,
        public amount: Number,
        public expense_description: String,
        public given_date: Date,
        public given_by: Number){
    }
}