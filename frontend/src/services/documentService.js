
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
