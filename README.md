Real Estate Helper App
======

> Ionic App; Help real estate agents match buyer and seller

## Overview

### 1. Main Features
- Manage agent users  
- Manage Properties with buyers and sellers  
- Match buyers and sellers  
 
## Techniques 
Ionic Framework v4.0.0  
AngularJS v7.2.2  
### 1. UI Implementation  
#### 1.1 Implement UI pages based on Flexbox layout
#### 1.2 UI layout when keyboard appears  
##### Problems
- In default, the whole view content shrinks when keyboard appears.  
- Keyboard covers the text inputs on the bottom of the screen and cannot scroll up

##### To solve this problem:  
- Introduce ``KeyboardService`` to detect keyboard height manually  
```html
<ion-content>
  <div
    class="flex-column"
    [style.margin-bottom] = "kbService.keyboardHeight + 'px'">
  </div>
</ion-content>
```  
```typescript
export class KeyboardService {

  keyboardHeight = 0;

  constructor() {
    window.addEventListener('keyboardWillShow', (event) => {
      // Describe your logic which will be run each time when keyboard is about to be shown.
      this.keyboardHeight = event['keyboardHeight'];
    });

    window.addEventListener('keyboardWillHide', () => {
      // Describe your logic which will be run each time when keyboard is about to be closed.
      this.keyboardHeight = 0;
    });
  }
}
```  
- Use keyboard cordova plugin   
  
#### 2.2 Function Implementation
##### 2.2.1 Auth module
``AuthService`` in *services/auth/auth.service.ts*  
User signup, login, signout, ...  
- Save user data in [Ionic Storage](https://ionicframework.com/docs/building/storage)  

##### 2.2.2 Api module
``ApiService`` in *services/api/api.service.ts*  
Main interfaces for fetching and writing data to database  

- Google Firebase for backend  

#### 2.3 Code tricks  
- Using alias to import classes with same name  
```typescript  
import {User} from '../../models/user';
import {User as FUser} from 'firebase';
```  

#### 2.4 Third-Party Libraries
##### 2.4.1 [Firebase JS SDK](https://github.com/firebase/firebase-js-sdk) v5.8.6  
Main backend & database for the app

##### 2.4.2 [Ionic image viewer](https://github.com/Riron/ionic-img-viewer#readme) v2.9.0
Preview images by showing it full screen  
- Preview image of products in Gallery page

##### 2.4.3 [Moment.js](https://github.com/moment/moment/) v2.24.0 
- Showing date in download list page  
- Showing date in review list page

##### 2.4.4 Cordova plugins
- [File](https://github.com/apache/cordova-plugin-file) v6.0.1  
- [File Transfer](https://github.com/apache/cordova-plugin-file-transfer) v1.7.1  
Download files  
- [SaveImage](https://github.com/quiply/SaveImage#readme) v0.3  
Save downloaded image files to Gallery  
- ~~[Stripe](https://github.com/zyra/cordova-plugin-stripe) v1.5.3~~  
- [Google Plus](https://github.com/EddyVerbruggen/cordova-plugin-googleplus) v7.0.0  
Google Signin
- [Facebook4](https://github.com/jeduan/cordova-plugin-facebook4#readme) v4.2.1  
Facebook Signin


## Need to Improve
#### Image list in Gallery page is not perfect  
- Images are not loading or showing in some cases  
It seems that ``virtualScroll`` and ``<ion-img>`` have some problems...