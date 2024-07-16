import { AdminProvider } from './components/AdminContext'
import Login from './components/Login'
import Table from './components/Table'
import './index.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';


function App() {

  return (
    <AdminProvider>
      <BrowserRouter>
    <Routes>
      <Route path="/" Component={Login}/>
      <Route path="/table"
      Component={Table}/>
    </Routes>   
      </BrowserRouter>  
    </AdminProvider>  
  )
}

export default App
