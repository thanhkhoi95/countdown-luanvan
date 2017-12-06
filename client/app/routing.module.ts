import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AuthGuardLayout } from './services/auth-guard-layout.service';
import { KitchenComponent } from './kitchen/kitchen.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardLogin] },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      { path: 'admin', component: AdminComponent, canActivate: [AuthGuardAdmin] },
      { path: 'table', component: TableComponent, canActivate: [AuthGuardAdmin] },
      { path: 'staff', component: StaffComponent, canActivate: [AuthGuardAdmin] },
      { path: 'category', component: CategoryComponent, canActivate: [AuthGuardAdmin]},
      { path: 'food', component: FoodComponent, canActivate: [AuthGuardAdmin]},
      { path: 'kitchen', component: KitchenComponent, canActivate: [AuthGuardAdmin]},
    ],
    canActivate: [AuthGuardLayout]
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class RoutingModule { }
