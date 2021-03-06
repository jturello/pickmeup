import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AuthService } from "./auth.service";
import { User } from "./user";

@Component({
  selector: 'sign-up',
  template: `

    <section>
      <form [formGroup]="myForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name</label>
          <input  class="form-control" formControlName="name" id="name">
        </div>
        <div>
          <label for="email">Email</label>
          <input class="form-control" formControlName="email" type="email" id="email">
        </div>
        <div>
          <label for="password">Password</label>
          <input class="form-control" formControlName="password" type="password" id="password">
        </div>
        <button class="btn btn-success" type="submit">Sign Up</button>
      </form>
    </section>
  `
})
export class SignupComponent implements OnInit {
  myForm: FormGroup;

  constructor(private fb:FormBuilder, private authService: AuthService, private router: Router) {}

  onSubmit() {
    const user = new User(this.myForm.value.email, this.myForm.value.password, this.myForm.value.name);
    this.authService.signup(user)
      .subscribe(
        data => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('userName', data.userName);
          localStorage.setItem('userEmail', data.userEmail);
          this.router.navigate(['']);
        },
        error => console.log(error)
      );
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        this.isEmail
      ])],
      password: ['', Validators.required]
    });
  }

  private isEmail(control: FormControl): {[s: string]: boolean} {
    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
        return {invalidMail: true};
    }
  }
}
