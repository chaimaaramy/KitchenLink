import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />  
  </StrictMode>,
)
// ← JSX : ressemble à du HTML mais c'est du JS
// React prend le contrôle de cette div et ne la lâche plus jamais
// Sans ce fichier, rien ne s'affiche
//Le ! après getElementById est du TypeScript : il dit "je certifie que cet élément existe".