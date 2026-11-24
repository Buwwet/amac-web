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
    </>
}