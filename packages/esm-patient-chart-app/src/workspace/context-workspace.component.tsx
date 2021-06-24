import React from 'react';
import ArrowRight16 from '@carbon/icons-react/es/arrow--right/16';
import Maximize16 from '@carbon/icons-react/es/maximize/16';
import Minimize16 from '@carbon/icons-react/es/minimize/16';
import styles from './context-workspace.scss';
import { ExtensionSlot, LayoutType, useLayoutType } from '@openmrs/esm-framework';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBodyScrollLock } from '@openmrs/esm-patient-common-lib';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName } from 'carbon-components-react/es/components/UIShell';
import { useWorkspace } from '../hooks/useWorkspace';
import { patientChartWorkspaceSlot } from '../constants';
import { isDesktop } from '../utils';
interface ContextWorkspaceParams {
  patientUuid: string;
}

type WindowState = 'maximize' | 'normal' | 'collapsed';
type ActionTypes = 'minimize' | 'maximize' | 'collapse';

interface WindowStatus {
  maximize: boolean;
  normal: boolean;
  collapsed: boolean;
}

const reducer = (state: WindowState, action: ActionTypes) => {
  switch (action) {
    case 'maximize':
      return (state = 'maximize');
    case 'minimize':
      return (state = 'normal');
    case 'collapse':
      return (state = 'collapsed');
  }
};

const ContextWorkspace: React.FC<RouteComponentProps<ContextWorkspaceParams>> = ({ match }) => {
  const layout = useLayoutType();
  const { patientUuid } = match.params;
  const { active, title, closeWorkspace } = useWorkspace();
  const { t } = useTranslation();
  const isTablet = layout === 'tablet';
  const [windowState, updateWindowState] = React.useReducer(reducer, 'normal');
  const props = React.useMemo(
    () => ({ closeWorkspace, patientUuid, isTablet }),
    [closeWorkspace, isTablet, patientUuid],
  );

  const Icon = windowState === 'maximize' ? Minimize16 : Maximize16;

  const windowStateStyles = () => {
    if (windowState === 'maximize') return styles.maximized;
    if (windowState === 'collapsed') return styles.hide;
  };

  useBodyScrollLock(active && !isDesktop(layout));

  return (
    <aside
      className={`${styles.contextWorkspaceContainer} ${windowStateStyles()} ${active ? styles.show : styles.hide}`}
      style={{ display: windowState === 'collapsed' && !active && 'none' }}>
      <Header aria-label={title} style={{ position: 'sticky' }}>
        <HeaderName prefix="">{title}</HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            onClick={() => {
              windowState === 'maximize' ? updateWindowState('minimize') : updateWindowState('maximize');
            }}
            aria-label={t('maximize', 'Maximize')}
            title={t('maximize', 'Maximize')}>
            <Icon />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label={t('collapse', 'Collapse')}
            title={t('collapse', 'Collapse')}
            onClick={() => updateWindowState('collapse')}>
            <ArrowRight16 />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <ExtensionSlot extensionSlotName={patientChartWorkspaceSlot} state={props} />
    </aside>
  );
};

export default ContextWorkspace;
