import { Body, Controller, Post } from '@nestjs/common';
import { create } from 'domain';
import { CurrentUser } from 'src/auth/curent-user.decorator';
import { LoggedInUser } from 'src/users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Post()
  create(@CurrentUser() user: LoggedInUser, @Body() input: CreateProjectDto) {
    return this.projectsService.createProject(input, user);
  }
}
