export interface AuthPayLoad{
    email: string;
    password: string;
}
export interface CreateAuthPayload{
    email: string;
    fullName: string;
    password: string;
    recoveryPassword: string;
}
export interface CreateBlogPayload{
blogTitle:string,
blogImage:string, 
blogBody:string,
comments:string,
likes:number
}
