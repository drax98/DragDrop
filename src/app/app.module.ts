import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TestComponentComponent} from './test-component/test-component.component';

@NgModule({
    declarations: [
        AppComponent,
        TestComponentComponent
    ],
    imports: [
        BrowserModule,
        DragDropModule
    ],
    entryComponents: [TestComponentComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
