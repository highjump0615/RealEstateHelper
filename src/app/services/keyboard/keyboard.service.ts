import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  keyboardHeight = 0;

  constructor() {
    window.addEventListener('keyboardWillShow', (event) => {
      console.log('keyboardWillShow');
      console.log(event);

      // Describe your logic which will be run each time when keyboard is about to be shown.
      this.keyboardHeight = event['keyboardHeight'];
    });

    window.addEventListener('keyboardWillHide', () => {
      console.log('keyboardWillHide');

      // Describe your logic which will be run each time when keyboard is about to be closed.
      this.keyboardHeight = 0;
    });
  }
}
