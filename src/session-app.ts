export class SessionApp {
  private static _userToken?: string;
  private static _userName: string;
  private static _fullName: string;
  private static _sex: string;

  static get userToken(): string {
    if (!this._userToken) {
      this._userToken = sessionStorage.getItem('userToken') as string;
    }
    return this._userToken;
  }

  static set userToken(value: string) {
    this._userToken = value;
    sessionStorage.setItem('userToken', value);
  }

  static clearUser() {
    this._userToken = undefined;
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userName');
  }

  static get userName(): string {
    if (!this._userName) {
      this._userName = sessionStorage.getItem('userName') as string;
    }
    return this._userName;
  }

  static set userName(value: string) {
    this._userName = value;
    sessionStorage.setItem('userName', value);
  }

  static get fullName(): string {
    if (!this._fullName) {
      this._fullName = sessionStorage.getItem('fullName') as string;
    }
    return this._fullName;
  }

  static set fullName(value: string) {
    this._fullName = value;
    sessionStorage.setItem('fullName', value);
  }

  static get sex(): string {
    if (!this._sex) {
      this._sex = sessionStorage.getItem('sex') as string;
    }
    return this._sex;
  }

  static set sex(value: string) {
    this._sex = value;
    sessionStorage.setItem('sex', value);
  }
}
