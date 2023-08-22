import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Service/api.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginForm: any;
  error = false;
  invalidDetails = false;
  constructor(private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }
  createForm() {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }
  login(): void {

    console.log(this.loginForm.value);

    if(this.loginForm.value.email.length==0 || this.loginForm.value.password.length==0) {
      console.log("Error");
      this.invalidDetails = true;
    }
    else {

    this.apiService.userLogin(this.loginForm.value).
      subscribe(res => {
        console.log(res);
        if (res.status == "200") {
          this.apiService.storeToken(res.auth_TOKEN, "customer");
          this.router.navigate(['/home']);
          this.error = false;
        } else if (res.status == "500") {
          this.apiService.adminLogin(this.loginForm.value).
            subscribe(res => {
              if (res.status == "200") {
                this.apiService.storeToken(res.auth_TOKEN, "admin");
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/login']);
              }
              this.error = false;
            },
              err => {
                console.log(err);
              });
        }
      },
        err => {
          console.log(err);
      });
  }
}
}
