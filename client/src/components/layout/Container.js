import React from 'react';
import PropTypes from 'prop-types';

/* 
  =====
  Props
  =====
  @name       parentContent
  @type       jsx or string
  @desc       parent jsx content 
  @required   true
  
  @name       childContent
  @type       jsx or string
  @desc       child jsx content, used for router outlet
  @required   false

  @name       parentSize
  @type       number
  @desc       defines the flex size of the parent content, used for landscape mode only
  @required   false

  @name       childSize
  @type       number
  @desc       defines the flex size of the child content, used for landscape mode only
  @required   false

  @name       parentStyle
  @type       css style object
  @desc       additional styles for parent 
  @required   false

  @name       childStyle
  @type       css style object
  @desc       additional styles for child 
  @required   false
*/
const Container = ({
  parentContent,
  childContent,
  parentSize,
  childSize,
  parentClass,
  childClass,
  parentStyle,
  childStyle,
}) => {
  return (
    <main className='container'>
      <section
        className={`parent ${parentClass ? parentClass : ''}`.trim()}
        style={{ ...parentStyle, flex: parentSize || 1 }}
      >
        {parentContent}
      </section>
      <section
        className={`child ${childClass ? childClass : ''}`.trim()}
        style={{ ...childStyle, flexGrow: childSize || 1 }}
      >
        {childContent}
      </section>
    </main>
  );
};

Container.propTypes = {
  parentContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  childContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  parentSize: PropTypes.number,
  childSize: PropTypes.number,
  parentStyle: PropTypes.object,
  childStyle: PropTypes.object,
};

export default Container;
