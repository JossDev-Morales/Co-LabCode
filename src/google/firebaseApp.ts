import admin, { ServiceAccount } from 'firebase-admin'
const serviceAccount:ServiceAccount = {
  clientEmail:process.env.admin_client_email,
  privateKey:process.env.admin_private_key,
  projectId:process.env.admin_project_id
}

export const firebaseApp=admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
},'co-lab');

