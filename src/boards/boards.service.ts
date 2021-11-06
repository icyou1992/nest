/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/Createboard.dto';
import { BoardRepository } from './boards.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './boards.entity';
import { User } from 'src/auth/auth.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}
  
  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async getBoardsByUser(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', {userId: user.id});
    
    const boards = await query.getMany();
    return boards;
  }

  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne(id);

    if(!found) throw new NotFoundException(`Can't find Board with id ${id}`);
    return found;
  }

  async deleteBoardById(id: number): Promise<void> {
    const found = await this.boardRepository.delete(id);
    
    if(!found.affected) throw new NotFoundException(`Can't find Board with id ${id}`);
  }

  async deleteBoardByUser(id: number, user: User): Promise<void> {
    const found = await this.boardRepository.delete({ id, user });
    
    // user가 만든 board 중 id가 없으면 밑의 에러 생성 
    if(!found.affected) throw new NotFoundException(`Can't find Board with id ${id}`);
  }

  async updateBoardStatusById(id: number, status: BoardStatus): Promise<Board> {
    const found = await this.getBoardById(id);
    found.status = status;
    
    await this.boardRepository.save(found);
    return found;
  }

  // private boards: Board[] = [];

  // getAllBoards(): Board[] {
  //   return this.boards;
  // }

  // createBoard(createBoardDto: CreateBoardDto) {
  //   const { title, desc } = createBoardDto;

  //   const board: Board = {
  //     id: uuid(),
  //     title,
  //     desc,
  //     status: BoardStatus.public,
  //   }

  //   this.boards.push(board);
  //   console.log(board);
  //   return board;
  // }

  // getBoardById(id: string): Board {
  //   const found = this.boards.find((board) => board.id === id);
  //   if(!found) throw new NotFoundException(`Can't find Board with id ${id}`);
  
  //   return found;
  // }

  // deleteBoardById(id: string): void {
  //   const found = this.getBoardById(id);
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }

  // updateBoardStatusById(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
}
