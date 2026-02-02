import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { setUser } from './store/userSlice'
import './index.css'
import App from './App.jsx'

// Hydrate Redux store from localStorage on app load
const token = localStorage.getItem('authToken');
if (token) {
  const name = localStorage.getItem('userName');
  const email = localStorage.getItem('userEmail');
  const role = localStorage.getItem('userRole');
  if (name || email) {
    store.dispatch(setUser({ name, email, role }));
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
