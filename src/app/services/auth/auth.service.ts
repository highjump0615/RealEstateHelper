import { Injectable } from '@angular/core';
import {User} from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor() { }
}
