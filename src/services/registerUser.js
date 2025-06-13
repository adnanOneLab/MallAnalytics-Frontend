import api from "./api";


export const registerVisitor = async (formData) => {
    const response = await api.post('/api/users/create/', formData);
    return response.data;
  };