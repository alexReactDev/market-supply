import Axios from "axios";

const axios = Axios.create({
	baseURL: "http://market-supply.alexander-portfolio-and-cv.com",
	timeout: 10000
});


export default axios;