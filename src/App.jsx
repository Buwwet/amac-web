import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ListaVacantes from "./pages/ListaVacantes";
import DetalleVacante from "./pages/DetalleVacante";
import Login from "./pages/Login";
import RegistroCandidato from "./pages/RegistroCandidato";
import RegistroEmpresa from "./pages/RegistroEmpresa";

export default function App() {

    return <>
        <a className="saltar-contenido" href="#principal">Saltar al contenido</a>
        <Header/>
            <main className='main-content' id="principal">
            <Routes>
                <Route path="login" element={<Login/>} />
                <Route path="registro" element={<RegistroCandidato/>} />
                <Route path="registro-empresa" element={<RegistroEmpresa/>} />
                <Route path="" element={<ListaVacantes/>} />
                <Route path="vacante/*" element={<DetalleVacante/>} />
            </Routes>
            </main>
        <Footer/>
    </>
}
