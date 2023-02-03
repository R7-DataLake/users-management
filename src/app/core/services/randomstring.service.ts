import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomstringService {

  constructor () { }

  generateRandomString(length: number = 10, characters: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): string {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
