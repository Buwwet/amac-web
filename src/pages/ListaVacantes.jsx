import VacanteItem from "../components/VacanteItem";

export default function ListaVacantes() {
    // TODO - usar datos del contexto de supabase

    return <>
        <h1>Listado de vacantes</h1>

        <div className="search-bar">
            <img aria-label="busqueda" src="/icons/search.svg"/>
            <input type="text" placeholder="Ingrese su busqueda..."/>
            <img aria-label="ajuste" src="/icons/setting.svg"/>
        </div>

        <div class="listado-vacantes-items">
            {/*  TODO recursion y eso */}
            <VacanteItem data={{}}/>
        </div>
    </>
}