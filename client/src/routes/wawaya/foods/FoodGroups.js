// import React, { useState, Fragment } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Outlet, useNavigate } from 'react-router-dom';

// // Components
// import Container from '../../../components/layout/Container';
// import Tabs from '../../../components/layout/Tabs';
// import Preloader from '../../../components/layout/Preloader';
// import Button from '../../../components/layout/Button';
// import FoodgroupItem from '../../../components/foodgroups/FoodGroupItem';
// import CompanyItem from '../companies/CompanyItem';

// // Icons
// import PlusIcon from '../../../components/icons/PlusIcon';

// // Actions
// import { getCompany } from '../../../actions/companies';
// import { getFoodgroups } from '../../../actions/menus';
// /*
//   =====
//   Props
//   =====
//   @name       companies
//   @type       object
//   @desc       App level companies state
//   @required   true

//   @name       foodgroups
//   @type       object
//   @desc       App level foodgroups state
//   @required   true

//   @name       getFoodgroups
//   @type       function
//   @desc       Redux action from foodgroups.js to populate foodgroups inside the app level state of foodgroups
//   @required   true

//   @name       getCompany
//   @type       function
//   @desc       Redux action from companies.js to set company in companies app level state
//   @required   true
// */
// const Foodgroups = ({
//   companies: { company, companies, companiesLoading },
//   foodgroups: { foodgroupsLoading, foodgroups },
//   getFoodgroups,
//   getCompany,
// }) => {
//   const [currentTabIndex, setCurrentTabIndex] = useState(0);
//   const onClickCompanyListItem = async companyId => {
//     // set back to 0 so that can navigate to next tab
//     setCurrentTabIndex(0);

//     const getCompanySuccess = await getCompany(companyId);
//     const getFoodgroupsSuccess = await getFoodgroups(companyId);

//     if (getCompanySuccess && getFoodgroupsSuccess) {
//       setCurrentTabIndex(1);
//     }
//   };

//   const companyList = companiesLoading ? (
//     <Preloader />
//   ) : companies.length > 0 ? (
//     <Fragment>
//       {companies.map((company, index) => (
//         <CompanyItem
//           key={company._id}
//           index={index + 1}
//           company={company}
//           onClickCompanyItem={() => onClickCompanyListItem(company._id)}
//         />
//       ))}
//     </Fragment>
//   ) : (
//     <p className='caption text-center'>No companies found</p>
//   );

//   const navigate = useNavigate();

//   const foodgroupsList = company ? (
//     <Fragment>
//       <header className='list-wrapper-header'>
//         <h2 className='list-wrapper-header-title'>{company.displayedName}</h2>
//         <Button
//           additionalClasses={'list-wrapper-header-btn'}
//           btnStyle={'contained'}
//           type={'primary'}
//           text={'food group'}
//           icon={<PlusIcon />}
//           leadingIcon={true}
//           onClick={() => navigate(`add`)}
//         />
//       </header>

//       <main className='list-wrapper-content'>
//         {foodgroupsLoading ? (
//           <Preloader />
//         ) : foodgroups.length > 0 ? (
//           foodgroups.map(foodgroup => (
//             <FoodgroupItem key={foodgroup._id} foodgroup={foodgroup} />
//           ))
//         ) : (
//           <p className='caption text-center'>No food group found</p>
//         )}
//       </main>
//     </Fragment>
//   ) : (
//     <p className='caption text-center'>Please select a company first</p>
//   );

//   const tabs = [
//     {
//       name: 'Companies',
//       content: companyList,
//     },
//     {
//       name: 'Foodgroups',
//       content: foodgroupsList,
//       class: 'list-wrapper',
//     },
//   ];

//   return (
//     <Container
//       parentContent={<Tabs tabs={tabs} currentTabIndex={currentTabIndex} />}
//       childClass={'info-wrapper'}
//       childContent={<Outlet />}
//       parentSize={1}
//       childSize={1}
//     />
//   );
// };

// Foodgroups.propTypes = {
//   companies: PropTypes.object.isRequired,
//   foodgroups: PropTypes.object.isRequired,
//   getFoodgroups: PropTypes.func.isRequired,
//   getCompany: PropTypes.func.isRequired,
// };

// const mapStateToProps = state => ({
//   companies: state.companies,
//   foodgroups: state.foodgroups,
// });

// const mapDispatchToProps = {
//   getFoodgroups,
//   getCompany,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Foodgroups);
