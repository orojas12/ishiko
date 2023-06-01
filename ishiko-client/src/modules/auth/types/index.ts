export interface Csrf {
  headerName: string;
  parameterName: string;
  token: string;
}

export interface UsernamePassword {
  username: string;
  password: string;
}

export interface User {
  username: string;
}
