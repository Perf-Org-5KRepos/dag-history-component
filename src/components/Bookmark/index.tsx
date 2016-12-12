import * as React from "react";
import * as classnames from "classnames";
import './Bookmark.scss';
import EditBookmark from './EditBookmark';
import StatePager from '../StatePager';
import { determineCommitPathLength, determineHighlight } from '../provenance';
const { PropTypes } = React;

export interface IBookmarkProps {
  name: string;
  onClick?: Function;
  active?: boolean;
  draggable?: boolean;
  onDragStart?: React.EventHandler<React.DragEvent<HTMLDivElement>>;
  onDragEnd?: React.EventHandler<React.DragEvent<HTMLDivElement>>;
  index: number;
  numLeadInStates?: number;
  annotation: string;
  onBookmarkChange?: Function;
  shortestCommitPath?: number[];
  selectedDepth?: number;
}

export interface IBookmarkState {
  editMode: boolean;
  focusOn?: string;
}

class Bookmark extends React.Component<IBookmarkProps, IBookmarkState> {
  public static propTypes = {
    index: PropTypes.number,
    name: PropTypes.string.isRequired,
    annotation: PropTypes.string.isRequired,
    numLeadInStates: PropTypes.number,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    onBookmarkChange: PropTypes.func,
    draggable: PropTypes.bool,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    shortestCommitPath: PropTypes.arrayOf(PropTypes.number),
    selectedDepth: PropTypes.number,
  };

  public static defaultProps = {
    shortestCommitPath: [],
  }

  constructor() {
    super();
    this.state = { editMode: false };
  }

  onClickEdit(focusOn) {
    this.setState({ editMode: true, focusOn });
  }

  onDoneEditing() {
    this.setState({ editMode: false });
  }

  onBookmarkChangeDone(payload) {
    if (this.props.onBookmarkChange) {
      this.props.onBookmarkChange(payload);
    }
  }

  private get commitPathLength() {
    const {
      shortestCommitPath,
      numLeadInStates,
    } = this.props;
    return determineCommitPathLength(shortestCommitPath.length, numLeadInStates);
  }

  private get highlight() {
    const {
      selectedDepth,
      shortestCommitPath,
      numLeadInStates,
      active,
    } = this.props;
    return determineHighlight(selectedDepth, shortestCommitPath.length, numLeadInStates, active);
  }

  render() {
    const {
      name,
      onClick,
      active,
      draggable,
      onDragStart,
      onDragEnd,
      index,
      annotation,
      onBookmarkChange,
      shortestCommitPath,
      selectedDepth,
      numLeadInStates,
    } = this.props;
    const {
      editMode,
      focusOn,
    } = this.state;
    const { highlight } = this;

    return editMode ? (
      <EditBookmark
        {...this.props}
        commitPathLength={this.commitPathLength}
        selectedDepth={highlight}
        focusOn={focusOn}
        onDoneEditing={() => this.onDoneEditing()}
        onBookmarkChange={p => this.onBookmarkChangeDone(p)}
        />
    ) : (
        <div
          className={`history-bookmark ${active ? 'selected' : ''}`}
          onClick={onClick ? () => onClick() : undefined}
          draggable={draggable}
          onDragStart={e => onDragStart ? onDragStart(e) : undefined}
          onDragEnd={e => onDragEnd ? onDragEnd(e) : undefined}
          data-index={index}
          >
          <div className="bookmark-details-container">
            <div className="bookmark-details">
              <div
                className={classnames('bookmark-title', { active })}
                onClick={() => this.onClickEdit('title')}
                >
                {name}
              </div>
              <div
                className="bookmark-annotation"
                onClick={() => this.onClickEdit('annotation')}
                >
                {annotation}
              </div>
            </div>
            <StatePager
              depth={this.commitPathLength}
              highlight={highlight}
              />
          </div>
        </div>
      );
  }
}

export default Bookmark;
