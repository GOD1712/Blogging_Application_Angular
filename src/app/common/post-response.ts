import { Post } from "./post";

export class PostResponse {
    constructor(
        public content: Post[],
        public pageNumber: number,
        public pageSize: number,
        public totalElements: number,
        public totalPages: number,
        public lastPage: boolean
    ) { }
}
