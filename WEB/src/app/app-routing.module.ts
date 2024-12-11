//app-routing-module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompaniesComponent } from './companies/companies.component';
import { MembershipFeeComponent } from './membership-fee/membership-fee.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';

import { authGuard } from './auth.guard';
import { NotificationComponent } from './notification/notification.component';

const routeConfig: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login',  component: LoginComponent },
    { path: 'register',  component: RegisterComponent },
    { 
      path: 'home', 
      component: HomeComponent,
      canActivate: [authGuard],
      data: {
        title: 'Home'
      },
      children: [
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        },
        {
          path: 'dashboard',
          component: DashboardComponent,
          data: { title: 'Dashboard' }
        },
        {
          path: 'companies',
          component: CompaniesComponent,
          data: { title: 'Company list' }
        },
        {
          path: 'membership-fee',
          component: MembershipFeeComponent,
          data: { title: 'Membership fee' }
        },
        {
          path: 'notification',
          component: NotificationComponent,
          data: { title: 'Notification' }
        },
        {
          path: 'change-password',
          component: ChangePasswordComponent,
          data: { title: 'Change password' }
        },
      ]
    },
    { path: '**', redirectTo: '/' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routeConfig, { scrollPositionRestoration: 'enabled' })], 
  exports: [RouterModule]
})
export class AppRoutingModule {
  static routes = routeConfig; 
}
