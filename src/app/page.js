'use client'
import { UserAuth } from "./context/AuthContext";

export default function Home() {
  
  const { user, googleSignIn } = UserAuth();

  const handleLogin = async () => {
    try {
      await googleSignIn();
      if (user) {
        // Redirige a /adminHome usando window.location.href
        window.location.href = "/pacienteHome";
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Plan de Alimentación</h1>
      <div className="flex flex-col items-center max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
        <p className="text-lg mb-6">Inicie sesión para poder acceder a su plan de alimentación</p>
        <button 
          onClick={handleLogin} 
          className="bg-green-600 rounded-lg p-4 text-xl text-white font-bold hover:bg-green-700 transition-colors">
          Google Sesión
        </button>
        <div className="mt-8">
          <ul className="list-disc pl-6 text-sm">
            <li>Joaquín Baez, Nutricionista.</li>
            <li>Matrícula: iselacreyo</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
