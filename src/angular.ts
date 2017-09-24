import { ElementRef, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { isArray, isUndefined, mergeWith } from 'lodash';
import { elementByQuery, elementsByQuery } from './dom';

const defaultModuleDef: TestModuleMetadata = {
    imports: [],
    providers: [],
    declarations: [],
    schemas: []
};

// tslint:disable-next-line:variable-name
export function configureComponentTestEnvironment(ComponentClass: {}, moduleDef?: TestModuleMetadata) {
    configureTestEnvironment(
        mergeModuleDefs(
            {
                declarations: [
                    ComponentClass
                ],
                schemas: [
                    NO_ERRORS_SCHEMA
                ]
            },
            moduleDef
        )
    )
        .compileComponents();
}

export function configureTestEnvironment(moduleDef: TestModuleMetadata) {
    return TestBed
        .configureTestingModule(moduleDef);
}

export function mergeModuleDefs(...moduleDefs: TestModuleMetadata[]) {
    return moduleDefs.reduce(
        (moduleDef1, moduleDef2) => mergeWith(
            moduleDef1,
            moduleDef2,
            (newValue, value) => isArray(newValue) ? newValue.concat(value) : undefined
        ),
        defaultModuleDef
    );
}

export function createComponent<T>(component: Type<T>) {
    return TestBed.createComponent<T>(component);
}

export function expectComponent<T>(fixture: ComponentFixture<T>) {
    return expect(fixture.componentInstance);
}

export function expectElementFromFixture<T>(fixture: ComponentFixture<T>, domQuery?: string): jasmine.Matchers<{}> {
    return expect(elementFromFixture(fixture, domQuery));
}

export function expectElementsFromFixture<T>(fixture: ComponentFixture<T>, domQuery: string): jasmine.ArrayLikeMatchers<{}> {
    return expect(elementsFromFixture(fixture, domQuery));
}

export function expectFormElementFromFixture<T>(fixture: ComponentFixture<T>, formControlName: string): jasmine.Matchers<{}> {
    return expect(elementFromFixture(fixture, getFormControlDomQuery(formControlName)));
}

export function expectFormElementsFromFixture<T>(fixture: ComponentFixture<T>, formControlName: string): jasmine.ArrayLikeMatchers<{}> {
    return expect(elementsFromFixture(fixture, getFormControlDomQuery(formControlName)));
}

export function expectViewChildFromFixture<T>(fixture: ComponentFixture<T>, viewChildProperty: string) {
    return expect(viewChildFromFixture(fixture, viewChildProperty));
}

export function componentFromFixture<T>(fixture: ComponentFixture<T>) {
    return fixture.componentInstance;
}

export function viewChildFromFixture<T>(fixture: ComponentFixture<T>, viewChildProperty: string) {
    return (<ElementRef> fixture.componentInstance[viewChildProperty].nativeElement);
}

export function formElementFromFixture<T>(fixture: ComponentFixture<T>, formControlName: string): Element {
    return elementFromFixture(fixture, getFormControlDomQuery(formControlName));
}

export function elementFromFixture<T>(fixture: ComponentFixture<T>, domQuery?: string): Element {
    const nativeElement = getNativeElement(fixture);
    return isUndefined(domQuery) ? nativeElement : elementByQuery(nativeElement, domQuery);
}

export function childComponentsFromFixture<T>(fixture: ComponentFixture<{}>, domQuery: string): T[] {
    return (<{}> elementsFromFixture(fixture, domQuery)) as T[];
}

export function formElementsFromFixture<T>(fixture: ComponentFixture<T>, formControlName: string): Element[] {
    return elementsFromFixture(fixture, getFormControlDomQuery(formControlName));
}

export function elementsFromFixture<T>(fixture: ComponentFixture<T>, domQuery: string): Element[] {
    const nativeElement = getNativeElement(fixture);
    return elementsByQuery(nativeElement, domQuery);
}

function getNativeElement<T>(fixture: ComponentFixture<T>): HTMLElement {
    fixture.detectChanges();
    return fixture.nativeElement;
}

function getFormControlDomQuery(formControlName: string): string {
    return `[formcontrolname="${formControlName}"]`;
}
