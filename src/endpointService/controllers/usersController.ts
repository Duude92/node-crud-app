import {IUser} from "../../shared/models/userModel";
import {ServerResponse, IncomingMessage} from 'node:http'

class User {}
export type EndpointFunctionPair = { [id: string]: (response: ServerResponse<IncomingMessage>) => void };
const getUsers = async (res: ServerResponse<IncomingMessage>): Promise<void> => {
    // await provider get users
    res.writeHead(200, {'Content-Type': 'application/json'});
    const result = new Array<IUser>();
    result.push({id: "1", age: 2, hobbies: ["aboba"], username: "name"} as IUser);
    result.push({id: "12", age: 23, hobbies: ["aboba1"], username: "nam1e"} as IUser);
    res.end(JSON.stringify(result));
}

const getUser = async (res: ServerResponse<IncomingMessage>): Promise<void> => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({id: "1", age: 2, hobbies: ["aboba"], username: "name"} as IUser));
};
export const endpoints: EndpointFunctionPair = {
    "users": getUsers,
    "users/id": getUser,
}