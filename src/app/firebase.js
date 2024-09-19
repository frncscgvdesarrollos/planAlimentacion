import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDoc, getDocs, where,query ,documentId } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB39q600upZb6cMLUQzvoo42VCEwhzyKHg",
    authDomain: "superbro-dacc0.firebaseapp.com",
    projectId: "superbro-dacc0",
    storageBucket: "superbro-dacc0.appspot.com",
    messagingSenderId: "216907553403",
    appId: "1:216907553403:web:3fe5a867ee2e07f0f3e0de",
    measurementId: "G-HTB583DSH4"
  };
  

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db,auth, };
/* CRUD PLANES */


export async function getPlanes() {
    try {
        const querySnapshot = await getDocs(collection(db, "planes_alimentacion"));
        const planes = [];
        querySnapshot.forEach((doc) => {
            planes.push({ id: doc.id, ...doc.data() });
        });
        return planes;
    } catch (error) {
        console.error("Error al obtener los planes de alimentación: ", error);
        throw error;
    }
}
export async function getPlan(planId) {
    try {
        const q = query(collection(db, "planes_alimentacion"), where(documentId(), "==", planId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const planData = querySnapshot.docs[0].data();
            return planData;
        } else {
            throw new Error("El plan de alimentación no existe");
        }
    } catch (error) {
        console.error("Error al obtener el plan de alimentación: ", error);
        throw error;
    }
}



export async function createPlan(plan) {
    try {
        const docRef = await addDoc(collection(db, "planes_alimentacion"), plan);
        console.log("Plan de alimentación creado con ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al crear el plan de alimentación: ", error);
        throw error;
    }
}

export async function updatePlan(planId, nuevoPlan) {
    try {
        const planRef = doc(db, "planes_alimentacion", planId);
        await updateDoc(planRef, nuevoPlan);
        console.log("Plan de alimentación actualizado con éxito");
    } catch (error) {
        console.error("Error al actualizar el plan de alimentación: ", error);
        throw error;
    }
}

export async function deletePlan(planId) {
    try {
        const planRef = doc(db, "planes_alimentacion", planId);
        await deleteDoc(planRef);
        console.log("Plan de alimentación eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar el plan de alimentación: ", error);
        throw error;
    }
}

/* CRUD PACIENTES */
export async function getPacientes() {
    try {
        const querySnapshot = await getDocs(collection(db, "pacientes"));
        const pacientes = [];
        querySnapshot.forEach((doc) => {
            pacientes.push({ id: doc.id, ...doc.data() });
        });
        return pacientes;
    } catch (error) {
        console.error("Error al obtener los pacientes: ", error);
        throw error;
    }
}

export async function getPaciente(pacienteId) {
    try {
        const pacientesRef = collection(db, "pacientes");
        const q = query(pacientesRef, where("uid", "==", pacienteId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("El paciente no existe");
        }

        // Asumiendo que solo habrá un paciente con ese uid
        const pacienteDoc = querySnapshot.docs[0];
        return pacienteDoc.data();
    } catch (error) {
        console.error("Error al obtener el paciente: ", error);
        throw error;
    }
}

export async function createPaciente(paciente) {
    try {
        const docRef = await addDoc(collection(db, "pacientes"), paciente);
        console.log("Paciente creado con ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al crear el paciente: ", error);
        throw error;
    }
}
export async function updatePaciente(pacienteId, nuevoPaciente) {
    try {
        const pacienteRef = doc(db, "pacientes", pacienteId);
        await updateDoc(pacienteRef, nuevoPaciente);
        console.log("Paciente actualizado con éxito");
    } catch (error) {
        console.error("Error al actualizar el paciente: ", error);
        throw error;
    }
}
export async function deletePaciente(pacienteId) {
    try {
        const pacienteRef = doc(db, "pacientes", pacienteId);
        await deleteDoc(pacienteRef);
        console.log("Paciente eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar el paciente: ", error);
        throw error;
    }
}
export async function asignarPlanPaciente(pacienteId, planId) {
    try {
        const pacienteRef = doc(db, "pacientes", pacienteId);
        await updateDoc(pacienteRef, { planAlimentacion: planId });
        console.log("Plan de alimentación asignado al paciente con éxito");
    } catch (error) {
        console.error("Error al asignar el plan de alimentación al paciente: ", error);
        throw error;
    }
}
export async function quitarPlanPaciente(pacienteId) {
    try {
        const pacienteRef = doc(db, "pacientes", pacienteId);
        await updateDoc(pacienteRef, { planAlimentacion: null });
        console.log("Plan de alimentación eliminado del paciente con éxito");
    } catch (error) {
        console.error("Error al quitar el plan de alimentación del paciente: ", error);
        throw error;
    }
}
export async function actualizarPlanPaciente(pacienteId, nuevoPlanId) {
    try {
        const pacienteRef = doc(db, "pacientes", pacienteId);
        await updateDoc(pacienteRef, { planAlimentacion: nuevoPlanId });
        console.log("Plan de alimentación del paciente actualizado con éxito");
    } catch (error) {
        console.error("Error al actualizar el plan de alimentación del paciente: ", error);
        throw error;
    }
}
