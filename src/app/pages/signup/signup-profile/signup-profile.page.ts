import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {KeyboardService} from '../../../services/keyboard/keyboard.service';
import {AuthService} from '../../../services/auth/auth.service';
import {BasePage} from '../../base.page';
import {User} from '../../../models/user';
import {ImageUploaderComponent} from '../../../components/image-uploader/image-uploader.component';
import {FirebaseManager} from '../../../helpers/firebase-manager';
import {ApiService} from "../../../services/api/api.service";

@Component({
  selector: 'app-signup-profile',
  templateUrl: './signup-profile.page.html',
  styleUrls: ['./signup-profile.page.scss'],
})
export class SignupProfilePage extends BasePage implements OnInit {

  email = '';
  password = '';

  name = '';
  phone = '';
  nameBkg = '';
  phoneBkg = '';
  addressBkg = '';

  isEdit = false;

  @ViewChild('imageProfile') uploadPhoto: ImageUploaderComponent;

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private kbService: KeyboardService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private auth: AuthService,
    public api: ApiService
  ) {
    super(loadingCtrl, alertCtrl);

    this.email = this.route.snapshot.paramMap.get('email');
    this.password = this.route.snapshot.paramMap.get('password');

    if (auth.user) {
      // set user info
      this.name = auth.user.name;
      this.email = auth.user.email;
      this.phone = auth.user.phone;
      this.nameBkg = auth.user.nameBkg;
      this.phoneBkg = auth.user.phoneBkg;
      this.addressBkg = auth.user.addressBkg;

      this.isEdit = true;
    }
  }

  ngOnInit() {
  }

  onButBack() {
    // back to prev page
    this.navCtrl.pop();
  }

  signinForm() {

    if (this.auth.user) {
      // update profile
      this.uploadImageAndSetupUserInfo(this.doneCallback);
    } else {
      //
      // do signup
      //
      this.showLoadingView();
      this.auth.signUp(
        this.email,
        this.password
      ).then((u) => {
        this.showLoadingView(false);

        // set user
        const userNew = new User(u.uid);
        userNew.email = this.email;

        this.auth.user = userNew;
        this.uploadImageAndSetupUserInfo(this.doneCallback);

      }).catch((err) => {
        console.log(err);

        this.showLoadingView(false);

        // show error alert
        this.presentAlert(
          'Signup Failed',
          err.message
        );
      });
    }
  }

  uploadImageAndSetupUserInfo(completion: (any?) => void) {
    if (this.uploadPhoto.picture) {
      this.showLoadingView();

      // upload photo
      const user = this.auth.user;
      const path = 'users/' + user.id + '.png';

      this.api.uploadImage(
        path,
        this.uploadPhoto.picture
      ).then((url) => {
        user.photoUrl = url;
        this.saveUserInfo(completion);

      }).catch((err) => {
        console.log(err);

        // failed to upload
        this.showLoadingView(false);
      });

    } else {
      this.saveUserInfo(completion);
    }
  }

  saveUserInfo(completion: (any?) => void) {
    const user = this.auth.user;

    // save info
    user.name = this.name;
    user.phone = this.phone;
    user.nameBkg = this.nameBkg;
    user.phoneBkg = this.phoneBkg;
    user.addressBkg = this.addressBkg;

    this.api.saveToDatabase(user);

    // save user info to session storage
    this.auth.user = user;
    this.auth.updateCurrentUser();

    // hide loading view
    this.showLoadingView(false);

    completion();
  }

  doneCallback = () => {
    if (this.isEdit) {
      // save profile
      this.onButBack();
      return;
    }

    // signup
    this.router.navigate(['/tabs/home']);
  }
}
