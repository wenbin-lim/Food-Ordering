import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import ListPreloader from '../../../components/preloaders/ListPreloader';
import Button from '../../../components/layout/Button';
import MenuItem from '../../../components/menus/MenuItem';
import SearchInput from '../../../components/layout/SearchInput';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getMenus } from '../../../actions/menus';

const CompanyMenus = ({
  userCompanyId,
  menus: { menus, menusLoading },
  getMenus,
}) => {
  useEffect(() => {
    getMenus(userCompanyId);

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
            {menusLoading || !Array.isArray(menus) ? (
              <ListPreloader />
            ) : menus.length > 0 ? (
              <Fragment>
                <header className='list-header'>
                  <div className='list-header-right-content'>
                    <SearchInput
                      name='search'
                      queryFields={['name']}
                      array={menus}
                      onSearch={onSearch}
                    />
                  </div>
                </header>
                {filteredResults.map(menu => (
                  <MenuItem key={menu._id} menu={menu} />
                ))}
              </Fragment>
            ) : (
              <p className='caption text-center'>No menus found</p>
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

CompanyMenus.propTypes = {
  userCompanyId: PropTypes.string.isRequired,
  menus: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  menus: state.menus,
});

const mapDispatchToProps = {
  getMenus,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyMenus);
