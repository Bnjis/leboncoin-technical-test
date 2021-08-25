import {get} from "../helpers/api";

export const users = {
  getAllUsers: () => {
    return get(`http://localhost:3005/users`);
  },
  getUser: ({id}) => {
    return get(`http://localhost:3005/user/${id}`);
  }
}

export default users;