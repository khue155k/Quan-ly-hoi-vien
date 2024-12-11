import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgScrollbar } from 'ngx-scrollbar';
import { CommonModule, NgStyle, NgTemplateOutlet } from '@angular/common';
import { QuillModule } from 'ngx-quill';

import {
    GridModule,
    FormModule,
    ContainerComponent,
    SidebarModule, CardModule,
    HeaderNavComponent, HeaderTogglerDirective,
    BreadcrumbRouterComponent,
    ModalModule,
    ButtonCloseDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective
} from '@coreui/angular';

import { IconComponent, IconModule } from '@coreui/icons-angular';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompaniesComponent } from './companies/companies.component';
import { HomeComponent } from './home/home.component';
import { DefaultHeaderComponent } from './header/header.component';
import { DefaultFooterComponent } from './footer/footer.component';
import { MembershipFeeComponent } from './membership-fee/membership-fee.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NotificationComponent } from './notification/notification.component';

import { AuthService } from './auth.service';
import { CompanyService } from './company.service';
import { ColorModeService } from '@coreui/angular';
import { AuthInterceptor } from './auth.interceptor';
import { RegisterComponent } from './register/register.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        GridModule,
        FormModule,
        RouterOutlet,
        ContainerComponent,
        ReactiveFormsModule,
        SidebarModule,
        NgScrollbar,
        IconComponent,
        IconModule,
        CommonModule,
        CardModule,
        NgStyle,
        NgTemplateOutlet,
        HeaderNavComponent,
        HeaderTogglerDirective,
        BreadcrumbRouterComponent,
        ModalModule,
        ButtonCloseDirective,
        ButtonDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ThemeDirective,
        QuillModule.forRoot(),
    ],
    exports: [

    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        DashboardComponent,
        CompaniesComponent,
        DefaultHeaderComponent,
        DefaultFooterComponent,
        MembershipFeeComponent,
        ChangePasswordComponent,
        NotificationComponent,
        RegisterComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideRouter(AppRoutingModule.routes),
        provideHttpClient(),
        AuthService,
        CompanyService,
        Router,
        ColorModeService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }