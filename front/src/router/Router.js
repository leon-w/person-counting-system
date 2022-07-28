import Home from '../pages/home/Home';
import Admin from '../pages/admin/Admin';
import Statistics from '../pages/statistics/Statistics';
import Settings from '../pages/settings/Settings';
import App from '../App';
import { RequireAuth, AuthProvider } from '../auth/auth';
import {
  Route,
  Routes,
  HashRouter
} from "react-router-dom";
import Login from '../components/Login/Login';
import EntranceScreen from '../pages/entrance-screen/EntranceScreen';
import ErrorPage from '../pages/error/ErrorPage';

function Router(){

    return (
    <AuthProvider>
        <HashRouter>
            <App></App>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route exact path="login" element={<Login/>}/>
                <Route exact path="entrance-screen" element={ <RequireAuth><EntranceScreen/></RequireAuth> }/>
                <Route exact path="admin" element={ <RequireAuth><Admin /></RequireAuth> }/>
                <Route exact path="statistics" element={<RequireAuth><Statistics /></RequireAuth>}/>
                <Route exact path="settings" element={<RequireAuth><Settings /></RequireAuth>}/>
                <Route exact path="error" element={<ErrorPage></ErrorPage>} />
            </Routes>
        </HashRouter>
    </AuthProvider>
    
    );
}

export default Router;