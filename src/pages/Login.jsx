import { crear_perfil, iniciar_session } from "../lib/supabase";

export default function Login() {
    // @manu implemeta aqui la lógica real



    return <>
        <button onClick={
            () => crear_perfil("barack@obama.edu", "676767", {rol: "empresa", nombre: "obama", edad: 67, colonia: "67 land", experiencia: "2000xp"})
        }>
            SIGN UP -obama
        </button>
        <button onClick={
            () => iniciar_session("barack@obama.edu", "676767")
        }>
            LOGIN -obama
        </button>

        <button onClick={
            () => crear_perfil("ricky@com.edu", "676767", {rol: "candidato", nombre: "ricky", edad: 67, colonia: "67 land", experiencia: "2000xp"})
        }>
            SIGN UP -ricky
        </button>
        <button onClick={
            () => iniciar_session("ricky@com.edu", "676767")
        }>
            LOGIN -ricky
        </button>


        <button onClick={
            () => crear_perfil("admin@soriana.mx", "676767", {rol: "empresa", nombre: "Soriana", edad: 67, colonia: "adwad", experiencia: "2000xp", img_url: "https://upload.wikimedia.org/wikipedia/commons/6/61/LogoSorianaSVG.svg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original"})
        }>
            SIGN UP - otro
        </button>
    </>
}