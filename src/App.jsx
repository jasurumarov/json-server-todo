import Body from './components/body/Body'
import './global.css'
import './scss/style.scss'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <main>
      <Body/>
      <ToastContainer />
    </main>
  )
}

export default App