export interface IUser {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

const defaultKeys = Object.keys({ username: 'default', age: 0, hobbies: ['default'] });
export const isValidUser = (user: IUser) => {
  const keys = Object.keys(user);
  const missingKey = defaultKeys.find((key) => !keys.includes(key));
  return !missingKey;
};