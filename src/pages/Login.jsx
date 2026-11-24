import { crear_perfil, iniciar_session } from "../lib/supabase";

export default function Login() {
    // @manu implemeta aqui la lógica real



    return <>
        <button onClick={
            () => crear_perfil("ricardo.villarreald@udem.edu", "676767", {rol: "candidato", nombre: "ricardo", edad: 67, colonia: "67 land", experiencia: "2000xp"})
        }>
            SIGN UP -ricky
        </button>
        <button onClick={
            () => iniciar_session("ricardo.villarreald@udem.edu", "676767")
        }>
            LOGIN -ricky
        </button>
    </>
}