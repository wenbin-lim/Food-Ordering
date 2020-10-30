import React, { useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import Tabs from '../../../components/layout/Tabs';
import ListPreloader from '../../../components/preloaders/ListPreloader';
import Button from '../../../components/layout/Button';
import CompanyItem from '../companies/CompanyItem';
import TableItem from '../../../components/tables/TableItem';
import SearchInput from '../../../components/layout/SearchInput';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getCompany } from '../../../actions/companies';
import { getTables } from '../../../actions/tables';

const Tables = ({
  companies: { companiesLoading, companies, requesting, company },
  tables: { tablesLoading, tables },
  getTables,
  getCompany,
}) => {
  const onClickCompanyItem = companyId => {
    tabsRef.current.changeTab(1);
    getCompany(companyId);
    getTables(companyId);
  };

  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const onSearchCompanies = filteredResult =>
    setFilteredCompanies(filteredResult);

  const [filteredTables, setFilteredTables] = useState([]);
  const onSearchTables = filteredResult => setFilteredTables(filteredResult);

  const companyList =
    companiesLoading || !Array.isArray(companies) ? (
      <ListPreloader />
    ) : companies.length > 0 ? (
      <article className='list p-0'>
        <header className='list-header'>
          <div className='list-header-right-content'>
            <SearchInput
              name='search'
              queryFields={['name']}
              array={companies}
              onSearch={onSearchCompanies}
            />
          </div>
        </header>
        {filteredCompanies.map((company, index) => (
          <CompanyItem
            key={company._id}
            index={index + 1}
            company={company}
            onClick={() => onClickCompanyItem(company._id)}
          />
        ))}
      </article>
    ) : (
      <p className='caption text-center'>No companies found</p>
    );

  const navigate = useNavigate();

  const tablesList = company ? (
    <Fragment>
      <Button
        classes={'list-add-btn'}
        fill={'contained'}
        type={'primary'}
        icon={<PlusIcon />}
        onClick={() => navigate('add')}
      />

      <article className='list p-0'>
        {tablesLoading || !Array.isArray(tables) ? (
          <ListPreloader />
        ) : tables.length > 0 ? (
          <Fragment>
            <header className='list-header'>
              <h3 className='list-header-left-content heading-3'>
                {!requesting && company.displayedName}
              </h3>
              <div className='list-header-right-content'>
                <SearchInput
                  name='search'
                  queryFields={['name']}
                  array={tables}
                  onSearch={onSearchTables}
                />
              </div>
            </header>
            {filteredTables.map((table, index) => (
              <TableItem key={table._id} index={index + 1} table={table} />
            ))}
          </Fragment>
        ) : (
          <p className='caption text-center'>No tables found</p>
        )}
      </article>
    </Fragment>
  ) : (
    <p className='caption text-center'>Please select a company first</p>
  );

  const tabsRef = useRef(null);

  const tabs = [
    {
      name: 'Companies',
      content: companyList,
      class: 'list-wrapper',
    },
    {
      name: 'Tables',
      content: tablesList,
      class: 'list-wrapper',
    },
  ];

  return (
    <Container
      parentClass={'tabs-wrapper'}
      parentContent={<Tabs wrapper={false} ref={tabsRef} tabs={tabs} />}
      childClass={'sidesheet'}
      childContent={<Outlet />}
      parentSize={1}
      childSize={1}
    />
  );
};

Tables.propTypes = {
  companies: PropTypes.object.isRequired,
  tables: PropTypes.object.isRequired,
  getTables: PropTypes.func.isRequired,
  getCompany: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  companies: state.companies,
  tables: state.tables,
});

const mapDispatchToProps = {
  getTables,
  getCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
