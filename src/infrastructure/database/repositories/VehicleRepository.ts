import { IVehicleRepository } from '../../../../application/repositories/IVehicleRepository';
import { Vehicle } from '../../../../domain/Vehicle';
import { VehicleModel } from '../mongoose/schemas/VehicleSchema';

export class VehicleRepository implements IVehicleRepository {
  async create(vehicle: Vehicle): Promise<Vehicle> {
    const newVehicle = new VehicleModel(vehicle);
    await newVehicle.save();
    return newVehicle.toObject();
  }

  async findByUserId(userId: string): Promise<Vehicle[]> {
    return VehicleModel.find({ userId }).lean().exec();
  }
}
