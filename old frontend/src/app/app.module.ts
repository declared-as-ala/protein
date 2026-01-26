import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration, withNoDomReuse, withNoHttpTransferCache } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductComponent } from './shared/product/product.component';
import { SlidesComponent } from './components/slides/slides.component';
import { VenteFlashProductComponent } from './components/vente-flash-product/vente-flash-product.component';
import { VenteFlashComponent } from './components/vente-flash/vente-flash.component';

import { HomeComponent } from './home/home.component';

import { FooterComponent } from './sections/footer/footer.component';
import { HeaderComponent } from './sections/header/header.component';
import { SearchComponent } from './sections/search/search.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ArticleComponent } from './shared/article/article.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrandsComponent } from './sections/brands/brands.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { CompteComponent } from './compte/compte.component';
import { HistoriqueComponent } from './compte/historique/historique.component';
import { ProfileComponent } from './compte/profile/profile.component';
import { DetailCommandeComponent } from './compte/detail-commande/detail-commande.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from "./shared/shared.module";
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();




@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        SlidesComponent,
        VenteFlashComponent,
        VenteFlashProductComponent,
        SearchComponent,
        CategoriesComponent,
        BrandsComponent,
        SignInComponent,
        CompteComponent,
        HistoriqueComponent,
        ProfileComponent,
        DetailCommandeComponent,
        PageNotFoundComponent,
        LayoutComponent
    ],
    providers: [provideClientHydration(withNoDomReuse())],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        CarouselModule,
        ReactiveFormsModule,
        ProductComponent,
        ArticleComponent,
        NgxPaginationModule,
        SharedModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
