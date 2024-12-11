import axios from 'axios';

// Base URL cho API
const BASE_URL = 'http://localhost:4000/';

// Lấy token từ localStorage (hoặc nơi bạn lưu token)
const getToken = () => localStorage.getItem('token');

// Cấu hình axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Thêm interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hàm fetch data
export const fetchDataFromApi = async (url) => {
  const { data } = await apiClient.get(url);
  return data;
};

// Hàm post data
export const postData = async (url, formData) => {
  const { data } = await apiClient.post(url, formData);
  return data;
};

// Hàm update data
export const editData = async (url, updateData) => {
  const { data } = await apiClient.put(url, updateData);
  return data;
};

// Hàm delete data
export const deleteData = async (url) => {
  const { data } = await apiClient.delete(url);
  return data;
};
