import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ProductComponent } from './product/product.component';
import { ArticleComponent } from './article/article.component';
import { SocialShareComponent } from './social-share/social-share.component';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { LoaderComponent } from './loader/loader.component';
import { SafePipe } from './safe.pipe';


@NgModule({
  declarations: [BreadcrumbsComponent, SocialShareComponent, LoaderComponent, SafePipe ],
  imports: [
    CommonModule,
    ArticleComponent,
    SharedRoutingModule,
    ProductComponent,
    ShareButtonsModule,
    ShareIconsModule,
  ],
  exports : [BreadcrumbsComponent , ProductComponent,ArticleComponent,SocialShareComponent , LoaderComponent,SafePipe
  ]
})
export class SharedModule { }
