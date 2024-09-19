'use client'
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getPaciente, getPlan } from '../firebase';

const generateDaysInMonth = (month, year) => {
  const days = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

export default function PatientHome() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [patientName, setPatientName] = useState('');
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Si no hay usuario, no hacer nada

    const fetchData = async () => {
      try {
        const pacienteData = await getPaciente(uid);
        if (pacienteData) {
          setPatientName(pacienteData.name || 'Nombre no disponible');
        }

        if(!pacienteData) {
            window.location.href = "/register";
          }

        const fetchedPlan = await getPlan(pacienteData?.planAlimentacion);
        if (fetchedPlan) {
          setNutritionPlan(fetchedPlan);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <p>Cargando el plan de alimentación...</p>;
  }

  if (!nutritionPlan) {
    return <p>No se encontró el plan de alimentación.</p>;
  }

  const daysInMonth = generateDaysInMonth(9, 2024); // Octubre 2024 como ejemplo

  return (
    <main className="flex flex-col items-center min-h-screen py-6 bg-gray-50">
      <div className="flex flex-col items-center max-w-[90vw] mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Bienvenido, {patientName}</h1>
        <p className="text-lg mb-6">Aquí está tu plan de alimentación para este mes:</p>
        
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desayuno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Almuerzo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merienda</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {daysInMonth.map(day => {
                const dateString = day.toISOString().split('T')[0];
                const dailyPlan = nutritionPlan[dateString] || {};
                const { breakfast, lunch, snack, dinner } = dailyPlan;
                return (
                  <tr key={dateString}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dateString}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{breakfast || 'No disponible'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lunch || 'No disponible'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{snack || 'No disponible'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dinner || 'No disponible'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button className="bg-blue-600 rounded-lg p-4 text-xl text-white font-bold hover:bg-blue-700 transition-colors">
            Ver Más Detalles
          </button>
          <button className="bg-green-600 rounded-lg p-4 text-xl text-white font-bold hover:bg-green-700 transition-colors">
            Contactar a Nutricionista
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 mt-6">
          <p>Para más detalles, visita nuestro <a href="/faq" className="text-blue-500 hover:underline">FAQ</a> o <a href="/support" className="text-blue-500 hover:underline">soporte</a>.</p>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          <h2 className="text-xl font-semibold mb-4">Descripción del Plan de Alimentación</h2>
          <p>{nutritionPlan.description}</p>
        </div>
      </div>
    </main>
  );
}
