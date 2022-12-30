import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService extends AbstractService<ProjectEntity> {
  constructor(
    @InjectRepository(ProjectEntity)
    repository: Repository<ProjectEntity>,
    private dataSource: DataSource,
  ) {
    super(ProjectsService.name, repository);
  }

  createProject(input: CreateProjectDto, userLogin: LoggedInUser) {
    const project = this.repository.create(input);
    project.createdBy = userLogin.id;
    return this.save(project);
  }
}
