import AuthProvider from "./auth/authProvider";
import { LakesProvider } from "./context/LakesContext";
import RoutesManager from "./routes/RoutesManager";

function App() {
  return (
    <AuthProvider>
      <LakesProvider>
        <RoutesManager />
      </LakesProvider>
    </AuthProvider>
  );
}

export default App;
