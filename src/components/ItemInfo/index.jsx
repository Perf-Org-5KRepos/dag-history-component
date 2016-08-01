
import React, { PropTypes } from 'react';
require('./ItemInfo.sass');
require('./ContextMenu.sass');
import Continuation from '../Continuation';
import { ContextMenu, MenuItem, ContextMenuLayer } from 'react-contextmenu';
import { ItemLabel } from './ItemLabel';
import { colors } from '../../palette';

const ItemInfoContextMenu = ({ itemKey, onRenameClick }) => (
  <ContextMenu identifier={itemKey}>
    <MenuItem onClick={onRenameClick}>Rename</MenuItem>
  </ContextMenu>
);
ItemInfoContextMenu.propTypes = {
  itemKey: PropTypes.string,
  onRenameClick: PropTypes.func,
};

const DO_NOTHING = () => ({});

class ItemInfo extends React.Component {
  constructor() {
    super();
    this.state = { renaming: false };
  }

  render() {
    const {
      continuation,
      label,
      onClick,
      onContinuationClick,
      active,
      editable,
      onLabelChange,
      itemKey,
    } = this.props;
    const {
      renaming,
    } = this.state;

    const handleLabelChange = (...args) => {
      this.setState({ renaming: false });
      onLabelChange(...args);
    };

    let ContextualItemLabel;
    if (editable) {
      ContextualItemLabel = ContextMenuLayer(itemKey)(ItemLabel); // eslint-disable-line
    }

    let continuationColor = colors.CONT_BLANK;
    if (active) {
      continuationColor = colors.CONT_ACTIVE;
    }

    const renderedContinuation = continuation ? (
      <Continuation
        numContinuations={continuation.numContinuations}
        color={continuationColor}
        onClick={onContinuationClick || DO_NOTHING}
      />
    ) : null;

    return (
      <div className="history-item-info" onClick={onClick || DO_NOTHING}>
        {renderedContinuation}
        {
          editable ? (
            <div className="item-info-context-menu-container">
              <ContextualItemLabel
                {...{
                  label,
                  active,
                  renaming,
                  onChange: handleLabelChange,
                  onStopEditing: () => this.setState({ renaming: false }),
                }}
              />
              <ItemInfoContextMenu
                itemKey={itemKey}
                onRenameClick={() => this.setState({ renaming: true })}
              />
            </div>
          ) :
            <ItemLabel {...{ label, active }} />
        }
      </div>
    );
  }
}
ItemInfo.propTypes = {
  itemKey: PropTypes.string,
  label: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  continuation: PropTypes.shape({
    numContinuations: PropTypes.number,
    isSelected: PropTypes.bool,
  }),
  onClick: PropTypes.func,
  onContinuationClick: PropTypes.func,
  onLabelChange: PropTypes.func,
  active: PropTypes.bool,
};

export default ItemInfo;