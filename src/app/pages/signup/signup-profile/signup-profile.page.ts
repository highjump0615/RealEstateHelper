import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {KeyboardService} from '../../../services/keyboard/keyboard.service';
import {AuthService} from '../../../services/auth/auth.service';
import {BasePage} from '../../base.page';
import {User} from '../../../models/user';
import {ImageUploaderComponent} from '../../../components/image-uploader/image-uploader.component';
import {FirebaseManager} from '../../../helpers/firebase-manager';

@Component({
  selector: 'app-signup-profile',
  templateUrl: './signup-profile.page.html',
  styleUrls: ['./signup-profile.page.scss'],
})
export class SignupProfilePage extends BasePage implements OnInit {

  userId = '';

  email = '';
  password = '';

  name = '';
  phone = '';
  nameBkg = '';
  phoneBkg = '';
  addressBkg = '';

  @ViewChild('imageProfile') uploadPhoto: ImageUploaderComponent;

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private kbService: KeyboardService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private auth: AuthService
  ) {
    super(loadingCtrl, alertCtrl);

    this.userId = this.route.snapshot.params['id'];

    this.email = this.route.snapshot.paramMap.get('email');
    this.password = this.route.snapshot.paramMap.get('password');
  }

  ngOnInit() {
  }

  onButBack($event: MouseEvent) {
    // back to prev page
    this.navCtrl.pop();
  }

  signinForm() {
    if (this.userId) {
      // update profile
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
      // upload photo
      const user = this.auth.user;
      const path = 'users/' + user.id + '.png';

      FirebaseManager.getInstance().uploadImageTo(
        path,
        this.uploadPhoto.picture,
        (downloadURL, error) => {
          if (error) {
            // failed to upload
            this.showLoadingView(false);
            return;
          }

          user.photoUrl = downloadURL;
          this.saveUserInfo(completion);
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

    user.saveToDatabase();

    // save user info to session storage
    this.auth.user = user;
    this.auth.updateCurrentUser();

    // hide loading view
    this.showLoadingView(false);

    completion();
  }

  doneCallback = () => {
    if (this.userId) {
      // save profile

      return;
    }

    // signup
    this.router.navigate(['/tabs/home']);
  }
}
