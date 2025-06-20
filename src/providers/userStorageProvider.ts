import { IUser } from '../shared/models/userModel';

let dbUrl = 'http://localhost:5050';

const setDbUrl = (url: string) => {
  dbUrl = url;
};

const fetchData = async (path: string, method = 'GET', userData: IUser | undefined = undefined): Promise<Response> => {
  const options: RequestInit = { method: method };
  if (userData) {
    options.body = JSON.stringify(userData);
  }
  return await fetch(`${dbUrl}/api/users/${path}`, options);
};

const getUsers = async () => {
  return await fetchData('');
};
const getUser = async (id: string) => {
  return await fetchData(id);
};
const postUser = async (body: IUser) => {
  return await fetchData('', 'POST', body);
};
const deleteUser = async (id: string) => {
  return await fetchData(id, 'DELETE');
};

const putUser = async (id: string, body: IUser) => {
  return await fetchData(id, 'PUT', body);
};

export {
  getUser,
  getUsers,
  postUser,
  deleteUser,
  putUser,
  setDbUrl
};