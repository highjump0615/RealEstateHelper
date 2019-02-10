import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {

  @ViewChild('slides') slides;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  /**
   * next button
   * @param event
   */
  onButNext(event) {
    this.slides.isEnd().then((result) => {
      if (result) {
        this.gotoLoginPage();
        return;
      }

      // go to next slide
      this.slides.slideNext();
    });
  }

  /**
   * skip button
   * @param event
   */
  onButSkip(event) {
    this.gotoLoginPage();
  }

  /**
   * go to log in page
   */
  gotoLoginPage() {
    this.router.navigate(['signup-email']);
  }
}
