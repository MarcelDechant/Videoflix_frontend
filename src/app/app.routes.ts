import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { LoginPageComponent } from './login-page/login-page.component';


export const routes: Routes = [
    { path: '', component: HomePageComponent},
    { path: 'signup', component: SignUpPageComponent},
    { path: 'login', component: LoginPageComponent},
];
