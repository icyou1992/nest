import { User } from 'src/auth/auth.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Board } from './boards.entity';
import { BoardStatus } from './boards.enum';
import { CreateBoardDto } from './dto/Createboard.dto';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, desc } = createBoardDto;

    const board = this.create({
      title,
      desc,
      status: BoardStatus.public,
      user,
    });
    await this.save(board);
    return board;
  }
}
