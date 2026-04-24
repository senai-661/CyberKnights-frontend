import type { JSX } from "react";

function Rodape(): JSX.Element {
    return (
        <footer className="bg-slate-700 h-[12vh] flex items-center justify-around">
            <p className="text-white text-xl">Copyright - Todos os direitos e esquerdos reservados</p>
            <p className="text-white text-xl">[ Lanches Maga ]</p>
        </footer>
    );
}

export default Rodape;