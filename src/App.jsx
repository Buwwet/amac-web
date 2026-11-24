import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ListaVacantes from "./pages/ListaVacantes";
import DetalleVacante from "./pages/DetalleVacante";
import Login from "./pages/Login";

export default function App() {

    return <>
        <a className="saltar-contenido" href="#principal">Saltar al contenido</a>
        <Header/>
            <main className='main-content'>
            <Routes>
                <Route path="login" element={<Login/>} />
                <Route path="" element={<ListaVacantes/>} />
                <Route path="vacante/*" element={<DetalleVacante/>} />
            </Routes>
            </main>
        <Footer/>
    </>
}