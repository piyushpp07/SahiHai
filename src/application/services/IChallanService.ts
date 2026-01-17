export interface IChallanService {
  getChallanDetails(vehicleNumber: string): Promise<any>;
}
