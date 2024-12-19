import axios from "axios";
import "dotenv/config";

const apiClient = axios.create({
	baseURL: `http://${process.env.HOST_NAME}:${process.env.PORT}`,
});

export default apiClient;
