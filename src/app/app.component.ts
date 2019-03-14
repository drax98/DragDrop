import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TestComponentComponent} from './test-component/test-component.component';

const MAX_COLUMNS_WIDTH = 12;
const MIN_COLUMNS_WIDTH = 1;

interface ColumnItem {
    columnsWidth: number;
    component: any;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild('itemsWrapper') itemsWrapper;
    config: ColumnItem[][] = [
        [
            {columnsWidth: 1, component: 'TestComponentComponent'},
            {columnsWidth: 1, component: 'TestComponentComponent'},
            {columnsWidth: 1, component: 'TestComponentComponent'},
        ],
        []
    ];
    private componentsMapping = {'TestComponentComponent': TestComponentComponent};
    private resizeItem: ColumnItem;
    private resizeStartPos: number;


    constructor() {
        this.config = this.loadConfiguration();
    }

    moveItem(event: CdkDragDrop<any>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        this.saveConfiguration();
    }

    getComponent(component: string) {
        return this.componentsMapping[component];
    }

    public predicateMove(item: CdkDrag<ColumnItem>, list: CdkDropList) {
        let width = 0;
        for (const listItem of list.data) {
            width += listItem.columnsWidth;
        }
        return width + item.data.columnsWidth <= MAX_COLUMNS_WIDTH;
    }

    @HostListener('mousemove', ['$event'])
    resize(event: MouseEvent) {
        if (!this.resizeItem) {
            return;
        }
        const breakpoint = this.getResizeBreakpoint() - 20;
        const startWidth = this.resizeItem.columnsWidth;
        const movementX = event.clientX - this.resizeStartPos;
        if (Math.abs(movementX) > breakpoint) {
            this.updateItemSize(this.resizeItem, Math.round(movementX / breakpoint) + startWidth);
            this.resizeStartPos = event.clientX;
        }
    }

    startResizing(event: MouseEvent, item: ColumnItem) {
        const element = event.target as HTMLDivElement;
        if (element.offsetWidth - event.offsetX < 20) {
            this.resizeItem = item;
            this.resizeStartPos = event.clientX;
        }
    }

    @HostListener('mouseup')
    stopResizing() {
        this.resizeItem = null;
        this.resizeStartPos = null;
    }

    private getResizeBreakpoint() {
        return this.itemsWrapper.nativeElement.offsetWidth / MAX_COLUMNS_WIDTH;
    }

    private saveConfiguration() {
        localStorage.setItem('dragDropConfig', JSON.stringify(this.config));
    }

    private loadConfiguration() {
        return JSON.parse(localStorage.getItem('dragDropConfig')) || this.config;
    }

    private updateItemSize(item: ColumnItem, newSize: number) {
        const maxWidthValidate = this.config
            .find(e => e.includes(item))
            .map(e => e.columnsWidth)
            .reduce((acc, val) => acc + val) >= MAX_COLUMNS_WIDTH;
        if ((maxWidthValidate && newSize > item.columnsWidth) || newSize < MIN_COLUMNS_WIDTH) {
            return;
        }
        item.columnsWidth = newSize;

        this.saveConfiguration();
    }

}
