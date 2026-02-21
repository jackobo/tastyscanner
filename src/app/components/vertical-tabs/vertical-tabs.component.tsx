import React, {useState} from "react";
import {observer} from "mobx-react";
import {IVerticalTabViewModel} from "./vertical-tab.view-model.interface";
import styled, {css} from "styled-components";

const TabsContainerBox = styled.div`
    display: flex;
    min-height: 100%;
`;


const TabsSidebarBox = styled.div`
    position: sticky;
    top: calc(-1 * var(--ion-space-20) + 4px);
    display: flex;
    flex-direction: column;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    overflow: hidden;
    height: fit-content;
`;

const TabButtonBox = styled.button<{ $isActive: boolean }>`
    overflow: hidden;
    display: block;
    writing-mode: vertical-rl; /* Asigură scrierea verticală standard */
    transform: rotate(180deg); /* Invers pentru a face textul să fie "de jos în sus" */
    transform-origin: center; /* Setează punctul de origine pentru text */
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
    padding: var(--ion-space-12);
    font-size: var(--ion-font-size-body2);
    
    background-color: ${(props) => (props.$isActive ? 'var(--ion-color-dark-contrast)' : "var(--ion-color-light-shade)")};
    
    color: ${(props) => (props.$isActive ? 'var(--ion-color-dark)' : 'var(--ion-color-medium-shade)')};
    font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
    &:hover {
        color: #000;
    }
    
    ${props => props.$isActive && css`
        border: 1px solid var(--ion-color-border);
        border-left: none;
    `}

`;

const ContentContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-12);
    width: 100%;
    flex: 1;
`;

const ContentTitleBox = styled.div`
    font-size: var(--ion-font-size-h3);
    font-weight: var(--ion-font-weight-bold);
    text-align: center;
`

const ContentBox = styled.div`
    
`




interface VerticalTabsComponentProps {
    tabs: IVerticalTabViewModel[];
}

export const VerticalTabsComponent: React.FC<VerticalTabsComponentProps> = observer((props) => {
    const [currentTab, setCurrentTab] = useState<IVerticalTabViewModel | null>(props.tabs[0]);
    const tabs = props.tabs;

    const onTabClick = (tab: IVerticalTabViewModel) => {
        setCurrentTab(tab);
    }

    const renderTabButton = (tab: IVerticalTabViewModel)=> {
        return (
            <TabButtonBox
                key={tab.key}
                $isActive={tab === currentTab}
                onClick={() => onTabClick(tab)}>
                {tab.getTitle()}
            </TabButtonBox>
        )
    }

    return (
        <TabsContainerBox>
            <TabsSidebarBox>
                {tabs.map(renderTabButton)}
            </TabsSidebarBox>
            <ContentContainerBox>
                <ContentTitleBox>
                    {currentTab?.getTitle()}
                </ContentTitleBox>
                <ContentBox>
                    {currentTab?.renderContent()}
                </ContentBox>

            </ContentContainerBox>
        </TabsContainerBox>
    );

})