import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UniversityManagementComponent } from './components/university-management/university-management.component';
import { UniversityDetailsComponent } from './components/university-details/university-details.component';
import { Compare } from './components/compare/compare';

export const routes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'profile', component: ProfileComponent },
	{ path: 'university/:id', component: UniversityDetailsComponent },
	{ path: 'compare', component: Compare },
	{ path: 'admin', component: AdminDashboardComponent },
	{ path: 'admin/universities', component: UniversityManagementComponent },
	{ path: '**', redirectTo: '' }
];
