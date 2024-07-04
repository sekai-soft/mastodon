import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import { openModal } from 'mastodon/actions/modal';
import { fetchServer } from 'mastodon/actions/server';
import { Avatar } from 'mastodon/components/avatar';
import { Icon } from 'mastodon/components/icon';
import { WordmarkLogo, SymbolLogo } from 'mastodon/components/logo';
import { registrationsOpen, me, sso_redirect } from 'mastodon/initial_state';

import { shouldShowNavPanel } from '../../../is_mobile';

const Account = connect(state => ({
  account: state.getIn(['accounts', me]),
}))(({ account }) => (
  <Link to={`/@${account.get('acct')}`} title={account.get('acct')}>
    <Avatar account={account} size={35} />
  </Link>
));

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

const messages = defineMessages({
  search: { id: 'navigation_bar.search', defaultMessage: 'Search' },
});

const mapStateToProps = (state) => ({
  signupUrl: state.getIn(['server', 'server', 'registrations', 'url'], null) || '/auth/sign_up',
});

const mapDispatchToProps = (dispatch) => ({
  openClosedRegistrationsModal() {
    dispatch(openModal({ modalType: 'CLOSED_REGISTRATIONS' }));
  },
  dispatchServer() {
    dispatch(fetchServer());
  }
});

class Header extends PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    openClosedRegistrationsModal: PropTypes.func,
    location: PropTypes.object,
    signupUrl: PropTypes.string.isRequired,
    dispatchServer: PropTypes.func,
    intl: PropTypes.object.isRequired,
    isNavPanelOpen: PropTypes.bool.isRequired,
    toggleNavPanel: PropTypes.func.isRequired,
  };

  componentDidMount () {
    const { dispatchServer } = this.props;
    dispatchServer();
  }

  render () {
    const { signedIn } = this.context.identity;
    const { location, openClosedRegistrationsModal, signupUrl, intl, isNavPanelOpen, toggleNavPanel } = this.props;

    let content;

    if (signedIn) {
      content = (
        <>
          {location.pathname !== '/search' && <Link to='/search' className='button button-secondary' aria-label={intl.formatMessage(messages.search)}><Icon id='search' /></Link>}
          {location.pathname !== '/publish' && <Link to='/publish' className='button button-secondary'><FormattedMessage id='compose_form.publish_form' defaultMessage='New post' /></Link>}
          <Account />
        </>
      );
    } else {

      if (sso_redirect) {
        content = (
            <a href={sso_redirect} data-method='post' className='button button--block button-tertiary'><FormattedMessage id='sign_in_banner.sso_redirect' defaultMessage='Login or Register' /></a>
        )
      } else {
        let signupButton;

        if (registrationsOpen) {
          signupButton = (
            <a href={signupUrl} className='button'>
              <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' />
            </a>
          );
        } else {
          signupButton = (
            <button className='button' onClick={openClosedRegistrationsModal}>
              <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' />
            </button>
          );
        }

        content = (
          <>
            {signupButton}
            <a href='/auth/sign_in' className='button button-tertiary'><FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Login' /></a>
          </>
        );
      }
    }

    return (
      <div className='ui__header'>
        <Link to='/' className='ui__header__logo'>
          <WordmarkLogo />
          <SymbolLogo />
        </Link>

        <div className='ui__header__links'>
          {content}
          {navPanelToggle(isNavPanelOpen, toggleNavPanel)}
        </div>
      </div>
    );
  }

}

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Header)));
