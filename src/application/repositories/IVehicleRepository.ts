import { Vehicle } from '../../domain/Vehicle';

export interface IVehicleRepository {
  create(vehicle: Vehicle): Promise<Vehicle>;
  findByUserId(userId: string): Promise<Vehicle[]>;
}
