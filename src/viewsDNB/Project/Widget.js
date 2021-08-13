import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Col, Progress, Row } from 'reactstrap';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  smallText: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  variant: PropTypes.string,
  imageSource: PropTypes.string
};

const defaultProps = {
  header: '89.9%',
  mainText: 'Lorem ipsum...',
  smallText: 'Lorem ipsum dolor sit amet enim.',
  // color: '',
  value: '25',
  variant: '',
  imageSource: '../../assets/icon/dashboard/order-received.png',
  alt: 'Warehouse status'
};

class Widget extends Component {
  render() {
    const { className, cssModule, header, mainText, smallText, color, value, children, variant, imageSource, alt, ...attributes } = this.props;

    // demo purposes only
    const progress = { style: '', color: color, value: value };
    const card = { style: '', bgColor: '' };

    if (variant === 'inverse') {
      progress.style = 'progress-white';
      progress.color = '';
      card.style = 'text-white';
      card.bgColor = 'bg-' + color;
    }

    const classes = mapToCssModules(classNames(className, card.style, card.bgColor), cssModule);
    progress.style = classNames('progress-xs my-3', progress.style);

    const verticalCenter = {
      padding: '0',
      display: 'flex',
      alignItems: 'center'
    }

    return (
      <Card className={classes} {...attributes}>
        <CardBody>
          <Row>
            <Col lg="3">
              <img src={imageSource} className="img-fluid" alt={alt} />
            </Col>
            <Col lg="9" style={verticalCenter}>
              <div>
                <div className="h4 m-0">{header}</div>
                <div>{mainText}</div>
              </div>
            </Col>
          </Row>
          <Progress className={progress.style} color={progress.color} value={progress.value} />
          <small className="text-muted">{smallText}</small>
          <div>{children}</div>
        </CardBody>
      </Card>
    );
  }
}

Widget.propTypes = propTypes;
Widget.defaultProps = defaultProps;

export default Widget;