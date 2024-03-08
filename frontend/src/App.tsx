import AuthProvider from "./auth/authProvider";
import RoutesManager from "./routes/RoutesManager";

function App() {
  return (
    <AuthProvider>
      <RoutesManager />
    </AuthProvider>
  );
}

export default App;
