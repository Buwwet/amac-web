import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ListaVacantes from "./pages/ListaVacantes";

export default function App() {

    return <>
        <a class="saltar-contenido" href="#principal">Saltar al contenido</a>
        <Header/>
            <main className='main-content'>
            <Routes>
                <Route path="" element={<ListaVacantes/>}/>
            </Routes>
            </main>
        <Footer/>
    </>
}