import "./globals.css";
import Llamada from "./componentes/Llamada"; 

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                <main className="min-h-screen ">
                    <Llamada></Llamada>
                    {children}
                </main>
            </body>
        </html>
    )
}
