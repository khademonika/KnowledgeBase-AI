
import API from "./api";

export const uploadDocument = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await API.post(
    "/api/documents/upload",
    formData
  );

  return data;
};
export const getUserDocuments = async () => {
  const { data } = await API.get("/api/documents");
  return data.documents;
};
export const deleteDocument = async (documentId) => {
  const { data } = await API.delete(`/api/documents/${documentId}`);
  return data;
};