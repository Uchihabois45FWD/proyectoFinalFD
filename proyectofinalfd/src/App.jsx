/**
 * Componente principal de la aplicación.
 * Este componente actúa como el punto de entrada raíz de la aplicación React.
 * Su responsabilidad principal es renderizar el sistema de routing que maneja
 * la navegación entre diferentes páginas y componentes de la aplicación.
 */
import Routing from "./routes/Routing" // Importa el sistema de rutas de la aplicación

function App() {
  // Componente raíz que envuelve toda la aplicación con el sistema de routing
  return (
    <>
      <Routing/>  {/* Renderiza el sistema de rutas que controla la navegación */}
    </>
  )
}

export default App
