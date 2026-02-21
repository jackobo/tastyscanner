import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {IDropDownDialogOptions} from "./drop-down-dialog-options";
import {StandardDialogPageComponent} from "../../../../modal/page/standard-dialog-page.component";
import {StandardDialogHeaderComponent} from "../../../../modal/header/standard-dialog-header.component";
import {StandardDialogContentComponent} from "../../../../modal/content/standard-dialog-content.component";
import {IDropDownController} from "../../models/drop-down-controller.interface";
import {StandardDialogFooterComponent} from "../../../../modal/footer/standard-dialog-footer.component";
import {InputLabelRendererType} from "../../../input-label-renderer.type";
import styled from "styled-components";
import {IDialogHandler} from "../../../../../services/dialog/dialog.service.interface";
import {useFrameworkServices} from "../../../../../hooks/use-framework-services.hook";
import {IFrameworkServiceFactory} from "../../../../../services/framework-service-factory.interface";

const DialogHeader = styled(StandardDialogHeaderComponent)`
    gap: var(--ion-space-8);
`

const DialogContent = styled(StandardDialogContentComponent)`
    --padding-top: 0;
`

interface DropDownModalDialogComponentProps {
    dialogHandler: IDialogHandler;
    renderTitle?: InputLabelRendererType;
    renderHeaderContent: () => (React.ReactElement | null);
    renderContent: () => React.ReactElement;
    renderFooterContent: () => (React.ReactElement | null);

}

const DropDownModalDialogComponent: React.FC<DropDownModalDialogComponentProps> = observer((props) => {

    const renderFooter = () => {
        const footer = props.renderFooterContent();
        if(!footer) {
            return null;
        }

        return (
            <StandardDialogFooterComponent dialogHandler={props.dialogHandler}>
                {footer}
            </StandardDialogFooterComponent>
        )
    }

    const renderTitle = () => {
        if(props.renderTitle) {
            return props.renderTitle();
        }

        return null;
    }

    return (
        <StandardDialogPageComponent>
            <DialogHeader title={renderTitle()}
                          dialogHandler={props.dialogHandler}
                          renderTitleOnTheFirstRow={true}>
                {props.renderHeaderContent()}
            </DialogHeader>
            <DialogContent dialogHandler={props.dialogHandler}>
                {props.renderContent()}
            </DialogContent>
            {renderFooter()}
        </StandardDialogPageComponent>
    );
})

enum DropDownDialogStatus {
    NotOpened,
    Opened,
}


interface DropDownWithDialogComponentProps {
    dropDownController: IDropDownController;
    renderContent: (dlg: IDialogHandler) => React.ReactElement;
    renderLabel?: InputLabelRendererType;
    dialogOptions?: IDropDownDialogOptions;

}

class DialogHandler {
    constructor(private readonly props: DropDownWithDialogComponentProps,
                private readonly services: IFrameworkServiceFactory) {
    }

    private _dialogStatus: DropDownDialogStatus = DropDownDialogStatus.NotOpened;
    private _dialog: IDialogHandler | null = null;

    public openDialog(): void {
        if(this._dialogStatus === DropDownDialogStatus.Opened) {
            return;
        }

        this._dialogStatus = DropDownDialogStatus.Opened;

        if(this.props.dialogOptions?.breakpoints) {
            this.services.dialog.showSheetModalDialog({
                breakpoints: this.props.dialogOptions.breakpoints,
                ...this._getDialogCommonProps()
            });
        } else {
            this.services.dialog.showStandardDialog({
                ...this._getDialogCommonProps()
            });
        }
    }

    public closeDialog(): void {
        this._dialog?.accept();
    }

    private _renderDialogHeaderContent = (dlg: IDialogHandler) => {
        if(this.props.dialogOptions?.renderHeaderContent) {
            return this.props.dialogOptions.renderHeaderContent(dlg);
        }
        return null;
    }

    private _renderDialogContent = (dlg: IDialogHandler) => {
        return this.props.renderContent(dlg);
    }

    private _renderDialogFooterContent = (dlg: IDialogHandler) => {
        if(this.props.dialogOptions?.renderFooterContent) {
            return this.props.dialogOptions.renderFooterContent(dlg);
        }
        return null;
    }

    private _renderTitle = () => {
        if(this.props.dialogOptions?.renderTitle) {
            return this.props.dialogOptions.renderTitle();
        }

        if(this.props.renderLabel) {
            return this.props.renderLabel();
        }
        return null;
    }

    private _getDialogCommonProps = () => {
        return {
            render: (dlg: IDialogHandler) => {
                this._dialog = dlg;
                return (<DropDownModalDialogComponent dialogHandler={dlg}
                                                      renderTitle={() => this._renderTitle()}
                                                      renderHeaderContent={() => this._renderDialogHeaderContent(dlg)}
                                                      renderContent={() => this._renderDialogContent(dlg)}
                                                      renderFooterContent={() => this._renderDialogFooterContent(dlg)}/>)
            },

            onReject: async () => {
                this.props.dropDownController.closeDropDown();
            }
        };
    }
}


export const DropDownWithDialogComponent: React.FC<DropDownWithDialogComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const [dialogHandler] = useState(new DialogHandler(props, services));

    useEffect(() => {
        dialogHandler.openDialog();
        return () => {
            dialogHandler.closeDialog();
        }
    }, [dialogHandler]);

    return (
        <></>
    );
});
