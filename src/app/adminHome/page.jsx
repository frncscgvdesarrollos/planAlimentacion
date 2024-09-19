'use client';
import { useState, useEffect } from 'react';
import { getPlanes, createPlan, updatePlan, deletePlan, getPacientes, asignarPlanPaciente } from '../firebase';

export default function adminHome() {
  const [plans, setPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', description: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('pacientes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansList, patientsList] = await Promise.all([getPlanes(), getPacientes()]);
        setPlans(plansList);
        setPatients(patientsList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddOrUpdatePlan = async () => {
    try {
      if (selectedPlan) {
        await updatePlan(selectedPlan.id, newPlan);
        setPlans(plans.map(p => (p.id === selectedPlan.id ? { ...p, ...newPlan } : p)));
      } else {
        const docId = await createPlan(newPlan);
        setPlans([...plans, { id: docId, ...newPlan }]);
      }
      setNewPlan({ name: '', description: '' });
      setShowPlanForm(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error adding or updating plan:', error);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlan(planId);
      setPlans(plans.filter(p => p.id !== planId));
    } catch (error) {
      console.error('Error deleting plan: ', error);
    }
  };

  const handleAssignPlan = async (patientId, planId) => {
    try {
      await asignarPlanPaciente(patientId, planId);
      setPatients(patients.map(p => (p.id === patientId ? { ...p, planAlimentacion: planId } : p)));
    } catch (error) {
      console.error('Error assigning plan: ', error);
    }
  };

  const handleCancel = () => {
    setSelectedPlan(null);
    setShowPlanForm(false);
    setNewPlan({ name: '', description: '' });
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen py-6">
      <aside className={`bg-cyan-600 dark:bg-gray-900 bg-opacity-90 ${isMenuCollapsed ? 'w-16' : 'w-1/4'} h-screen p-4 transition-width duration-300`}>
        <div className='flex flex-col h-full'>
          <button onClick={() => setIsMenuCollapsed(!isMenuCollapsed)} className='text-white ml-auto mr-2 text-xl mb-6'>
            {isMenuCollapsed ? '▷' : '◁'}
          </button>
          <div className='mb-6'>
            <h2 className={`text-white text-2xl font-semibold mb-2 ${isMenuCollapsed ? 'hidden' : ''}`}>Menú</h2>
          </div>
          <ul className={`flex flex-col space-y-2 ${isMenuCollapsed ? 'hidden' : ''}`}>
            <li className='p-3 text-white text-lg bg-cyan-700 dark:bg-gray-800 rounded-md hover:bg-cyan-800 dark:hover:bg-gray-700 transition-colors'>
              <button onClick={() => setActiveSection('pacientes')} className='block w-full text-left'>
                Pacientes
              </button>
            </li>
            <li className='p-3 text-white text-lg bg-cyan-700 dark:bg-gray-800 rounded-md hover:bg-cyan-800 dark:hover:bg-gray-700 transition-colors'>
              <button onClick={() => setActiveSection('planes')} className='block w-full text-left'>
                Planes de Alimentación
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 p-4 bg-cyan-100 dark:bg-gray-800">
        {activeSection === 'pacientes' && (
          <section>
            <h1 className="text-4xl font-bold mb-4">Pacientes</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="py-2 px-4 border-b">Nombre</th>
                    <th className="py-2 px-4 border-b">Edad</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Teléfono</th>
                    <th className="py-2 px-4 border-b">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(patient => (
                    <tr key={patient.id}>
                      <td className="py-2 px-4 border-b">{patient.name}</td>
                      <td className="py-2 px-4 border-b">{patient.age}</td>
                      <td className="py-2 px-4 border-b">{patient.email}</td>
                      <td className="py-2 px-4 border-b">{patient.phone}</td>
                      <td className="py-2 px-4 border-b">
                        <select
                          value={patient.planAlimentacion || ''}
                          onChange={(e) => handleAssignPlan(patient.id, e.target.value)}
                          className="border border-gray-300 rounded-lg p-2 w-full"
                        >
                          <option value="">Seleccionar Plan</option>
                          {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === 'planes' && (
          <section>
            <h1 className="text-4xl font-bold mb-4">Planes de Alimentación</h1>
            <button
              className="bg-green-600 rounded-lg p-2 text-white font-bold mb-4 w-full"
              onClick={() => setShowPlanForm(true)}
            >
              {selectedPlan ? 'Editar Plan' : 'Agregar Plan'}
            </button>
            {showPlanForm && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Nombre del Plan"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                />
                <textarea
                  placeholder="Descripción"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                />
                <button
                  className="bg-blue-600 text-white p-2 rounded-lg mr-2"
                  onClick={handleAddOrUpdatePlan}
                >
                  {selectedPlan ? 'Actualizar Plan' : 'Agregar Plan'}
                </button>
                <button
                  className="bg-red-600 text-white p-2 rounded-lg"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            )}
            <ul>
              {plans.map(plan => (
                <li key={plan.id} className="flex items-center justify-between border-b border-gray-300 py-2">
                  <div>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  <div>
                    <button
                      className="bg-yellow-600 text-white p-1 rounded-lg mr-2"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setNewPlan({ name: plan.name, description: plan.description });
                        setShowPlanForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white p-1 rounded-lg"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
