export class Income{
    public id:number;
    
    constructor(
        public service_type:String, 
        public service_id: number,
        public amount: number,
        public received_at: Date,
        public received_by: number
        ){

    }
}