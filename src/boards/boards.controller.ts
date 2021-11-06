/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './boards.enum';
import { CreateBoardDto } from './dto/Createboard.dto';
import { BoardStatusValidationPipe } from './pipes/BoardStatusValidation.pipe';
import { Board } from './boards.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/getUser.Decorator';
import { User } from 'src/auth/auth.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardController');
  constructor(private boardsService: BoardsService) {}
  
  @Get()
  getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }

  @Get('/test')
  getBoardsByUser(
    @GetUser() user: User
  ): Promise<Board[]> {
    this.logger.verbose(`User ${user.name} trying to get all boards`);
    return this.boardsService.getBoardsByUser(user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User 
  ): Promise<Board> {
    this.logger.verbose(`User ${user.name} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`)
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Delete('/:id')
  deleteBoardById(@Param('id', ParseIntPipe) id): Promise<void> {
    return this.boardsService.deleteBoardById(id);
  }
  
  @Delete('/:id/test')
  deleteBoardByUser(@Param('id', ParseIntPipe) id, @GetUser() user: User): Promise<void> {
    return this.boardsService.deleteBoardByUser(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatusById(@Param('id', ParseIntPipe) id: number, @Body('status', BoardStatusValidationPipe) status: BoardStatus) {
    return this.boardsService.updateBoardStatusById(id, status);
  }

  // @Get('/')
  // getAllBoards(): Board[] {
  //   return this.boardsService.getAllBoards();
  // }

  // @Post('/')
  // @UsePipes(ValidationPipe)
  // createBoard(
  //   @Body() createBoardDto: CreateBoardDto
  // ): Board {
  //   return this.boardsService.createBoard(createBoardDto);
  // }

  // @Get('/:id')
  // getBoardById(@Param('id') id: string): Board {
  //   return this.boardsService.getBoardById(id);
  // }

  // @Delete('/:id')
  // deleteBoardById(@Param('id') id: string): void {
  //   this.boardsService.deleteBoardById(id);
  // }
  
  // @Patch('/:id/status')
  // updateBoardStatusById(
  //   @Param('id') id: string,
  //   @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  // ): Board {
  //   return this.boardsService.updateBoardStatusById(id, status);
  // }
}
