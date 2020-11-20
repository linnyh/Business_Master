import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { Signup } from './signup';
import { AuthenticationCodeServiceService } from 'src/app/shared/services/authentication-code-service.service';
import { Router } from '@angular/router';
import { PassportServiceService } from 'src/app/shared/services/passport-service.service';
import { Md5 } from 'ts-md5/dist/md5';
import { verify } from 'crypto';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  constructor(private authenticationCode: AuthenticationCodeServiceService, private navCtrl: NavController,
              private router: Router,
              private userService: PassportServiceService){}
  @ViewChild('signupSlides', {static: true}) signupSlides: IonSlides;
  signup: Signup = {
    phone: '',
    email: '',
    shopName: '',
    password: '',
    confirmPassword: '',
    code: '',
  };
  register = {
    phone: '',
    email: '',
    shopName: '',
    password: '',
    confirmPassword: '',
    code: ''
  };
  verifyCode: any = {
    verifyCodeTips: '获取',
    code : '',
    codeLength: 4,
    countdown: 60,
    disable: true,
    fail: false// 验证失败
  };


  public submited = false;
  public codeTest = '';
  public codeMd5 = '';
  public slideIndex = 0; //  用于注册页面过程

  params: any = {
    checkInformationResult: false
  };

  onSignupPhone(form: NgForm) {
    this.submited = true;
    console.log('提交');
    if (form.valid) {
      // 已通过客户端验证
      console.log('Phone In');
      this.onNext();
    }
  }

  getCode() {
    // 获取验证码
    this.codeTest = this.authenticationCode.createCode(this.verifyCode.codeLength);
    // console.log('验证码：' + this.code_test);
    // MD5加密
    this.codeMd5 = Md5.hashStr(this.codeTest).toString();
    // 发送短信
    // 发送验证码成功后开始倒计时
    this.verifyCode.disable = false;
    this.setTime();
  }

  setTime() {
    if (this.verifyCode.countdown === 1) {
        this.verifyCode.countdown = 60;
        this.verifyCode.verifyCodeTips = '重新获取';
        this.verifyCode.disable = true;
        return;
    } else {
        this.verifyCode.countdown--;
    }

    this.verifyCode.verifyCodeTips = '重新获取(' + this.verifyCode.countdown + ')';
    setTimeout(() => {
        this.verifyCode.verifyCodeTips = '重新获取(' + this.verifyCode.countdown + ')';
        this.setTime();
    }, 1000);
  }

  checkCode(){
    console.log(this.verifyCode.code);
    if (this.authenticationCode.validate(this.verifyCode.code)) {
      this.onNext();
      this.verifyCode.fail = false;
    } else {
        this.verifyCode.fail = true;
    }
  }

  oncheckInformation() {
    // console.log('sureCode : ' + this.signup.confirmPassword);
    if (this.signup.password !== '' && this.signup.password === this.signup.confirmPassword && this.saveUser()) {
        this.onNext();
        this.params.checkInformationResult = false;
    } else {
        this.params.checkInformationResult = true;
        console.log('两次密码不一样');
    }
  }

  saveUser(): boolean {
// tslint:disable-next-line:ban-types
    const res: Boolean = this.userService.addUser(this.signup.phone, this.signup.email,
      this.signup.password, this.signup.shopName);
    if (res === true) {
      console.log('注册成功');
      return true;
    } else {
      console.log('注册失败');
      return false;
    }
  }

  gotoLoginPage() {
    this.slideIndex = 0;
    this.submited = false;
    // 重置signup
    this.signup.password = '';
    this.signup.confirmPassword = '';
    this.signup.phone = '';
    this.signup.email = '';
    this.signup.shopName = '';

    // 重置verifyCode
    this.verifyCode.code = '';

    this.router.navigateByUrl('/login');
  }


  ngOnInit() {
    this.signupSlides.lockSwipeToNext(true);
  }
  onNext(){
    this.signupSlides.lockSwipeToNext(false);
    this.signupSlides.slideNext();
    this.slideIndex++;
    this.signupSlides.lockSwipeToNext(true);
  }
  onPrevious() {
    this.signupSlides.lockSwipeToNext(false);
    this.signupSlides.slidePrev();
    this.slideIndex--;
    this.signupSlides.lockSwipeToNext(true);
  }

}
