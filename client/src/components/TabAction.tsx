import { ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface TabActionI {
  children: ReactNode;
  id?: string;
}
const TabAction: FC<TabActionI> = ({ children, id }) => {
  const domReady = useMemo(() => {
    return document.getElementById(id);
  }, [id]);

  return domReady ? <div className="create_portal_tab">{createPortal(children, domReady as HTMLElement)}</div> : null;
};
TabAction.defaultProps = { id: 'tab-action' };
export default TabAction;
