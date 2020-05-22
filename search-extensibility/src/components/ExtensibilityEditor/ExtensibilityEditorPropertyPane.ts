import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    IPropertyPaneField,
    PropertyPaneFieldType,
    IPropertyPaneCustomFieldProps
} from '@microsoft/sp-property-pane';
import { IExtensibilityEditorProps, ExtensibilityEditor } from './ExtensibilityEditor';
import { ExtensionTypes } from '../../utility/ExtensionTypes';
import { Guid } from '@microsoft/sp-core-library';

export interface IExtensibilityEditorPropertyPaneProps extends IExtensibilityEditorProps {
    disabled?: boolean;    
}

export interface IExtensibilityEditorPropertyPaneInternalProps extends IExtensibilityEditorPropertyPaneProps, IPropertyPaneCustomFieldProps {}

export class PropertyPaneExtensibilityEditor implements IPropertyPaneField<IExtensibilityEditorPropertyPaneProps> {
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public shouldFocus?: boolean;
    public properties: IExtensibilityEditorPropertyPaneProps;
    private element: HTMLElement;

    constructor(targetProperty:string, properties: IExtensibilityEditorPropertyPaneProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            label:properties.label,
            allowedExtensions: properties.allowedExtensions,
            libraries: properties.libraries,
            onLibraryAdded: properties.onLibraryAdded,
            onLibraryDeleted: properties.onLibraryDeleted
        };
    }

    private onDispose(element: HTMLElement) {
        ReactDOM.unmountComponentAtNode(element);
    }
    private render():void {
        if(!this.element) return;
        this.onRender(this.element);
    }

    private onRender(e:HTMLElement):void {

        if(!this.element) this.element = e;
        
        const element: React.ReactElement<IExtensibilityEditorProps> = React.createElement(ExtensibilityEditor, {
            label: this.properties.label,
            allowedExtensions: [ ExtensionTypes.QueryModifer, ExtensionTypes.WebComponent, ExtensionTypes.HandlebarsHelper ],
            libraries: this.properties.libraries,
            onLibraryAdded: this.onLibraryAdded.bind(this),
            onLibraryDeleted: this.onLibraryDeleted.bind(this)
        });

        ReactDOM.render(element, e);

    }

    private onLibraryAdded(id:Guid):void {
        this.properties.onLibraryAdded(id);
    }

    private onLibraryDeleted(id:Guid):void {
        this.properties.onLibraryDeleted(id);
    }

}