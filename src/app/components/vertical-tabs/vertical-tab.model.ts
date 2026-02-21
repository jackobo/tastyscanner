import React from 'react';
import {IVerticalTabViewModel} from "./vertical-tab.view-model.interface";
import {IAppServiceFactory} from "../../services/app-service-factory.interface";

export abstract class VerticalTabModel implements IVerticalTabViewModel {
    constructor(protected readonly services: IAppServiceFactory) {
    }

    abstract get key(): string;
    abstract getTitle(): string;
    abstract renderContent(): React.ReactNode;
}