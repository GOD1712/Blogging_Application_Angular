import { Role } from "./role";

export class User {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public about!: string;
    public roles!: Role[];

    constructor() { }

}
