type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
  salt: string;
  token?: string;
  dateLoggedIn?: Date;
  dateCreated?: Date;
};

export default User;
