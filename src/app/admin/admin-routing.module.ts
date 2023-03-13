import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from '../dashboard/profile/profile.component';
import { AuthGuard } from './services/auth.guard';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { PlansComponent } from './plans/plans.component';
import { AddComponent } from './plans/add/add.component';
import { CmsComponent } from './cms/cms.component';
import { SupportComponent } from './support/support.component';
import { TicketComponent } from './ticket/ticket.component';
import { ManageCmsComponent } from './manage-cms/manage-cms.component';
import { KnowledgebaseComponent } from './knowledgebase/knowledgebase.component';
import { AddKnowledgebaseComponent } from './add-knowledgebase/add-knowledgebase.component';


const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'users', component: UsersComponent },
      { path: 'user/:type/:id', component: ProfileComponent },
      { path: 'profile/:type/:id', component: ProfileComponent },
      { path: 'plans', component: PlansComponent },
      { path: 'plans/add', component: AddComponent },
      { path: 'plans/edit/:id', component: AddComponent },
      { path: 'support', component: SupportComponent },
      { path: 'support/ticket/:id', component: TicketComponent },
      { path: 'cms', component: CmsComponent },
      { path: 'cms/:type', component: ManageCmsComponent },
      { path: 'knowledgebase', component: KnowledgebaseComponent },
      { path: 'knowledgebase/add', component: AddKnowledgebaseComponent },
      { path: 'knowledgebase/edit/:id', component: AddKnowledgebaseComponent },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
