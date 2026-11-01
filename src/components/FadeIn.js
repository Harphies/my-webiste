import React from 'react';
import PropTypes from 'prop-types';

class FadeIn extends React.Component {
  constructor(props) {
    super(props);
    this.fadeInWord = React.createRef();
    this.state = {
      wrapHeight: '',
      hasStyleInfo: false
    };
  }

  componentDidMount() {
    const wrapHeight = this.fadeInWord.current.getBoundingClientRect().height + 10;
    this.setState({
      hasStyleInfo: true,
      wrapHeight: wrapHeight
    });
  }

  render() {
    const {children, className:compClass = '', style} = this.props;
    const {wrapHeight, hasStyleInfo} = this.state;
    let transformStyle = {};
    if (wrapHeight) {
      transformStyle = {
        top: `${wrapHeight}px`
      }
    }
    const classForFadeinWord = compClass + (hasStyleInfo ? '' :' op0 ') + (hasStyleInfo ? ' keyFrameAnimator' : '');
    return (
      <div className={'padT10 textcenter inline oh fadeInWrap ' + (hasStyleInfo ? '' :' op0')}>
        <div ref={this.fadeInWord} className={'fadeInWord ' + classForFadeinWord } style={{...transformStyle, ...style}}>
          {children}
        </div>
      </div>
    );
  }
}

FadeIn.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
};

export default FadeIn;