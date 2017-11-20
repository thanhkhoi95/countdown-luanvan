import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RoutingModule } from './routing.module';

import { SharedModule } from './shared/shared.module';

import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { TableService } from './services/table.service';
import { StaffService } from './services/staff.service';
import { CategoryService } from './services/category.service';
import { FoodService } from './services/food.service';

import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AuthGuardLayout } from './services/auth-guard-layout.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AdminComponent } from './admin/admin.component';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TableComponent } from './table/table.component';
import { StaffComponent } from './staff/staff.component';
import { CategoryComponent } from './category/category.component';
import { FoodComponent } from './food/food.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    AdminComponent,
    NotFoundComponent,
    LayoutComponent,
    TableComponent,
    StaffComponent,
    CategoryComponent,
    FoodComponent
  ],
  imports: [
    RoutingModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    AuthGuardLayout,
    UserService,
    TableService,
    StaffService,
    CategoryService,
    FoodService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
