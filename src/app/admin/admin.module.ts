import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared/shared.module';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { AddComponent } from './plans/add/add.component';
import { PlansComponent } from './plans/plans.component';
import { CmsComponent } from './cms/cms.component';
import { SupportComponent } from './support/support.component';
import { TicketComponent } from './ticket/ticket.component';
import { ManageCmsComponent } from './manage-cms/manage-cms.component';
import { KnowledgebaseComponent } from './knowledgebase/knowledgebase.component';
import { AddKnowledgebaseComponent } from './add-knowledgebase/add-knowledgebase.component';

@NgModule({
  declarations: [
    AdminComponent,
    HomeComponent,
    UsersComponent,
    AddComponent,
    PlansComponent,
    CmsComponent,
    SupportComponent,
    TicketComponent,
    ManageCmsComponent,
    KnowledgebaseComponent,
    AddKnowledgebaseComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
  exports: [AdminComponent, SharedModule],
})
export class AdminModule {}
