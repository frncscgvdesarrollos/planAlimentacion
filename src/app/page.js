'use client'
import { UserAuth } from "./context/AuthContext";

export default function Home() {
  const { user, googleSignIn } = UserAuth();

  const handleLogin = async () => {
    try {
      await googleSignIn();
      if (user) {
        window.location.href = "/pacienteHome";
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-6 px-4 sm:px-0 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center max-w-md mx-auto p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800 bg-opacity-90">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Plan de Alimentación</h1>
        <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">Inicie sesión para poder acceder a su plan de alimentación</p>
        <button 
          onClick={handleLogin} 
          className="flex items-center justify-center w-full bg-green-600 rounded-lg p-4 text-xl text-white font-bold hover:bg-green-700 transition-colors">
          <span className="mr-2">🔑</span> Google Sesión
        </button>
        <div className="mt-8">
          <ul className="list-disc pl-6 text-sm text-gray-500 dark:text-gray-400">
            <li>Joaquín Baez, Nutricionista.</li>
            <li>Matrícula: iselacreyo</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
