'use client'
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { createPaciente } from '../firebase';

export default function RegisterPaciente() {
  const { user } = UserAuth(); // Asumiendo que user es el usuario autenticado
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!user) return; // Asegúrate de que el usuario esté autenticado

    setLoading(true);

    try {
      const paciente = {
        uid: user.uid, // Agregar el uid del usuario autenticado
        name,
        age,
        email,
        phone,
        planId: null, // Inicialmente sin plan asignado
      };

      await createPaciente(paciente);
      alert('Paciente registrado con éxito');
      // Redirigir o hacer cualquier otra acción necesaria
      window.location.href = '/pacienteHome'; // Redirige a la página principal después del registro
    } catch (error) {
      console.error('Error al registrar paciente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-50">
      <div className="flex flex-col items-center max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Registro de Paciente</h1>
        <div className="w-full">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white p-2 rounded-lg w-full"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Paciente'}
          </button>
        </div>
      </div>
    </main>
  );
}
