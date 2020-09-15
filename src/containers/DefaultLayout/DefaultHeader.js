import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, UncontrolledDropdown } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/ERI_horizontal_RGB.png';
import sygnet from '../../assets/img/brand/ECON_RGB.svg';

import Ericsson from '../../assets/img/brand/ECON_RGB.svg'
import ECON from '../../assets/img/brand/ECON-Full.svg'
import ECONnonB from '../../assets/img/brand/ECON-nonBold.svg'
import { connect } from 'react-redux';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: this.props.dataLogin._id,
      userName: this.props.dataLogin.nameUser,
      userEmail: this.props.dataLogin.email,
      tokenUser: this.props.dataLogin.token,
      vendor_name : this.props.dataLogin.vendor_name,
      vendor_code : this.props.dataLogin.vendor_code,
      order_created : [],
      rtd : [],
      userRole: this.props.dataLogin.role,
    }

  }
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width:142, height: 30, alt: 'Ericsson Logo'}}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Ericsson Logo' }}
        />

        <Nav className="ml-auto" navbar>
          {/* <AppHeaderDropdown direction="down">
            <DropdownToggle nav style={{marginRight:'30px' }}>
              <NavLink to="#" className="nav-link">User</NavLink>
              <NavLink to="#" className="nav-link">{this.state.userName.toUpperCase()}</NavLink>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown> */}
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <div style={{marginRight:'30px' }}>
              <b>{this.props.dataLogin.nameUser.toUpperCase()}</b>
              </div>              
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = (state) => {
  return {
    dataLogin : state.loginData,
    SidebarMinimize : state.minimizeSidebar
  }
}

export default connect(mapStateToProps)(DefaultHeader);
