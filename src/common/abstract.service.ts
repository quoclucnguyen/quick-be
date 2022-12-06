import { Logger } from '@nestjs/common';
import {
  Repository,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Like,
} from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { AbstractEntity } from './abstract.entity';
import { AbstractFilter } from './abtract.filter';
export abstract class AbstractService<E extends AbstractEntity> {
  protected readonly logger = new Logger(this.className);

  protected constructor(
    protected className: string,
    protected repository: Repository<E>,
  ) {}

  async findAll(condition?: FindManyOptions<E>) {
    this.logger.log(
      `Finding all entities with condition ${JSON.stringify(condition)}`,
    );

    return this.repository.find(condition);
  }

  async findAllWithOpts(opts?: FindManyOptions<E>) {
    this.logger.log(`Finding all entities with opts ${JSON.stringify(opts)}`);

    return this.repository.find(
      opts
        ? {
            ...opts,
            skip:
              opts?.skip != null && opts?.take != null
                ? opts.skip * opts.take
                : 0,
          }
        : null,
    );
  }

  async findOne(condition?: FindOneOptions<E>) {
    this.logger.log(
      `Finding entity with condition ${JSON.stringify(condition)}`,
    );

    return this.repository.findOne(condition);
  }

  async findOneWithOpts(opts?: FindManyOptions<E>) {
    this.logger.log(`Finding entity with opts ${JSON.stringify(opts)}`);

    return this.repository.findOne(opts);
  }

  async save(entity: E) {
    this.logger.log(`Saving new entity`);

    return this.repository.save(entity as unknown as DeepPartial<E>);
  }

  async update(opts: FindOneOptions, diff: Partial<E>) {
    this.logger.log(`Updating entity with id ${JSON.stringify(opts)}`);

    return this.repository
      .findOne(opts)
      .then((e) => this.repository.merge(e, diff as unknown as DeepPartial<E>))
      .then((e) => this.repository.save(e as unknown as DeepPartial<E>));
  }

  async removeWithOpts(opts: FindManyOptions<E>) {
    this.logger.log(`Removing entity with opts ${JSON.stringify(opts)}`);

    return this.findAllWithOpts(opts)
      .then((e) => this.repository.remove(e))
      .then((e) => {
        return true;
      });
  }

  async count() {
    this.logger.log(`Counting all entities}`);

    return this.repository.count();
  }

  async countWithOpts(opts?: FindManyOptions<E>) {
    this.logger.log(`Counting all entities with opts ${JSON.stringify(opts)}`);

    return this.repository.count(opts);
  }

  processQueryDto(query: AbstractFilter) {
    const options: FindManyOptions<E> = {};
    const where: FindOptionsWhere<E> = {};

    query.whereProperties.forEach((property) => {
      if (query[property] != null) {
        where[property] = query[property];
      }
    });

    query.whereWithLikeProperties.forEach((property) => {
      if (query[property] != null) {
        where[property] = Like(`%${query[property]}%`);
      }
    });
    options.where = where;
    options.take = query.take;
    options.skip = query.skip;
    return options;
  }
}
