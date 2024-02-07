import Template from './shared/template';
import Header from './components/header/Header';
import Recipes from './components/recipes/Recipes';
import HeaderMobile from './components/header-mobile/HeaderMobile';
import Notifications from './components/notifications/Notifications';

function App() {

    return (
        <>
            <Notifications/>
            <Template>

                <HeaderMobile />

                <Header/>

                <Recipes/>

            </Template>
        </>
    );
}

export default App;

