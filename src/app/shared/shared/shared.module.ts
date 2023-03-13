import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbPaginationModule,
  NgbAlertModule,
  NgbTypeaheadModule,
  NgbButtonsModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NgZorroModule } from './ng-zorro-module';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { GoogleChartsModule } from 'angular-google-charts';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';

const materialModules = [MatIconModule];

const components = [HeaderComponent, FooterComponent];

@NgModule({
  declarations: [...components, TimeAgoPipe],
  // entryComponents: [...components],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ...materialModules,
    NgbPaginationModule,
    NgbAlertModule,
    NgbTypeaheadModule,
    NgbButtonsModule,
    NgZorroModule,
    FroalaEditorModule,
    FroalaViewModule,
    GooglePlaceModule,
    NgxUiLoaderModule,
    GoogleChartsModule,
    
  ],
  exports: [
    ...components,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ...materialModules,
    NgbPaginationModule,
    NgbAlertModule,
    NgbTypeaheadModule,
    NgbButtonsModule,
    NgZorroModule,
    FroalaEditorModule,
    FroalaViewModule,
    GooglePlaceModule,
    NgxUiLoaderModule,
    GoogleChartsModule,
    TimeAgoPipe
  ],
})
export class SharedModule {}
