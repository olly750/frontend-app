import React, { ReactElement, useState } from 'react';

import Panel, { PanelProps } from '../Atoms/custom/Panel';

type PanelChildrenType = ReactElement<PanelProps>[];

type IProps = {
  children: PanelChildrenType;
};

function Accordion({ children }: IProps) {
  const [activePanel, setActivePanel] = useState(-1);

  const handleOpen = (index: number) => {
    if (index === activePanel) setActivePanel(-1);
    else setActivePanel(index);
  };

  return (
    <div>
      {children.length > 0
        ? children.map((panel, i) => {
            const panelProps: PanelProps = panel.props;
            return (
              <Panel
                index={i}
                show={panel.props.show}
                bgColor={panelProps.bgColor}
                key={panel.props.title}
                active={activePanel === i}
                handleOpen={(i) => handleOpen(i)}
                title={panelProps.title}
                subtitle={panelProps.subtitle}
                className={panelProps.className}
                width={panelProps.width}
                badge={
                  panelProps.badge && {
                    type: panelProps.badge.type,
                    text: panelProps.badge.text,
                  }
                }>
                {panelProps.children}
              </Panel>
            );
          })
        : null}
    </div>
  );
}

export default Accordion;
