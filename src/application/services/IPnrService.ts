export interface IPnrService {
  getPnrDetails(pnrNumber: string): Promise<any>;
}
