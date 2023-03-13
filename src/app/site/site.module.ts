import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared/shared.module';
import { HomeComponent } from './home/home.component';
import { BecomePartnerComponent } from './become-partner/become-partner.component';
import { PlansComponent } from './plans/plans.component';
import { SupportComponent } from './support/support.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { TicketComponent } from './ticket/ticket.component';
import { ForgotComponent } from './forgot/forgot.component';
import { KnowledgebaseComponent } from './knowledgebase/knowledgebase.component';

@NgModule({
  declarations: [HomeComponent, BecomePartnerComponent, PlansComponent, SupportComponent, AddTicketComponent, TicketComponent, ForgotComponent, KnowledgebaseComponent],
  // entryComponents: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [HomeComponent, BecomePartnerComponent, PlansComponent, SupportComponent, AddTicketComponent, TicketComponent]
})
export class SiteModule { }
