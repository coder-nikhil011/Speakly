import api from "./api";
export const getTeacherAssignments = async () => (await api.get("/assignments")).data.assignments || [];
export const getStudentAssignments = async () => (await api.get("/assignments/student")).data.assignments || [];
export const createAssignment = async (data) => (await api.post("/assignments", data)).data.assignment;
export const getAssignment = async (id) => (await api.get(`/assignments/${id}`)).data.assignment;
