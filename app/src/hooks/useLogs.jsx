const axios = require('axios');
const { useEffect, useState } = require("react")

export const useLogs = (refresh) => {

    const [logs, setLogs] = useState([]);


    useEffect(() => {
        getLogs().then((res)=>{
            setLogs(res.data.logs)
        })      
    }, [refresh])
    
    async function getLogs() {
      return await axios.get('/api/v1/logs')
         }

    return {logs}
}