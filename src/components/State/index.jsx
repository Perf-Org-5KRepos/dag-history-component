import React, { PropTypes } from 'react';
import ItemInfo from '../ItemInfo';
import { colors } from '../../palette';
import EmptyBookmark from 'react-icons/lib/fa/bookmark-o';
import Bookmark from 'react-icons/lib/fa/bookmark';

const coloring = {
  current: {
    active: colors.CURRENT_ACTIVE,
    nonactive: colors.CURRENT,
  },
  legacy: {
    active: colors.LEGACY_ACTIVE,
    nonactive: colors.ANCESTOR,
  },
};
const DO_NOTHING = () => ({});

const State = ({
  label,
  branchType,
  active,
  continuationActive,
  renderBookmarks,
  bookmarked,
  continuation,
  onClick,
  onContinuationClick,
  onBookmarkClick,
}) => {
  const backgroundColor = coloring[branchType][active ? 'active' : 'nonactive'];
  let bookmark = null;
  if (renderBookmarks) {
    bookmark = bookmarked ?
      <Bookmark color="gold" onClick={onBookmarkClick || DO_NOTHING} /> :
      <EmptyBookmark onClick={onBookmarkClick || DO_NOTHING} />;
  }
  return (
    <div className="history-state" style={{ backgroundColor }} onClick={onClick || DO_NOTHING}>
      <ItemInfo
        label={label}
        continuation={continuation}
        onContinuationClick={onContinuationClick || DO_NOTHING}
        active={active}
        continuationActive={continuationActive}
      />
      {bookmark}
    </div>
  );
};

State.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  continuationActive: PropTypes.bool,
  bookmarked: PropTypes.bool,
  renderBookmarks: PropTypes.bool,
  branchType: PropTypes.oneOf(['current', 'legacy']).isRequired,
  continuation: PropTypes.shape({
    numContinuations: PropTypes.number,
    isSelected: PropTypes.bool,
  }).isRequired,
  onBookmarkClick: PropTypes.func,
  onClick: PropTypes.func,
  onContinuationClick: PropTypes.func,
};

export default State;
