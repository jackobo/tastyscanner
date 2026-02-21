import React from 'react'

export interface IVerticalTabViewModel {
    readonly key: string;
    getTitle(): string;
    renderContent(): React.ReactNode;
}