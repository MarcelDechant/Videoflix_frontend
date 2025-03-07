import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { Router } from '@angular/router';
import { FormInputComponent } from '../shared/components/form-input/form-input.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../services/form/form.service';
import { AuthService } from '../services/auth/auth.service';
import { MessageToastService } from '../services/message_toast/message-toast.service';
import { BackendApiService } from '../services/backend_api/backend-api.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,FormInputComponent, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  /**
   * Form group for handling form inputs.
   */
  form: FormGroup;

  /**
   * Constructor to inject services and initialize the form group.
   * @param fb - FormBuilder instance for creating the reactive form.
   * @param bs - BackendApiService for handling API requests.
   * @param router - Router for navigation after successful login.
   * @param as - AuthService for handling token storage.
   * @param formService - FormService for form validation utilities.
   * @param messageToastService - MessageToastService for displaying messages.
   */
  constructor(
    private fb: FormBuilder,
    private bs: BackendApiService,
    private router: Router,
    private as: AuthService,
    private formService: FormService,
    public messageToastService: MessageToastService
  ) {
    
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  /**
   * Lifecycle hook to check for an existing access token on component initialization.
   * Handle automatic login.
   */
  ngOnInit() {
    if(this.as.getAccessToken()) {
      this.router.navigate(['/browse'])
    }
  }


  /**
   * Handles form submission, triggers validation if the form is invalid,
   * otherwise initiates the login process.
   */
  onSubmit() {
    if (this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      const rememberMe = this.form.get('rememberMe')?.value;
      this.handleLogin(email, password, rememberMe);
    } else {
      this.formService.validateAllFormFields(this.form);
    }
  }

  /**
   * Performs the login request and handles the response or error.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param rememberMe - Flag indicating if the user should remain logged in.
   */
  async handleLogin(email: string, password: string, rememberMe: boolean) {
    try {
      const response: any = await this.bs.login(email, password);
      this.as.saveTokens(response['access'], response['refresh'], rememberMe);
      this.router.navigate(['/browse']);
    } catch (error: any) {
      console.error(error);
      this.messageToastService.setError(error.error.detail);
    }
  }

}