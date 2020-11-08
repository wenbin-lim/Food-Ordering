import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import ListPreloader from '../../../components/preloaders/ListPreloader';
import Button from '../../../components/layout/Button';
import UserItem from '../../../components/users/UserItem';
import SearchInput from '../../../components/layout/SearchInput';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getUsers } from '../../../actions/users';

const CompanyUsers = ({
  userCompanyId,
  users: { users, usersLoading },
  getUsers,
}) => {
  useEffect(() => {
    getUsers(userCompanyId);

    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const [filteredResults, setFilteredResults] = useState([]);
  const onSearch = filteredResult => setFilteredResults(filteredResult);

  return (
    <Container
      parentClass={'list-wrapper'}
      parentContent={
        <Fragment>
          <Button
            classes={'list-add-btn'}
            fill={'contained'}
            type={'primary'}
            icon={<PlusIcon />}
            onClick={() => navigate('add')}
          />

          <article className='list'>
            {usersLoading || !Array.isArray(users) ? (
              <ListPreloader />
            ) : users.length > 0 ? (
              <Fragment>
                <header className='list-header'>
                  <div className='list-header-right-content'>
                    <SearchInput
                      name='search'
                      queryFields={['name']}
                      array={users}
                      onSearch={onSearch}
                    />
                  </div>
                </header>
                {filteredResults.map(user => (
                  <UserItem key={user._id} user={user} />
                ))}
              </Fragment>
            ) : (
              <p className='caption text-center'>No users found</p>
            )}
          </article>
        </Fragment>
      }
      childClass={'sidesheet'}
      childContent={<Outlet />}
      parentSize={3}
      childSize={2}
    />
  );
};

CompanyUsers.propTypes = {
  userCompanyId: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = {
  getUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyUsers);
