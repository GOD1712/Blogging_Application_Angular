import { User } from "./user";

export class Comment {

    public commentId!: number;
    public title!: string;
    public content!: string;
    public commentUser!: User;

    constructor() { }
}
