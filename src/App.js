import React, { lazy, Suspense, Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryTable from "./components/InventoryTable";
import ReturnTable from "./components/ReturnItem";
import FirstPage from "./components/first-page";
import Allotted from "./components/allotted";




// Lazy-loaded components
const LoginPage = lazy(() => import('./components/adminloginPage')); // Weaponwise login page
const DefmaLoginPage = lazy(() => import('./components/adminloginPage1')); // Defma login page
const HomePage = lazy(() => import('./components/HomePage'));
const HomePage1 = lazy(() => import('./components/HomePage1'));
const DayFormComponent = lazy(() => import('./components/DayFormComponent'));
const CleanFormComponent = lazy(() => import('./components/CleanFormComponent'));
const IssuedItemsTable = lazy(() => import('./components/IssuedItemsTable'));
const RequestForm = lazy(() => import('./components/defmaRequestForm'));
const MonitorDefma = lazy(() => import('./components/monitorDefma'));


// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
// const Layout = ({ children }) => (
//   <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//     {children}
//   </div>
// );

const App = () => {
  return (
    <Router>
      
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<FirstPage />} />
            <Route path="/weaponwise-login" element={<LoginPage />} />
            <Route path="/defma-login" element={<DefmaLoginPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/homepage1" element={<HomePage1 />} />
            <Route path="/defmaRequestForm" element={<RequestForm />} />
            <Route path="/issued-items" element={<IssuedItemsTable />} />
            <Route path="/day-form" element={<DayFormComponent />} />
            <Route path="/clean-form" element={<CleanFormComponent />} />
            <Route path="/return-table" element={<ReturnTable />} />
            <Route path="/check-inventory" element={<InventoryTable />} />
            <Route path="/allotted" element={<Allotted />} />
            <Route path="/monitor" element={<MonitorDefma />} />

          </Routes>
        </Suspense>
      </ErrorBoundary>
      
    </Router>
  );
};

export default App;