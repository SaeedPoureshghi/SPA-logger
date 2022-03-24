import './App.css';
import { useState } from 'react';
import { useLogs } from './hooks/useLogs';
import axios from 'axios';

const App = () => {

  // When a new data saved refresh the table
  const [refresh, setRefresh] = useState(false);
  
  // show returned message from API
  const [message, setmessage] = useState('');
  const [showmessage, setshowmessage] = useState(false);
  const [fetchResult, setfetchResult] = useState(null);
  
  // Hook to get Logs.
  const { logs } = useLogs(refresh);

  /**
   * call api to save a log
   * @param {*} e  
   */
  const saveLog = (e) => {
    e.preventDefault()
    axios.post('/api/v1/logs', {
      description: e.target.description.value,
      start: e.target.start.value,
      end: e.target.end.value
    })
      .then((res) => {
        setRefresh(!refresh);
        setshowmessage(true);
        setfetchResult(res.data.success);
        setmessage(res.data.message)
        const timer = setTimeout(() => {
          setshowmessage(false);
          clearInterval(timer);
        }, 4000);
      })
    e.target.reset();
  }

  /**
   * Call api to remove a log
   * @param {*} id of desired log
   */

  const removeLog = (id) => {
    axios.post('/api/v1/logs/remove', {
      id: id
    })
      .then((res) => {
        setRefresh(!refresh);
        setshowmessage(true);
        setfetchResult(res.data.success);
        setmessage(res.data.message);
        const timer = setTimeout(() => {
          setshowmessage(false);
          clearInterval(timer);
        }, 2000);
      })

  }

  return (
    <div className="App">

      <div className="form">
        <form onSubmit={saveLog}>
          Start :
          <input type="datetime-local" name="start" id="start" required />
          End :
          <input type="datetime-local" name="end" id="end" required />
          Description :
          <input type="textarea" row={5} name="description" id="description" required />
          <input type="submit" value="Save" />
        </form>

        <div className={(showmessage) ? ((fetchResult) ? 'message green fadeout' : 'message red fadeout') : ((fetchResult) ? 'message green fadein' : 'message red fadein')}>
          <p>
            {message}
          </p>
        </div>

      </div>

      <div className="datas">

        <table>
          <thead>

            <tr>
              <td>#</td>
              <td>Description</td>
              <td>Start</td>
              <td>End</td>
              <td>Created at</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {logs && logs.length == 0 &&
              <tr>
                <td colSpan={6}>No logs yet</td>
              </tr>
            }

            {logs && logs.map((log, index) => {

              return (

                <tr key={index}>
                  <td>{log.id}</td>
                  <td>{log.log_description}</td>
                  <td>{log.log_starttime}</td>
                  <td>{log.log_endtime}</td>
                  <td>{log.log_createat}</td>
                  <td>
                    <button onClick={() => removeLog(log.id)}>Remove</button>
                  </td>
                </tr>

              )

            })
            }
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default App;
