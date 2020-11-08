import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import ListPreloader from '../../../components/preloaders/ListPreloader';
import Button from '../../../components/layout/Button';
import TableItem from '../../../components/tables/TableItem';
import SearchInput from '../../../components/layout/SearchInput';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getTables } from '../../../actions/tables';

const CompanyTables = ({
  userCompanyId,
  tables: { tables, tablesLoading },
  getTables,
}) => {
  useEffect(() => {
    getTables(userCompanyId);

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
            {tablesLoading || !Array.isArray(tables) ? (
              <ListPreloader />
            ) : tables.length > 0 ? (
              <Fragment>
                <header className='list-header'>
                  <div className='list-header-right-content'>
                    <SearchInput
                      name='search'
                      queryFields={['name']}
                      array={tables}
                      onSearch={onSearch}
                    />
                  </div>
                </header>
                {filteredResults.map((table, index) => (
                  <TableItem key={table._id} index={index + 1} table={table} />
                ))}
              </Fragment>
            ) : (
              <p className='caption text-center'>No tables found</p>
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

CompanyTables.propTypes = {
  userCompanyId: PropTypes.string.isRequired,
  tables: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  tables: state.tables,
});

const mapDispatchToProps = {
  getTables,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTables);
