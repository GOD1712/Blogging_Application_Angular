import { Category } from "./category";
import { Comment } from "./comment";
import { User } from "./user";

export class Post {

    public postId!: number;
    public title!: string;
    public content!: string;
    public imageName!: string;
    public addedDate!: Date;
    public category!: Category;
    public user!: User;
    public comments!: Comment[];
}
