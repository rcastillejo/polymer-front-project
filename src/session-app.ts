export class SessionApp {
  private static _userToken?: string;
  private static _userName: string;

  static get userToken(): string {
    if(!this._userToken){
      this._userToken = sessionStorage.getItem("userToken") as string;
    }
    return this._userToken;
  }

  static set userToken(value: string) {
    this._userToken = value;
    sessionStorage.setItem("userToken", value);
  }

  static clearUser() {
    this._userToken = undefined;
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
  }

  static get userName(): string {
    if(!this._userName){
      this._userName = sessionStorage.getItem("userName") as string;
    }
    return this._userName;
  }

  static set userName(value: string) {
    this._userName = value;
    sessionStorage.setItem("userName", value);
  }
}
