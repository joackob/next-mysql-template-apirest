import { DataSource, Repository } from "typeorm";
import { Donador } from "./entity/Donador";

type ResultUpdate = {
  updated: boolean;
};

type ResultDelete = {
  removed: boolean;
};

export class RepoDonadores {
  private repo: Repository<Donador>;
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: "mysql",
      host: process.env.DBHOST ?? "localhost",
      port: parseInt(process.env.DBPORT ?? "3306"),
      username: process.env.DBUSER ?? "root",
      password: process.env.DBPASS ?? "pass",
      database: process.env.DB ?? "test",
      synchronize: true,
      logging: true,
      entities: [Donador],
      subscribers: [],
      migrations: [],
    });

    this.repo = this.dataSource.getRepository(Donador);
  }

  async initialize() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }

    return this;
  }

  async save(params: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  }) {
    await this.initialize();
    const donor = await this.repo.save(params);
    return donor;
  }

  async destroy() {
    await this.initialize();
    this.dataSource.destroy();
    return this;
  }

  async update(params: {
    id: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
  }) {
    await this.initialize();
    const res = await this.repo.update({ id: params.id }, params);
    const affected: ResultUpdate = {
      updated: res.affected === 1,
    };

    return affected;
  }

  async find(params: { id: string }) {
    await this.initialize();
    const donor = await this.repo.findOne({
      where: {
        id: params.id,
      },
    });

    return donor;
  }

  async findAll() {
    await this.initialize();
    const admins = await this.repo.find({});
    return admins;
  }

  async delete(params: { id: string }) {
    await this.initialize();
    const res = await this.repo.delete({
      id: params.id,
    });
    const affected: ResultDelete = {
      removed: res.affected === 1,
    };

    return affected;
  }
}

export const repoDonadores = new RepoDonadores();
