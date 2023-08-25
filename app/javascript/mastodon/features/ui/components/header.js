import React from 'react';
import Logo from 'mastodon/components/logo';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { registrationsOpen, me } from 'mastodon/initial_state';
import Avatar from 'mastodon/components/avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openModal } from 'mastodon/actions/modal';
import { shouldShowNavPanel } from '../../../is_mobile';

const Account = connect(state => ({
  account: state.getIn(['accounts', me]),
}))(({ account }) => (
  <Link to={`/@${account.get('acct')}`} title={account.get('acct')}>
    <Avatar account={account} size={35} />
  </Link>
));

const mapDispatchToProps = (dispatch) => ({
  openClosedRegistrationsModal() {
    dispatch(openModal('CLOSED_REGISTRATIONS'));
  },
});

const navPanelToggle = (isNavPanelOpen, toggleNavPanel) => {
  if (shouldShowNavPanel()) {
    return null;
  }
  return (
    <div style={{ width: '32px' }} onClick={toggleNavPanel} onKeyPress={toggleNavPanel} role='button' tabIndex={0}>
      <div style={{ width: '50%', margin: '0 auto' }}>
        {isNavPanelOpen ? <i className='fa fa-times' /> : <i className='fa fa-bars' />}
      </div>
    </div>
  );
};

export default @withRouter
@connect(null, mapDispatchToProps)
class Header extends React.PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    openClosedRegistrationsModal: PropTypes.func,
    location: PropTypes.object,
    isNavPanelOpen: PropTypes.bool.isRequired,
    toggleNavPanel: PropTypes.func.isRequired,
  };

  render () {
    const { signedIn } = this.context.identity;
    const { location, openClosedRegistrationsModal, isNavPanelOpen, toggleNavPanel } = this.props;

    let content;

    if (signedIn) {
      content = (
        <>
          {location.pathname !== '/publish' && <Link to='/publish' className='button'><FormattedMessage id='compose_form.publish_form' defaultMessage='Publish' /></Link>}
          <Account />
        </>
      );
    } else {
      let signupButton;

      if (registrationsOpen) {
        signupButton = (
          <a href='/auth/sign_up' className='button button-tertiary'>
            <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' />
          </a>
        );
      } else {
        signupButton = (
          <button className='button button-tertiary' onClick={openClosedRegistrationsModal}>
            <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' />
          </button>
        );
      }

      content = (
        <>
          <a href='/auth/sign_in' className='button'><FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Sign in' /></a>
          {signupButton}
        </>
      );
    }

    return (
      <div className='ui__header'>
        <Link to='/' className='ui__header__logo'><Logo /></Link>

        <div className='ui__header__links'>
          {content}
          {navPanelToggle(isNavPanelOpen, toggleNavPanel)}
        </div>
      </div>
    );
  }

}
